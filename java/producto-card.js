/* ==============================================
   PRODUCTO-CARD.JS - Componente reutilizable de producto
   ============================================== */

const carrito = {};

// Ajusta rutas según si estamos en /pages/ o raíz
function getRuta(archivo) {
    return window.location.pathname.includes('/pages/')
        ? `../${archivo}`
        : archivo;
}

/**
 * Carga el componente HTML de plantillas (una sola vez)
 */

async function cargarComponenteProducto() {
    // Evitar cargar dos veces
    if (document.getElementById('tpl-carta-item')) return;

    const res = await fetch(getRuta('components/producto-card.html'));
    const html = await res.text();

    // ✅ Crear un contenedor dedicado fuera del flujo del DOM
    const div = document.createElement('div');
    div.id = 'producto-templates';
    div.setAttribute('hidden', '');  // más limpio que display:none
    div.innerHTML = html;
    document.documentElement.appendChild(div); // ✅ se añade al <html>, no al <body>
}

/**
 * Rellena una tarjeta de CARTA clonando la plantilla
 */
function crearCartaItem(producto) {
    const tpl = document.getElementById('tpl-carta-item');
    const clone = tpl.content.cloneNode(true);
    const card = clone.querySelector('.menu-item');

    card.dataset.id = producto.id;

    const titulo = card.querySelector('.item-nombre');
    if (titulo) titulo.textContent = producto.nombre.toUpperCase();

    const desc = card.querySelector('.item-info-desc');
    if (desc) desc.textContent = producto.descripcion;

    const precio = card.querySelector('.item-precio-burbuja');
    if (precio) {
        // Si el producto vale puntos (más de 0), mostramos el texto. Si no, solo el precio en €.
        let textoPuntos = (producto.puntos_requeridos > 0)
            ? `<br><span style="font-size:12px; color:#00ffff; text-shadow: 1px 1px 2px #000;">o ${producto.puntos_requeridos} pts</span>`
            : '';
        precio.innerHTML = `${producto.precio}€ ${textoPuntos}`;
    }

    const img = card.querySelector('img');
    if (img) {
        img.src = getRuta(producto.imagen || 'img/burger-placeholder.png');
        img.alt = producto.nombre;
    }

    return card;
}

/**
 * Rellena una tarjeta de PEDIDO clonando la plantilla
 */
function crearPedidoItem(producto, mapaAlergenos) {
    const tpl = document.getElementById('tpl-pedido-item');
    const clone = tpl.content.cloneNode(true);
    const card = clone.querySelector('.menu-item');

    card.dataset.id = producto.id;
    card.querySelector('.item-nombre').textContent = producto.nombre.toUpperCase();
    card.querySelector('.item-info-desc').textContent = producto.descripcion;
    const precio = card.querySelector('.item-precio-burbuja');
    if (precio) {
        let textoPuntos = (producto.puntos_requeridos > 0)
            ? '<br><span style="font-size:12px; color:#00ffff; text-shadow: 1px 1px 2px #000;">o ' + producto.puntos_requeridos + ' pts</span>'
            : '';
        precio.innerHTML = producto.precio + '€ ' + textoPuntos;
    }

    const img = card.querySelector('img');
    img.src = getRuta(producto.imagen || 'img/burger-placeholder.png');
    img.alt = producto.nombre;

    // Alérgenos
    const divAlerg = card.querySelector('.iconos-alergenos');
    divAlerg.innerHTML = (producto.alergenos || []).map(id => {
        const alerg = mapaAlergenos[id];
        if (!alerg) return '';
        return `<span class="icono-alerg" title="${alerg.nombre}">${alerg.icono}</span>`;
    }).join('');

    // Agotado
    if (!producto.disponible) {
        card.querySelector('.qty-control').style.display = 'none';
        card.style.opacity = '0.5';
    }

    // Contador
    const btnMas = card.querySelector('.btn-mas');
    const btnMenos = card.querySelector('.btn-menos');
    const qty = card.querySelector('.numero-cantidad');
    qty.id = `qty-${producto.id}`;

    btnMas.addEventListener('click', () => cambiarCantidad(producto.id, 1));
    btnMenos.addEventListener('click', () => cambiarCantidad(producto.id, -1));

    return card;
}

