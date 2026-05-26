import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { SHARED_IMPORTS } from '../../shared/shared_imports';
import { AuthService } from '../../services/auth.service';
import { UserRole } from '../../models/auth-user.model';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [...SHARED_IMPORTS, RouterModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss',
})
export class Navbar {
  @Input() mode: 'public' | 'private' = 'public';
  @Input() userRole: UserRole = 'ESTUDIANTE';
  @Input() isLogin = false;

  @Output() toggleSidebar = new EventEmitter<void>();

  constructor(
    private readonly router: Router,
    private readonly authService: AuthService
  ) {}

  public get isPublic(): boolean {
    return this.mode === 'public';
  }

  public get isPrivate(): boolean {
    return this.mode === 'private';
  }

  public get isModerator(): boolean {
    return this.userRole === 'PROFESOR' || this.userRole === 'ADMINISTRADOR';
  }

  public onToggleSidebar(): void {
    this.toggleSidebar.emit();
  }

  public goToInicio(): void {
    this.router.navigate(['/landing']).then(() => {
      setTimeout(() => {
        window.scrollTo({
          top: 0,
          behavior: 'smooth',
        });
      }, 80);
    });
  }

  public goToProposito(): void {
    this.router.navigate(['/landing']).then(() => {
      setTimeout(() => {
        document
          .getElementById('proposito')
          ?.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
          });
      }, 100);
    });
  }

  public goToLogin(): void {
    this.router.navigate(['/login']);
  }

  public goToRegistro(): void {
    this.router.navigate(['/registro']);
  }

  public goToProfile(): void {
    this.router.navigate(['/profile']);
  }

  public logout(): void {
    this.authService.logout();
    this.router.navigate(['/landing']);
  }
}
