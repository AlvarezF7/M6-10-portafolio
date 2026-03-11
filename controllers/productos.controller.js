// logica back
const path = require("path");
const { v4: uuidv4 } = require("uuid");
const { leerJson, escribirJson } = require("../services/file.service");

const FILE_PROD = path.join(__dirname, "../data/productos.json");

// GET /productos
const getProductos = async (req, res) => {
  try {
    const data = await leerJson(FILE_PROD);
    // Aseguramos que siempre devolvemos un array
    res.status(200).json(data.productos || []);
  } catch (error) {
    console.error("Error al leer productos:", error);
    res.status(500).json({ error: "Error al leer productos" });
  }
};

// POST /producto
const crearProducto = async (req, res) => {
  try {
    const { nombre, precio, stock } = req.body;
    if (!nombre || precio == null || stock == null) {
      return res.status(400).json({ error: "Datos incompletos" });
    }

    const data = await leerJson(FILE_PROD);

    const nuevo = {
      id: uuidv4(),
      nombre,
      precio,
      stock
    };

    // Creamos el array si no existía
    if (!data.productos) data.productos = [];
    data.productos.push(nuevo);

    await escribirJson(FILE_PROD, data);

    res.status(201).json(nuevo);
  } catch (error) {
    console.error("Error al crear producto:", error);
    res.status(500).json({ error: "Error al crear producto" });
  }
};

// PUT /producto/:id
const actualizarProducto = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, precio, stock } = req.body;

    const data = await leerJson(FILE_PROD);

    if (!data.productos) data.productos = [];

    const producto = data.productos.find(p => p.id === id);
    if (!producto) {
      return res.status(404).json({ error: "Producto no encontrado" });
    }

    if (nombre != null) producto.nombre = nombre;
    if (precio != null) producto.precio = precio;
    if (stock != null) producto.stock = stock;

    await escribirJson(FILE_PROD, data);
    res.status(200).json(producto);
  } catch (error) {
    console.error("Error al actualizar producto:", error);
    res.status(500).json({ error: "Error al actualizar producto" });
  }
};

// DELETE /producto/:id
const eliminarProducto = async (req, res) => {
  try {
    const { id } = req.params;
    const data = await leerJson(FILE_PROD);

    if (!data.productos) data.productos = [];

    const index = data.productos.findIndex(p => p.id === id);
    if (index === -1) {
      return res.status(404).json({ error: "Producto no encontrado" });
    }

    const eliminado = data.productos.splice(index, 1);
    await escribirJson(FILE_PROD, data);

    res.status(200).json(eliminado[0]);
  } catch (error) {
    console.error("Error al eliminar producto:", error);
    res.status(500).json({ error: "Error al eliminar producto" });
  }
};

module.exports = { getProductos, crearProducto, actualizarProducto, eliminarProducto };