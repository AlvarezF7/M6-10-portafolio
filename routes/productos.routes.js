
const express = require("express");
const router = express.Router();

const {
  getProductos,crearProducto,  actualizarProducto, eliminarProducto} = require("../controllers/productos.controller");

router.get("/productos", getProductos);
router.post("/producto", crearProducto);
router.put("/producto/:id", actualizarProducto);
router.delete("/producto/:id", eliminarProducto); /*queryparams*/

module.exports = router;