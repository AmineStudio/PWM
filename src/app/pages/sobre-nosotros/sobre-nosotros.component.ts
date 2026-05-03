import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { FirestoreService, Ubicacion } from '../../services/firestore.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-sobre-nosotros',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './sobre-nosotros.component.html',
  styleUrls: ['./sobre-nosotros.component.css'],
})
export class SobreNosotrosComponent implements OnInit {
  private fs = inject(FirestoreService);
  private sanitizer = inject(DomSanitizer);

  ubicaciones$!: Observable<Ubicacion[]>;
  ubicacionActiva: Ubicacion | null = null;
  mapaActual: SafeResourceUrl | null = null;

  ngOnInit(): void {
    this.ubicaciones$ = this.fs.getUbicaciones();

    // Cargar la primera ubicación por defecto
    this.fs.getUbicacion('centro').subscribe(ub => {
      if (ub && !this.ubicacionActiva) {
        this.seleccionarUbicacion(ub);
      }
    });
  }

  seleccionarUbicacion(ubicacion: Ubicacion): void {
    this.ubicacionActiva = ubicacion;
    this.mapaActual = this.sanitizer.bypassSecurityTrustResourceUrl(ubicacion.mapa_embed);
  }
}
