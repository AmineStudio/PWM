import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  isSignUpActive = false;

  constructor(private router: Router) {}

  togglePanel(active: boolean) {
    this.isSignUpActive = active;
  }

  // Simulación de la lógica que tenías en tu JS
  async iniciarSesion(email: string, pass: string) {
    if (!email || !pass) {
      alert('Introduce email y contraseña.');
      return;
    }

    // Aquí iría tu lógica de fetch a data.json
    // Por ahora, simulamos el éxito y redirigimos a la home
    console.log('Intentando login con:', email);

    // Guardamos en localStorage como hacías en tu JS
    localStorage.setItem('usuario', JSON.stringify({ email, nombre: 'Usuario Tahm' }));
    this.router.navigate(['/']); // Redirige a la página inicial
  }

  registrar(nombre: string, email: string, pass: string) {
    if (!nombre || !email || !pass) {
      alert('Rellena todos los campos.');
      return;
    }

    const nuevoUsuario = {
      id: Date.now(),
      nombre,
      email,
      puntos: 50
    };

    localStorage.setItem('usuario', JSON.stringify(nuevoUsuario));
    alert('¡Bienvenido a la realeza! Has ganado 50 Tahmkoins');
    this.router.navigate(['/']);
  }
}
