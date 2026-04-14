import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Router } from '@angular/router';
import { SHARED_IMPORTS } from '../../shared/shared_imports';

type UserRole = 'ESTUDIANTE' | 'PROFESOR' | 'ADMINISTRADOR';
type NavbarMode = 'public' | 'private';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    ...SHARED_IMPORTS,
  ],
  templateUrl: './navbar.html',
  styleUrls: ['./navbar.scss'],
})
export class Navbar {
  @Input() mode: NavbarMode = 'public';
  @Input() userRole: UserRole = 'ESTUDIANTE';

  @Output() toggleSidebar = new EventEmitter<void>();

  constructor(private readonly router: Router) {}

  public onToggleSidebar(): void {
    this.toggleSidebar.emit();
  }

  public logout(): void {
    localStorage.removeItem('userRole');
    this.router.navigate(['/auth/login']);
  }

  public goToInicio(): void {
    this.router.navigateByUrl('/');
  }

  public goToRegistro(): void {
    this.router.navigate(['/auth/registro']);
  }

  public goToLogin(): void {
    this.router.navigate(['/auth/login']);
  }

  public goToProposito(): void {
    this.router.navigate(['/'], { fragment: 'proposito' });
  }

  public goToProfile(): void {
    this.router.navigate(['/profile']);
  }

  public get isPublic(): boolean {
    return this.mode === 'public';
  }

  public get isPrivate(): boolean {
    return this.mode === 'private';
  }

  public get isProfesorOrAdmin(): boolean {
    return this.userRole === 'PROFESOR' || this.userRole === 'ADMINISTRADOR';
  }

  public get isAdministrador(): boolean {
    return this.userRole === 'ADMINISTRADOR';
  }
}
