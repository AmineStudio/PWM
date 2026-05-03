import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FirestoreService } from '../../services/firestore.service';

@Component({
  selector: 'app-contacto',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './contacto.component.html',
  styleUrls: ['./contacto.component.css'],
})
export class ContactoComponent {
  private fs = inject(FirestoreService);

  tipoSeleccionado = 'duda';
  enviando = signal(false);
  enviado = signal(false);
  error = signal('');

  seleccionarTipo(tipo: string): void {
    this.tipoSeleccionado = tipo;
  }

  async enviarMensaje(formulario: any): Promise<void> {
    if (!formulario.valid) return;

    this.enviando.set(true);
    this.error.set('');

    try {
      await this.fs.enviarMensajeContacto({
        tipo: this.tipoSeleccionado,
        nombre: formulario.value.nombre,
        email: formulario.value.email,
        mensaje: formulario.value.mensaje,
      });

      this.enviado.set(true);
      formulario.reset();
      this.tipoSeleccionado = 'duda';

      // Ocultar el mensaje de éxito tras 4 segundos
      setTimeout(() => this.enviado.set(false), 4000);
    } catch (e: any) {
      this.error.set('Error al enviar el mensaje. Inténtalo de nuevo.');
    } finally {
      this.enviando.set(false);
    }
  }
}
