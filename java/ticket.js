document.addEventListener('DOMContentLoaded', () => {
    const ticketDisplay = document.getElementById('numero-ticket-final');
    if (!ticketDisplay) return;

    const ultimoId = localStorage.getItem('ultimo_pedido') || 'Error';
    ticketDisplay.textContent = '#' + ultimoId;
});