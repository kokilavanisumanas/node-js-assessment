const express = require('express');
const Product = require('../models/Product');
const upload = require('../middlewares/upload');
const { validateProduct, validate } = require('../middlewares/validateProduct');
const uploads = require('../fileuploads/uploadConfig'); // Import Multer configuration
const bodyParser = require('body-parser');

const router = express.Router();

// Create a new product
router.post('/products', upload.single('image'), validateProduct, validate, async (req, res) => {
    try {
        const { name, price, description } = req.body;
        const imageUrl = req.file ? req.file.path : null;

        const product = new Product({
            name,
            price,
            description,
            imageUrl,
        });

        await product.save();
        res.status(201).json({ product });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// List all products
router.get('/products', async (req, res) => {
    try {
        const products = await Product.find();
        res.status(200).json({ products });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get a single product
router.get('/products/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.status(200).json({ product });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Update a product
router.put('/products/:id', upload.single('image'), validateProduct, validate, async (req, res) => {
    try {
        const { name, price, description } = req.body;
        const imageUrl = req.file ? req.file.path : null;

        const product = await Product.findByIdAndUpdate(req.params.id, {
            name,
            price,
            description,
            imageUrl,
        }, { new: true });

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        res.status(200).json({ product });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Delete a product
router.delete('/products/:id', async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.status(200).json({ message: 'Product deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});


const app = express();
app.use(bodyParser.json());

// Endpoint to upload a file and associate it with a product
app.post('/products/:id/upload', uploads.single('image'), async (req, res) => {
    try {
      const productId = req.params.id;
      const file = req.file;
      
      if (!file) {
        return res.status(400).send('No file uploaded');
      }
      
      // Find the product by ID and update the imageUrl field with the new file's path
      const product = await Product.findByIdAndUpdate(
        productId,
        { imageUrl: file.path },
        { new: true }
      );
      
      if (!product) {
        return res.status(404).send('Product not found');
      }
      
      res.send({ message: 'File uploaded successfully', product });
    } catch (error) {
      res.status(500).send(error.message);
    }
  });
module.exports = router;
