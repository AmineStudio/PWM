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

    const esPedido = !!document.querySelector('.pedido-mode');
    const modo = esPedido ? 'pedido' : 'carta';
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

    if (usuario) {
        // Cambiar icono de usuario por nombre + logout
        btnUser.innerHTML = `<span style="color:#fff;font-size:14px;letter-spacing:1px;">${usuario.nombre.split(' ')[0].toUpperCase()}</span>`;
        btnUser.href = '#';
        btnUser.title = `Sesión iniciada como ${usuario.nombre}`;

        // Botón logout
        const btnLogout = document.createElement('a');
        btnLogout.className = 'icon-btn';
        btnLogout.href = '#';
        btnLogout.title = 'Cerrar sesión';
        btnLogout.innerHTML = '<i class="fa-solid fa-right-from-bracket" style="color:#ff2a2a;font-size:24px;"></i>';
        btnLogout.addEventListener('click', (e) => {
            e.preventDefault();
            localStorage.removeItem('usuario');
            window.location.reload();
        });

        btnUser.parentNode.insertBefore(btnLogout, btnUser.nextSibling);

    } else {
        btnUser.href = 'pages/login.html';
    }
});