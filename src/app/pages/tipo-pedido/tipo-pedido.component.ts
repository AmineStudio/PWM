import { Component, OnInit, inject } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { Router } from '@angular/router';
import { FirestoreService, TipoPedido } from '../../services/firestore.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-tipo-pedido',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './tipo-pedido.component.html',
  styleUrls: ['./tipo-pedido.component.css'],
})
export class TipoPedidoComponent implements OnInit {
  private fs = inject(FirestoreService);
  private router = inject(Router);
  private location = inject(Location);

  tiposPedido$!: Observable<TipoPedido[]>;

  ngOnInit(): void {
    this.tiposPedido$ = this.fs.getTiposPedido();
  }

  seleccionarOpcion(id: string): void {
    sessionStorage.setItem('tipoPedido', id);
    this.router.navigate(['/carta']);
  }

  volver(): void {
    this.location.back();
  }
}
