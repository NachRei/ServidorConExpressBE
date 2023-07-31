const fs = require('fs');

class ProductManager {
  constructor(filePath) {
    this.path = filePath;
    this.nextProductId = 1;
  }

  async addProduct(product) {
    // Validar que todos los campos sean obligatorios
    if (!product.title || !product.description || !product.price || !product.thumbnail || !product.code || !product.stock) {
      throw new Error('Todos los campos son obligatorios.');
    }

    try {
      const products = await this.getProductsFromFile();

      // Validar que no se repita el campo "code"
      const existingProduct = products.find(p => p.code === product.code);
      if (existingProduct) {
        throw new Error('El código del producto ya existe.');
      }

      // Agregar el producto con un id autoincrementable
      const newProduct = {
        ...product,
        id: this.nextProductId,
      };
      products.push(newProduct);
      this.nextProductId++;

      await this.saveProductsToFile(products);
    } catch (error) {
      throw new Error('Error al agregar el producto.');
    }
  }

  async getProducts() {
    try {
      return await this.getProductsFromFile();
    } catch (error) {
      throw new Error('Error al obtener los productos.');
    }
  }

  async getProductById(id) {
    try {
      const products = await this.getProductsFromFile();
      const product = products.find(p => p.id === id);
      if (!product) {
        throw new Error('Producto no encontrado.');
      }
      return product;
    } catch (error) {
      throw new Error('Error al obtener el producto por ID.');
    }
  }

  async updateProduct(id, updatedFields) {
    try {
      const products = await this.getProductsFromFile();
      const productIndex = products.findIndex(p => p.id === id);

      if (productIndex === -1) {
        throw new Error('Producto no encontrado.');
      }

      // Actualizar el producto con los nuevos campos
      products[productIndex] = {
        ...products[productIndex],
        ...updatedFields,
        id, // Asegurarnos de mantener el mismo ID
      };

      await this.saveProductsToFile(products);
    } catch (error) {
      throw new Error('Error al actualizar el producto.');
    }
  }

  async deleteProduct(id) {
    try {
      const products = await this.getProductsFromFile();
      const updatedProducts = products.filter(p => p.id !== id);

      if (products.length === updatedProducts.length) {
        throw new Error('Producto no encontrado.');
      }

      await this.saveProductsToFile(updatedProducts);
    } catch (error) {
      throw new Error('Error al eliminar el producto.');
    }
  }

  // Métodos auxiliares para manejar la lectura y escritura del archivo
  async getProductsFromFile() {
    return new Promise((resolve, reject) => {
      fs.readFile(this.path, 'utf8', (err, data) => {
        if (err) {
          // Si el archivo no existe o hay un error, devolvemos un arreglo vacío
          resolve([]);
        } else {
          try {
            resolve(JSON.parse(data));
          } catch (error) {
            reject(error);
          }
        }
      });
    });
  }

  async saveProductsToFile(products) {
    return new Promise((resolve, reject) => {
      fs.writeFile(this.path, JSON.stringify(products, null, 2), 'utf8', err => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }
}
