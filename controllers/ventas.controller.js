const path = require("path");
const { v4: uuidv4 } = require("uuid");
const { leerJson, escribirJson } = require("../services/file.service");

const FILE_PROD = path.join(__dirname,"../data/productos.json");
const FILE_VENT = path.join(__dirname,"../data/ventas.json");

const crearVenta = async (req,res)=>{

 try{

   const productosData = await leerJson(FILE_PROD);
   const ventasData = await leerJson(FILE_VENT);

   let total = 0;

   productosData.productos.forEach(p=>{
       if(p.disponible){
         total += p.precio;
       }
   });

   const nuevaVenta = {
     id: uuidv4(),
     fecha: new Date(),
     total
   };

   ventasData.ventas.push(nuevaVenta);

   await escribirJson(FILE_VENT,ventasData);

   res.status(201).json(nuevaVenta);

 }catch{

   res.status(500).json({error:"Error al registrar venta"});

 }

};

const getVentas = async(req,res)=>{

 try{

   const ventas = await leerJson(FILE_VENT);

   res.status(200).json(ventas);

 }catch{

   res.status(500).json({error:"Error al leer ventas"});

 }

};

module.exports = {crearVenta, getVentas};