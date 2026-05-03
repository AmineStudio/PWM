import { Component, inject, signal } from '@angular/core';
import { AuthService } from '../../services/auth';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  email = '';
  password = '';
  nombre = '';
  emailReg = '';
  passwordReg = '';
  modoRegistro = false;

  // Signal en lugar de variable normal
  error = signal('');

  async enviar() {
    this.error.set(''); // ← así se actualiza un signal
    try {
      if (this.modoRegistro) {
        await this.authService.register(this.emailReg, this.passwordReg);
      } else {
        await this.authService.login(this.email, this.password);
      }
      this.router.navigate(['/inicio']);
    } catch (e: any) {
      this.error.set(this.traducirError(e.code)); // ← Angular detecta el cambio automáticamente
    }
  }

  traducirError(code: string): string {
    console.log('Error code:', code);
    const errores: any = {
      'auth/invalid-credential': 'Email o contraseña incorrectos.',
      'auth/invalid-email': 'El email no es válido.',
      'auth/email-already-in-use': 'Este email ya está registrado.',
      'auth/weak-password': 'La contraseña debe tener al menos 6 caracteres.',
      'auth/too-many-requests': 'Demasiados intentos. Espera un momento.',
      'auth/network-request-failed': 'Error de conexión. Revisa tu internet.',
      'auth/user-not-found': 'No existe una cuenta con este email.',
      'auth/wrong-password': 'Contraseña incorrecta.',
    };
    return errores[code] || `Error: ${code}`;
  }

  cambiarModo() {
    this.modoRegistro = !this.modoRegistro;
    this.error.set('');
  }
}
