/* ==============================================
   JAVA.JS - MOTOR DE TAHM KING (V. FINAL)
   ============================================== */

async function xLuIncludeFile() {
    let z = document.getElementsByTagName("*");

    for (let i = 0; i < z.length; i++) {
        if (z[i].getAttribute("xlu-include-file")) {
            let a = z[i].cloneNode(false);
            let file = z[i].getAttribute("xlu-include-file");

            // === MAGIA NUEVA: CORRECCIÓN DE CARGA DE ARCHIVOS ===
            // Si estamos en la carpeta 'pages' y el archivo a cargar NO tiene '../', se lo ponemos.
            if (window.location.pathname.includes("/pages/") && !file.startsWith("../")) {
                file = "../" + file;
            }
            // ====================================================

            try {
                let response = await fetch(file);
                if (response.ok) {
                    let content = await response.text();

                    a.removeAttribute("xlu-include-file");
                    a.innerHTML = content;
                    z[i].parentNode.replaceChild(a, z[i]);

                    // Si cargamos menús, arreglamos sus enlaces internos
                    if (file.includes("header") || file.includes("sidebar")) {
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