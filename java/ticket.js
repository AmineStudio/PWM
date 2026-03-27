// java/ticket.js
document.addEventListener('DOMContentLoaded', () => {
    const ticketDisplay = document.getElementById('numero-ticket-final');
    if (!ticketDisplay) return;

    // Leemos el número que guardamos al pagar
    const ultimoId = localStorage.getItem('ultimo_pedido') || 'Error';

    // Lo pintamos en la pantalla
    ticketDisplay.textContent = '#' + ultimoId;
});