function crearPanelItem(producto, mapaAlergenos, categoriaId, productos, datos) {
    const tpl = document.getElementById('tpl-carta-item');
    const clone = tpl.content.cloneNode(true);
    const card = clone.querySelector('.menu-item');

    card.dataset.id = producto.id;
    card.style.opacity = producto.disponible ? '1' : '0.5';

    const img = card.querySelector('img');
    img.src = getRuta(producto.imagen || 'img/burger-placeholder.png');
    img.alt = producto.nombre;

    // Convertimos el array de alérgenos en un texto (ej: "gluten, lacteos")
    const alergenosStr = (producto.alergenos || []).join(', ');

    const infoDiv = card.querySelector('.item-info');
    infoDiv.innerHTML = `
        <input class="panel-input" value="${producto.nombre}" placeholder="Nombre"
               style="background:none;border:none;border-bottom:1px solid #666;color:#fff;font-size:18px;width:100%;margin-bottom:4px;font-family:inherit;font-weight:bold;">
        
        <input class="panel-input-desc" value="${producto.descripcion}" placeholder="Descripción"
               style="background:none;border:none;border-bottom:1px solid #444;color:#ccc;font-size:12px;width:100%;margin-bottom:4px;font-family:inherit;">
               
        <input class="panel-input-alergenos" value="${alergenosStr}" placeholder="Alérgenos (ej: gluten, lacteos)"
               style="background:none;border:none;border-bottom:1px solid #444;color:#ffaa00;font-size:12px;width:100%;margin-bottom:4px;font-family:inherit;">
               
        <div style="display:flex;align-items:center;gap:10px;margin-top:5px;">
            <div>
                <input class="panel-input-precio" value="${producto.precio}" type="number" step="0.01"
                       style="background:none;border:none;border-bottom:1px solid #444;color:#ff2a2a;font-size:14px;width:60px;font-family:inherit;">
                <span style="color:#ff2a2a;">€</span>
            </div>
            <div>
                <input class="panel-input-puntos" value="${producto.puntos_requeridos || 0}" type="number"
                       style="background:none;border:none;border-bottom:1px solid #444;color:#00ffff;font-size:14px;width:50px;font-family:inherit;">
                <span style="color:#00ffff;font-size:12px;">Pts</span>
            </div>
        </div>
    `;

    const priceDiv = card.querySelector('.item-price');
    priceDiv.style.cssText = 'display:flex;flex-direction:column;gap:5px;align-items:flex-end;min-width:140px;';
    priceDiv.innerHTML = `
        <button class="btn-guardar btn-main" style="font-size:11px;padding:6px 12px;width:100%;">GUARDAR</button>
        <button class="btn-disponible action-btn ${producto.disponible ? 'cart' : 'cancel'}" style="font-size:11px;padding:6px 12px;width:100%;">
            ${producto.disponible ? 'OCULTAR' : 'MOSTRAR'}
        </button>
        <button class="btn-eliminar action-btn cancel" style="font-size:11px;padding:6px 12px;width:100%; background-color:#ff2a2a; color:white;">ELIMINAR</button>
    `;

    // Botón GUARDAR
    priceDiv.querySelector('.btn-guardar').addEventListener('click', () => {
        const prod = productos.find(x => x.id === producto.id);
        prod.nombre = infoDiv.querySelector('.panel-input').value.trim();
        prod.descripcion = infoDiv.querySelector('.panel-input-desc').value.trim();
        prod.precio = parseFloat(infoDiv.querySelector('.panel-input-precio').value);
        prod.puntos_requeridos = parseInt(infoDiv.querySelector('.panel-input-puntos').value) || 0;

        // Limpiamos los alérgenos para guardarlos como array
        const alergenosInput = infoDiv.querySelector('.panel-input-alergenos').value;
        prod.alergenos = alergenosInput.split(',').map(s => s.trim().toLowerCase()).filter(s => s !== '');

        localStorage.setItem('productos_panel', JSON.stringify(datos));
        alert('✅ Cambios guardados correctamente.');
    });

    // Botón OCULTAR/MOSTRAR
    priceDiv.querySelector('.btn-disponible').addEventListener('click', () => {
        const prod = productos.find(x => x.id === producto.id);
        prod.disponible = !prod.disponible;
        localStorage.setItem('productos_panel', JSON.stringify(datos));
        cargarProductos('lista-productos', 'panel', categoriaId); // Recargamos
    });

    // Botón ELIMINAR
    priceDiv.querySelector('.btn-eliminar').addEventListener('click', () => {
        if (!confirm(`¿Estás seguro de que quieres eliminar "${producto.nombre}" de la base de datos?`)) return;
        const idx = productos.findIndex(x => x.id === producto.id);
        productos.splice(idx, 1);
        localStorage.setItem('productos_panel', JSON.stringify(datos));
        cargarProductos('lista-productos', 'panel', categoriaId); // Recargamos
    });

    return card;
}


