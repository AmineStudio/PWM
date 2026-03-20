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