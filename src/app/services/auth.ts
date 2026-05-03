import { Injectable } from '@angular/core';
import { initializeApp, getApps } from 'firebase/app';
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User,
  Auth,
} from 'firebase/auth';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private auth: Auth;

  usuarioActual$: Observable<User | null>;

  constructor(private router: Router) {
    const app = getApps().length ? getApps()[0] : initializeApp(environment.firebaseConfig);
    this.auth = getAuth(app);

    this.usuarioActual$ = new Observable((subscriber) => {
      return onAuthStateChanged(
        this.auth,
        (user) => subscriber.next(user),
        (err) => subscriber.error(err),
      );
    });
  }

  async login(email: string, password: string) {
    return signInWithEmailAndPassword(this.auth, email, password);
  }

  async register(email: string, password: string) {
    return createUserWithEmailAndPassword(this.auth, email, password);
  }

  async logout() {
    await signOut(this.auth);
    this.router.navigate(['/inicio']);
  }
}
