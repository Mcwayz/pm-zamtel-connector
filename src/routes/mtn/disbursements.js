const express = require('express');
const router = express.Router();
const mtnDisbursementController = require('../../controllers/mtn/disbursements');


// Funds Transfer Endpoint


router.post('/mtnFundsTransfer', async (req, res) => {
  try {
    const data = req.body;
    const result = await mtnDisbursementController.processTransfer(data);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// Funds Transfer Transaction Status


router.post('/mtnTransferStatus', async (req, res) => {
    try {
      const data = req.body;
      const result = await mtnDisbursementController.validateMTNTransferStatus(data);
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  
  module.exports = router;