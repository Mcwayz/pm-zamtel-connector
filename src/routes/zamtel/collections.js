const express = require('express');
const router = express.Router();
const zamtelCollectionsController = require('../../controllers/zamtel/collections');

router.post('/pushZamtelpayment', async (req, res) => {
  try {
    const data = req.body;
    const result = await zamtelCollectionsController.pushZamtelPayment(data);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});



module.exports = router;