# M6 Trabajo Portafolio E-commerce Go-Art

# Descripción
Proyecto de e-commerce llamado **Go-Art**, donde se pueden listar productos, agregarlos al carrito, calcular total con IVA, y registrar la venta en un archivo JSON simulando una base de datos. Incluye gestión de stock y resumen de compra mediante modal. 

## Tecnologías Utilizadas
- Node.js
- Express
- HTML
- CSS
- JavaScript
- Almacenamiento: Archivo JSON (simulando base de datos)


## Endpoints API REST

| Método | Ruta                | Descripción                               |
|--------|-------------------|-------------------------------------------|
| GET    | `/productos`       | Obtener todos los productos               |
| POST   | `/producto`        | Crear un producto nuevo                   |
| PUT    | `/producto/:id`    | Actualizar un producto por ID             |
| DELETE | `/producto/:id`    | Eliminar un producto por ID               |
| POST   | `/venta`           | Registrar una venta desde el carrito      |
| GET    | `/ventas`          | Obtener todas las ventas registradas      |

## Funcionalidades
- Listar productos disponibles y su stock.
- Ver el la cantidad de Stock en tiempo real y avisar al usuario  con un aler de articulo no disponible.
- Agregar productos al carrito.
- Modificar cantidad de productos en el carrito.
- Calcular subtotal, IVA (19%) y total a pagar.
- Registrar la venta y actualizar stock en archivos JSON.
- Mostrar resumen de la compra en un modal con ID de venta y detalle de productos.

## Ejecución del proyecto

1. Instalar dependencias  bsch **npm install**
2. Ejecutar Servidor  **npm start**
3. Abrir Navegador http://localhost:3000.

## Nota del autos
- se tomo como base uno de las tareas anteriores por lo que las vistas de about y contacto no estan activas ya que se priorizo la coneccion entre back y front  y la modularizacion del codigo siguiendo las buenas practicas. 


# Autor

Fernanda Álvarez para curso Fullstack Javascript Sence.
