import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-sobre-nosotros',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './sobre-nosotros.component.html',
  styleUrls: ['./sobre-nosotros.component.css'],
})
export class SobreNosotrosComponent {
  // Mapa por defecto (Centro)
  mapaActual: SafeResourceUrl;

  constructor(private sanitizer: DomSanitizer) {
    // Inicializamos con una ubicación por defecto
    this.mapaActual = this.sanitizer.bypassSecurityTrustResourceUrl(
      'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3103.1458857731995!2d-3.703790!3d40.416775!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xd42287e1f13b19b%3A0xc6e467d30560e90!2sMadrid!5e0!3m2!1ses!2ses!4v1700000000000',
    );
  }

  cambiarMapa(ubicacion: string) {
    let url = '';
    switch (ubicacion) {
      case 'centro':
        url = 'https://www.google.com/maps/embed?pb=...';
        break;
      case 'puerto':
        url = 'https://www.google.com/maps/embed?pb=...';
        break;
      case 'sur':
        url = 'https://www.google.com/maps/embed?pb=...';
        break;
    }
    this.mapaActual = this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }
}
