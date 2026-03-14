/* ==============================================
   TIPO-PEDIDO.JS - Lógica de Selección Premium
   ============================================== */

document.addEventListener("DOMContentLoaded", async () => {
    const contenedor = document.getElementById('contenedor-opciones');
    if (!contenedor) return;

    // 1. Datos de Respaldo
    let opciones = [
        {
            "id": "aqui", "texto": "COMER AQUÍ", "descripcion": "Disfruta de la experiencia Tahm King en nuestro local.",
            "imagen": "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=600&auto=format&fit=crop",
            "icono": `<svg viewBox="0 0 24 24" width="50" height="50" fill="none" stroke-width="2"><path d="M18 8h1a4 4 0 0 1 0 8h-1"></path><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"></path><line x1="6" y1="1" x2="6" y2="4"></line><line x1="10" y1="1" x2="10" y2="4"></line><line x1="14" y1="1" x2="14" y2="4"></line></svg>`
        },
        {
            "id": "llevar", "texto": "PARA LLEVAR", "descripcion": "Pasa por el local y recógelo sin esperas.",
            "imagen": "https://images.unsplash.com/photo-1626804475297-4160aece9a66?q=80&w=600&auto=format&fit=crop",
            "icono": `<svg viewBox="0 0 24 24" width="50" height="50" fill="none" stroke-width="2"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path><line x1="3" y1="6" x2="21" y2="6"></line><path d="M16 10a4 4 0 0 1-8 0"></path></svg>`
        },
        {
            "id": "domicilio", "texto": "A DOMICILIO", "descripcion": "Te lo llevamos caliente directo a tu puerta.",
            "imagen": "https://images.unsplash.com/photo-1526367790999-0150786686a2?q=80&w=600&auto=format&fit=crop",
            "icono": `<svg viewBox="0 0 24 24" width="50" height="50" fill="none" stroke-width="2"><circle cx="5.5" cy="17.5" r="2.5"></circle><circle cx="18.5" cy="17.5" r="2.5"></circle><path d="M15 6h5l3 7v6M5.5 17.5H15M2 17.5h.5M9 17.5h6"></path><path d="M12 5L9 2H4v7h5"></path></svg>`
        }
    ];

    // 2. Intentamos cargar el data.json
    // 2. Intentamos cargar el data.json
    // 2. Intentamos cargar el data.json
    try {
        const rutaData = window.location.pathname.includes('/pages/') ? '../data.json' : 'data.json';

        // CORRECCIÓN AQUÍ: Usamos la variable rutaData sin comillas extra
        const res = await fetch(rutaData);

        if (res.ok) {
            const data = await res.json();
            if (data.tipos_pedido) {
                opciones = data.tipos_pedido;
            }
        }
    } catch (e) {
        console.warn("Usando datos de respaldo.", e);
    }

    // 3. Pintamos las tarjetas
    contenedor.innerHTML = '';
    opciones.forEach(opcion => {
        const enlace = document.createElement('a');
        enlace.href = "pedido.html";
        enlace.className = 'tarjeta-con-foto';

        let rutaBg = opcion.imagen;
        if (!rutaBg.startsWith('http') && !rutaBg.startsWith('../')) {
            rutaBg = '../' + rutaBg;
        }

        enlace.innerHTML = `
            <div class="tarjeta-opcion-bg" style="background-image: linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.9)), url('${rutaBg}');"></div>
            <div class="tarjeta-opcion-contenido">
                <div class="icono-dorado">${opcion.icono}</div>
                <div class="boton-dorado">${opcion.texto}</div>
                <p class="descripcion-opcion">${opcion.descripcion}</p>
            </div>
        `;

        enlace.addEventListener('click', (e) => {
            e.preventDefault();
            localStorage.setItem('tipo_pedido', opcion.id);
            window.location.href = enlace.href;
        });

        contenedor.appendChild(enlace);
    });
});