/**
 * Carga productos desde data.json y los renderiza
 * @param {string} contenedorId - ID del contenedor donde pintar
 * @param {string} modo - 'carta' o 'pedido'
 * @param {number|null} categoriaId - null = todos
 */
async function cargarProductos(contenedorId, modo = 'carta', categoriaId = null) {
    try {
        await cargarComponenteProducto();

        // 1. Intentamos leer de la memoria del navegador (localStorage)
        let datosRaw = localStorage.getItem('productos_panel');
        let datos;

        if (datosRaw) {
            // Si existen datos, los usamos
            datos = JSON.parse(datosRaw);
        } else {
            // 2. SI NO HAY NADA (Caso del cliente nuevo):
            // Vamos a buscar el archivo data.json original
            const res = await fetch(getRuta('data.json'));
            datos = await res.json();

            // Lo guardamos en localStorage para que a partir de ahora
            // la web use esta "copia" que el panel podrá editar
            localStorage.setItem('productos_panel', JSON.stringify(datos));
        }

        // --- A partir de aquí el código sigue igual para dibujar la carta ---
        const mapaAlergenos = {};
        datos.alergenos.forEach(a => {
            mapaAlergenos[a.id] = { icono: a.icono, nombre: a.nombre };
        });

        let productos = datos.productos;
        if (categoriaId) {
            productos = productos.filter(p => p.categoria_id === categoriaId);
        }

        const contenedor = document.getElementById(contenedorId);
        if (!contenedor) return;

        contenedor.innerHTML = '';
        productos.forEach(p => {
            let card;
            if (modo === 'carta') {
                card = crearCartaItem(p);
            } else if (modo === 'pedido') {
                card = crearPedidoItem(p, mapaAlergenos);
            } else if (modo === 'panel') {
                // ✅ FIX: pasamos datos.productos (array COMPLETO), no el filtrado por categoría.
                // Así el splice en ELIMINAR y el find en GUARDAR/OCULTAR operan sobre la lista real.
                card = crearPanelItem(p, mapaAlergenos, categoriaId, datos.productos, datos);
            }
            if (card) contenedor.appendChild(card);
        });
        // --------------------------------------------------------------------

    } catch (e) {
        console.error('Error cargando productos:', e);
    }
}



function cambiarCantidad(productoId, delta) {
    // Convertimos el ID a String para que coincida siempre,
    // ya venga del JSON (número corto) o del Panel (Date.now() largo)
    const id = String(productoId);

    if (!carrito[id]) carrito[id] = 0;
    carrito[id] = Math.max(0, carrito[id] + delta);

    // ✅ Si llega a 0, lo eliminamos del carrito
    if (carrito[id] === 0) {
        delete carrito[id];
    }

    // Actualizar el número en el contador de la tarjeta
    const el = document.getElementById(`qty-${id}`);
    if (el) el.textContent = carrito[id] || 0;

    guardarCarrito();

    // LANZAMOS UN AVISO: "El carrito ha cambiado"
    // Esto permitirá que la lista de pedidos se actualice sola
    document.dispatchEvent(new CustomEvent('carritoActualizado'));
}

function guardarCarrito() {
    localStorage.setItem('carrito', JSON.stringify(carrito));
}

function guardarCarrito() {
    localStorage.setItem('carrito', JSON.stringify(carrito));
}


document.addEventListener('carritoActualizado', () => {
    renderizarResumenPedido();
});

