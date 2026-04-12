import { Component } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { Router } from '@angular/router';

interface OpcionPedido {
  id: string;
  titulo: string;
  descripcion: string;
  clase: string;
  icono: string;
}

@Component({
  selector: 'app-tipo-pedido',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './tipo-pedido.component.html',
  styleUrls: ['./tipo-pedido.component.css'],
})
export class TipoPedidoComponent {
  public opciones: OpcionPedido[] = [
    {
      id: 'aqui',
      titulo: 'Comer aquí',
      descripcion: 'Disfruta de tu comida en nuestras instalaciones con el mejor ambiente.',
      clase: 'opcion-comer-aqui',
      icono: 'fa-utensils',
    },
    {
      id: 'llevar',
      titulo: 'Para llevar',
      descripcion: 'Pide ahora y recógelo cuando esté listo para disfrutar donde quieras.',
      clase: 'opcion-para-llevar',
      icono: 'fa-bag-shopping',
    },
    {
      id: 'domicilio',
      titulo: 'A domicilio',
      descripcion: 'Llevamos el sabor de Tahm King directo a la puerta de tu casa.',
      clase: 'opcion-domicilio',
      icono: 'fa-motorcycle',
    },
  ];

  constructor(
    private router: Router,
    private location: Location,
  ) {}

  seleccionarOpcion(id: string): void {
    sessionStorage.setItem('tipoPedido', id);
    this.router.navigate(['/productos']);
  }

  volver(): void {
    this.location.back();
  }
}
