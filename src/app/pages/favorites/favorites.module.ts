import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { RouterModule, Routes } from '@angular/router';
import { FavoritesPage } from './favorites.page';

const routes: Routes = [{ path: '', component: FavoritesPage }];

@NgModule({
  imports: [CommonModule, IonicModule, RouterModule.forChild(routes)],
  declarations: [FavoritesPage]
})
export class FavoritesPageModule {}