const { PublicKey } = require("@solana/web3.js");

function removeValueFromArray(arr, value) {
    const index = arr.indexOf(value);
    if (index !== -1) {
        arr.splice(index, 1);
    }
}

async function get_token_account(connection, searchAddress, tokenMintAddress) {
    const public_key = new PublicKey(searchAddress);
    const mint_key = new PublicKey(tokenMintAddress);
    const token_account_address = await connection.getTokenAccountsByOwner(public_key,
        {mint: mint_key});
    if(token_account_address.value.length > 0){
        return token_account_address.value[0].pubkey.toString();
    }
    else{
        return searchAddress;
    }
}

function convertStringToNumber(str) {
    if (str.length < 7) {
        throw new Error('Input string must be at least 7 characters long.');
    }

    const integerPart = str.slice(0, -6); // Get the part of the string before the last 6 characters
    const decimalPart = str.slice(-6); // Get the last 6 characters

    const result = parseFloat(`${integerPart}.${decimalPart}`);
    return result;
}

module.exports = {
    removeValueFromArray,
    get_token_account,
    convertStringToNumber
};