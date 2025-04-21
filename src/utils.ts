import { Connection, PublicKey, Keypair, SendTransactionError } from '@solana/web3.js';
import { getAssociatedTokenAddress, getAccount, transfer, createAssociatedTokenAccount } from '@solana/spl-token';
import * as fs from 'fs';
import * as path from 'path';

// Constants
export const RPC_ENDPOINT = 'http://localhost:8899';
export const WALLETS_DIR = path.join(__dirname, '..', 'wallets');

// Interfaces
export interface TokenInfo {
    wallets: {
        emisorEuroCC: { publicKey: string };
        emisorBonoDeuda: { publicKey: string };
        adquirente1: { publicKey: string };
        adquirente2: { publicKey: string };
    };
    tokens: {
        euroCC: {
            mint: string;
            name: string;
            symbol: string;
            decimals: number;
            initialSupply: number;
        };
        bonoDeuda: {
            mint: string;
            name: string;
            symbol: string;
            decimals: number;
            initialSupply: number;
        };
    };
}

// Helper functions
export function loadKeypair(name: string): Keypair {
    const secretKey = JSON.parse(fs.readFileSync(path.join(WALLETS_DIR, `${name}.json`), 'utf-8'));
    return Keypair.fromSecretKey(new Uint8Array(secretKey));
}

export function loadTokenInfo(): TokenInfo {
    return JSON.parse(fs.readFileSync('token-info.json', 'utf-8'));
}

export async function getOrCreateAssociatedTokenAccount(
    connection: Connection,
    mint: PublicKey,
    owner: PublicKey,
    payer: Keypair
): Promise<PublicKey> {
    try {
        const ata = await getAssociatedTokenAddress(mint, owner);
        try {
            await getAccount(connection, ata);
            console.log(`Token account ${ata.toString()} already exists for ${owner.toString()}`);
            return ata;
        } catch {
            console.log(`Creating token account for ${owner.toString()}...`);
            const newAta = await createAssociatedTokenAccount(
                connection,
                payer,
                mint,
                owner
            );
            return newAta;
        }
    } catch (error) {
        console.error('Error creating/getting token account:', error);
        throw error;
    }
}

export async function getTokenBalance(
    connection: Connection,
    tokenAccount: PublicKey
): Promise<number> {
    try {
        const account = await getAccount(connection, tokenAccount);
        return Number(account.amount);
    } catch (error) {
        return 0;
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
        console.log(`Transfer successful! Signature: ${signature}`);
        return signature;
    } catch (error) {
        if (error instanceof SendTransactionError) {
            console.error('Error during transaction:', error.message);
            if (error.logs) {
                console.error('Transaction logs:', error.logs);
            }
        } else {
            console.error('Unexpected error:', error);
        }
        throw error;
    }
} 