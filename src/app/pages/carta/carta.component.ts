import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FirestoreService, Categoria, Producto } from '../../services/firestore.service';
import { CarritoService } from '../../services/carrito.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-carta',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './carta.component.html',
  styleUrl: './carta.component.css',
})
export class CartaComponent implements OnInit {
  private fs = inject(FirestoreService);
  private router = inject(Router);
  carrito = inject(CarritoService);

  categorias$!: Observable<Categoria[]>;
  productos$!: Observable<Producto[]>;
  categoriaActivaId: number | null = null;
  productosFiltrados$!: Observable<Producto[]>;
  agregados = new Set<number>();

  ngOnInit(): void {
    this.categorias$ = this.fs.getCategorias();
    this.productos$ = this.fs.getProductos();
    this.productosFiltrados$ = this.productos$.pipe(
      map((prods) => prods.filter((p) => p.disponible))
    );
  }

  filtrarPorCategoria(categoriaId: number | null): void {
    this.categoriaActivaId = categoriaId;
    if (categoriaId === null) {
      this.productosFiltrados$ = this.productos$.pipe(
        map((prods) => prods.filter((p) => p.disponible))
      );
    } else {
      this.productosFiltrados$ = this.fs.getProductosPorCategoria(categoriaId);
    }
  }

  agregarAlCarrito(producto: Producto): void {
    this.carrito.agregar(producto);
    this.agregados.add(producto.id);
    setTimeout(() => this.agregados.delete(producto.id), 800);
  }

  cantidadEnCarrito(productoId: number): number {
    return this.carrito.items().find((i) => i.producto.id === productoId)?.cantidad ?? 0;
  }

  irAlCarrito(): void {
    this.router.navigate(['/carrito']);
  }
}
