class BaseDeDatos {
  constructor() {
    //  base de datos
    this.productos = [];
    // Vamos a cargar todos los productos que tengamos

  }
//registro de productos
  async traerRegistros() {
    const response = await fetch("./productos.json");
    this.productos = await response.json();
    return this.productos;
  }
  registroPorId(id) {
    return this.productos.find((producto) => producto.id === id);
  }
  // Retorna una lista con los productos
  registrosPorNombre(palabra) {
    return this.productos.filter((producto) => producto.nombre.toLowerCase().includes(palabra));
  }
  registrosPorCategorias(categoria) {
    return this.productos.filter((producto) => producto.categoria === categoria);
  }
  }

// Clase carrito
class Carrito {
  constructor() {
    // Cargamos del storage
    const carritoStorage = JSON.parse(localStorage.getItem("carrito"));
    // Inicializamos variables
    this.carrito = carritoStorage || [];
    this.baseDeDatos = new BaseDeDatos();

    this.listar();
  }
  vaciar() {
    this.carrito = []; // Vaciamos el array de productos del carrito
    localStorage.setItem("carrito", JSON.stringify(this.carrito)); // Actualizamos el storage
    this.listar(); // Actualizamos la visualización del carrito en el HTML
}
  // Verificamos si el producto está en el carrito
  estaEnCarrito({ id }) {
    return this.carrito.find((producto) => producto.id === id);
  }

  // agregar el producto al carrito
  agregar(producto) {
    // lo guardo 
    const productoEnCarrito = this.estaEnCarrito(producto);
    if (productoEnCarrito) {
      //  sumo la cantidad
      productoEnCarrito.cantidad++;
    } else {
      // Si no está, lo agrego al carrito
      this.carrito.push({ ...producto, cantidad: 1 });
      localStorage.setItem("carrito", JSON.stringify(this.carrito));
    }
    // Actualizo el carrito en el HTML
    this.listar();
    // Usando toastify
    Toastify({
      text: `${producto.nombre} Fue agregado al carrito`,
      position: "center",
      className: "info",
      gravity: "top",
      style: {
        background: "linear-gradient(90deg, rgb(206, 74, 177) 0%, rgb(212, 116, 183) 40%,  rgb(233, 37, 37) 100%)",
      },
    }).showToast();
  }


  // quitar productos del carrito
  quitar(id) {
    const indice = this.carrito.findIndex((producto) => producto.id === id);
    // Si la cantidad del producto es mayor a 1, le resto
    if (this.carrito[indice].cantidad > 1) {
      this.carrito[indice].cantidad--;
    } else {
      // Si la cantidad es 1, lo borramos del carrito
      this.carrito.splice(indice, 1);
    }
    // Actualiza el storage
    localStorage.setItem("carrito", JSON.stringify(this.carrito));
    // Actualiza el carrito en el HTML
    this.listar();

   // Mostrar notificación de que el producto fue quitado
  const productoQuitado = bd.registroPorId(id); // Utilizamos 'bd' en lugar de 'this.baseDeDatos'
  if (productoQuitado) {
    Toastify({
      text: `${productoQuitado.nombre} fue quitado del carrito`,
      duration: 3000,
      newWindow: true,
      close: true,
      gravity: "top",
      position: "center",
      style: {
        background: "linear-gradient(90deg, rgb(206, 74, 177) 0%, rgb(212, 116, 183) 40%,  rgb(233, 37, 37) 100%)",
      },
      stopOnFocus: true,
    }).showToast();
    }
}
  

  // Actualizar el HTML de nuestro carrito
  listar() {
    // Reiniciamos las variables
    this.total = 0;
    this.totalProductos = 0;
    const divCarrito = document.querySelector("#carritoItems");
    const divCarritoTotales = document.querySelector("#carritoTotales");

    // Limpiamos el contenido del offcanvas antes de actualizarlo
    divCarrito.innerHTML = "";
    divCarritoTotales.innerHTML = "";

    for (const producto of this.carrito) {
      divCarrito.innerHTML += `
        <div class="card">
        <img src="img/${producto.imagen}" class="card-img-top" alt="pructo">
          <div class="card-body">
            <h5 class="card-title">${producto.nombre}</h5>
            <p class="card-text">Cantidad: ${producto.cantidad}</p>
            <p class="card-text">Precio unitario: $${producto.precio}</p>
            <p class="card-text">Subtotal: $${producto.precio * producto.cantidad}</p>
            <p><a href="#" class="btnQuitar" data-id="${producto.id}">Quitar</a></p>
          </div>
        </div>
      `;

      // Actualizamos los totales
      this.total += producto.precio * producto.cantidad;
      this.totalProductos += producto.cantidad;
    }

    divCarritoTotales.innerHTML = `
      <p>Total Productos: <span>${this.totalProductos}</span></p>
      <p>Total Carrito: $<span>${this.total}</span></p>
    `;
  
    // Botones de quitar
    const botonesQuitar = document.querySelectorAll(".btnQuitar");
    for (const boton of botonesQuitar) {
      boton.addEventListener("click", (event) => {
        event.preventDefault();
        this.quitar(Number(boton.dataset.id));
      });
    }
    // Actualizamos variables carrito
    const spanCantidadProductos = document.querySelector("#cantidadProductos");
    
    spanCantidadProductos.innerText = this.totalProductos;
    
  }
  
}

