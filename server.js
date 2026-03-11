const express = require("express");
const path = require("path");
const PORT = 3000;

//importaciones
const productosRoutes = require("./routes/productos.routes");
const ventasRoutes = require("./routes/ventas.routes");


const app = express();

//middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));/*front*/

//rutas
app.use("/", productosRoutes);
app.use("/", ventasRoutes);




app.listen(PORT, () => {
  console.log(`Servidor en http://localhost:${PORT}`);
});

//rutas necesito un

//GET /: sirve la aplicación cliente (página principal).
//POST /producto: registra un nuevo producto y lo almacena.
//GET /productos: retorna todos los productos con su inventario/stock.
//PUT /producto: actualiza datos de un producto existente.
//DELETE /productO: elimina un producto por id
//POST /venta: registra una nueva venta (actualiza inventario).
//GET /ventas: retorna todas las ventas guardadas en ventas.json



