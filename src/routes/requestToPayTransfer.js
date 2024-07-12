const express = require('express');
const router = express.Router();
const airtelRequestToPayTransferController = require('../controllers/airtel/requestToPayTransfer');
const mtnRequestToPayTransferController = require('../controllers/mtn/requestToPayTransfer');
const zamtelRequestToPayTransferController = require('../controllers/zamtel/requestToPayTransfer');

router.post('/requestToPayTransfer', async (req, res) => {
  try {
    const data = req.body;
    console.log(`-> ${new Date()} :: POST /requestToPayTransfer: ${JSON.stringify(data)}`);

    // Determine which controller to use based on the MSISDN prefix
    const msisdn = data.payer.partyId;
    let result;

    if (msisdn.startsWith('096') || msisdn.startsWith('076')) {
      result = await mtnRequestToPayTransferController.postMTNRequestToPayTransfer(data);
    } else if (msisdn.startsWith('097') || msisdn.startsWith('077')) {
      result = await airtelRequestToPayTransferController.postRequestToPayTransfer(data);
    } else if (msisdn.startsWith('095') || msisdn.startsWith('075')) {
      result = await zamtelRequestToPayTransferController.postRequestToPayTransfer(data);
    } else {
      throw new Error('Invalid MSISDN prefix');
    }

    console.log("Response: ", result);
    res.json(result);
  } catch (error) {
    console.log(`-> ${new Date()} :: ERROR: ${error.message}`);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
