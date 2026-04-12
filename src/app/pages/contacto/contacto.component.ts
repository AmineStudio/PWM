import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-contacto',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './contacto.component.html',
  styleUrls: ['./contacto.component.css'],
})
export class ContactoComponent {
  // Estado para controlar qué tarjeta está seleccionada
  tipoSeleccionado: string = 'duda';

  // Cambia el tipo de mensaje al hacer clic en las tarjetas
  seleccionarTipo(tipo: string): void {
    this.tipoSeleccionado = tipo;
  }

  enviarMensaje(formulario: any): void {
    if (formulario.valid) {
      const datos = {
        tipo: this.tipoSeleccionado,
        ...formulario.value,
      };

      console.log('Datos a enviar:', datos);
      alert('¡Gracias por contactar! Hemos recibido tu ' + this.tipoSeleccionado);

      formulario.reset(); // Limpia el formulario tras el envío
      this.tipoSeleccionado = 'duda'; // Resetea la opción visual
    }
  }
}
