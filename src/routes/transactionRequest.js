const express = require('express');
const router = express.Router();
const mtnRequestToPayTransferController = require('../controllers/mtn/requestToPayTransfer');
const airtelTransactionRequestController = require('../controllers/airtel/transactionRequest');
const airtelRequestToPayTransferController = require('../controllers/airtel/requestToPayTransfer');
const zamtelRequestToPayTransferController = require('../controllers/zamtel/requestToPayTransfer');

router.post('/transactionrequests', async (req, res) => {
  try {
    const data = req.body;
    console.log(`-> ${new Date()} :: POST /transactionrequests: ${JSON.stringify(data)}`);
    const result = await airtelTransactionRequestController.transactionRequest(data);
    console.log("Response: ", result);

    data.homeR2PTransactionId = result.homeR2PTransactionId;
    data.transferAmount = data.amount;
    data.amountType = "SEND";
    data.scenario = "TRANSFER";

    // Swap the from and to fields
    [data["to"], data["from"]] = [data["from"], data["to"]];

    console.log(`-> ${new Date()} :: POST /requestToPayTransfer: ${JSON.stringify(data)}`);

    // Determine the appropriate controller based on the MSISDN prefix
    const msisdn = data.payer.partyId;
    let r2pResult;

    if (msisdn.startsWith('095') || msisdn.startsWith('075')) {
      r2pResult = await zamtelRequestToPayTransferController.postRequestToPayTransfer(data);
    } else {
      throw new Error('Invalid MSISDN prefix');
    }

    console.log("Response from R2P: ", r2pResult);
    res.json(result);
  } catch (error) {
    console.log(`-> ${new Date()} :: ERROR: ${error.message}`);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
