/* ==============================================
   JAVA.JS - MOTOR DE TAHM KING (V. FINAL)
   ============================================== */

async function xLuIncludeFile() {
    let z = document.getElementsByTagName("*");

    for (let i = 0; i < z.length; i++) {
        if (z[i].getAttribute("data-xlu-include-file")) {
            let a = z[i].cloneNode(false);
            let file = z[i].getAttribute("data-xlu-include-file");

            // === MAGIA: CORRECCIÓN DE CARGA DE ARCHIVOS ===
            // Si estamos en la carpeta 'pages' y el archivo a cargar NO tiene '../', se lo ponemos.
            if (window.location.pathname.includes("/pages/") && !file.startsWith("../")) {
                file = "../" + file;
            }
            // ====================================================

            try {
                let response = await fetch(file);
                if (response.ok) {
                    let content = await response.text();

                    a.removeAttribute("data-xlu-include-file");
                    a.innerHTML = content;
                    z[i].parentNode.replaceChild(a, z[i]);

                    // Si cargamos menús, arreglamos sus enlaces internos
                    if (file.includes("header") || file.includes("sidebar") || file.includes("footer")) {
                        corregirRutas(a);
                    }

                    xLuIncludeFile(); // Seguimos buscando más componentes
                }
            } catch (error) {
                console.error("Error cargando archivo:", file, error);
            }
            return;
        }
    }
    document.dispatchEvent(new CustomEvent('componentesListos'));
}

function corregirRutas(elemento) {
    if (window.location.pathname.includes("/pages/")) {
        const elementos = elemento.querySelectorAll('a, img');
        elementos.forEach(el => {
            let attr = el.tagName === 'A' ? 'href' : 'src';
            let ruta = el.getAttribute(attr);

            if (ruta && !ruta.startsWith('http') && !ruta.startsWith('#') && !ruta.startsWith('../')) {
                el.setAttribute(attr, '../' + ruta);
            }
        });
    }
}

document.addEventListener("DOMContentLoaded", function() {
    xLuIncludeFile();
});

/* ==============================================
   LÓGICA DEL SIDEBAR (Se ejecuta al cargar los componentes)
   ============================================== */
document.addEventListener('componentesListos', () => {
    // Buscamos los botones
    const btnMenu = document.getElementById('btn-menu'); // El del header
    const sidebar = document.getElementById('mi-sidebar');
    const overlay = document.getElementById('fondo-sidebar');
    const btnCerrar = document.getElementById('btn-cerrar-menu'); // El del sidebar

    // Si todo existe, le damos vida
    if (btnMenu && sidebar && overlay && btnCerrar) {

        // 1. Al hacer clic en las tres rayitas -> ABRIR
        btnMenu.addEventListener('click', () => {
            sidebar.classList.add('activo');
            overlay.classList.add('activo');
        });

        // Función para cerrar todo
        const cerrarSidebar = () => {
            sidebar.classList.remove('activo');
            overlay.classList.remove('activo');
        };

        // 2. Al hacer clic en la X -> CERRAR
        btnCerrar.addEventListener('click', cerrarSidebar);

        // 3. Al hacer clic en el fondo negro fuera del menú -> CERRAR
        overlay.addEventListener('click', cerrarSidebar);
    }
});

document.addEventListener('componentesListos', () => {

    const cards = document.querySelectorAll('.card-contacto');
    const textarea = document.querySelector('.contacto-form textarea');

    cards.forEach(card => {
        card.addEventListener('click', () => {

            // Quitar selección previa
            cards.forEach(c => c.classList.remove('activa'));

            // Activar la actual
            card.classList.add('activa');

            // Auto rellenar mensaje
            const tipo = card.dataset.tipo;

            if (textarea) {
                if (tipo === "duda") {
                    textarea.placeholder = "Escribe tu duda...";
                }
                if (tipo === "reclamacion") {
                    textarea.placeholder = "Describe tu problema...";
                }
                if (tipo === "sugerencia") {
                    textarea.placeholder = "Cuéntanos tu idea...";
                }
            }
        });
    });

});

