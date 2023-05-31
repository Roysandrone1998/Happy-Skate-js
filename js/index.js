// Consola de comandos 
let comando;

while (comando !== 'Salir') {
    comando = prompt('Ingrese el comando:\n\n- Color filamentos\n- Mostrar cuotas\n- Contactanos\n- Salir');

    switch (comando) {
        case 'Color filamentos':
            let colorProducto = prompt('Ingrese el color\n\n- Negro\n- Gris espacial\n- Bronce');
            if (colorProducto === "Negro") {
                alert("El color " + colorProducto + " está en stock.");
            } else if (colorProducto === "Gris espacial") {
                alert("El color '" + colorProducto + "' está en stock.");
            } else if (colorProducto === "Bronce") {
                alert("El color '" + colorProducto + "' está en stock.");
            } else {
                alert("No hay ese color en stock.");
            }
            break;

        case 'Mostrar cuotas':
            let cuotas = 1;
            for (let i = 0; i < 3; i++) {
                alert('Puedes pagar en ' + cuotas + ' cuotas sin interés.');
                if (i === 0) {
                    cuotas += 2;
                } else {
                    cuotas += 3;
                }
            }
            break;

        case 'Contactanos':
            let nombre = prompt("Ingresa tu nombre.");
            let mail = prompt("Ingresa tu mail.");
            let mensaje = prompt("Dejanos tu mensaje o pedido.");
            alert("Hola " + nombre + ", tu mail es: " + mail);
            continuar = confirm("Confirma y estaremos en contacto contigo lo antes posible.")
            break;
            default:
                alert("Error: No se reconoció ningún comando! Intentelo otra vez!!")
    }
}