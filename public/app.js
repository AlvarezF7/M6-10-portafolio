const contenedorProductos = document.getElementById("cardMuestra");
const carritoBody = document.getElementById("carritoBody");
const subtotalHTML = document.getElementById("subtotal");
const ivaHTML = document.getElementById("iva");
const totalHTML = document.getElementById("total");
const resumenModalBody = document.getElementById("modalResumenBody");
const btnComprar = document.querySelector("#totalCarrito button");

let productos = [];
let carrito = [];

function formatoPrecio(precio) {
  return "$" + precio.toLocaleString("es-CL");
}

const obtenerProductos = async () => {
  try {
    const res = await fetch("/productos");
    const data = await res.json();
    productos = data.productos;
    mostrarProductos();
  } catch (error) {
    console.error("Error al cargar productos:", error);
  }
};

// Descontar stock de un producto
const descontarStock = (id) => {
  const producto = productos.find(p => p.id === id);
  if (!producto || producto.stock <= 0) return false;
  producto.stock--;
  return true;
};

// Mostrar cards de productos
const mostrarProductos = () => {
  contenedorProductos.innerHTML = "";
  productos.forEach(prod => {
    const card = document.createElement("div");
    card.className = "cards";
    card.style.width = "16rem";
    card.innerHTML = `
      <img src="${prod.img}" class="card-img-top">
      <div class="card-body d-flex flex-column" style="gap:5px">
        <h5 class="card-title">${prod.nombre}</h5>
        <p class="card-text">${formatoPrecio(prod.precio)}</p>
        <p class="card-stock">Stock: ${prod.stock}</p>
        <button class="btn btn-primary mt-auto" id="btnAgregar">Agregar</button>
      </div>
    `;
    const boton = card.querySelector("button");
    boton.addEventListener("click", () => agregarAlCarrito(prod.id, card));

    contenedorProductos.appendChild(card);
  });
};

// Agregar producto al carrito
const agregarAlCarrito = (id, card) => {
  if (!descontarStock(id)) {
    alert("No hay stock disponible de este producto");
    return;
  }

  const producto = productos.find(p => p.id === id);
  const item = carrito.find(p => p.id === id);

  if (item) {
    item.cantidad++;
  } else {
    carrito.push({ ...producto, cantidad: 1 });
  }

  // Actualizar stock en la card
  const stockP = card.querySelector(".card-stock");
  stockP.textContent = `Stock: ${producto.stock}`;

  renderCarrito();
};

// Renderizar carrito
const renderCarrito = () => {
  carritoBody.innerHTML = "";
  carrito.forEach(prod => {
    const fila = document.createElement("tr");
    fila.innerHTML = `
      <td>${prod.nombre}</td>
      <td>
        <input type="number" min="1" value="${prod.cantidad}" style="width:60px">
      </td>
      <td>${formatoPrecio(prod.precio)}</td>
      <td>${formatoPrecio(prod.precio * prod.cantidad)}</td>
      <td><button class="btn btn-danger btn-sm">X</button></td>
    `;

    // Cambiar cantidad
    const inputCantidad = fila.querySelector("input");
    inputCantidad.addEventListener("change", e => {
      const nuevaCantidad = parseInt(e.target.value);
      const diferencia = nuevaCantidad - prod.cantidad;
      const productoOriginal = productos.find(p => p.id === prod.id);

      if (productoOriginal.stock < diferencia) {
        alert("No hay suficiente stock para esa cantidad");
        inputCantidad.value = prod.cantidad;
        return;
      }

      prod.cantidad = nuevaCantidad;
      productoOriginal.stock -= diferencia;

      // Actualizar card stock
      const card = [...document.querySelectorAll(".cards")].find(c =>
        c.querySelector(".card-title").textContent === prod.nombre
      );
      if (card) card.querySelector(".card-stock").textContent = `Stock: ${productoOriginal.stock}`;

      renderCarrito();
    });

    // Eliminar producto del carrito
    const btnEliminar = fila.querySelector("button");
    btnEliminar.addEventListener("click", () => {
      const index = carrito.indexOf(prod);
      if (index > -1) {
        const productoOriginal = productos.find(p => p.id === prod.id);
        productoOriginal.stock += prod.cantidad;

        // Actualizar stock en la card
        const card = [...document.querySelectorAll(".cards")].find(c =>
          c.querySelector(".card-title").textContent === prod.nombre
        );
        if (card) card.querySelector(".card-stock").textContent = `Stock: ${productoOriginal.stock}`;

        carrito.splice(index, 1);
      }
      renderCarrito();
    });

    carritoBody.appendChild(fila);
  });

  calcularTotal();
};

// Calcular subtotal, IVA y total
const calcularTotal = () => {
  const subtotal = carrito.reduce((acc, p) => acc + p.precio * p.cantidad, 0);
  const iva = Math.round(subtotal * 0.19);
  const total = subtotal + iva;

  subtotalHTML.textContent = "Sub-Total: " + formatoPrecio(subtotal);
  ivaHTML.textContent = "IVA 19%: " + formatoPrecio(iva);
  totalHTML.innerHTML = `<strong>Total a Pagar: ${formatoPrecio(total)}</strong>`;
};

// Comprar productos
btnComprar.addEventListener("click", async () => {
  if (carrito.length === 0) {
    alert("El carrito está vacío");
    return;
  }

  try {
    const res = await fetch("/venta", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ carrito })
    });

    const data = await res.json();

    if (res.ok) {
      // Mostrar resumen en el modal
      resumenModalBody.innerHTML = `
        <p>ID Venta: <strong>${data.id}</strong></p>
        <ul>
          ${data.productos.map(p => `<li>${p.nombre} x ${p.cantidad} = ${formatoPrecio(p.precio * p.cantidad)}</li>`).join("")}
        </ul>
        <p>Sub-Total: ${formatoPrecio(data.productos.reduce((acc,p)=>acc+p.precio*p.cantidad,0))}</p>
        <p>IVA 19%: ${formatoPrecio(Math.round(data.productos.reduce((acc,p)=>acc+p.precio*p.cantidad,0)*0.19))}</p>
        <p><strong>Total: ${formatoPrecio(data.total)}</strong></p>
      `;

      // Limpiar carrito y refrescar productos
      carrito = [];
      mostrarProductos();
      renderCarrito();

      // Abrir modal usando Bootstrap 5
      const modalBootstrap = new bootstrap.Modal(document.getElementById("modalResumen"));
      modalBootstrap.show();

    } else {
      alert("Error al procesar la compra: " + (data.error || ""));
    }

  } catch (error) {
    console.error("Error al procesar compra:", error);
    alert("Error al procesar la compra");
  }
});


obtenerProductos(); 