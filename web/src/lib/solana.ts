"use server";
import { Connection, PublicKey, LAMPORTS_PER_SOL, Keypair, SendTransactionError, Transaction, sendAndConfirmTransaction } from "@solana/web3.js";
import { createMint, createTransferInstruction, getOrCreateAssociatedTokenAccount, mintTo, transfer } from '@solana/spl-token';
import clientPromise from "./mongodb";
/**
 * Sends an airdrop of SOL to the specified wallet address
 * @param address The Solana wallet address to receive the airdrop
 * @param amount The amount of SOL to airdrop (default: 1)
 * @returns A promise that resolves to the transaction signature
 */
export async function requestAirdrop(address: string, amount: number = 1): Promise<string> {
    try {
        // Connect to the Solana devnet
        const connection = new Connection(process.env.SOLANA_URL!, "confirmed");

        // Convert the address string to a PublicKey
        const publicKey = new PublicKey(address);

        // Request the airdrop (amount in LAMPORTS)
        const signature = await connection.requestAirdrop(
            publicKey,
            amount * LAMPORTS_PER_SOL
        );

        // Confirm the transaction
        await connection.confirmTransaction(signature, "confirmed");

        return signature;
    } catch (error) {
        throw new Error("Error requesting airdrop: " + error);
    }
}

/**
 * Gets the SOL balance of a Solana wallet address
 * @param address The Solana wallet address to check
 * @returns A promise that resolves to the balance in SOL
 */
export async function getBalance(address: string): Promise<number> {
    try {
        // Connect to the Solana devnet
        const connection = new Connection(process.env.SOLANA_URL!, "confirmed");

        // Convert the address string to a PublicKey
        const publicKey = new PublicKey(address);

        // Get the balance in lamports
        const balanceInLamports = await connection.getBalance(publicKey);

        // Convert lamports to SOL
        const balanceInSol = balanceInLamports / LAMPORTS_PER_SOL;

        return balanceInSol;
    } catch (error) {
        throw new Error("Error getting balance: " + error);
    }
}

export async function createToken(
    payer: Keypair,
    name: string,
    symbol: string,
    decimals: number,
    initialSupply: number
): Promise<PublicKey> {
    const connection = new Connection(process.env.SOLANA_URL!, 'confirmed');
    const mint = await createMint(
        connection,
        payer,
        payer.publicKey,
        payer.publicKey,
        decimals
    );


    // Create token account for the payer
    const tokenAccount = await getOrCreateAssociatedTokenAccount(
        connection,
        payer,
        mint,
        payer.publicKey
    );

    await mintTo(
        connection,
        payer,
        mint,
        tokenAccount.address,
        payer,
        initialSupply * Math.pow(10, decimals)
    );

    return mint;
}

/**
 * Hace airdrop de un token SPL a una wallet
 * @param mintAddress Dirección del mint del token SPL
 * @param destinationAddress Dirección de la wallet destino
 * @param amount Cantidad de tokens a enviar
 * @param payerPrivateKey PrivateKey del emisor (en hex)
 */
export async function airdropSplToken(mintAddress: string, destinationAddress: string, amount: number, payerPrivateKey: string) {
    const connection = new Connection(process.env.SOLANA_URL!, "confirmed");
    const payer = Keypair.fromSecretKey(Buffer.from(payerPrivateKey, 'hex'));
    const mint = new PublicKey(mintAddress);
    const destination = new PublicKey(destinationAddress);
    // Obtener o crear la cuenta asociada de token para el destino
    const destTokenAccount = await getOrCreateAssociatedTokenAccount(
        connection,
        payer,
        mint,
        destination
    );
    // Mint tokens al destino
    await mintTo(
        connection,
        payer,
        mint,
        destTokenAccount.address,
        payer,
        amount
    );
    return true;
}

export async function airdropSplTokenAction(selectedWallet: string, mintAddress: string, splAmount: number) {
    // Buscar el token en la base de datos para obtener la privateKey del emisor
    const client = await clientPromise;
    const db = client.db();
    const token = await db.collection("token").findOne({ mintAddress });
    if (!token || !token.walletAddress) {
        throw new Error("No se encontró el token o el emisor");
    }
    const wallet = await db.collection("wallets").findOne({ address: token.walletAddress });
    if (!wallet || !wallet.privateKey) {
        throw new Error("No se encontró la privateKey del emisor");
    }
    try {
        await airdropSplToken(mintAddress, selectedWallet, splAmount, wallet.privateKey);
    } catch (e) {
        throw new Error("Error en el airdrop: " + e);
    }
}

export async function getTokenBalance(mintAddress: string, walletAddress: string) {
    const connection = new Connection(process.env.SOLANA_URL!, "confirmed");
    const client = await clientPromise;
    const db = client.db();
    const wallet = await db.collection("wallets").findOne({ address: walletAddress });
    if (!wallet || !wallet.privateKey) {
        throw new Error("No se encontró la privateKey del emisor");
    }
    const signer = Keypair.fromSecretKey(Buffer.from(wallet.privateKey, 'hex'));

    const mint = new PublicKey(mintAddress);
    const tokenAccount = await getOrCreateAssociatedTokenAccount(connection, signer, mint, signer.publicKey);
    const balance = await connection.getTokenAccountBalance(tokenAccount.address);
    return balance.value.amount;
}

