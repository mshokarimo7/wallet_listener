const { Connection, PublicKey } = require('@solana/web3.js');
const { removeValueFromArray, get_token_account } = require('./etc/helpers.js');
const { parseInnerInstructions, parseMainInstruction } = require('./parsers/instruction_parsers.js');

//const tokenMintAddress = 'HaSbULSHz7S2eEkmGSgyYwmbHcTecc5xcNAo6e8TfWFs';
//const searchAddress = 'KoLpN4cKx6asud6fm2UGRMnbTDTqtRkqSEsQ3v7kMzD';
const searchAddress = 'GtiUVnQEy6DRVizgFgg5MoghycJWX11XmAMMdaJCfKyA';
const tokenMintAddress = 'CGPoSJ4mLErDe7Mb2cb11Z6xhjADtGcQXXUi7Nmaruax';
const endpoint = 'https://mainnet.helius-rpc.com/?api-key=406f506f-c4ad-4a4f-b37f-1c9e1fd32313';
const connection = new Connection(endpoint);
const before_sig = '3pQsumQnmYWtQBTjHRsaoZYSCFrATdSLQZ7KPNbi37iyaJbzB6Ags7DT2mfq9Sgj7cNvaCZZapronEyJnir4wDdk';
const after_sig = 'QzhSMsZzgZRevvY6A1JCooEmzEqEMtx5MajT25LTdLkwSo5MonqyhX3gcFCCw1saVDcQn7qoJNrD6dKmEkUXu1w';

let totalTokens = 0;
const wallets_array = [];

const getTransactions = async (address, numTx, token_account) => {
    const pubKey = new PublicKey(address);

    // the function 'getSignaturesForAddress' actually returns a confirmed signature info, which is a transaction
    //const transactionList = await connection.getSignaturesForAddress(pubKey, { limit: numTx, before: before_sig, until: after_sig });
    const transactionList = await connection.getSignaturesForAddress(pubKey, { limit: numTx });

    // getting the signatures list from the transactions list i.e. 
    const signatureList = transactionList.map(tx => tx.signature);
    const transactionDetails = await connection.getParsedTransactions(signatureList, {maxSupportedTransactionVersion: 0});

    transactionDetails.forEach((tx) => {
        /* Creating the array to store the 'inner instruction group' indexes,
        so that i can call the inner instructions inside their main instruction
        where they belong */
        const index_array = [];
        /* Keeping count of which inner instruction group will be parsed 
        from the inner inner instruction array */
        let which_inner_instr = 0;

        if(tx.meta.innerInstructions){
            tx.meta.innerInstructions.forEach((innerInstruction) => {
                index_array.push(innerInstruction.index);
            });
        }
        console.log('Index array: ', index_array, '\n');

        // Getting the main instructions -------------------------------------------
        const main_instructions = tx.transaction.message.instructions;
        main_instructions.forEach((main_instruction, j) => {

            // Parsing the main instruction
            const return_wallet_object_main = parseMainInstruction(main_instruction, j, token_account);
            if(return_wallet_object_main.length > 0){
                return_wallet_object_main.forEach(obj1 => {
                    wallets_array.push({
                        wallet_address: obj1.dest_wallet_address,
                        amount: obj1.uiAmount
                    });
                    totalTokens = totalTokens + obj1.uiAmount;
                });
            }

            if(index_array.includes(j)){
                // Parsing the inner instructions ----------------------------------
                const return_wallet_object = parseInnerInstructions(tx.meta.innerInstructions[which_inner_instr], token_account);
                if(return_wallet_object.length > 0){
                    return_wallet_object.forEach((obj2) => {
                        wallets_array.push({wallet_address: obj2.dest_wallet_address, amount: obj2.uiAmount});
                        totalTokens = totalTokens + obj2.uiAmount;
                    });
                }
                which_inner_instr++;
                removeValueFromArray(index_array, j);
            }
        });
    });
    console.log('Total amount sent to RATS: ', totalTokens, '\n');
    console.log('Rat wallets array: ', wallets_array, '\n');
};

async function main() {
    // Getting the token account after waiting for the promise to resolve
    const token_account = await get_token_account(connection, searchAddress, tokenMintAddress);

    // Waiting for the transactions to be processed
    await getTransactions(searchAddress, 10, token_account);

    // Token account address
    console.log('Token_account:', token_account, '\n');
}

main(); // Calling the main async function
