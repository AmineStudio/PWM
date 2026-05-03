import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FirestoreService, Pedido } from '../../services/firestore.service';
import { AuthService } from '../../services/auth';
import { Observable, switchMap, of } from 'rxjs';

@Component({
  selector: 'app-historial',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './historial.component.html',
  styleUrls: ['./historial.component.css'],
})
export class HistorialComponent implements OnInit {
  private fs = inject(FirestoreService);
  auth = inject(AuthService);

  pedidos$!: Observable<Pedido[]>;
  usuarioDatos$!: Observable<any>;
  pedidoDetalle: Pedido | null = null;

  ngOnInit(): void {
    this.usuarioDatos$ = this.auth.usuarioActual$.pipe(
      switchMap((user) => (user ? this.fs.getUsuario(user.uid) : of(null))),
    );

    this.pedidos$ = this.auth.usuarioActual$.pipe(
      switchMap((user) => (user ? this.fs.getPedidosPorUsuario(user.uid) : of([]))),
    );
  }

  verDetalle(pedido: Pedido): void {
    this.pedidoDetalle =
      (this.pedidoDetalle as any)?.docId === (pedido as any).docId ? null : pedido;
  }

  cerrarDetalle(): void {
    this.pedidoDetalle = null;
  }

  getClaseEstado(estado: string): string {
    const clases: Record<string, string> = {
      pendiente: 'estado-pendiente',
      'en preparación': 'estado-preparacion',
      listo: 'estado-listo',
      entregado: 'estado-entregado',
      cancelado: 'estado-cancelado',
    };
    return clases[estado] ?? '';
  }
}
