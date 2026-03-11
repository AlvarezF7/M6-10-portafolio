const express = require("express");
const path = require("path");
const { v4: uuidv4 } = require("uuid");
const { leerJson, escribirJson } = require("../services/file.service");

const router = express.Router();

const FILE_PROD = path.join(__dirname,"../data/productos.json");
const FILE_VENT = path.join(__dirname,"../data/ventas.json");

// Crear venta
const crearVenta = async (req, res) => {
  try {
    const carrito = req.body.carrito;
    if (!carrito || carrito.length === 0) {
      return res.status(400).json({ error: "Carrito vacío" });
    }

    const productosData = await leerJson(FILE_PROD);
    const ventasData = await leerJson(FILE_VENT);

    let total = 0;

    carrito.forEach(item => {
      const producto = productosData.productos.find(p => p.id === item.id);
      if (producto && producto.stock >= item.cantidad) {
        total += producto.precio * item.cantidad;
        producto.stock -= item.cantidad;
      }
    });

    await escribirJson(FILE_PROD, productosData);

    const nuevaVenta = {
      id: uuidv4(),
      fecha: new Date(),
      total,
      productos: carrito
    };

    ventasData.ventas.push(nuevaVenta);
    await escribirJson(FILE_VENT, ventasData);

    res.status(201).json(nuevaVenta);

  } catch (error) {
    console.error("Error en crearVenta:", error);
    res.status(500).json({ error: "Error al registrar venta" });
  }
};

// Obtener todas las ventas
const getVentas = async (req, res) => {
  try {
    const ventas = await leerJson(FILE_VENT);
    res.status(200).json(ventas);
  } catch {
    res.status(500).json({ error: "Error al leer ventas" });
  }
};

router.post("/venta", crearVenta);
router.get("/ventas", getVentas);

module.exports = router;