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
    card.querySelector('.item-nombre').textContent = producto.nombre.toUpperCase();
    card.querySelector('.item-info').textContent = producto.descripcion;
    card.querySelector('.item-precio-burbuja').textContent = `${producto.precio}€`;

    const img = card.querySelector('img');
    img.src = getRuta(producto.imagen || 'img/burger-placeholder.png')
    img.alt = producto.nombre;

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
    card.querySelector('.item-precio-burbuja').textContent = `${producto.precio}€`;

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

    const infoDiv = card.querySelector('.item-info');
    infoDiv.innerHTML = `
        <input class="panel-input" value="${producto.nombre}"
               style="background:none;border:none;border-bottom:1px solid #666;color:#fff;font-size:20px;width:100%;margin-bottom:8px;font-family:inherit;">
        <input class="panel-input-desc" value="${producto.descripcion}"
               style="background:none;border:none;border-bottom:1px solid #444;color:#ccc;font-size:14px;width:100%;margin-bottom:8px;font-family:inherit;">
        <div style="display:flex;align-items:center;gap:6px;">
            <input class="panel-input-precio" value="${producto.precio}" type="number" step="0.01"
                   style="background:none;border:none;border-bottom:1px solid #444;color:#ff2a2a;font-size:16px;width:70px;font-family:inherit;">
            <span style="color:#ff2a2a;">€</span>
        </div>
    `;

    const priceDiv = card.querySelector('.item-price');
    priceDiv.style.cssText = 'display:flex;flex-direction:column;gap:8px;align-items:flex-end;min-width:160px;';
    priceDiv.innerHTML = `
        <button class="btn-guardar btn-main" style="font-size:12px;padding:8px 16px;width:100%;">
            <i class="fa-solid fa-floppy-disk"></i> GUARDAR
        </button>
        <button class="btn-disponible action-btn ${producto.disponible ? 'cart' : 'cancel'}" style="font-size:12px;padding:8px 16px;width:100%;">
            <i class="fa-solid fa-${producto.disponible ? 'eye' : 'eye-slash'}"></i>
            ${producto.disponible ? 'DISPONIBLE' : 'NO DISPONIBLE'}
        </button>
        <button class="btn-eliminar action-btn cancel" style="font-size:12px;padding:8px 16px;width:100%;">
            <i class="fa-solid fa-trash"></i> ELIMINAR
        </button>
    `;

    priceDiv.querySelector('.btn-guardar').addEventListener('click', () => {
        const prod = productos.find(x => x.id === producto.id);
        prod.nombre      = infoDiv.querySelector('.panel-input').value.trim();
        prod.descripcion = infoDiv.querySelector('.panel-input-desc').value.trim();
        prod.precio      = parseFloat(infoDiv.querySelector('.panel-input-precio').value);
        guardarDatos(datos);
        alert('Cambios guardados.');
    });

    priceDiv.querySelector('.btn-disponible').addEventListener('click', () => {
        const prod = productos.find(x => x.id === producto.id);
        prod.disponible = !prod.disponible;
        guardarDatos(datos);
        cargarProductos('lista-productos', 'panel', categoriaId);
    });

    priceDiv.querySelector('.btn-eliminar').addEventListener('click', () => {
        if (!confirm(`¿Eliminar "${producto.nombre}"?`)) return;
        const idx = productos.findIndex(x => x.id === producto.id);
        productos.splice(idx, 1);
        guardarDatos(datos);
        cargarProductos('lista-productos', 'panel', categoriaId);
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
            const card = (modo === 'carta') ? crearCartaItem(p) : crearPedidoItem(p, mapaAlergenos);
            contenedor.appendChild(card);
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