// Clase "molde" para los productos
class Producto {
  constructor(id, nombre, precio, categoria, imagen = false) {
    this.id = id;
    this.nombre = nombre;
    this.precio = precio;
    this.categoria = categoria;
    this.imagen = imagen;
  }
}

// Objeto de la base de datos
const bd = new BaseDeDatos();

// Elementos
const divProductos = document.querySelector("#productos");
const formBuscar = document.querySelector("#formBuscar");
const inputBuscar = document.querySelector("#inputBuscar");
const botonCarrito = document.querySelector("section h3");
const botonesCategorias = document.querySelectorAll(".btnCategorias");
const botonComprar = document.querySelector("#botonComprar");



// botones de categoria
botonesCategorias.forEach((boton) => {
  boton.addEventListener("click", (event) => {
    event.preventDefault();
    const productosPorCategoria = bd.registrosPorCategorias(boton.innerText);
    cargarProductos(productosPorCategoria); 
  });
});

// Muestra los registros de la base de datos en nuestro HTML
function cargarProductos(productos) {
  divProductos.innerHTML = "";
  for (const producto of productos) {
    divProductos.innerHTML += `
    <div class="card" > 
    <img src="img/${producto.imagen}" class="card-img-top" alt="trucks">
    <div class="card-body">
        <h5 class="card-title">${producto.nombre}.</h5>
        <p class="card-text">$${producto.precio}</p>
        <p><a href="#" class="btnAgregar" data-id="${producto.id}">Agregar</a></p>
      </div>
    `;
  }
  // Botones de agregar al carrito
  
  const botonesAgregar = document.querySelectorAll(".btnAgregar");
  for (const boton of botonesAgregar) {
    // Le agregamos un evento click a cada uno
    boton.addEventListener("click", (event) => {
      event.preventDefault();
      // Obtenemos el ID del producto del atributo data-id
      const id = Number(boton.dataset.id);
      // Con ese ID, consultamos a nuestra base de datos por el producto
      const producto = bd.registroPorId(id);
      // Agregamos el registro (producto) a nuestro carrito
      carrito.agregar(producto);
    });
  }
}
// Mensaje de compra realizada con la librería Sweet Alert
botonComprar.addEventListener("click", (event) => {
  event.preventDefault();
  Swal.fire({
    title: "¡Compra realizada con exito.!",
    text: "Sigue tu pedido por mail.",
    icon: "success",
    confirmButtonText: "Aceptar",
  });
  // Vacíamos el carrito
  
  carrito.vaciar();
  // Ocultamos el carrito en el HTML
  document.querySelector("section").classList.add("ocultar");
});
// Evento buscador
formBuscar.addEventListener("submit", (event) => {
  event.preventDefault();
  const palabra = inputBuscar.value;
  cargarProductos(bd.registrosPorNombre(palabra.toLowerCase()));
});
// Buscador: al soltar una tecla se ejecuta el evento keyup
inputBuscar.addEventListener("keyup", (event) => {
  event.preventDefault();
  const palabra = inputBuscar.value;
  cargarProductos(bd.registrosPorNombre(palabra.toLowerCase()));
  // Pedimos a nuestra base de datos que nos traiga todos los registrossa
  const productos = bd.registrosPorNombre(palabra.toLowerCase());
  // Lo mostramos en el HTML
  cargarProductos(productos);
});



// Objeto carrito
const carrito = new Carrito();



// Toggle para ocultar/mostrar el carrito
botonCarrito.addEventListener("click", () => {
  document.querySelector("section").classList.toggle("ocultar");
});


bd.traerRegistros().then((productos) => cargarProductos(productos));


