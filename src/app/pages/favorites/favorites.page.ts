import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FirestoreService } from '../../services/firestore.service';
import { SqliteService } from '../../services/sqlite.service';
import { AuthService } from '../../services/auth.service';
import { Restaurante } from '../../models/models';

@Component({
  selector: 'app-favorites',
  templateUrl: './favorites.page.html',
  styleUrls: ['./favorites.page.scss'],
  standalone: false
})
export class FavoritesPage implements OnInit {

  restaurantes: Restaurante[] = [];
  favoritosIds: Set<string> = new Set();
  isLoading = true;

  constructor(
    private firestoreService: FirestoreService,
    private sqliteService: SqliteService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  ionViewWillEnter(): void {
    this.loadFavoritos();
  }

  async loadData(): Promise<void> {
    this.isLoading = true;
    this.firestoreService.getRestaurantes().subscribe(async (data) => {
      this.restaurantes = data;
      await this.loadFavoritos();
      this.isLoading = false;
    });
  }

  async loadFavoritos(): Promise<void> {
    const ids = await this.sqliteService.getFavoritosIds();
    this.favoritosIds = new Set(ids);
  }

  isFavorito(id: string): boolean {
    return this.favoritosIds.has(id);
  }

  goToDetail(restaurante: Restaurante): void {
    this.router.navigate(['/detail', restaurante.id]);
  }

  async logout(): Promise<void> {
    await this.authService.logout();
    this.router.navigate(['/login']);
  }
}