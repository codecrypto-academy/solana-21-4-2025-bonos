import { Connection, PublicKey } from '@solana/web3.js';
import { getAssociatedTokenAddress } from '@solana/spl-token';
import {
    RPC_ENDPOINT,
    TokenInfo,
    loadKeypair,
    loadTokenInfo,
    getOrCreateAssociatedTokenAccount,
    getTokenBalance,
    transferTokens
} from './utils';

// Constants
const CUPON_PORCENTAJE = 0.04; // 5% coupon rate
const NOMINAL_BONO = 1000; // 1000 EuroCC

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
        
        // Get bond balances
        const adquirente1BonoBalance = await getTokenBalance(connection, adquirente1BonoDeudaAccount);
        const adquirente2BonoBalance = await getTokenBalance(connection, adquirente2BonoDeudaAccount);
        
        // Calculate coupon payments
        const adquirente1Cupon = (adquirente1BonoBalance * NOMINAL_BONO * CUPON_PORCENTAJE) / Math.pow(10, tokenInfo.tokens.bonoDeuda.decimals);
        const adquirente2Cupon = (adquirente2BonoBalance * NOMINAL_BONO * CUPON_PORCENTAJE) / Math.pow(10, tokenInfo.tokens.bonoDeuda.decimals);
        
        console.log('\nBond balances:');
        console.log(`adquirente1: ${adquirente1BonoBalance / Math.pow(10, tokenInfo.tokens.bonoDeuda.decimals)} BonoDeuda`);
        console.log(`adquirente2: ${adquirente2BonoBalance / Math.pow(10, tokenInfo.tokens.bonoDeuda.decimals)} BonoDeuda`);
        
        console.log('\nCoupon payments:');
        console.log(`adquirente1: ${adquirente1Cupon} EuroCC`);
        console.log(`adquirente2: ${adquirente2Cupon} EuroCC`);
        
        // Pay coupons
        if (adquirente1Cupon > 0) {
            console.log(`\nPaying coupon to adquirente1...`);
            await transferTokens(
                connection,
                emisorEuroCCKeypair,
                emisorEuroCCAccount,
                adquirente1EuroCCAccount,
                adquirente1Cupon * Math.pow(10, tokenInfo.tokens.euroCC.decimals)
            );
        }
        
        if (adquirente2Cupon > 0) {
            console.log(`Paying coupon to adquirente2...`);
            await transferTokens(
                connection,
                emisorEuroCCKeypair,
                emisorEuroCCAccount,
                adquirente2EuroCCAccount,
                adquirente2Cupon * Math.pow(10, tokenInfo.tokens.euroCC.decimals)
            );
        }
        
        console.log('\nCoupon payments completed successfully!');
        
    } catch (error) {
        console.error('Error in coupon payment process:', error);
    }
}

main().catch(console.error); 