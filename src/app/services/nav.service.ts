import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class NavService {
  isOpen = signal(false); // Estado inicial cerrado

  toggle() { this.isOpen.set(!this.isOpen()); }
  close() { this.isOpen.set(false); }
}
