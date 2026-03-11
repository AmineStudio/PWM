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
    img.src = getRuta('img/burger-placeholder.png');
    img.alt = producto.nombre;

    return card;
}

/**
 * Rellena una tarjeta de PEDIDO clonando la plantilla
 */
function crearPedidoItem(producto, mapaAlergenos) {
    const tpl = document.getElementById('tpl-pedido-item');
    const clone = tpl.content.cloneNode(true);
    const card = clone.querySelector('.card-producto-roja');

    card.dataset.id = producto.id;
    card.querySelector('.prod-titulo').textContent = producto.nombre.toUpperCase();
    card.querySelector('.etiqueta-precio').textContent = `${producto.precio}€`;

    const img = card.querySelector('img');
    img.src = getRuta('img/burger-placeholder.png');
    img.alt = producto.nombre;

    // ✅ Alérgenos leídos desde el JSON
    const divAlerg = card.querySelector('.iconos-alergenos');
    divAlerg.innerHTML = producto.alergenos
        .map(id => {
            const alerg = mapaAlergenos[id];
            if (!alerg) return '';
            return `<span class="icono-alerg" title="${alerg.nombre}">${alerg.icono}</span>`;
        })
        .join('');

    // Producto no disponible
    if (!producto.disponible) {
        const wrapper = card.querySelector('.prod-img-wrapper');
        const overlay = document.createElement('div');
        overlay.className = 'overlay-agotado';
        overlay.innerHTML = '&#10006;';
        wrapper.prepend(overlay);
        card.querySelector('.contador-blanco').style.display = 'none';
    }

    // Eventos del contador
    const btnMas = card.querySelector('.btn-mas');
    const btnMenos = card.querySelector('.btn-menos');
    const qty = card.querySelector('.numero-cantidad');
    qty.id = `qty-${producto.id}`;

    btnMas.addEventListener('click', () => cambiarCantidad(producto.id, 1));
    btnMenos.addEventListener('click', () => cambiarCantidad(producto.id, -1));

    card.querySelector('.btn-info-i')
        .addEventListener('click', () => console.log('Info:', producto));

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

        const res = await fetch(getRuta('data.json'));
        const data = await res.json();

        const mapaAlergenos = {};
        data.alergenos.forEach(a => {
            mapaAlergenos[a.id] = { icono: a.icono, nombre: a.nombre };
        });

        let productos = data.productos;
        if (categoriaId !== null) {
            productos = productos.filter(p => p.categoria_id === categoriaId);
        }

        const contenedor = document.getElementById(contenedorId);
        if (!contenedor) return;

        contenedor.innerHTML = '';
        productos.forEach(p => {
            const card = modo === 'carta'
                ? crearCartaItem(p)
                : crearPedidoItem(p, mapaAlergenos);
            contenedor.appendChild(card);
        });

        // ✅ Sincronizar contadores con el carrito guardado
        if (modo === 'pedido') {
            const carritoGuardado = JSON.parse(localStorage.getItem('carrito') || '{}');
            Object.entries(carritoGuardado).forEach(([id, cantidad]) => {
                carrito[id] = cantidad;
                const el = document.getElementById(`qty-${id}`);
                if (el) el.textContent = cantidad;
            });
        }

    } catch (e) {
        console.error('Error cargando productos:', e);
    }
}

function cambiarCantidad(productoId, delta) {
    if (!carrito[productoId]) carrito[productoId] = 0;
    carrito[productoId] = Math.max(0, carrito[productoId] + delta);

    // ✅ Si llega a 0, lo eliminamos del carrito
    if (carrito[productoId] === 0) {
        delete carrito[productoId];
    }

    const el = document.getElementById(`qty-${productoId}`);
    if (el) el.textContent = carrito[productoId] || 0;

    guardarCarrito();
}

function guardarCarrito() {
    localStorage.setItem('carrito', JSON.stringify(carrito));
}