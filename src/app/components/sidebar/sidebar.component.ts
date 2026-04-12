import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css',
})
export class SidebarComponent {
  @Input() isOpen = false; // Recibe el estado del padre (AppComponent)
  @Output() closeSidebar = new EventEmitter<void>(); // Avisa al padre para cerrar

  // Esta es la función correcta que debes usar
  onClose() {
    this.closeSidebar.emit();
  }
}