function renderizarResumenPedido() {
    const contenedor = document.getElementById('lista-resumen-pedidos'); // Asegúrate de que este ID sea el de tu HTML
    if (!contenedor) return;

    const carritoActual = JSON.parse(localStorage.getItem('carrito') || '{}');
    const datos = JSON.parse(localStorage.getItem('productos_panel')); // Usamos nuestros datos compartidos

    contenedor.innerHTML = ''; // Limpiamos para redibujar

    let total = 0;

    Object.entries(carritoActual).forEach(([id, cantidad]) => {
        // Buscamos el producto en nuestros datos (comparando como String)
        const producto = datos.productos.find(p => String(p.id) === id);

        if (producto) {
            const subtotal = producto.precio * cantidad;
            total += subtotal;


            contenedor.innerHTML += `
                <div class="resumen-item">
                    <span>${producto.nombre} x${cantidad}</span>
                    <span>${subtotal.toFixed(2)}€</span>
                </div>`;
        }
    });


}

// Añadir al final de producto-card.js

function vaciarCarrito() {
    // Vaciamos el objeto en memoria
    for (let key in carrito) delete carrito[key];
    // Lo borramos de localStorage
    localStorage.removeItem('carrito');

    // Reseteamos los contadores visuales a 0
    document.querySelectorAll('.numero-cantidad').forEach(el => el.textContent = '0');

    // Avisamos a la interfaz de que el carrito está vacío
    document.dispatchEvent(new CustomEvent('carritoActualizado'));
}

function finalizarPedido() {
    const carritoActual = JSON.parse(localStorage.getItem('carrito') || '{}');
    if (Object.keys(carritoActual).length === 0) {
        alert("El carrito está vacío. Añade algún producto antes de pagar.");
        return false;
    }

    const usuario = JSON.parse(localStorage.getItem('usuario'));
    const datos = JSON.parse(localStorage.getItem('productos_panel'));

    let totalPedido = 0;
    let totalPuntosRequeridos = 0; // NUEVO: Calculamos cuánto cuesta en puntos
    const productosComprados = [];

    Object.entries(carritoActual).forEach(([id, cantidad]) => {
        const producto = datos.productos.find(p => String(p.id) === id);
        if (producto) {
            totalPedido += producto.precio * cantidad;
            totalPuntosRequeridos += (producto.puntos_requeridos || 0) * cantidad;

            productosComprados.push({
                producto_id: producto.id,
                nombre: producto.nombre,
                cantidad: cantidad,
                precio_unitario: producto.precio
            });
        }
    });

    // === NUEVA LÓGICA DE PAGO CON PUNTOS ===
    let pagadoConPuntos = false;

    // Si el usuario está logueado, el carrito vale puntos, y tiene puntos suficientes...
    if (usuario && totalPuntosRequeridos > 0 && usuario.puntos >= totalPuntosRequeridos) {
        const quierePagar = confirm(`¡Enhorabuena! Tienes ${usuario.puntos} puntos.\n\nEste pedido te cuesta ${totalPedido.toFixed(2)}€ o ${totalPuntosRequeridos} puntos.\n\n¿Quieres usar tus puntos para que te salga GRATIS?`);

        if (quierePagar) {
            pagadoConPuntos = true;
            totalPedido = 0; // ¡El pedido le sale a 0€!
        }
    } else if (usuario && totalPuntosRequeridos > 0 && usuario.puntos < totalPuntosRequeridos) {
        // Le recordamos sutilmente que le faltan puntos
        console.log(`Te faltan ${totalPuntosRequeridos - usuario.puntos} puntos para que esto sea gratis.`);
    }
    // =======================================

    let nuevoId;
    do { nuevoId = Math.floor(Math.random() * 100) + 1; }
    while (datos.pedidos && datos.pedidos.some(p => p.id === nuevoId));

    // Cogemos el tipo de pedido (si no hay, por defecto es domicilio)
    const tipoPedido = localStorage.getItem('tipo_pedido') || 'domicilio';

    const nuevoPedido = {
        id: nuevoId,
        usuario_id: usuario ? usuario.id : "invitado",
        fecha: new Date().toISOString().split('T')[0],
        timestamp: Date.now(), // <-- NUEVO: Guardamos el milisegundo exacto del pedido
        tipo: tipoPedido,      // <-- NUEVO: Guardamos qué tipo eligió
        estado: "preparando",
        total: parseFloat(totalPedido.toFixed(2)),
        pagado_con_puntos: pagadoConPuntos,
        productos: productosComprados
    };

    if (!datos.pedidos) datos.pedidos = [];
    datos.pedidos.push(nuevoPedido);

    if (usuario) {
        const usuariosArr = datos.usuarios || [];
        const userIndex = usuariosArr.findIndex(u => u.id === usuario.id);

        if(userIndex !== -1) {
            if (!usuariosArr[userIndex].pedidos) usuariosArr[userIndex].pedidos = [];
            usuariosArr[userIndex].pedidos.push(nuevoPedido.id);

            // APLICAMOS LA SUBIDA O BAJADA DE PUNTOS
            if (pagadoConPuntos) {
                // Si pagó con puntos, se los restamos
                usuariosArr[userIndex].puntos -= totalPuntosRequeridos;
            } else {
                // Si pagó con euros, gana puntos (x10)
                usuariosArr[userIndex].puntos = (usuariosArr[userIndex].puntos || 0) + Math.floor(totalPedido * 10);
            }

            usuario.puntos = usuariosArr[userIndex].puntos;
            usuario.pedidos = usuariosArr[userIndex].pedidos;
            localStorage.setItem('usuario', JSON.stringify(usuario));
        }
    }

    localStorage.setItem('productos_panel', JSON.stringify(datos));

    if (pagadoConPuntos) {
        alert(`¡MAGIA! Has pagado con tus puntos. Tu número de pedido es el #${nuevoPedido.id}`);
    } else {
        alert(`¡Pedido realizado con éxito! Tu número de pedido es el #${nuevoPedido.id}`);
    }

    vaciarCarrito();
    localStorage.setItem('ultimo_pedido', nuevoId);
    return true;
}

