import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Alergeno {
  nombre: string;
  descripcion: string;
  imagen: string;
}

@Component({
  selector: 'app-alergenos',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './alergenos.component.html',
  styleUrls: ['./alergenos.component.css'],
})
export class AlergenosComponent {
  public alergenos: Alergeno[] = [
    {
      nombre: 'Gluten',
      descripcion: 'Presente en panes y rebozados crujientes.',
      imagen: 'assets/img/alergenos/gluten.png',
    },
    {
      nombre: 'Lácteos',
      descripcion: 'Quesos fundidos y salsas especiales de la casa.',
      imagen: 'assets/img/alergenos/lacteos.png',
    },
    {
      nombre: 'Frutos Secos',
      descripcion: 'Posibles trazas en postres y aceites seleccionados.',
      imagen: 'assets/img/alergenos/frutossecos.png',
    },
    {
      nombre: 'Huevo',
      descripcion: 'En mayonesa casera y nuestros panes brioche.',
      imagen: 'assets/img/alergenos/huevo.png',
    },
    {
      nombre: 'Soja',
      descripcion: 'Presente en marinadas para carnes y vegetales.',
      imagen: 'assets/img/alergenos/soja.png',
    },
    {
      nombre: 'Pescado',
      descripcion: 'Salsa César y opciones marinas del menú.',
      imagen: 'assets/img/alergenos/pescado.png',
    },
  ];
}
