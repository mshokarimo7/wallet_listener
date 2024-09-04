const token_2022 = 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA';
const { convertStringToNumber } = require('../etc/helpers.js');

function parseInnerInstructions(innerInstructions, token_account){
    const return_wallet_object1 = [];
    console.log('Inner instructions being parsed \n');
    innerInstructions.instructions.forEach((innerInstr, l) => {
        console.log('Inner instruction: ', l, innerInstr, '\n');
        // Checking to see if it is a 'transferChecked' or 'transfer' type of an instruction.
        // If it is 'transfer', we also make sure its a token2022 program id 
        if((innerInstr.parsed.type == 'transferChecked' && innerInstr.parsed.info.source == token_account) || 
        (innerInstr.parsed.type == 'transfer' && innerInstr.programId.toString() == token_2022 && 
        innerInstr.parsed.info.source == token_account))
        {
            // Checking to see if the amount is stored in a TokenAmount object
            if(innerInstr.parsed.info.tokenAmount){
                return_wallet_object1.push({dest_wallet_address: innerInstr.parsed.info.destination,
                    uiAmount: innerInstr.parsed.info.tokenAmount.uiAmount});
                console.log(return_wallet_object1, '\n');
            }
            // If not, just pull the Amount variable, which is a string
            else{
                return_wallet_object1.push({dest_wallet_address: innerInstr.parsed.info.destination,
                    uiAmount: convertStringToNumber(innerInstr.parsed.info.amount)});
                console.log(return_wallet_object1, '\n');
            }
        }
    });
    return return_wallet_object1;
}

function parseMainInstruction(main_instruc, j, token_account) {
    const return_wallet_object1 = [ ];
    // Do not do anything if its a partially decoded instruction, i.e. instruction doesnt have '.parsed' object
    if (main_instruc.accounts) {
        console.log('Partially decoded main instruction:', j, main_instruc);
    }
    // If it does have '.parsed' proceed with the insructon parsing
    else{
        console.log('Parsed main instruction: ', j, main_instruc, '\n');
        // Checking to see if it is a 'transferChecked' or 'transfer' type of an instruction.
        // If it is 'transfer', we also make sure its a token2022 program id 
        if((main_instruc.parsed.type == 'transferChecked' && main_instruc.parsed.info.source == token_account) || 
        (main_instruc.parsed.type == 'transfer' && main_instruc.programId.toString() == token_2022 && 
        main_instruc.parsed.info.source == token_account))
            {
                if(main_instruc.parsed.info.tokenAmount){
                    return_wallet_object1.push({dest_wallet_address: main_instruc.parsed.info.destination,
                        uiAmount: main_instruc.parsed.info.tokenAmount.uiAmount});
                    console.log(return_wallet_object1, '\n');
                }
                else{
                    return_wallet_object1.push({dest_wallet_address: main_instruc.parsed.info.destination,
                        uiAmount: convertStringToNumber(main_instruc.parsed.info.amount)});
                    console.log(return_wallet_object1, '\n');
                }

            }
    }
    return return_wallet_object1;
}

module.exports = {
    parseInnerInstructions,
    parseMainInstruction
};