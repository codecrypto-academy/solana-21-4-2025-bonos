import { Connection, Keypair, PublicKey, SystemProgram, Transaction } from '@solana/web3.js';
import { createMint, getOrCreateAssociatedTokenAccount, mintTo, transfer } from '@solana/spl-token';
import * as fs from 'fs';
import * as path from 'path';

// Constants
const RPC_ENDPOINT = 'http://localhost:8899';
const AIRDROP_AMOUNT = 2000; // SOL
const EUROCC_INITIAL_SUPPLY = 1000000000000;
const BONODEUDA_INITIAL_SUPPLY = 10000;

// Create wallets directory if it doesn't exist
const WALLETS_DIR = path.join(__dirname ,'..', 'wallets');
if (!fs.existsSync(WALLETS_DIR)) {
    fs.mkdirSync(WALLETS_DIR);
}

async function createWallet(name: string): Promise<Keypair> {
    const keypair = Keypair.generate();
    const secretKey = keypair.secretKey;
    
    // Save the secret key to a file
    fs.writeFileSync(
        path.join(WALLETS_DIR, `${name}.json`),
        JSON.stringify(Array.from(secretKey))
    );
    
    console.log(`Created wallet for ${name}`);
    return keypair;
}

async function airdropSol(connection: Connection, publicKey: PublicKey, amount: number) {
    const signature = await connection.requestAirdrop(
        publicKey,
        amount * 1e9 // Convert SOL to lamports
    );
    await connection.confirmTransaction(signature);
    console.log(`Airdropped ${amount} SOL to ${publicKey.toString()}`);
}

async function createToken(
    connection: Connection,
    payer: Keypair,
    name: string,
    symbol: string,
    decimals: number,
    initialSupply: number
): Promise<PublicKey> {
    const mint = await createMint(
        connection,
        payer,
        payer.publicKey,
        payer.publicKey,
        decimals
    );
    
    console.log(`Created ${name} token with mint address: ${mint.toString()}`);
    
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
    
    console.log(`Minted ${initialSupply} ${symbol} to ${payer.publicKey.toString()}`);
    return mint;
}

async function airdropTokens(
    connection: Connection,
    tokenMint: PublicKey,
    from: Keypair,
    to: PublicKey,
    amount: number,
    decimals: number
) {
    const fromTokenAccount = await getOrCreateAssociatedTokenAccount(
        connection,
        from,
        tokenMint,
        from.publicKey
    );
    
    const toTokenAccount = await getOrCreateAssociatedTokenAccount(
        connection,
        from,
        tokenMint,
        to
    );
    
    await transfer(
        connection,
        from,
        fromTokenAccount.address,
        toTokenAccount.address,
        from,
        amount * Math.pow(10, decimals)
    );
    
    console.log(`Airdropped ${amount} tokens to ${to.toString()}`);
}

async function main() {
    // Connect to Solana devnet
    const connection = new Connection(RPC_ENDPOINT, 'confirmed');
    
    // Create wallets
    const emisorEuroCC = await createWallet('emisor_eurocc');
    const emisorBonoDeuda = await createWallet('emisor_bonodeuda');
    const adquirente1 = await createWallet('adquirente1');
    const adquirente2 = await createWallet('adquirente2');
    
    // Airdrop SOL to all wallets
    await airdropSol(connection, emisorEuroCC.publicKey, AIRDROP_AMOUNT);
    await airdropSol(connection, emisorBonoDeuda.publicKey, AIRDROP_AMOUNT);
    await airdropSol(connection, adquirente1.publicKey, AIRDROP_AMOUNT);
    await airdropSol(connection, adquirente2.publicKey, AIRDROP_AMOUNT);
    
    // Create EuroCC token
    const euroCCMint = await createToken(
        connection,
        emisorEuroCC,
        'EuroCC',
        'EUROCC',
        2,
        EUROCC_INITIAL_SUPPLY
    );
    
    // Airdrop EuroCC to adquirente1 and adquirente2
    await airdropTokens(
        connection,
        euroCCMint,
        emisorEuroCC,
        adquirente1.publicKey,
        EUROCC_INITIAL_SUPPLY / 10,
        2
    );
    await airdropTokens(
        connection,
        euroCCMint,
        emisorEuroCC,
        adquirente2.publicKey,
        EUROCC_INITIAL_SUPPLY / 10,
        2
    );
    
    // Create BonoDeuda token
    const bonoDeudaMint = await createToken(
        connection,
        emisorBonoDeuda,
        'BonoDeuda',
        'BONO',
        0,
        BONODEUDA_INITIAL_SUPPLY
    );

    // Save token and wallet information to a file
    const tokenInfo = {
        wallets: {
            emisorEuroCC: {
                publicKey: emisorEuroCC.publicKey.toString(),
            },
            emisorBonoDeuda: {
                publicKey: emisorBonoDeuda.publicKey.toString(),
            },
            adquirente1: {
                publicKey: adquirente1.publicKey.toString(),
            },
            adquirente2: {
                publicKey: adquirente2.publicKey.toString(),
            }
        },
        tokens: {
            euroCC: {
                mint: euroCCMint.toString(),
                name: 'EuroCC',
                symbol: 'EUROCC',
                decimals: 2,
                initialSupply: EUROCC_INITIAL_SUPPLY
            },
            bonoDeuda: {
                mint: bonoDeudaMint.toString(),
                name: 'BonoDeuda',
                symbol: 'BONO',
                decimals: 0,
                initialSupply: BONODEUDA_INITIAL_SUPPLY
            }
        }
    };

    fs.writeFileSync('token-info.json', JSON.stringify(tokenInfo, null, 2));
    console.log('Token and wallet information saved to token-info.json');

    
    
    console.log('Setup completed successfully!');
}

main().catch(console.error); 