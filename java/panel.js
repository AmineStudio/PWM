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
        window.location.href = 'login.html';
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

    // ── Render ofertas ────────────────────────────────────────────
    function renderOfertas() {
        const datos = getDatos();
        if (!datos) return;

        const lista = document.getElementById('lista-ofertas');
        lista.innerHTML = '';

        const ofertas = datos.productos.filter(p => p.categoria_id === 6);

        if (ofertas.length === 0) {
            lista.innerHTML = '<p style="color:#ccc;text-align:center;padding:40px;">Sin ofertas.</p>';
            return;
        }

        ofertas.forEach(p => {
            const item = document.createElement('article');
            item.className = 'menu-item';
            item.style.opacity = p.disponible ? '1' : '0.5';

            item.innerHTML = `
                <img src="../${p.imagen || 'img/burger-placeholder.png'}" class="item-img" alt="${p.nombre}"
                     onerror="this.src='https://cdn-icons-png.flaticon.com/512/3075/3075977.png'">
                <div class="item-info">
                    <input class="panel-input" value="${p.nombre}"
                           style="background:none;border:none;border-bottom:1px solid #666;color:#fff;font-size:20px;width:100%;margin-bottom:8px;font-family:inherit;">
                    <input class="panel-input-desc" value="${p.descripcion}"
                           style="background:none;border:none;border-bottom:1px solid #444;color:#ccc;font-size:14px;width:100%;margin-bottom:8px;font-family:inherit;">
                    <div style="display:flex;align-items:center;gap:6px;">
                        <input class="panel-input-precio" value="${p.precio}" type="number" step="0.01"
                               style="background:none;border:none;border-bottom:1px solid #444;color:#ff2a2a;font-size:16px;width:70px;font-family:inherit;">
                        <span style="color:#ff2a2a;">€</span>
                    </div>
                </div>
                <div style="display:flex;flex-direction:column;gap:8px;align-items:flex-end;min-width:160px;">
                    <button class="btn-guardar btn-main" style="font-size:12px;padding:8px 16px;width:100%;">
                        <i class="fa-solid fa-floppy-disk"></i> GUARDAR
                    </button>
                    <button class="btn-disponible action-btn ${p.disponible ? 'cart' : 'cancel'}" style="font-size:12px;padding:8px 16px;width:100%;">
                        <i class="fa-solid fa-${p.disponible ? 'eye' : 'eye-slash'}"></i>
                        ${p.disponible ? 'DISPONIBLE' : 'NO DISPONIBLE'}
                    </button>
                    <button class="btn-eliminar action-btn cancel" style="font-size:12px;padding:8px 16px;width:100%;">
                        <i class="fa-solid fa-trash"></i> ELIMINAR
                    </button>
                </div>
            `;

            item.querySelector('.btn-guardar').addEventListener('click', () => {
                const d    = getDatos();
                const prod = d.productos.find(x => x.id === p.id);
                prod.nombre      = item.querySelector('.panel-input').value.trim();
                prod.descripcion = item.querySelector('.panel-input-desc').value.trim();
                prod.precio      = parseFloat(item.querySelector('.panel-input-precio').value);
                guardarDatos(d);
                alert('Cambios guardados.');
            });

            item.querySelector('.btn-disponible').addEventListener('click', () => {
                const d    = getDatos();
                const prod = d.productos.find(x => x.id === p.id);
                prod.disponible = !prod.disponible;
                guardarDatos(d);
                renderOfertas();
            });

            item.querySelector('.btn-eliminar').addEventListener('click', () => {
                if (!confirm(`¿Eliminar "${p.nombre}"?`)) return;
                const d   = getDatos();
                const idx = d.productos.findIndex(x => x.id === p.id);
                d.productos.splice(idx, 1);
                guardarDatos(d);
                renderOfertas();
            });

            lista.appendChild(item);
        });
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