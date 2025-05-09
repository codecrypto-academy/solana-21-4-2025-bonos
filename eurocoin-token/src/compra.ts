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
const NUM_BONOS = 1;
const PRECIO_EUROCC = 1000;

async function main() {
    // Load token info
    const tokenInfo = loadTokenInfo();
    
    // Connect to Solana
    const connection = new Connection(RPC_ENDPOINT, 'confirmed');
    
    // Get token mints
    const euroCCMint = new PublicKey(tokenInfo.tokens.euroCC.mint);
    const bonoDeudaMint = new PublicKey(tokenInfo.tokens.bonoDeuda.mint);
    
    // Load keypairs
    const emisorBonoDeudaKeypair = loadKeypair('emisor_bonodeuda');
    const adquirente1Keypair = loadKeypair('adquirente1');
    
    try {
        console.log('Setting up token accounts...');
        
        // Get or create token accounts for EuroCC
        const adquirente1EuroCCAccount = await getOrCreateAssociatedTokenAccount(
            connection,
            euroCCMint,
            adquirente1Keypair.publicKey,
            adquirente1Keypair
        );
        
        const emisorBonoDeudaEuroCCAccount = await getOrCreateAssociatedTokenAccount(
            connection,
            euroCCMint,
            emisorBonoDeudaKeypair.publicKey,
            adquirente1Keypair
        );
        
        // Get or create token accounts for BonoDeuda
        const emisorBonoDeudaAccount = await getOrCreateAssociatedTokenAccount(
            connection,
            bonoDeudaMint,
            emisorBonoDeudaKeypair.publicKey,
            adquirente1Keypair
        );
        
        const adquirente1BonoDeudaAccount = await getOrCreateAssociatedTokenAccount(
            connection,
            bonoDeudaMint,
            adquirente1Keypair.publicKey,
            adquirente1Keypair
        );
        
        // Calculate amounts with decimals
        const euroCCAmount = PRECIO_EUROCC * Math.pow(10, tokenInfo.tokens.euroCC.decimals);
        const bonoDeudaAmount = NUM_BONOS * Math.pow(10, tokenInfo.tokens.bonoDeuda.decimals);
        
        console.log('\nExecuting purchase transaction...');
        console.log(`adquirente1 will pay ${PRECIO_EUROCC} EuroCC for ${NUM_BONOS} BonoDeuda`);
        
        // Transfer EuroCC from adquirente1 to emisorBonoDeuda
        console.log('\nTransferring EuroCC...');
        await transferTokens(
            connection,
            adquirente1Keypair,
            adquirente1EuroCCAccount,
            emisorBonoDeudaEuroCCAccount,
            euroCCAmount
        );
        
        // Transfer BonoDeuda from emisorBonoDeuda to adquirente1
        console.log('\nTransferring BonoDeuda...');
        await transferTokens(
            connection,
            emisorBonoDeudaKeypair,
            emisorBonoDeudaAccount,
            adquirente1BonoDeudaAccount,
            bonoDeudaAmount
        );
        
        console.log('\nPurchase completed successfully!');
        
    } catch (error) {
        console.error('Error in purchase process:', error);
    }
}

main().catch(console.error); 