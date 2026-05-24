import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { FirestoreService } from '../../services/firestore.service';
import { SqliteService } from '../../services/sqlite.service';
import { Restaurante } from '../../models/models';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.page.html',
  styleUrls: ['./detail.page.scss'],
  standalone: false
})
export class DetailPage implements OnInit {

  restaurante: Restaurante | null = null;
  esFavorito = false;
  isLoading = true;

  constructor(
    private route: ActivatedRoute,
    private firestoreService: FirestoreService,
    private sqliteService: SqliteService,
    private toastCtrl: ToastController
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id')!;
    this.loadRestaurante(id);
  }

  loadRestaurante(id: string): void {
    this.firestoreService.getRestaurante(id).subscribe(async (data) => {
      this.restaurante = data;
      this.esFavorito = await this.sqliteService.isFavorito(id);
      this.isLoading = false;
    });
  }

  async toggleFavorito(): Promise<void> {
    if (!this.restaurante) return;
    this.esFavorito = await this.sqliteService.toggleFavorito(this.restaurante.id);
    const toast = await this.toastCtrl.create({
      message: this.esFavorito
        ? `"${this.restaurante.nombre}" añadido a favoritos ⭐`
        : `"${this.restaurante.nombre}" eliminado de favoritos`,
      duration: 2000,
      position: 'bottom',
      color: this.esFavorito ? 'warning' : 'medium'
    });
    await toast.present();
  }
}