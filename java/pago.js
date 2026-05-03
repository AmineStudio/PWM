//PAGO
document.addEventListener("DOMContentLoaded", () => {
    const formPago = document.getElementById('form-pago');
    if (!formPago) return;

    const carritoActual = JSON.parse(localStorage.getItem('carrito') || '{}');
    const datosDB = JSON.parse(localStorage.getItem('productos_panel') || '{"productos":[]}');
    let total = 0;

    Object.entries(carritoActual).forEach(([id, cantidad]) => {
        const prod = datosDB.productos.find(p => String(p.id) === id);
        if(prod) total += prod.precio * cantidad;
    });

    const totalPrecioEl = document.querySelector('.total-precio');
    if (totalPrecioEl) totalPrecioEl.textContent = total.toFixed(2) + '€';

    formPago.addEventListener('submit', (evento) => {
        evento.preventDefault();

        const exito = finalizarPedido();

        if (exito) {
            window.location.href = 'ticket.html';
        }
    });

    const btnCancelar = document.querySelector('.btn-cancelar');
    if (btnCancelar) {
        btnCancelar.addEventListener('click', () => {
            window.history.back();
        });
    }
});