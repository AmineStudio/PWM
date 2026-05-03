import { Component, AfterViewInit, OnInit, Inject, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser, CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import Swiper from 'swiper';
import { Navigation, Autoplay } from 'swiper/modules';
import { FirestoreService, Producto, Oferta } from '../../services/firestore.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-inicio',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.css'],
})
export class InicioComponent implements OnInit, AfterViewInit {
  private fs = inject(FirestoreService);

  productosDestacados$!: Observable<Producto[]>;
  ofertasDestacadas$!: Observable<Oferta[]>;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  ngOnInit(): void {
    this.productosDestacados$ = this.fs.getProductosDestacados();
    this.ofertasDestacadas$   = this.fs.getOfertasDestacadas();
  }

  ngAfterViewInit() {
    if (isPlatformBrowser(this.platformId)) {
      // Hero Slider
      new Swiper('#hero-slider', {
        modules: [Autoplay],
        loop: true,
        speed: 600,
        autoplay: { delay: 4000, disableOnInteraction: false },
      });

      // Productos Slider
      new Swiper('#productos-slider', {
        modules: [Navigation],
        slidesPerView: 1,
        spaceBetween: 20,
        loop: true,
        navigation: {
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev',
        },
        breakpoints: {
          640: { slidesPerView: 2 },
          1024: { slidesPerView: 4 },
        },
      });

      // Combos Slider
      new Swiper('#combos-slider', {
        modules: [Autoplay],
        loop: true,
        speed: 600,
        autoplay: { delay: 4000, reverseDirection: true },
      });
    }
  }

  actualizarGrafica(nivel: number, porcentaje: string, nombre: string, desc: string) {
    if (isPlatformBrowser(this.platformId)) {
      const barra    = document.getElementById('barra-color');
      const nombreTxt = document.getElementById('nombre-nivel');
      const descTxt  = document.getElementById('desc-nivel');
      if (barra) barra.style.width = porcentaje;
      if (nombreTxt) nombreTxt.innerText = nombre;
      if (descTxt) descTxt.innerText = desc;
    }
  }
}
