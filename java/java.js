/* ==============================================
   JAVA.JS - MOTOR DE TAHM KING
   ============================================== */

async function xLuIncludeFile() {
    let z = document.getElementsByTagName("*");

    for (let i = 0; i < z.length; i++) {
        if (z[i].getAttribute("xlu-include-file")) {
            let a = z[i].cloneNode(false);
            let file = z[i].getAttribute("xlu-include-file");

            try {
                let response = await fetch(file);
                if (response.ok) {
                    let content = await response.text();

                    // Inyectamos el contenido
                    a.removeAttribute("xlu-include-file");
                    a.innerHTML = content;
                    z[i].parentNode.replaceChild(a, z[i]);

                    // === CORRECCIÓN DE RUTAS ===
                    // Si cargamos un componente de navegación (Header o Sidebar), arreglamos sus enlaces
                    if (file.includes("header") || file.includes("sidebar")) {
                        corregirRutas(a);
                    }

                    // Recursividad para componentes anidados
                    xLuIncludeFile();
                }
            } catch (error) {
                console.error("Error cargando archivo:", error);
            }
            return;
        }
    }
}

function corregirRutas(elemento) {
    // 1. Detectamos si estamos dentro de la carpeta 'pages'
    const estamosEnPages = window.location.pathname.includes("/pages/");

    if (estamosEnPages) {
        // Buscamos TODOS los enlaces (a) e imágenes (img) dentro del componente
        const elementosConRuta = elemento.querySelectorAll('a, img');

        elementosConRuta.forEach(el => {
            let atributo = el.tagName === 'A' ? 'href' : 'src';
            let ruta = el.getAttribute(atributo);

            // Si la ruta es interna (no empieza por http, # o ../)
            if (ruta && !ruta.startsWith('http') && !ruta.startsWith('#') && !ruta.startsWith('../')) {
                // Le añadimos "../" para salir de la carpeta pages
                el.setAttribute(atributo, '../' + ruta);
            }
        });
    }
}

// Iniciar al cargar
document.addEventListener("DOMContentLoaded", function() {
    xLuIncludeFile();
});