const app = require('./app');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Set default port
const PORT = process.env.PORT || 5000;

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
  console.log(`Server accessible at http://0.0.0.0:${PORT}`);
});