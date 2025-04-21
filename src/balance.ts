import { Connection, PublicKey } from '@solana/web3.js';
import {
    RPC_ENDPOINT,
    TokenInfo,
    loadKeypair,
    loadTokenInfo,
    getOrCreateAssociatedTokenAccount,
    getTokenBalance
} from './utils';

async function main() {
    // Load token info
    const tokenInfo = loadTokenInfo();
    
    // Connect to Solana
    const connection = new Connection(RPC_ENDPOINT, 'confirmed');
    
    // Get token mints
    const euroCCMint = new PublicKey(tokenInfo.tokens.euroCC.mint);
    const bonoDeudaMint = new PublicKey(tokenInfo.tokens.bonoDeuda.mint);
    
    // Load keypairs
    const emisorEuroCCKeypair = loadKeypair('emisor_eurocc');
    const emisorBonoDeudaKeypair = loadKeypair('emisor_bonodeuda');
    const adquirente1Keypair = loadKeypair('adquirente1');
    const adquirente2Keypair = loadKeypair('adquirente2');
    
    try {
        console.log('Setting up token accounts...');
        
        // Get or create token accounts for EuroCC
        const emisorEuroCCAccount = await getOrCreateAssociatedTokenAccount(
            connection,
            euroCCMint,
            emisorEuroCCKeypair.publicKey,
            emisorEuroCCKeypair
        );
        
        const emisorBonoDeudaEuroCCAccount = await getOrCreateAssociatedTokenAccount(
            connection,
            euroCCMint,
            emisorBonoDeudaKeypair.publicKey,
            emisorEuroCCKeypair
        );
        
        const adquirente1EuroCCAccount = await getOrCreateAssociatedTokenAccount(
            connection,
            euroCCMint,
            adquirente1Keypair.publicKey,
            emisorEuroCCKeypair
        );
        
        const adquirente2EuroCCAccount = await getOrCreateAssociatedTokenAccount(
            connection,
            euroCCMint,
            adquirente2Keypair.publicKey,
            emisorEuroCCKeypair
        );
        
        // Get or create token accounts for BonoDeuda
        const emisorBonoDeudaAccount = await getOrCreateAssociatedTokenAccount(
            connection,
            bonoDeudaMint,
            emisorBonoDeudaKeypair.publicKey,
            emisorEuroCCKeypair
        );
        
        const adquirente1BonoDeudaAccount = await getOrCreateAssociatedTokenAccount(
            connection,
            bonoDeudaMint,
            adquirente1Keypair.publicKey,
            emisorEuroCCKeypair
        );
        
        const adquirente2BonoDeudaAccount = await getOrCreateAssociatedTokenAccount(
            connection,
            bonoDeudaMint,
            adquirente2Keypair.publicKey,
            emisorEuroCCKeypair
        );
        
        // Get balances
        const emisorEuroCCBalance = await getTokenBalance(connection, emisorEuroCCAccount);
        const emisorBonoDeudaEuroCCBalance = await getTokenBalance(connection, emisorBonoDeudaEuroCCAccount);
        const adquirente1EuroCCBalance = await getTokenBalance(connection, adquirente1EuroCCAccount);
        const adquirente2EuroCCBalance = await getTokenBalance(connection, adquirente2EuroCCAccount);
        
        const emisorBonoDeudaBalance = await getTokenBalance(connection, emisorBonoDeudaAccount);
        const adquirente1BonoDeudaBalance = await getTokenBalance(connection, adquirente1BonoDeudaAccount);
        const adquirente2BonoDeudaBalance = await getTokenBalance(connection, adquirente2BonoDeudaAccount);
        
        // Print balances
        console.log('\nEuroCC Balances:');
        console.log(`emisorEuroCC: ${emisorEuroCCBalance / Math.pow(10, tokenInfo.tokens.euroCC.decimals)}`);
        console.log(`emisorBonoDeuda: ${emisorBonoDeudaEuroCCBalance / Math.pow(10, tokenInfo.tokens.euroCC.decimals)}`);
        console.log(`adquirente1: ${adquirente1EuroCCBalance / Math.pow(10, tokenInfo.tokens.euroCC.decimals)}`);
        console.log(`adquirente2: ${adquirente2EuroCCBalance / Math.pow(10, tokenInfo.tokens.euroCC.decimals)}`);
        
        console.log('\nBonoDeuda Balances:');
        console.log(`emisorBonoDeuda: ${emisorBonoDeudaBalance / Math.pow(10, tokenInfo.tokens.bonoDeuda.decimals)}`);
        console.log(`adquirente1: ${adquirente1BonoDeudaBalance / Math.pow(10, tokenInfo.tokens.bonoDeuda.decimals)}`);
        console.log(`adquirente2: ${adquirente2BonoDeudaBalance / Math.pow(10, tokenInfo.tokens.bonoDeuda.decimals)}`);
        
    } catch (error) {
        console.error('Error checking balances:', error);
    }
}

main().catch(console.error);