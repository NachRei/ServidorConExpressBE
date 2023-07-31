const express = require('express');
const app = express();
const ProductManager = require('./ProductManager');

const productManager = new ProductManager('products.json');

// Endpoint para obtener los productos
app.get('/products', async (req, res) => {
  try {
    const { limit } = req.query;
    const products = await productManager.getProducts();

    if (limit) {
      const parsedLimit = parseInt(limit, 10);
      if (!isNaN(parsedLimit) && parsedLimit > 0) {
        res.json(products.slice(0, parsedLimit));
      } else {
        res.status(400).json({ error: 'El valor del límite debe ser un número entero positivo.' });
      }
    } else {
      res.json(products);
    }
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener los productos.' });
  }
});

// Endpoint para obtener un producto por ID
app.get('/products/:pid', async (req, res) => {
  try {
    const productId = parseInt(req.params.pid, 10);
    if (isNaN(productId)) {
      res.status(400).json({ error: 'El ID del producto debe ser un número entero.' });
    } else {
      const product = await productManager.getProductById(productId);
      res.json(product);
    }
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener el producto por ID.' });
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor Express escuchando en el puerto ${PORT}`);
});
