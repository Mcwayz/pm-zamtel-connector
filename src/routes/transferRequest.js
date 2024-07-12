const express = require('express');
const router = express.Router();
const airtelFundsTransferController = require('../controllers/airtel/disbursements');
const mtnFundsTransferController = require('../controllers/mtn/disbursements');
const zamtelFundsTransferController = require('../controllers/zamtel/disbursements');


router.post('/mnoFundsTransfer', async (req, res) => {
    try {
      const data = req.body;
      console.log(`-> ${new Date()} :: POST /mnoFundsTransfer: ${JSON.stringify(data)}`);
  
      // Determine which controller to use based on the MSISDN prefix
      const msisdn = data.payer.partyId;
      let result;
  
      if (msisdn.startsWith('095') || msisdn.startsWith('075')) {
        result = await zamtelFundsTransferController.postRequestToPayTransfer(data);
      } else {
        throw new Error('Invalid MSISDN Prefix');
      }
  
      console.log("Response: ", result);
      res.json(result);
    } catch (error) {
      console.log(`-> ${new Date()} :: ERROR: ${error.message}`);
      res.status(500).json({ error: error.message });
    }
  });
  
  module.exports = router;
  