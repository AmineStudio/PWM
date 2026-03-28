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
        // --- MOTOR DE ESTADOS AUTOMÁTICO ---
        const ahora = Date.now();
        let hayCambios = false;

        misPedidos.forEach(pedido => {
            // Solo calculamos si el pedido no está entregado ni cancelado
            if (pedido.estado === 'preparando' || pedido.estado === 'en camino' || pedido.estado === 'listo') {

                // Calculamos cuántos segundos han pasado desde que se creó el pedido
                const tiempoPasado = (ahora - (pedido.timestamp || ahora)) / 1000;

                if (tiempoPasado >= 30) {
                    // A los 30 segundos, siempre se entrega
                    pedido.estado = 'entregado';
                    hayCambios = true;
                } else if (tiempoPasado >= 15 && pedido.estado === 'preparando') {
                    // A los 15 segundos, depende de si es a domicilio o en local
                    pedido.estado = (pedido.tipo === 'domicilio') ? 'en camino' : 'listo';
                    hayCambios = true;
                }
            }
        });

        // Si algún estado cambió, lo guardamos en la base de datos
        if (hayCambios) {
            localStorage.setItem('productos_panel', JSON.stringify(datosDB));
        }
        // ------------------------------------
    }

    // Mostrar los puntos del usuario arriba del historial
    let puntosHTML = '';
    if (usuario.puntos !== undefined) {
        puntosHTML = `
            <div class="puntos-usuario" style="background: linear-gradient(135deg, #ff2a2a, #b30000); border-radius: 15px; padding: 20px; margin-bottom: 30px; text-align: center;">
                <i class="fa-solid fa-star" style="font-size: 32px; color: #ffcc00; margin-bottom: 10px; display: block;"></i>
                <h3 style="color: #fff; margin: 0 0 5px 0;">TUS PUNTOS</h3>
                <p style="font-size: 48px; font-weight: bold; color: #ffcc00; margin: 10px 0;">${usuario.puntos}</p>
                <p style="color: #fff; margin: 0; font-size: 14px;">¡Acumula puntos y cánjealos por productos exclusivos!</p>
            </div>
        `;
    }

    if (misPedidos.length === 0) {
        contenedor.innerHTML = puntosHTML + '<h3 style="color:#ccc; text-align:center; padding: 50px 0;">Aún no tienes pedidos. ¡Anímate a pedir algo de la carta!</h3>';
        return;
    }

    misPedidos.reverse();

    // Añadir los puntos antes de los pedidos
    let pedidosHTML = puntosHTML;

    // Añadir título de historial
    pedidosHTML += '<h2 style="color:#fff; text-align:center; margin-bottom: 30px;">HISTORIAL DE PEDIDOS</h2>';

    // Añadir contenedor para los pedidos
    pedidosHTML += '<div class="pedidos-lista">';

    misPedidos.forEach(pedido => {
        let colorEstado = 'orange';
        let estadoCapitalizado = pedido.estado.charAt(0).toUpperCase() + pedido.estado.slice(1);

        if (pedido.estado.toLowerCase() === 'entregado') colorEstado = 'green';
        if (pedido.estado.toLowerCase() === 'cancelado') colorEstado = '#ff2a2a';
        if (pedido.estado.toLowerCase() === 'preparando') colorEstado = '#ffcc00';
        if (pedido.estado.toLowerCase() === 'en camino') colorEstado = '#00ffff'; // Azulito
        if (pedido.estado.toLowerCase() === 'listo') colorEstado = '#ff00ff'; // Magenta o el que más te guste
        const fechaArray = pedido.fecha.split('-');
        const fechaES = fechaArray.length === 3 ? `${fechaArray[2]}/${fechaArray[1]}/${fechaArray[0]}` : pedido.fecha;

        pedidosHTML += `
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
    });

    pedidosHTML += '</div>';

    contenedor.innerHTML = pedidosHTML;

    // Refrescar la pantalla silenciosamente cada 5 segundos para animar los pedidos
    setTimeout(() => {
        const tienePendientes = misPedidos.some(p => p.estado !== 'entregado' && p.estado !== 'cancelado');
        if (tienePendientes) {
            window.location.reload();
        }
    }, 10000);
});