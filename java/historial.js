// java/historial.js
document.addEventListener('DOMContentLoaded', () => {
    const contenedor = document.getElementById('lista-historial');
    if (!contenedor) return;

    const usuario = JSON.parse(localStorage.getItem('usuario'));

    if (!usuario) {
        contenedor.innerHTML = '<h3 style="color:#fff; text-align:center; padding: 50px 0;">Debes <a href="login.html" style="color:#ff0000; text-decoration:underline;">iniciar sesión</a> para ver tu historial de pedidos.</h3>';
        return;
    }

    const datosDB = JSON.parse(localStorage.getItem('productos_panel') || '{"pedidos":[]}');
    let misPedidos = [];

    if (datosDB.pedidos) {
        misPedidos = datosDB.pedidos.filter(p => p.usuario_id === usuario.id);
    }

    if (misPedidos.length === 0) {
        contenedor.innerHTML = '<h3 style="color:#ccc; text-align:center; padding: 50px 0;">Aún no tienes pedidos. ¡Anímate a pedir algo de la carta!</h3>';
        return;
    }

    misPedidos.reverse();
    contenedor.innerHTML = '';

    misPedidos.forEach(pedido => {
        let colorEstado = 'orange';
        let estadoCapitalizado = pedido.estado.charAt(0).toUpperCase() + pedido.estado.slice(1);

        if (pedido.estado.toLowerCase() === 'entregado') colorEstado = 'green';
        if (pedido.estado.toLowerCase() === 'cancelado') colorEstado = '#ff2a2a';
        if (pedido.estado.toLowerCase() === 'preparando') colorEstado = '#ffcc00';

        const fechaArray = pedido.fecha.split('-');
        const fechaES = fechaArray.length === 3 ? `${fechaArray[2]}/${fechaArray[1]}/${fechaArray[0]}` : pedido.fecha;

        const htmlPedido = `
        <div class="tarjeta-pedido">
            <div class="numero-pedido">#${pedido.id}</div>
            <div class="info-pedido">
                <p><strong>Fecha:</strong> ${fechaES}</p>
                <p><strong>Estado:</strong> <span style="color: ${colorEstado};">${estadoCapitalizado}</span></p>
                <p><strong>Precio:</strong> ${pedido.total.toFixed(2)}€</p>
            </div>
            <button class="btn-info"><span>i</span></button>
        </div>
        `;

        contenedor.innerHTML += htmlPedido;
    });
});