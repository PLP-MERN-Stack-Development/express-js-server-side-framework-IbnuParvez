// server.js - Starter Express server for Week 2 assignment

// Import required modules
const express = require('express');
const bodyParser = require('body-parser');
const { v4: uuidv4 } = require('uuid');

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware setup
app.use(express.json());

// Sample in-memory products database
let products = [
  {
    id: '1',
    name: 'Laptop',
    description: 'High-performance laptop with 16GB RAM',
    price: 1200,
    category: 'electronics',
    inStock: true
  },
  {
    id: '2',
    name: 'Smartphone',
    description: 'Latest model with 128GB storage',
    price: 800,
    category: 'electronics',
    inStock: true
  },
  {
    id: '3',
    name: 'Coffee Maker',
    description: 'Programmable coffee maker with timer',
    price: 50,
    category: 'kitchen',
    inStock: false
  }
];

// Root route
app.get('/', (req, res) => {
  res.send('Welcome to the Product API! Go to /api/products to see all products.');
});

// TODO: Implement the following routes:
// GET /api/products - Get all products
// GET /api/products/:id - Get a specific product
app.get('/api/products/:id', async (req, res) => {
	const product = await products.find(p => p.id === req.params.id);
	if (!product) {
		return res.status(404).json({Message: "Product not found"});
	}
	res.json(product);
});
// POST /api/products - Create a new product
app.post('/api/products', (req, res) => {
	const { name, description, price, category, instock} = req.body;
	const newProduct = { id: uuidv4(), name, description, price, category, instock };
	products.push(newProduct);
	res.status(201).json(newProduct);
});
// PUT /api/products/:id - Update a product
app.put('/api/products/:id', (req, res) => {
	const product = products.find(p => p.id === req.params.id);
	if(!product) return res.status(404).json({message: "Product not found"});
	Object.assign(product, req.body);
	res.json(product);
});
// DELETE /api/products/:id - Delete a product
app,delete('/api/products/:id', async (req, res) => {
	const productIndex = products.findIndex(p => p.id === req.params.id);
  	if (productIndex === -1) {
    	return res.status(404).json({ message: 'Product not found' });
  	}
  	products.splice(productIndex, 1);
  	res.json({ message: 'Deleted successfully' });
});
// Example route implementation for GET /api/products
app.get('/api/products', (req, res) => {
  res.json(products);
});

// TODO: Implement custom middleware for:
// - Request logging
app.use((req, res, next) => {
  	const time = new Date().toISOString();
  	console.log(`[${time}] ${req.method} ${req.originalUrl}`);
  	next();
});
// - Authentication
app.get('/api', function auth(req, res) => {
	const apiKey = req.header('x-api-key');
	if ( apiKey != process.env.API_KEY) {
	return res.status(404).json({message: "Unauthorized"});
	}
});
// - Error handling
app.use('/api', (err, req, res, next){
	console.error(err.message);
	res.status(500).json({message: "Something went wrong"});
});
// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

// Export the app for testing purposes
module.exports = app; 
