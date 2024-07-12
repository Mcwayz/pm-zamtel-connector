const fs = require('fs');
require('dotenv').config();
const cors = require('cors');
const express = require('express');




const partiesRoutes = require('./src/routes/parties');
const mtnCollectionsRoutes = require('./src/routes/mtn/collections');
const zamtelCollectionsRoutes = require('./src/routes/zamtel/collections');
const airtelCollectionsRoutes = require('./src/routes/airtel/collections');
const mtnAuthenticationRoutes = require('./src/routes/mtn/authentication');
const transactionRequestRoutes = require('./src/routes/transactionRequest');
const requestToPayTransferRoutes = require('./src/routes/requestToPayTransfer');
const airtelAuthenticationRoutes = require('./src/routes/airtel/authentication');
const zamtelAuthenticationRoutes = require('./src/routes/zamtel/authentication');
const { saveEncodedCredentials } = require('./src/controllers/mtn/authentication');

const app = express();
app.use(cors());
app.use(express.json());

// Call the function to save encoded credentials
saveEncodedCredentials();

// Airtel Routes
app.use('/airtel/auth', airtelAuthenticationRoutes);
app.use('/airtel/collections', airtelCollectionsRoutes);

// MTN Routes
app.use('/mtn/auth', mtnAuthenticationRoutes);
app.use('/mtn/collections', mtnCollectionsRoutes);

// Zamtel Routes
app.use('/zamtel/auth', zamtelAuthenticationRoutes);
app.use('/zamtel/collections', zamtelCollectionsRoutes);

// Common Routes
app.use('/', partiesRoutes);
app.use('/', transactionRequestRoutes);
app.use('/', requestToPayTransferRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

app.get('/health', (req, res) => {
  const currentDate = new Date();
  const currentDateISO = currentDate.toISOString();
  res.status(200).json({ message: `${currentDateISO}: Core connector is available and running on port ${process.env.PORT}` });
});

const PORT = process.env.PORT || 3003;
app.listen(PORT, () => {
  const currentDate = new Date();
  const currentDateISO = currentDate.toISOString();
  console.log(`${currentDateISO}: Core connector is available and running on port ${PORT}`);
});
