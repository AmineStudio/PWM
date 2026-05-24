import { Injectable } from '@angular/core';
import {
  Auth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  user,
  User
} from '@angular/fire/auth';
import {
  Firestore,
  doc,
  setDoc,
  getDoc
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { UserProfile } from '../models/models';

@Injectable({ providedIn: 'root' })
export class AuthService {

  currentUser$!: Observable<User | null>;

constructor(private auth: Auth, private firestore: Firestore) {
  this.currentUser$ = user(this.auth);
}
  async register(
    email: string,
    password: string,
    nombre: string,
    apellidos: string,
    fotoUrl: string
  ): Promise<void> {
    const credential = await createUserWithEmailAndPassword(this.auth, email, password);
    const uid = credential.user.uid;
    const perfil: UserProfile = { uid, email, nombre, apellidos, fotoUrl };
    await setDoc(doc(this.firestore, 'usuarios', uid), perfil);
  }

  async login(email: string, password: string): Promise<void> {
    await signInWithEmailAndPassword(this.auth, email, password);
  }

  async logout(): Promise<void> {
    await signOut(this.auth);
  }

  async getUserProfile(uid: string): Promise<UserProfile | null> {
    const snap = await getDoc(doc(this.firestore, 'usuarios', uid));
    return snap.exists() ? (snap.data() as UserProfile) : null;
  }

  getCurrentUid(): string | null {
    return this.auth.currentUser?.uid ?? null;
  }
}