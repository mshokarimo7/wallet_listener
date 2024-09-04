const { Connection, PublicKey } = require('@solana/web3.js');

async function get_token_account(connection, searchAddress, tokenMintAddress) {
    const public_key = new PublicKey(searchAddress);
    const mint_key = new PublicKey(tokenMintAddress);
    const token_account_address = await connection.getTokenAccountsByOwner(public_key,
        {mint: mint_key});
    return token_account_address;
}

const endpoint = 'https://mainnet.helius-rpc.com/?api-key=76549b2f-d3e9-4c33-bbe0-f103a92537dc';
const connection = new Connection(endpoint);
//const searchAddress = 'GMUb8JF8NgD6NXHzG9mbQbE16EqADkBZdfhJJvur4zfE';
const searchAddress = 'GtiUVnQEy6DRVizgFgg5MoghycJWX11XmAMMdaJCfKyA';

const tokenMintAddress = 'CGPoSJ4mLErDe7Mb2cb11Z6xhjADtGcQXXUi7Nmaruax';


async function main() {
    const new_new = await get_token_account(connection, searchAddress, tokenMintAddress);
    if(new_new.value.length > 0){
        console.log('Value exists \n');
    }
    else{
        console.log('Value does not exist \n');
    }
}
main();