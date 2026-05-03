import { Component, inject, signal, HostListener } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NavService } from '../../services/nav.service';
import { AuthService } from '../../services/auth';
import { FirestoreService } from '../../services/firestore.service';
import { switchMap, of } from 'rxjs';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, CommonModule, AsyncPipe],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent {
  nav = inject(NavService);
  auth = inject(AuthService);
  private fs = inject(FirestoreService);
  private router = inject(Router);

  menuUsuarioAbierto = signal(false);

  // Datos del usuario desde Firestore
  usuarioDatos$ = this.auth.usuarioActual$.pipe(
    switchMap((user) => (user ? this.fs.getUsuario(user.uid) : of(null))),
  );

  toggleMenuUsuario(): void {
    this.menuUsuarioAbierto.update((v) => !v);
  }

  irALogin(): void {
    this.router.navigate(['/login']);
  }

  irAHistorial(): void {
    this.menuUsuarioAbierto.set(false);
    this.router.navigate(['/historial']);
  }

  async logout(): Promise<void> {
    this.menuUsuarioAbierto.set(false);
    await this.auth.logout();
  }

  // Cerrar menú al hacer click fuera
  @HostListener('document:click', ['$event'])
  onClickFuera(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    if (!target.closest('.usuario-wrap')) {
      this.menuUsuarioAbierto.set(false);
    }
  }
}
