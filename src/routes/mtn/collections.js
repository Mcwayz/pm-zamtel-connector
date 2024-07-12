const express = require('express');
const router = express.Router();
const mtnCollectionsController = require('../../controllers/mtn/collections');


// Payment Request Endpoint


router.post('/pushMTNPayment', async (req, res) => {
  try {
    const data = req.body;
    const result = await mtnCollectionsController.pushMTNPayment(data);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// Payment Request Status Endpoint


router.post('/mtnTransactionStatus', async (req, res) => {
  try {
    const data = req.body;
    const result = await mtnCollectionsController.getMTNPaymentStatus(data);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;