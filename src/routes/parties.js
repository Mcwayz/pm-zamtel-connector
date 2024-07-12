// const express = require('express');
// const router = express.Router();
// const airtelPartiesController = require('../controllers/parties');

// router.get('/parties/:idType/:idValue', async (req, res) => {
//   try {
//     const data = {
//         'idType': req.params['idType'],
//         'idValue': req.params['idValue'] 
//     };
//     console.log(`-> ${new Date()} :: GET /parties/${req.params['idType']}/${req.params['idValue']}: ${JSON.stringify(data)}`);
//     const result = await airtelPartiesController.getAirtelParties(data);
//     console.log("Response: ", result);
//     res.json(result);
//   } catch (error) {
//     console.log(`-> ${new Date()} :: ERROR: ${error.message}`);
//     res.status(500).json({ error: error.message });
//   }
// });

// module.exports = router;


const express = require('express');
const router = express.Router();
const airtelPartiesController = require('../controllers/airtel/parties');
const mtnPartiesController = require('../controllers/mtn/parties');
const zamtelPartiesController = require('../controllers/zamtel/parties');

router.get('/parties/:idType/:idValue', async (req, res) => {
  try {
    const idType = req.params['idType'];
    const idValue = req.params['idValue'];
    const data = { idType, idValue };
    console.log(`-> ${new Date()} :: GET /parties/${idType}/${idValue}: ${JSON.stringify(data)}`);

    let result;
    if (idValue.startsWith('096') || idValue.startsWith('076')) {
      result = await mtnPartiesController.getMTNParties(data);
    } else if (idValue.startsWith('097') || idValue.startsWith('077')) {
      result = await airtelPartiesController.getAirtelParties(data);
    } else if (idValue.startsWith('095') || idValue.startsWith('075')) {
      result = await zamtelPartiesController.getZamtelParties(data);
    } else {
      throw new Error('Invalid idValue prefix');
    }

    console.log("Response: ", result);
    res.json(result);
  } catch (error) {
    console.log(`-> ${new Date()} :: ERROR: ${error.message}`);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
