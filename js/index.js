// Clase molde para los objetos del carrito
class Partes {
  // Parámetros para crear item del carrito
  constructor(nombre, precio, imagen) {
    this.nombre = nombre;
    this.precio = precio;
    this.imagen = imagen;
  }
}

// Variables globales
// Array donde guardamos todos los items comprados
const carrito = [];
// Items del carrito
const trucks = new Partes("Trucks", 5000, "truck.jfif");
const ruedas = new Partes("Ruedas", 4200, "rueda.jfif");
const rulemanes = new Partes("Rulemanes", 3000, "rulemanes.jfif");
// Vendedor
const objetos = [trucks, ruedas, rulemanes];
// Total
let total = 0;
// Elementos
const elementoTotal = document.querySelector("#total");
const elementoCarrito = document.querySelector("#carrito");
elementoTotal.innerText = total;


// Funciones regulares
function comprar(partes) {
  carrito.push(partes);
  total += partes.precio;
  actualizarHTML();
}

// Función encargada de quitar items del carrito
function vender(indice) {
  // Obtengo el item del array para usar la propiedad precio
  const partes = carrito[indice];
  // Resto del total el precio del item
  total -= partes.precio;
  // Con el índice uso splice y lo borro del array
  carrito.splice(indice, 1);
  actualizarHTML(); // Actualizo el HTML
}
// Se va a encargar de renderizar todos las partes del carrito
function actualizarHTML() {
  // Vacío el elemento del carrito
  elementoCarrito.innerHTML = "";
  // Recorre el array carrito
  for (const partes of carrito) {
    let indicePartes = carrito.indexOf(partes);
    let elementoPartes = `
      <li class="partes">
        <img src="img/${partes.imagen}">
        <button onclick="vender(${indicePartes})">Vender</button>
      </li>`;
    elementoCarrito.innerHTML += elementoPartes;
  }

  // Actualiza el total
  elementoTotal.innerText = total;
}