export async function buyToken(walletAddress: string, tokenStableMintAddress: string, tokenBonoMintAddress: string, amount: number) {
    const connection = new Connection(process.env.SOLANA_URL!, "confirmed");
    const client = await clientPromise;
    const db = client.db();
    const wallet = await db.collection("wallets").findOne({ address: walletAddress });
    if (!wallet || !wallet.privateKey) {
        throw new Error("No se encontró la privateKey del buyer");
    }
    const tokenStable = await db.collection("token").findOne({ mintAddress: tokenStableMintAddress });
    const tokenBono = await db.collection("token").findOne({ mintAddress: tokenBonoMintAddress });
    if (!tokenStable || !tokenBono) {
        throw new Error("No se encontró el token stable o el bono");
    }
    const emisorBonoWallet = await db.collection("wallets").findOne({ address: tokenBono.walletAddress });
    if (!emisorBonoWallet || !emisorBonoWallet.privateKey) {
        throw new Error("No se encontró la privateKey del emisor");
    }
    const walletKeypair = Keypair.fromSecretKey(Buffer.from(wallet.privateKey, 'hex'));
    const emisorTokenBonoKeypair = Keypair.fromSecretKey(Buffer.from(emisorBonoWallet.privateKey, 'hex'));
    try {
        const tokenAccountFrom = await getOrCreateAssociatedTokenAccount(connection, emisorTokenBonoKeypair, new PublicKey(tokenBono.mintAddress), emisorTokenBonoKeypair.publicKey);
        const tokenAccountTo = await getOrCreateAssociatedTokenAccount(connection, walletKeypair, new PublicKey(tokenBono.mintAddress), walletKeypair.publicKey);
        await transferTokens(connection, emisorTokenBonoKeypair, tokenAccountFrom.address, tokenAccountTo.address, amount);
    } catch (e) {
        throw new Error("Error en la transferencia: " + e);
    }

    // Transfer the stablecoin to the emisorBonoWallet
    const tokenAccountFromStable = await getOrCreateAssociatedTokenAccount(connection, walletKeypair, new PublicKey(tokenStable.mintAddress), walletKeypair.publicKey);
    const tokenAccountToStable = await getOrCreateAssociatedTokenAccount(connection, emisorTokenBonoKeypair, new PublicKey(tokenStable.mintAddress), emisorTokenBonoKeypair.publicKey);
    await transferTokens(connection, walletKeypair, tokenAccountFromStable.address, tokenAccountToStable.address, amount * tokenBono.nominal);


    // Store the transaction in MongoDB
    try {
        // Store the bond purchase information in the bonista collection
        await db.collection("bonista").insertOne({
            tokenMint: tokenBonoMintAddress,
            address: walletAddress,
            amount: amount,
            purchaseDate: new Date(),
            stablecoinUsed: tokenStableMintAddress
        });

    } catch (dbError) {
        throw new Error("Error storing bond purchase in database: " + dbError);
    }


}

export async function transferTokens(
    connection: Connection,
    from: Keypair,
    fromTokenAccount: PublicKey,
    toTokenAccount: PublicKey,
    amount: number
): Promise<string> {
    try {
        const signature = await transfer(
            connection,
            from,
            fromTokenAccount,
            toTokenAccount,
            from,
            amount
        );
        return signature;
    } catch (error) {
        if (error instanceof SendTransactionError) {
            throw new Error('Error during transaction: ' + error.message + ' ' + error.log);
        } else {
            throw new Error('Unexpected error: ' + error);
        }
    }
}

export async function payCupon(tokenBonoMintAddress: string) {
    const connection = new Connection(process.env.SOLANA_URL!, "confirmed");
    const client = await clientPromise;
    const db = client.db();
    const tokenBono = await db.collection("token").findOne({ mintAddress: tokenBonoMintAddress });
    if (!tokenBono) {
        throw new Error("No se encontró el token bono");
    }
    const emisorBonoWallet = await db.collection("wallets").findOne({ address: tokenBono.walletAddress });
    if (!emisorBonoWallet || !emisorBonoWallet.privateKey) {
        throw new Error("No se encontró la privateKey del emisor");
    }
    const wallemisorBonoWalletetKeypair = Keypair.fromSecretKey(Buffer.from(emisorBonoWallet.privateKey, 'hex'));
    const bonistas = await db.collection("bonista").find({ tokenMint: tokenBonoMintAddress }).toArray();

    const transferInstructions = await Promise.all(bonistas.map(async (bonista) => {
        const sourceTokenAccount = await getOrCreateAssociatedTokenAccount(connection, wallemisorBonoWalletetKeypair, new PublicKey(bonista.stablecoinUsed), new PublicKey(wallemisorBonoWalletetKeypair.publicKey));
        const walletBonista = await db.collection("wallets").findOne({ address: bonista.address });
        if (!walletBonista || !walletBonista.privateKey) {
            throw new Error("No se encontró la privateKey del bonista");
        }
        const walletKeypair = Keypair.fromSecretKey(Buffer.from(walletBonista.privateKey, 'hex'));
        const destinationTokenAccount = await getOrCreateAssociatedTokenAccount(connection, walletKeypair, new PublicKey(bonista.stablecoinUsed), new PublicKey(bonista.address));
        return createTransferInstruction(
            // source token account
            sourceTokenAccount.address,
            // destination token account
            destinationTokenAccount.address,
            // authority (your wallet)
            wallemisorBonoWalletetKeypair.publicKey,
            // amount to transfer
            Math.floor(tokenBono.porcentajeCupon * bonista.amount * tokenBono.nominal / 100)
        );
    }));
    const transaction = new Transaction().add(...transferInstructions);
    const signature = await sendAndConfirmTransaction(
        connection,
        transaction,
        [wallemisorBonoWalletetKeypair]
    );
    return signature;
}