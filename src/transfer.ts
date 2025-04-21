import { Connection, PublicKey } from '@solana/web3.js';
import {
    RPC_ENDPOINT,
    TokenInfo,
    loadKeypair,
    loadTokenInfo,
    getOrCreateAssociatedTokenAccount,
    transferTokens
} from './utils';

// Constants
const NUM_TOKENS = 1;

async function main() {
    // Load token info
    const tokenInfo = loadTokenInfo();
    
    // Connect to Solana
    const connection = new Connection(RPC_ENDPOINT, 'confirmed');
    
    // Get token mints
    const bonoDeudaMint = new PublicKey(tokenInfo.tokens.bonoDeuda.mint);
    
    // Load keypairs
    const adquirente1Keypair = loadKeypair('adquirente1');
    const adquirente2Keypair = loadKeypair('adquirente2');
    
    try {
        console.log('Setting up token accounts...');
        
        // Get or create token accounts for BonoDeuda
        const adquirente1BonoDeudaAccount = await getOrCreateAssociatedTokenAccount(
            connection,
            bonoDeudaMint,
            adquirente1Keypair.publicKey,
            adquirente1Keypair
        );
        
        const adquirente2BonoDeudaAccount = await getOrCreateAssociatedTokenAccount(
            connection,
            bonoDeudaMint,
            adquirente2Keypair.publicKey,
            adquirente1Keypair
        );
        
        // Calculate amount with decimals
        const amount = NUM_TOKENS * Math.pow(10, tokenInfo.tokens.bonoDeuda.decimals);
        
        console.log(`\nTransferring ${NUM_TOKENS} BonoDeuda tokens from adquirente1 to adquirente2...`);
        
        // Transfer tokens
        await transferTokens(
            connection,
            adquirente1Keypair,
            adquirente1BonoDeudaAccount,
            adquirente2BonoDeudaAccount,
            amount
        );
        
        console.log('\nTransfer completed successfully!');
        
    } catch (error) {
        console.error('Error in transfer process:', error);
    }
}

main().catch(console.error); 