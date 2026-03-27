document.addEventListener('DOMContentLoaded', async () => {

    // ── Seguridad ────────────────────────────────────────────────
    const trabajador = JSON.parse(localStorage.getItem('trabajador') || 'null');
    if (!trabajador) {
        window.location.href = 'login.html';
        return;
    }

    // ── Logout ───────────────────────────────────────────────────
    document.getElementById('btn-logout').addEventListener('click', (e) => {
        e.preventDefault();
        localStorage.removeItem('trabajador');
        localStorage.removeItem('usuario');
        window.location.href = '../index.html';
    });

    // ── Tabs ─────────────────────────────────────────────────────
    const tabs = ['tab-productos', 'tab-ofertas', 'tab-nuevo', 'tab-nueva-oferta'];

    document.querySelectorAll('[data-tab]').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('[data-tab]').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            tabs.forEach(t => {
                const el = document.getElementById(t);
                if (el) el.style.display = t === 'tab-' + btn.dataset.tab ? 'block' : 'none';
            });
            if (btn.dataset.tab === 'ofertas') renderOfertas();
        });
    });

    // ── Helpers datos ─────────────────────────────────────────────
    function getDatos() {
        return JSON.parse(localStorage.getItem('productos_panel') || 'null');
    }

    function guardarDatos(datos) {
        localStorage.setItem('productos_panel', JSON.stringify(datos));
    }


    // ── Formulario nueva oferta ───────────────────────────────────
    document.addEventListener('componentesListos', () => {
        document.getElementById('btn-anadir-oferta').addEventListener('click', () => {
            const nombre = document.getElementById('oferta-nombre').value.trim();
            const desc   = document.getElementById('oferta-desc').value.trim();
            const precio = parseFloat(document.getElementById('oferta-precio').value);
            const imagen = document.getElementById('oferta-imagen').value.trim();

            if (!nombre || !desc || isNaN(precio)) {
                alert('Rellena nombre, descripción y precio.');
                return;
            }

            const datos = getDatos();
            if (!datos) {
                alert('Error: carga la página primero.');
                return;
            }

            datos.productos.push({
                id: Date.now(),
                nombre,
                descripcion: desc,
                precio,
                categoria_id: 6,
                alergenos: [],
                imagen: imagen || 'img/oferta-home.jpg',
                disponible: true,
                destacado: false
            });

            guardarDatos(datos);

            document.getElementById('oferta-nombre').value = '';
            document.getElementById('oferta-desc').value   = '';
            document.getElementById('oferta-precio').value = '';
            document.getElementById('oferta-imagen').value = '';

            alert(`"${nombre}" añadida correctamente.`);
        });

        // Poblar select y checkboxes del formulario de producto
        const datos = getDatos();
        if (!datos) return;

        const selectCat = document.getElementById('new-categoria');
        if (selectCat && selectCat.options.length === 0) {
            datos.categorias.forEach(cat => {
                const opt = document.createElement('option');
                opt.value = cat.id;
                opt.textContent = cat.nombre;
                selectCat.appendChild(opt);
            });
        }

        const divAlergenos = document.getElementById('new-alergenos');
        if (divAlergenos && divAlergenos.children.length === 0) {
            datos.alergenos.forEach(a => {
                const label = document.createElement('label');
                label.style.cssText = 'color:#fff;display:flex;align-items:center;gap:6px;cursor:pointer;';
                label.innerHTML = `<input type="checkbox" value="${a.id}"> ${a.icono} ${a.nombre}`;
                divAlergenos.appendChild(label);
            });
        }

        document.getElementById('btn-anadir').addEventListener('click', () => {
            const nombre = document.getElementById('new-nombre').value.trim();
            const desc   = document.getElementById('new-desc').value.trim();
            const precio = parseFloat(document.getElementById('new-precio').value);
            const catId  = parseInt(document.getElementById('new-categoria').value);
            const imagen = document.getElementById('new-imagen').value.trim();
            const alergs = Array.from(
                document.querySelectorAll('#new-alergenos input:checked')
            ).map(el => el.value);

            if (!nombre || !desc || isNaN(precio)) {
                alert('Rellena nombre, descripción y precio.');
                return;
            }

            const d = getDatos();
            d.productos.push({
                id: Date.now(),
                nombre,
                descripcion: desc,
                precio,
                categoria_id: catId,
                alergenos: alergs,
                imagen: imagen || 'img/burger-placeholder.png',
                disponible: true,
                destacado: false
            });

            guardarDatos(d);

            document.getElementById('new-nombre').value = '';
            document.getElementById('new-desc').value   = '';
            document.getElementById('new-precio').value = '';
            document.getElementById('new-imagen').value = '';
            document.querySelectorAll('#new-alergenos input').forEach(el => el.checked = false);

            alert(`"${nombre}" añadido correctamente.`);
        });
    });
});