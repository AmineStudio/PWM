/* ==============================================
   JAVA.JS - Carga de componentes y Corrección de Rutas
   ============================================== */

async function xLuIncludeFile() {
    let z = document.getElementsByTagName("*");

    for (let i = 0; i < z.length; i++) {
        // Buscamos elementos con el atributo xlu-include-file
        if (z[i].getAttribute("xlu-include-file")) {
            let a = z[i].cloneNode(false);
            let file = z[i].getAttribute("xlu-include-file");

            try {
                let response = await fetch(file);
                if (response.ok) {
                    let content = await response.text();

                    // --- 1. LÓGICA DE PLANTILLAS (Tu código original) ---
                    if (file === "article-template.html") {
                        let articleData = {
                            title: z[i].getAttribute("data-title"),
                            subtitle: z[i].getAttribute("data-subtitle"),
                            date: z[i].getAttribute("data-date"),
                            displayDate: z[i].getAttribute("data-display-date"),
                            content: z[i].getAttribute("data-content"),
                            image: z[i].getAttribute("data-image"),
                            imageCaption: z[i].getAttribute("data-image-caption")
                        };

                        content = content.replace(/{{title}}/g, articleData.title)
                            .replace(/{{subtitle}}/g, articleData.subtitle)
                            .replace(/{{date}}/g, articleData.date)
                            .replace(/{{displayDate}}/g, articleData.displayDate)
                            .replace(/{{content}}/g, articleData.content)
                            .replace(/{{image}}/g, articleData.image || '')
                            .replace(/{{imageCaption}}/g, articleData.imageCaption || '');
                    }

                    // --- 2. INYECTAMOS EL HTML ---
                    a.removeAttribute("xlu-include-file");
                    a.innerHTML = content;
                    z[i].parentNode.replaceChild(a, z[i]);

                    // --- 3. CORRECCIÓN DE RUTAS (NUEVO) ---
                    // Si el archivo cargado es el sidebar o el header, arreglamos los enlaces
                    if (file.includes("sidebar") || file.includes("header")) {
                        corregirRutas(a);
                    }

                    // Llamada recursiva por si hay componentes dentro de componentes
                    xLuIncludeFile();
                }
            } catch (error) {
                console.error("Error fetching file:", error);
            }
            return;
        }
    }
}

/* --- FUNCIÓN MÁGICA PARA ARREGLAR ENLACES --- */
function corregirRutas(elemento) {
    // 1. Detectamos si estamos dentro de la carpeta 'pages'
    const estamosEnPages = window.location.pathname.includes("/pages/");

    if (estamosEnPages) {
        // Buscamos todos los enlaces (a) e imágenes (img) dentro del componente cargado
        const enlaces = elemento.querySelectorAll('a, img');

        enlaces.forEach(el => {
            // Obtenemos la ruta (href para links, src para imágenes)
            let atributo = el.tagName === 'A' ? 'href' : 'src';
            let ruta = el.getAttribute(atributo);

            // Si la ruta existe y no es externa (http) ni un ancla (#)
            if (ruta && !ruta.startsWith('http') && !ruta.startsWith('#') && !ruta.startsWith('../')) {
                // Le añadimos los dos puntos para "salir" de la carpeta pages
                el.setAttribute(atributo, '../' + ruta);
            }
        });
    }
}

// Inicializamos cuando el HTML esté listo
document.addEventListener("DOMContentLoaded", function() {
    xLuIncludeFile();
});