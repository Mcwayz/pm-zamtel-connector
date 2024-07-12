const { v4: uuidv4 } = require('uuid');

const transactionRequest = async (data) => {
  try {
    const returnData = {
        "homeR2PTransactionId": uuidv4(),
        "transactionRequestId": data.transactionRequestId,
        "transactionRequestState": "RECEIVED"
    }

    return returnData;
  } catch (error) {
    console.log(`-> ${new Date()} :: ERROR: ${error.message}`);
    return { error: error.message };
  }
};

module.exports = { transactionRequest };