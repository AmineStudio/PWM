import { Injectable, signal, computed } from '@angular/core';
import { Producto } from './firestore.service';

export interface ItemCarrito {
  producto: Producto;
  cantidad: number;
}

@Injectable({ providedIn: 'root' })
export class CarritoService {
  private _items = signal<ItemCarrito[]>([]);

  items = this._items.asReadonly();

  total = computed(() => this._items().reduce((acc, i) => acc + i.producto.precio * i.cantidad, 0));

  totalItems = computed(() => this._items().reduce((acc, i) => acc + i.cantidad, 0));

  agregar(producto: Producto): void {
    this._items.update((items) => {
      const idx = items.findIndex((i) => i.producto.id === producto.id);
      if (idx >= 0) {
        const copia = [...items];
        copia[idx] = { ...copia[idx], cantidad: copia[idx].cantidad + 1 };
        return copia;
      }
      return [...items, { producto, cantidad: 1 }];
    });
  }

  restar(productoId: number): void {
    this._items.update((items) => {
      const idx = items.findIndex((i) => i.producto.id === productoId);
      if (idx < 0) return items;
      const copia = [...items];
      if (copia[idx].cantidad <= 1) {
        copia.splice(idx, 1);
      } else {
        copia[idx] = { ...copia[idx], cantidad: copia[idx].cantidad - 1 };
      }
      return copia;
    });
  }

  eliminar(productoId: number): void {
    this._items.update((items) => items.filter((i) => i.producto.id !== productoId));
  }

  vaciar(): void {
    this._items.set([]);
  }
}
