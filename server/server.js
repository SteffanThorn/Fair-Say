require('dotenv').config({ path: '.env.local' });
const express = require('express');
const mpsRoutes = require('./routes/mps');
const partiesRoutes = require('./routes/parties');
const errorHandler = require('./middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(express.json());

// Routes
app.use('/api/mps', mpsRoutes);
app.use('/api/parties', partiesRoutes);

// Error handling middleware
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`Express API server running on port ${PORT}`);
});