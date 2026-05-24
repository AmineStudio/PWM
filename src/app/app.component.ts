import { Component, OnInit } from '@angular/core';
import { SqliteService } from './services/sqlite.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: false
})
export class AppComponent implements OnInit {

  constructor(private sqliteService: SqliteService) {}

  async ngOnInit(): Promise<void> {
    await this.sqliteService.initDB();
  }
}