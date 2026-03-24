document.addEventListener("DOMContentLoaded", () => {

    const container = document.getElementById('container');
    const registerBtn = document.getElementById('register');
    const loginBtn = document.getElementById('login');

    if (!container || !registerBtn || !loginBtn) return;

    registerBtn.addEventListener('click', () => container.classList.add("active"));
    loginBtn.addEventListener('click', () => container.classList.remove("active"));

    const btnIniciar    = document.querySelector('.sign-in button');
    const inputEmail    = document.querySelector('.sign-in input[type="email"]');
    const inputPass     = document.querySelector('.sign-in input[type="password"]');

    const btnRegistrar  = document.querySelector('.sign-up button');
    const inputNombre   = document.querySelector('.sign-up input[type="text"]');
    const inputEmailReg = document.querySelector('.sign-up input[type="email"]');
    const inputPassReg  = document.querySelector('.sign-up input[type="password"]');

    // ── Helpers ──────────────────────────────────────────────────
    async function getUsuarios() {
        const local = JSON.parse(localStorage.getItem('usuarios') || 'null');
        if (local) return local;
        const res  = await fetch('../data.json');
        const data = await res.json();
        return data.usuarios;
    }

    async function getTrabajadores() {
        const res  = await fetch('../data.json');
        const data = await res.json();
        return data.trabajadores;
    }

    function guardarUsuarios(usuarios) {
        localStorage.setItem('usuarios', JSON.stringify(usuarios));
    }

    // ── Login ────────────────────────────────────────────────────
    btnIniciar.addEventListener('click', async () => {
        const email = inputEmail.value.trim();
        const pass  = inputPass.value.trim();

        if (!email || !pass) {
            alert('Introduce email y contraseña.');
            return;
        }

        // Primero buscar en trabajadores
        const trabajadores = await getTrabajadores();
        const trabajador   = trabajadores.find(t => t.email === email && t.password === pass);

        if (trabajador) {
            localStorage.setItem('trabajador', JSON.stringify(trabajador));
            window.location.href = 'panel.html';
            return;
        }

        // Si no, buscar en usuarios
        const usuarios = await getUsuarios();
        const usuario  = usuarios.find(u => u.email === email && u.password === pass);

        if (!usuario) {
            alert('Email o contraseña incorrectos.');
            return;
        }

        localStorage.setItem('usuario', JSON.stringify(usuario));
        window.location.href = '../index.html';
    });

    // ── Registro ─────────────────────────────────────────────────
    btnRegistrar.addEventListener('click', async () => {
        const nombre = inputNombre.value.trim();
        const email  = inputEmailReg.value.trim();
        const pass   = inputPassReg.value.trim();

        if (!nombre || !email || !pass) {
            alert('Rellena todos los campos.');
            return;
        }

        const usuarios = await getUsuarios();

        if (usuarios.find(u => u.email === email)) {
            alert('Ya existe una cuenta con ese email.');
            return;
        }

        const nuevoUsuario = {
            id: Date.now(),
            nombre,
            email,
            password: pass,
            puntos: 50,
            pedidos: []
        };

        usuarios.push(nuevoUsuario);
        guardarUsuarios(usuarios);

        localStorage.setItem('usuario', JSON.stringify(nuevoUsuario));
        window.location.href = '../index.html';
    });

});