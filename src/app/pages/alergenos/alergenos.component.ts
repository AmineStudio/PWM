import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FirestoreService, Alergeno } from '../../services/firestore.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-alergenos',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './alergenos.component.html',
  styleUrls: ['./alergenos.component.css'],
})
export class AlergenosComponent implements OnInit {
  private fs = inject(FirestoreService);
  alergenos$!: Observable<Alergeno[]>;

  ngOnInit(): void {
    this.alergenos$ = this.fs.getAlergenos();
  }
}
