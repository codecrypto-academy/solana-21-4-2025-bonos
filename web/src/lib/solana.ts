"use server";
import { Connection, PublicKey, LAMPORTS_PER_SOL, Keypair } from "@solana/web3.js";

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

        console.log(`Airdrop of ${amount} SOL to ${address} successful`);
        return signature;
    } catch (error) {
        console.error("Error requesting airdrop:", error);
        throw error;
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

        console.log(`Balance of ${address}: ${balanceInSol} SOL`);
        return balanceInSol;
    } catch (error) {
        console.error("Error getting balance:", error);
        throw error;
    }
}



async function createToken(
    connection: Connection,
    emisorEuroCC: PublicKey,
    nombreToken: string,
    simboloToken: string,
    decimales: number,
    cantidadInicial: number
) {
    // Create EuroCC token
    await createToken(
        connection,
        emisorEuroCC,
        nombreToken,
        simboloToken,
        decimales,
        cantidadInicial
    );
}
