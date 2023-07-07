class BaseDeDatos {
  constructor() {
    // Array de la base de datos
    this.productos = [];
    // Vamos a cargar todos los productos que tengamos
    // Con una simple línea de código, vamos a ir cargando todos los productos que tengamos
    this.agregarRegistro(1, "Trucks", 5000, "trucks", "truck.jfif");
    this.agregarRegistro(2, "Ruedas", 4200, "ruedas", "rueda.jfif");
    this.agregarRegistro(3, "Rulemanes", 5000, "rulemanes", "rulemanes.jfif");
  }

  // Método que crea el objeto producto y lo almacena en el array con un push
  agregarRegistro(id, nombre, precio, categoria, imagen) {
    const producto = new Producto(id, nombre, precio, categoria, imagen);
    this.productos.push(producto);
  }

  // Nos retorna el array con todos los productos de la base de datos
  traerRegistros() {
    return this.productos;
  }

  // Busca un producto por ID, si lo encuentra lo retorna en forma de objeto
  // A tener en cuenta: Los IDs son únicos, debe haber uno solo por producto para evitar errores
  registroPorId(id) {
    return this.productos.find((producto) => producto.id === id);
  }

  // Retorna una lista (array) de productos que incluyan en el nombre los caracteres
  // que le pasamos por parámetro. Si le pasamos "a" como parámetro, va a buscar y
  // devolver todos los productos que tengan la letra "a" en el nombre del producto
  registrosPorNombre(palabra) {
    return this.productos.filter((producto) => producto.nombre.toLowerCase().includes(palabra));
  }
}

// Clase carrito, para manipular los productos de nuestro carrito
class Carrito {
  constructor() {
    // Cargamos del storage
    const carritoStorage = JSON.parse(localStorage.getItem("carrito"));
    // Inicializamos variables
    this.carrito = carritoStorage || [];
    this.total = 0;
    this.totalProductos = 0;
    // Apenas se crea el carrito, que llame al método listar para que
    // renderice todos los productos que haya en el storage
    this.listar();
  }

  // Verificamos si el producto está en el carrito. Usamos desestructuración en el parámetro:
  // recibimos el objeto producto en el parámetro pero solo usamos la propiedad id
  estaEnCarrito({ id }) {
    return this.carrito.find((producto) => producto.id === id);
  }

  // Método para agregar el producto al carrito
  agregar(producto) {
    // Si el producto está en el carrito, lo guardo en esta variable
    const productoEnCarrito = this.estaEnCarrito(producto);
    if (productoEnCarrito) {
      // Si está en el carrito, le sumo la cantidad
      productoEnCarrito.cantidad++;
    } else {
      // Si no está, lo agrego al carrito
      this.carrito.push({ ...producto, cantidad: 1 });
      localStorage.setItem("carrito", JSON.stringify(this.carrito));
    }
    // Actualizo el carrito en el HTML
    this.listar();
  }

  // Método para quitar o restar productos del carrito
  quitar(id) {
    // Recibimos como parámetro el ID del producto, con ese ID buscamos el índice
    // del producto para poder usar el splice y borrarlo en caso de que haga falta
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
  }

  // Actualizar el HTML de nuestro carrito
  listar() {
    // Reiniciamos las variables
    this.total = 0;
    this.totalProductos = 0;
    const divCarrito = document.querySelector("#carrito");
    // Recorremos todos los productos del carrito y los agregamos al div #carrito
    divCarrito.innerHTML = "";
    for (const producto of this.carrito) {
      divCarrito.innerHTML += `
      <div class="card" > 
      <img src="img/${producto.imagen}" class="card-img-top" alt="trucks">
      <div class="card-body">
          <h5 class="card-title">${producto.nombre}.</h5>
          <p class="card-text">$${producto.precio}</p>
          <p><a href="#" class="btnIndex" data-id="${producto.id}">Quitar</a></p>
        </div>
      `;
      // Actualizamos los totales
      this.total += producto.precio * producto.cantidad;
      this.totalProductos += producto.cantidad;
    }
    // Botones de quitar
    const botonesQuitar = document.querySelectorAll(".btnIndex");
    for (const boton of botonesQuitar) {
      boton.addEventListener("click", (event) => {
        event.preventDefault();
        this.quitar(Number(boton.dataset.id));
      });
    }
    // Actualizamos variables carrito
    const spanCantidadProductos = document.querySelector("#cantidadProductos");
    const spanTotalCarrito = document.querySelector("#totalCarrito");
    spanCantidadProductos.innerText = this.totalProductos;
    spanTotalCarrito.innerText = this.total;
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
const botonCarrito = document.querySelector("section h1");

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
        <p><a href="#" class="btnIndex" data-id="${producto.id}">Agregar al carrito</a></p>
      </div>
    `;
  }
  // Botones de agregar al carrito
  // Botones agregar al carrito: como no sabemos cuántos productos hay en nuestra base de datos,
  // buscamos TODOS los botones que hayamos renderizado recién, y los recorremos uno por uno
  const botonesAgregar = document.querySelectorAll(".btnIndex");
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

// Evento buscador
formBuscar.addEventListener("submit", (event) => {
  event.preventDefault();
  const palabra = inputBuscar.value;
  cargarProductos(bd.registrosPorNombre(palabra.toLowerCase()));
});
// Buscador: al soltar una tecla se ejecuta el evento keyup
inputBuscar.addEventListener("keyup", (event) => {
  event.preventDefault();
  // Obtenemos el atributo value del input
  const palabra = inputBuscar.value;
  cargarProductos(bd.registrosPorNombre(palabra.toLowerCase()));
  // Pedimos a nuestra base de datos que nos traiga todos los registros
  // que coincidan con la palabra que pusimos en nuestro input
  const productos = bd.registrosPorNombre(palabra.toLowerCase());
  // Lo mostramos en el HTML
  cargarProductos(productos);
});

// Trigger para ocultar/mostrar el carrito
botonCarrito.addEventListener("click", (event) => {
  document.querySelector("section").classList.toggle("ocultar");
});

// Objeto carrito
// Objeto carrito: lo instanciamos a lo último de nuestro archivo JavaScript
// para asegurarnos que TODO esté declarado e inicializado antes de crear el carrito
const carrito = new Carrito();