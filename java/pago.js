// java/pago.js
document.addEventListener("DOMContentLoaded", () => {
    const formPago = document.getElementById('form-pago');
    if (!formPago) return; // Si no estamos en la página de pago, no hace nada

    // 1. Mostrar el precio total en la pantalla de pago leyendo el carrito
    const carritoActual = JSON.parse(localStorage.getItem('carrito') || '{}');
    const datosDB = JSON.parse(localStorage.getItem('productos_panel') || '{"productos":[]}');
    let total = 0;

    Object.entries(carritoActual).forEach(([id, cantidad]) => {
        const prod = datosDB.productos.find(p => String(p.id) === id);
        if(prod) total += prod.precio * cantidad;
    });

    const totalPrecioEl = document.querySelector('.total-precio');
    if (totalPrecioEl) totalPrecioEl.textContent = total.toFixed(2) + '€';

    // 2. Controlar qué pasa al darle a PAGAR
    formPago.addEventListener('submit', (evento) => {
        evento.preventDefault();

        // Llamamos a la función de producto-card.js
        const exito = finalizarPedido();

        if (exito) {
            window.location.href = 'ticket.html';
        }
    });

    // Controlar el botón de cancelar (para quitar el onclick del HTML)
    const btnCancelar = document.querySelector('.btn-cancelar');
    if (btnCancelar) {
        btnCancelar.addEventListener('click', () => {
            window.history.back();
        });
    }
});