document.addEventListener('componentesListos', async () => {
    const navCats = document.getElementById('nav-categorias');
    const lista = document.getElementById('lista-productos');

    if (!navCats || !lista) return;
    if (typeof cargarProductos === 'undefined') return;

    // === AQUÍ ESTÁ LA MAGIA QUE DETECTA EL PANEL ===
    const esPedido = !!document.querySelector('.pedido-mode');
    const esPanel = !!document.querySelector('.panel-mode');

    let modo = 'carta'; // Por defecto pinta la carta normal
    if (esPedido) modo = 'pedido'; // Si es la página de pedidos
    if (esPanel) modo = 'panel';   // Si es el panel del trabajador
    // ===============================================

    const base = window.location.pathname.includes('/pages/') ? '../' : '';

    const res = await fetch(base + 'data.json');
    const data = await res.json();
    const categorias = data.categorias.sort((a, b) => a.orden - b.orden);

    categorias.forEach((cat, i) => {
        const btn = document.createElement('button');
        btn.className = 'cat-btn' + (i === 0 ? ' active' : '');
        btn.textContent = cat.nombre;
        btn.addEventListener('click', () => {
            navCats.querySelectorAll('.cat-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            cargarProductos('lista-productos', modo, cat.id);
        });
        navCats.appendChild(btn);
    });

    if (categorias.length > 0) {
        cargarProductos('lista-productos', modo, categorias[0].id);
    }
});


window.addEventListener('pageshow', () => {
    const carritoGuardado = JSON.parse(localStorage.getItem('carrito') || '{}');
    document.querySelectorAll('[id^="qty-"]').forEach(el => {
        const id = el.id.replace('qty-', '');
        el.textContent = carritoGuardado[id] || 0;
    });
});

// mensaje de bienvenida y el logout en el header

document.addEventListener('componentesListos', () => {
    const usuario = JSON.parse(localStorage.getItem('usuario') || 'null');
    const btnUser = document.getElementById('btn-user');

    if (!btnUser) return;

    // Función para obtener la ruta correcta del login
    function getRutaLogin() {
        // Si estamos en la carpeta pages/, necesitamos subir un nivel
        if (window.location.pathname.includes('/pages/')) {
            return '../pages/login.html';
        }
        // Si estamos en la raíz, la ruta es directa
        return 'pages/login.html';
    }

    if (usuario) {
        // Cambiar icono de usuario por nombre + logout
        btnUser.innerHTML = `<span style="color:#fff;font-size:14px;letter-spacing:1px;">${usuario.nombre.split(' ')[0].toUpperCase()}</span>`;
        // --- MENÚ FLOTANTE DEL PERFIL ANIMADO ---
        btnUser.addEventListener('click', function(e) {
            e.preventDefault();

            let menu = document.getElementById('menu-perfil-flotante');

            if (!menu) {
                menu = document.createElement('div');
                menu.id = 'menu-perfil-flotante';
                menu.style.cssText = 'position:absolute; top:70px; right:20px; background:#111; border:2px solid #ff2a2a; border-radius:10px; padding:20px; z-index:9999; box-shadow: 0 10px 20px rgba(0,0,0,0.8); text-align:center; min-width:180px;';

                const misPuntos = usuario.puntos || 0;
                const rutaHistorial = window.location.pathname.includes('/pages/') ? 'historial.html' : 'pages/historial.html';

                // LA MAGIA DE LAS ANIMACIONES
                const estilosAnimacion = '<style>' +
                    '.btn-hist-flotante { background:#ff2a2a; color:#fff; display:block; padding:10px; text-decoration:none; border-radius:5px; margin-bottom:10px; font-weight:bold; transition:all 0.3s ease; }' +
                    '.btn-hist-flotante:hover { background:#cc0000; transform:scale(1.05); box-shadow:0 4px 10px rgba(255,42,42,0.4); }' +
                    '.btn-cerrar-flotante { background:none; border:none; color:#ccc; cursor:pointer; text-decoration:none; font-size:14px; width:100%; transition:all 0.3s ease; }' +
                    '.btn-cerrar-flotante:hover { color:#ff2a2a; transform:scale(1.05); }' +
                    '</style>';

                menu.innerHTML = estilosAnimacion +
                    '<h4 style="color:#fff; margin:0 0 5px 0; text-transform:uppercase;">' + usuario.nombre + '</h4>' +
                    '<p style="color:#ffcc00; font-size:22px; margin:0 0 15px 0; font-weight:bold;">💎 ' + misPuntos + ' pts</p>' +
                    '<hr style="border-color:#333; margin-bottom:15px;">' +
                    '<a href="' + rutaHistorial + '" class="btn-hist-flotante">Ver Historial</a>' +
                    '<button id="btn-cerrar-sesion-flotante" class="btn-cerrar-flotante">Cerrar Sesión</button>';

                btnUser.parentElement.style.position = 'relative';
                btnUser.parentElement.appendChild(menu);

                document.getElementById('btn-cerrar-sesion-flotante').addEventListener('click', function() {
                    localStorage.removeItem('usuario');
                    window.location.reload();
                });
            } else {
                menu.style.display = (menu.style.display === 'none') ? 'block' : 'none';
            }
        });
        btnUser.href = '#';
        btnUser.title = `Sesión iniciada como ${usuario.nombre}`;


    } else {
        // Usar la ruta corregida según la página actual
        btnUser.href = getRutaLogin();
    }
});