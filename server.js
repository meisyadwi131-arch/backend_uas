const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Import Routes
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');
const categoryRoutes = require('./routes/categoryRoutes');

// Mount Routes
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/categories', categoryRoutes);

// Root Endpoint
app.get('/', (req, res) => {
    res.json({ message: 'Welcome to the UAS Online Store API' });
});

// Checkout API (Requirement 2) - forwards to WA
// The logic will be handled inside orderRoutes, but for clarity:
app.use('/api/checkout', orderRoutes); 

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
});
