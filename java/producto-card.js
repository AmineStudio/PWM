// Ajusta rutas según si estamos en /pages/ o raíz
function getRuta(archivo) {
    return window.location.pathname.includes('/pages/')
        ? `../${archivo}`
        : archivo;
}
//Carga el componente HTML de plantillas (una sola vez)
async function cargarComponenteProducto() {
    if (document.getElementById('tpl-carta-item')) return;

    const res = await fetch(getRuta('components/producto-card.html'));
    const html = await res.text();

    const div = document.createElement('div');
    div.id = 'producto-templates';
    div.setAttribute('hidden', '');
    div.innerHTML = html;
    document.documentElement.appendChild(div);
}

function crearCartaItem(producto, mapaAlergenos) {
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

    if (producto.alergenos && producto.alergenos.length > 0 && mapaAlergenos) {
        const infoDiv = card.querySelector('.item-info');
        if (infoDiv) {
            let divAlerg = card.querySelector('.iconos-alergenos');

            if (!divAlerg) {
                divAlerg = document.createElement('div');
                divAlerg.className = 'iconos-alergenos';
                infoDiv.appendChild(divAlerg);
            } else {
                infoDiv.appendChild(divAlerg);
            }

            divAlerg.style.cssText = 'display: flex; flex-direction: row; flex-wrap: wrap; align-items: center; margin-top: 10px; gap: 10px;';

            let alergenosHTML = '';
            producto.alergenos.forEach(idAl => {
                const alerg = mapaAlergenos[idAl];
                if (alerg) {
                    let rutaImg = alerg.icono;
                    if (window.location.pathname.includes('/pages/') && rutaImg.startsWith('img/')) {
                        rutaImg = '../' + rutaImg;
                    }
                    alergenosHTML += `<img src="${rutaImg}" title="${alerg.nombre}" alt="${alerg.nombre}" class="icono-alerg-mini" style="width: 40px; height: 40px; object-fit: contain; vertical-align: middle;">`;
                }
            });
            divAlerg.innerHTML = alergenosHTML;
        }
    }
    return card;
}

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

    if (producto.alergenos && producto.alergenos.length > 0 && mapaAlergenos) {
        const infoDiv = card.querySelector('.item-info');
        if (infoDiv) {
            let divAlerg = card.querySelector('.iconos-alergenos');
            if (!divAlerg) {
                divAlerg = document.createElement('div');
                divAlerg.className = 'iconos-alergenos';
                infoDiv.appendChild(divAlerg);
            } else {
                infoDiv.appendChild(divAlerg);
            }

            divAlerg.style.cssText = 'display: flex; flex-direction: row; flex-wrap: wrap; align-items: center; margin-top: 10px; gap: 10px;';

            let alergenosHTML = '';
            producto.alergenos.forEach(idAl => {
                const alerg = mapaAlergenos[idAl];
                if (alerg) {
                    let rutaImg = alerg.icono;
                    if (window.location.pathname.includes('/pages/') && rutaImg.startsWith('img/')) {
                        rutaImg = '../' + rutaImg;
                    }
                    alergenosHTML += `<img src="${rutaImg}" title="${alerg.nombre}" alt="${alerg.nombre}" class="icono-alerg-mini" style="width: 40px; height: 40px; object-fit: contain; vertical-align: middle;">`;
                }
            });
            divAlerg.innerHTML = alergenosHTML;
        }
    }

    if (!producto.disponible) {
        card.querySelector('.qty-control').style.display = 'none';
        card.style.opacity = '0.5';
    }

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

    const alergenosStr = (producto.alergenos || []).join(', ');

    const infoDiv = card.querySelector('.item-info');
    infoDiv.innerHTML = `
        <input class="panel-input" value="${producto.nombre}" placeholder="Nombre"
               style="background:none;border:none;border-bottom:1px solid #666;color:#fff;font-size:18px;width:100%;margin-bottom:4px;font-family:inherit;font-weight:bold;">
        
        <input class="panel-input-desc" value="${producto.descripcion}" placeholder="Descripción"
               style="background:none;border:none;border-bottom:1px solid #444;color:#ccc;font-size:12px;width:100%;margin-bottom:4px;font-family:inherit;">
               
        <input class="panel-input-alergenos" value="${alergenosStr}" placeholder="Alérgenos (ej: gluten, lacteos)"
               style="background:none;border:none;border-bottom:1px solid #444;color:#ffaa00;font-size:12px;width:100%;margin-bottom:8px;font-family:inherit;">

        <div style="display:flex; align-items:center; gap:10px; margin-bottom:8px;">
            <button class="btn-cambiar-img" style="background:#333; color:#fff; border:1px solid #666; padding:5px 10px; font-size:11px; cursor:pointer; border-radius:4px; transition: 0.2s;">
                <i class="fa-solid fa-camera"></i> CAMBIAR FOTO
            </button>
            <input type="file" class="input-file-img" accept="image/*" style="display:none;">
            <input type="hidden" class="panel-input-img" value="${producto.imagen || ''}">
            <span class="nombre-archivo-img" style="color:#aaa; font-size:10px; font-style:italic;"></span>
        </div>
               
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

    const btnImg = infoDiv.querySelector('.btn-cambiar-img');
    const fileInput = infoDiv.querySelector('.input-file-img');
    const hiddenImgInput = infoDiv.querySelector('.panel-input-img');
    const nombreArchivoSpan = infoDiv.querySelector('.nombre-archivo-img');

    btnImg.onmouseover = () => btnImg.style.background = '#555';
    btnImg.onmouseout = () => btnImg.style.background = '#333';

    btnImg.addEventListener('click', () => fileInput.click());

    fileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            nombreArchivoSpan.textContent = "Cargando...";
            const reader = new FileReader();
            reader.onload = function(event) {
                const base64String = event.target.result;
                img.src = base64String;
                hiddenImgInput.value = base64String;
                nombreArchivoSpan.textContent = file.name;
            };
            reader.readAsDataURL(file);
        }
    });

    const priceDiv = card.querySelector('.item-price');
    priceDiv.style.cssText = 'display:flex;flex-direction:column;gap:5px;align-items:flex-end;min-width:140px;';
    priceDiv.innerHTML = `
        <button class="btn-guardar btn-main" style="font-size:11px;padding:6px 12px;width:100%;">GUARDAR</button>
        <button class="btn-disponible action-btn ${producto.disponible ? 'cart' : 'cancel'}" style="font-size:11px;padding:6px 12px;width:100%;">
            ${producto.disponible ? 'OCULTAR' : 'MOSTRAR'}
        </button>
        <button class="btn-eliminar action-btn cancel" style="font-size:11px;padding:6px 12px;width:100%; background-color:#ff2a2a; color:white;">ELIMINAR</button>
    `;

    priceDiv.querySelector('.btn-guardar').addEventListener('click', () => {
        const prod = productos.find(x => x.id === producto.id);

        prod.nombre = infoDiv.querySelector('.panel-input').value.trim();
        prod.descripcion = infoDiv.querySelector('.panel-input-desc').value.trim();
        prod.precio = parseFloat(infoDiv.querySelector('.panel-input-precio').value);
        prod.puntos_requeridos = parseInt(infoDiv.querySelector('.panel-input-puntos').value) || 0;
        prod.imagen = infoDiv.querySelector('.panel-input-img').value.trim();

        const alergenosInput = infoDiv.querySelector('.panel-input-alergenos').value;
        prod.alergenos = alergenosInput.split(',').map(s => s.trim().toLowerCase()).filter(s => s !== '');

        localStorage.setItem('productos_panel', JSON.stringify(datos));
        card.querySelector('img').src = getRuta(prod.imagen || 'img/burger-placeholder.png');
        alert('Cambios guardados correctamente.');
    });

    priceDiv.querySelector('.btn-disponible').addEventListener('click', () => {
        const prod = productos.find(x => x.id === producto.id);
        prod.disponible = !prod.disponible;
        localStorage.setItem('productos_panel', JSON.stringify(datos));
        cargarProductos('lista-productos', 'panel', categoriaId);
    });

    priceDiv.querySelector('.btn-eliminar').addEventListener('click', () => {
        if (!confirm(`¿Estás seguro de que quieres eliminar "${producto.nombre}" de la base de datos?`)) return;
        const idx = productos.findIndex(x => x.id === producto.id);
        productos.splice(idx, 1);
        localStorage.setItem('productos_panel', JSON.stringify(datos));
        cargarProductos('lista-productos', 'panel', categoriaId);
    });

    return card;
}

async function cargarProductos(contenedorId, modo = 'carta', categoriaId = null) {
    try {
        await cargarComponenteProducto();

        let datosRaw = localStorage.getItem('productos_panel');
        let datos;

        if (datosRaw) {
            datos = JSON.parse(datosRaw);
        } else {
            const res = await fetch(getRuta('data.json'));
            datos = await res.json();
            localStorage.setItem('productos_panel', JSON.stringify(datos));
        }

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
                card = crearCartaItem(p, mapaAlergenos);
            } else if (modo === 'pedido') {
                card = crearPedidoItem(p, mapaAlergenos);
            } else if (modo === 'panel') {
                card = crearPanelItem(p, mapaAlergenos, categoriaId, datos.productos, datos);
            }
            if (card) contenedor.appendChild(card);
        });

    } catch (e) {
        console.error('Error cargando productos:', e);
    }
}

function sincronizarCarrito() {
    const carritoGuardado = JSON.parse(localStorage.getItem('carrito') || '{}');

    Object.keys(carritoGuardado).forEach(id => {
        const qtyElement = document.getElementById(`qty-${id}`);
        if (qtyElement) {
            qtyElement.textContent = carritoGuardado[id];
        }
    });

    document.querySelectorAll('[id^="qty-"]').forEach(el => {
        const id = el.id.replace('qty-', '');
        if (!carritoGuardado[id]) {
            el.textContent = '0';
        }
    });
}

function cambiarCantidad(productoId, delta) {
    const id = String(productoId);
    let carritoActual = JSON.parse(localStorage.getItem('carrito') || '{}');

    if (!carritoActual[id]) carritoActual[id] = 0;
    carritoActual[id] = Math.max(0, carritoActual[id] + delta);

    if (carritoActual[id] === 0) {
        delete carritoActual[id];
    }

    localStorage.setItem('carrito', JSON.stringify(carritoActual));

    const el = document.getElementById(`qty-${id}`);
    if (el) el.textContent = carritoActual[id] || 0;

    document.dispatchEvent(new CustomEvent('carritoActualizado'));
}

function renderizarResumenPedido() {
    const contenedor = document.getElementById('lista-resumen-pedidos');
    if (!contenedor) return;

    const carritoActual = JSON.parse(localStorage.getItem('carrito') || '{}');
    const datos = JSON.parse(localStorage.getItem('productos_panel'));

    contenedor.innerHTML = '';
    let total = 0;

    Object.entries(carritoActual).forEach(([id, cantidad]) => {
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

function vaciarCarrito() {
    localStorage.removeItem('carrito');
    document.querySelectorAll('.numero-cantidad').forEach(el => el.textContent = '0');
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
    let totalPuntosRequeridos = 0;
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

    let pagadoConPuntos = false;

    if (usuario && totalPuntosRequeridos > 0 && usuario.puntos >= totalPuntosRequeridos) {
        const quierePagar = confirm(`¡Enhorabuena! Tienes ${usuario.puntos} puntos.\n\nEste pedido te cuesta ${totalPedido.toFixed(2)}€ o ${totalPuntosRequeridos} puntos.\n\n¿Quieres usar tus puntos para que te salga GRATIS?`);

        if (quierePagar) {
            pagadoConPuntos = true;
            totalPedido = 0;
        }
    } else if (usuario && totalPuntosRequeridos > 0 && usuario.puntos < totalPuntosRequeridos) {
        console.log(`Te faltan ${totalPuntosRequeridos - usuario.puntos} puntos para que esto sea gratis.`);
    }

    let nuevoId;
    do { nuevoId = Math.floor(Math.random() * 100) + 1; }
    while (datos.pedidos && datos.pedidos.some(p => p.id === nuevoId));

    const tipoPedido = localStorage.getItem('tipo_pedido') || 'domicilio';

    const nuevoPedido = {
        id: nuevoId,
        usuario_id: usuario ? usuario.id : "invitado",
        fecha: new Date().toISOString().split('T')[0],
        timestamp: Date.now(),
        tipo: tipoPedido,
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

            if (pagadoConPuntos) {
                usuariosArr[userIndex].puntos -= totalPuntosRequeridos;
            } else {
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

window.addEventListener('storage', (e) => {
    if (e.key === 'carrito') {
        sincronizarCarrito();
        document.dispatchEvent(new CustomEvent('carritoActualizado'));
    }
});

document.addEventListener('carritoActualizado', () => {
    renderizarResumenPedido();
    sincronizarCarrito();
});

document.addEventListener('click', function(e) {
    const btnCancelar = e.target.closest('.action-btn.cancel');

    if (btnCancelar) {
        e.preventDefault();

        const carritoActual = JSON.parse(localStorage.getItem('carrito') || '{}');

        if (Object.keys(carritoActual).length > 0) {
            if (confirm('¿Estás seguro de que quieres cancelar el pedido y vaciar el carrito?')) {
                vaciarCarrito();
                window.location.href = btnCancelar.getAttribute('href');
            }
        } else {
            // Si el carrito ya estaba vacío, nos vamos directos sin preguntar nada
            window.location.href = btnCancelar.getAttribute('href');
        }
    }
});