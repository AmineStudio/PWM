import { Injectable } from '@angular/core';
import { initializeApp, getApps } from 'firebase/app';
import {
  getFirestore,
  collection,
  doc,
  query,
  where,
  addDoc,
  updateDoc,
  serverTimestamp,
  setDoc,
  onSnapshot,
  Firestore,
} from 'firebase/firestore';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Categoria {
  id: number;
  nombre: string;
  slug: string;
  orden: number;
}
export interface Producto {
  id: number;
  nombre: string;
  descripcion: string;
  precio: number;
  categoria_id: number;
  alergenos: string[];
  imagen: string;
  disponible: boolean;
  destacado: boolean;
  puntos_requeridos: number;
}
export interface Oferta {
  id: number;
  titulo: string;
  descripcion: string;
  precio: number;
  categoria_id: number;
  productos_incluidos: number[];
  imagen: string;
  destacada: boolean;
  puntos_requeridos: number;
}
export interface Alergeno {
  id: string;
  nombre: string;
  descripcion: string;
  icono: string;
}
export interface TipoPedido {
  id: string;
  texto: string;
  descripcion: string;
  imagen: string;
  icono: string;
}
export interface Ubicacion {
  id: string;
  nombre: string;
  direccion: string;
  telefono: string;
  mapa_embed: string;
}
export interface ItemPedido {
  producto_id: number;
  cantidad: number;
  precio_unitario: number;
}
export interface Pedido {
  id?: number;
  usuario_id: any;
  fecha: string;
  estado: 'pendiente' | 'en preparación' | 'listo' | 'entregado' | 'cancelado';
  total: number;
  productos: ItemPedido[];
  tipo_pedido?: string;
  createdAt?: any;
}
export interface MensajeContacto {
  tipo: string;
  nombre: string;
  email: string;
  mensaje: string;
  createdAt?: any;
}

@Injectable({ providedIn: 'root' })
export class FirestoreService {
  private db: Firestore;

  constructor() {
    const app = getApps().length ? getApps()[0] : initializeApp(environment.firebaseConfig);
    this.db = getFirestore(app);
  }

  private coleccion<T>(nombre: string): Observable<T[]> {
    return new Observable((subscriber) => {
      const ref = collection(this.db, nombre);
      return onSnapshot(
        ref,
        (snap) => subscriber.next(snap.docs.map((d) => ({ ...d.data(), docId: d.id })) as T[]),
        (err) => subscriber.error(err),
      );
    });
  }

  private coleccionFiltrada<T>(nombre: string, ...condiciones: any[]): Observable<T[]> {
    return new Observable((subscriber) => {
      const ref = query(collection(this.db, nombre), ...condiciones);
      return onSnapshot(
        ref,
        (snap) => subscriber.next(snap.docs.map((d) => ({ ...d.data(), docId: d.id })) as T[]),
        (err) => subscriber.error(err),
      );
    });
  }

  private documento<T>(ruta: string): Observable<T> {
    return new Observable((subscriber) => {
      const ref = doc(this.db, ruta);
      return onSnapshot(
        ref,
        (snap) => subscriber.next({ ...snap.data(), docId: snap.id } as T),
        (err) => subscriber.error(err),
      );
    });
  }

  getCategorias() {
    return this.coleccion<Categoria>('categorias');
  }
  getProductos() {
    return this.coleccion<Producto>('productos');
  }
  getOfertas() {
    return this.coleccion<Oferta>('ofertas');
  }
  getAlergenos() {
    return this.coleccion<Alergeno>('alergenos');
  }
  getTiposPedido() {
    return this.coleccion<TipoPedido>('tipos_pedido');
  }
  getUbicaciones() {
    return this.coleccion<Ubicacion>('ubicaciones');
  }
  getTodosPedidos() {
    return this.coleccion<Pedido>('pedidos');
  }
  getUbicacion(id: string) {
    return this.documento<Ubicacion>(`ubicaciones/${id}`);
  }
  getUsuario(uid: string) {
    return this.documento<any>(`usuarios/${uid}`);
  }

  getProductosPorCategoria(categoriaId: number) {
    return this.coleccionFiltrada<Producto>(
      'productos',
      where('categoria_id', '==', categoriaId),
      where('disponible', '==', true),
    );
  }

  getProductosDestacados() {
    return this.coleccionFiltrada<Producto>(
      'productos',
      where('destacado', '==', true),
      where('disponible', '==', true),
    );
  }

  getOfertasDestacadas() {
    return this.coleccionFiltrada<Oferta>('ofertas', where('destacada', '==', true));
  }

  getPedidosPorUsuario(usuarioId: any) {
    return this.coleccionFiltrada<Pedido>('pedidos', where('usuario_id', '==', usuarioId));
  }

  async crearPedido(pedido: Omit<Pedido, 'id'>): Promise<void> {
    await addDoc(collection(this.db, 'pedidos'), { ...pedido, createdAt: serverTimestamp() });
  }

  async actualizarEstadoPedido(docId: string, estado: Pedido['estado']): Promise<void> {
    await updateDoc(doc(this.db, `pedidos/${docId}`), { estado });
  }

  async enviarMensajeContacto(mensaje: MensajeContacto): Promise<void> {
    await addDoc(collection(this.db, 'mensajes_contacto'), {
      ...mensaje,
      createdAt: serverTimestamp(),
    });
  }

  async crearUsuario(uid: string, datos: any): Promise<void> {
    await setDoc(
      doc(this.db, `usuarios/${uid}`),
      { ...datos, puntos: 0, pedidos: [] },
      { merge: true },
    );
  }
}
