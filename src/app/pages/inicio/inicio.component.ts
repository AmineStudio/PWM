import { Component, AfterViewInit, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser, CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import Swiper from 'swiper';
import { Navigation, Autoplay } from 'swiper/modules';

@Component({
  selector: 'app-inicio',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.css'],
})
export class InicioComponent implements AfterViewInit {
  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  ngAfterViewInit() {
    if (isPlatformBrowser(this.platformId)) {
      // Hero Slider (Fila 1)
      new Swiper('#hero-slider', {
        modules: [Autoplay],
        loop: true,
        speed: 600,
        autoplay: { delay: 4000, disableOnInteraction: false },
      });

      // Productos Slider con FLECHAS (Fila 2)
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

      // Combos Slider (Fila 3)
      new Swiper('#combos-slider', {
        modules: [Autoplay],
        loop: true,
        speed: 600,
        autoplay: { delay: 4000, reverseDirection: true },
      });
    }
  }

  // Tu lógica de la gráfica adaptada a Angular
  actualizarGrafica(nivel: number, porcentaje: string, nombre: string, desc: string) {
    if (isPlatformBrowser(this.platformId)) {
      const barra = document.getElementById('barra-color');
      const nombreTxt = document.getElementById('nombre-nivel');
      const descTxt = document.getElementById('desc-nivel');

      if (barra) barra.style.width = porcentaje;
      if (nombreTxt) nombreTxt.innerText = nombre;
      if (descTxt) descTxt.innerText = desc;
    }
  }
}