// Función para sincronizar el carrito entre pestañas/páginas
function sincronizarCarrito() {
    const carritoGuardado = JSON.parse(localStorage.getItem('carrito') || '{}');

    // Actualizar los contadores visuales en la página actual
    Object.keys(carritoGuardado).forEach(id => {
        const qtyElement = document.getElementById(`qty-${id}`);
        if (qtyElement) {
            qtyElement.textContent = carritoGuardado[id];
        }
    });

    // Limpiar contadores de productos que ya no están en el carrito
    document.querySelectorAll('[id^="qty-"]').forEach(el => {
        const id = el.id.replace('qty-', '');
        if (!carritoGuardado[id]) {
            el.textContent = '0';
        }
    });
}

// Escuchar cambios en localStorage (para sincronizar entre pestañas)
window.addEventListener('storage', (e) => {
    if (e.key === 'carrito') {
        sincronizarCarrito();
        // Actualizar el objeto carrito en memoria
        const nuevoCarrito = JSON.parse(e.newValue || '{}');
        // Limpiar carrito actual
        for (let key in carrito) delete carrito[key];
        // Copiar nuevo carrito
        Object.assign(carrito, nuevoCarrito);

        // Disparar evento de actualización
        document.dispatchEvent(new CustomEvent('carritoActualizado'));
    }
});

// Escuchar evento personalizado para actualizar la lista de pedidos
document.addEventListener('carritoActualizado', () => {
    renderizarResumenPedido();
    sincronizarCarrito();
});

// Modificar la función cambiarCantidad para asegurar que los IDs se manejan como strings
function cambiarCantidad(productoId, delta) {
    // Convertimos el ID a String para que coincida siempre
    const id = String(productoId);

    // Obtener carrito actual
    let carritoActual = JSON.parse(localStorage.getItem('carrito') || '{}');

    if (!carritoActual[id]) carritoActual[id] = 0;
    carritoActual[id] = Math.max(0, carritoActual[id] + delta);

    // Si llega a 0, lo eliminamos del carrito
    if (carritoActual[id] === 0) {
        delete carritoActual[id];
    }

    // Guardar en localStorage
    localStorage.setItem('carrito', JSON.stringify(carritoActual));

    // Actualizar el objeto carrito en memoria
    for (let key in carrito) delete carrito[key];
    Object.assign(carrito, carritoActual);

    // Actualizar el número en el contador de la tarjeta
    const el = document.getElementById(`qty-${id}`);
    if (el) el.textContent = carritoActual[id] || 0;

    // Disparar evento de actualización
    document.dispatchEvent(new CustomEvent('carritoActualizado'));
}