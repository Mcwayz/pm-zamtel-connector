const express = require('express');
const router = express.Router();
const mtnAuthenticationController = require('../../controllers/mtn/authentication');

router.get('/get-token', async (req, res) => {
  try {
    const result = await mtnAuthenticationController.getBearToken();
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;