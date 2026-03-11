// logica back
const path = require("path");
const { v4: uuidv4 } = require("uuid");
const { leerJson, escribirJson } = require("../services/file.service");

const FILE_PROD = path.join(__dirname, "../data/productos.json");

const getProductos = async (req, res) => {
  try {
    const productos = await leerJson(FILE_PROD);
    res.status(200).json(productos);
  } catch {
    res.status(500).json({ error: "Error al leer productos" });
  }
};

const crearProducto = async (req, res) => {
  try {
    const { nombre, precio, stock } = req.body;

    if (!nombre || precio == null || stock == null) {
      return res.status(400).json({ error: "Datos incompletos" });
    }

    const productos = await leerJson(FILE_PROD);

    const nuevo = {
      id: uuidv4(),
      nombre,
      precio,
      stock
    };

    productos.push(nuevo);

    await escribirJson(FILE_PROD, productos);

    res.status(201).json(nuevo);

  } catch {
    res.status(500).json({ error: "Error al crear producto" });
  }
};

const actualizarProducto = async (req, res) => {

  try {
    const { id } = req.params;
    const { nombre, precio, stock } = req.body;

    const data = await leerJson(FILE_PROD);

    const producto = data.productos.find(p => p.id == id);

    if (!producto) {
      return res.status(404).json({ error: "Producto no encontrado" });
    }
    if (nombre) producto.nombre = nombre;
    if (precio) producto.precio = precio;
    if (stock) producto.stock = stock;

    await escribirJson(FILE_PROD, data);
    res.status(200).json(producto);
  } catch {
    res.status(500).json({ error: "Error al actualizar producto" });
  }

};
const eliminarProducto = async (req, res) => {
  try {
    const { id } = req.params;

    const data = await leerJson(FILE_PROD);

    const index = data.productos.findIndex(p => p.id == id);
    if (index === -1) {
      return res.status(404).json({ error: "Producto no encontrado" });
    }

    const eliminado = data.productos.splice(index,1);
    await escribirJson(FILE_PROD, data);
    res.status(200).json(eliminado);

  } catch {
    res.status(500).json({ error: "Error al eliminar producto" });
  }

};



module.exports = { getProductos, crearProducto, actualizarProducto, eliminarProducto };