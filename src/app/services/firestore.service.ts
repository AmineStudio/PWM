import { Injectable } from '@angular/core';
import {
  Firestore,
  collection,
  collectionData,
  doc,
  docData
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Restaurante } from '../models/models';

@Injectable({ providedIn: 'root' })
export class FirestoreService {

  constructor(private firestore: Firestore) {}

  getRestaurantes(): Observable<Restaurante[]> {
    const ref = collection(this.firestore, 'restaurantes');
    return collectionData(ref, { idField: 'id' }) as Observable<Restaurante[]>;
  }

  getRestaurante(id: string): Observable<Restaurante> {
    const ref = doc(this.firestore, 'restaurantes', id);
    return docData(ref, { idField: 'id' }) as Observable<Restaurante>;
  }
}