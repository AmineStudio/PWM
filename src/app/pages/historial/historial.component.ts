import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Pedido {
  id: number;
  fecha: string;
  total: number;
  estado: 'pendiente' | 'entregado' | 'cancelado';
  items: number;
}

@Component({
  selector: 'app-historial',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './historial.component.html',
  styleUrls: ['./historial.component.css'],
})
export class HistorialComponent implements OnInit {
  public pedidos: Pedido[] = [];

  ngOnInit(): void {
    // Simulamos la carga de datos (esto podría venir de localStorage o un servicio)
    this.pedidos = [
      { id: 1024, fecha: '12/04/2026', total: 24.5, estado: 'entregado', items: 3 },
      { id: 1025, fecha: '13/04/2026', total: 15.9, estado: 'pendiente', items: 1 },
      { id: 1026, fecha: '10/04/2026', total: 42.1, estado: 'cancelado', items: 5 },
      { id: 1027, fecha: '08/04/2026', total: 12.0, estado: 'entregado', items: 2 },
    ];
  }

  verDetalle(id: number): void {
    console.log('Mostrando detalle del pedido:', id);
    // Aquí podrías navegar a una página de detalle o abrir un modal
  }
}
