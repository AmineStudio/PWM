import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NavService } from '../../services/nav.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink], // Necesario para que funcione el routerLink
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  // Conectamos el componente con el servicio que controla el sidebar
  nav = inject(NavService);
}
