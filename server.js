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


