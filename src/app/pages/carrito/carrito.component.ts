import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { CarritoService } from '../../services/carrito.service';
import { FirestoreService } from '../../services/firestore.service';
import { AuthService } from '../../services/auth';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-carrito',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './carrito.component.html',
  styleUrls: ['./carrito.component.css'],
})
export class CarritoComponent {
  carrito = inject(CarritoService);
  private fs = inject(FirestoreService);
  private auth = inject(AuthService);
  private router = inject(Router);

  tipoPedido = sessionStorage.getItem('tipoPedido') ?? 'aqui';
  enviando = false;
  confirmado = false;

  async confirmarPedido(): Promise<void> {
    if (this.carrito.items().length === 0) return;
    this.enviando = true;

    try {
      // Obtener el usuario actual de forma segura
      const user = await firstValueFrom(this.auth.usuarioActual$);
      const usuarioId = user?.uid ?? 'anonimo';

      await this.fs.crearPedido({
        usuario_id: usuarioId,
        fecha: new Date().toLocaleDateString('es-ES'),
        estado: 'pendiente',
        total: this.carrito.total(),
        tipo_pedido: this.tipoPedido,
        productos: this.carrito.items().map((i) => ({
          producto_id: i.producto.id,
          cantidad: i.cantidad,
          precio_unitario: i.producto.precio,
        })),
      });

      this.confirmado = true;
      this.carrito.vaciar();
      setTimeout(() => this.router.navigate(['/historial']), 2500);
    } catch (e) {
      console.error(e);
    } finally {
      this.enviando = false;
    }
  }
}
