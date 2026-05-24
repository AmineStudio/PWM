import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoadingController, AlertController } from '@ionic/angular';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  standalone: false
})
export class RegisterPage {

  form: FormGroup;
  fotoBase64: string = '';
  fotoPreview: string = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController
  ) {
    this.form = this.fb.group({
      nombre:    ['', [Validators.required]],
      apellidos: ['', [Validators.required]],
      email:     ['', [Validators.required, Validators.email]],
      password:  ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  onFotoSeleccionada(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      this.fotoBase64 = reader.result as string;
      this.fotoPreview = this.fotoBase64;
    };
    reader.readAsDataURL(file);
  }

  async onRegister(): Promise<void> {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    const loading = await this.loadingCtrl.create({ message: 'Registrando...' });
    await loading.present();
    try {
      const { nombre, apellidos, email, password } = this.form.value;
      await this.authService.register(email, password, nombre, apellidos, this.fotoBase64);
      await loading.dismiss();
      this.router.navigate(['/favorites']);
    } catch (error: any) {
  await loading.dismiss();
  
  let mensaje = 'No se pudo crear la cuenta. Inténtalo de nuevo.';
  
  if (error.code === 'auth/email-already-in-use') {
    mensaje = 'Este email ya está registrado.';
  } else if (error.code === 'auth/weak-password') {
    mensaje = 'La contraseña debe tener al menos 6 caracteres.';
  } else if (error.code === 'auth/invalid-email') {
    mensaje = 'El formato del email no es válido.';
  } else if (error.code) {
    mensaje = 'Error: ' + error.code;
  }

  const alert = await this.alertCtrl.create({
    header: 'Error en el registro',
    message: mensaje,
    buttons: ['OK']
  });
  await alert.present();
}
  }

  goToLogin(): void {
    this.router.navigate(['/login']);
  }
}