import { Routes } from '@angular/router';

import { InicioComponent } from './pages/inicio/inicio.component';
import { CartaComponent } from './pages/carta/carta.component';
import { AlergenosComponent } from './pages/alergenos/alergenos.component';
import { ContactoComponent } from './pages/contacto/contacto.component';
import { HistorialComponent } from './pages/historial/historial.component';
import { TipoPedidoComponent } from './pages/tipo-pedido/tipo-pedido.component';
import { LoginComponent } from './pages/login/login.component';

export const routes: Routes = [
  { path: '', component: InicioComponent },
  { path: 'carta', component: CartaComponent },
  { path: 'alergenos', component: AlergenosComponent },
  { path: 'contacto', component: ContactoComponent },
  { path: 'historial', component: HistorialComponent },
  { path: 'tipo-pedido', component: TipoPedidoComponent },
  { path: 'login', component: LoginComponent },
  { path: '**', redirectTo: '', pathMatch: 'full' },
];
