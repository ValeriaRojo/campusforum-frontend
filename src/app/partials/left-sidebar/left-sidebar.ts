import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { Router } from '@angular/router';
import { SHARED_IMPORTS } from '../../shared/shared_imports';

type UserRole = 'ESTUDIANTE' | 'PROFESOR' | 'ADMINISTRADOR';

@Component({
  selector: 'app-left-sidebar',
  standalone: true,
  imports: [...SHARED_IMPORTS],
  templateUrl: './left-sidebar.html',
  styleUrls: ['./left-sidebar.scss'],
})
export class LeftSidebar {
  private readonly router = inject(Router);

  @Input() userRole: UserRole = 'ESTUDIANTE';
  @Output() closeSidebar = new EventEmitter<void>();

  public close(): void {
    this.closeSidebar.emit();
  }

  public goTo(route: string): void {
    this.router.navigate([route]).then(() => {
      this.close();
    });
  }

  public logout(): void {
    localStorage.removeItem('userRole');
    localStorage.removeItem('userEmail');

    this.router.navigate(['/auth/login']).then(() => {
      this.close();
    });
  }

  private get effectiveUserRole(): UserRole {
    if (this.userRole === 'PROFESOR' || this.userRole === 'ADMINISTRADOR') {
      return this.userRole;
    }

    const savedRole = localStorage.getItem('userRole') as UserRole | null;

    if (
      savedRole === 'ESTUDIANTE' ||
      savedRole === 'PROFESOR' ||
      savedRole === 'ADMINISTRADOR'
    ) {
      return savedRole;
    }

    return 'ADMINISTRADOR';
  }

  public get isProfesor(): boolean {
    return this.effectiveUserRole === 'PROFESOR';
  }

  public get isAdministrador(): boolean {
    return this.effectiveUserRole === 'ADMINISTRADOR';
  }

  public get isProfesorOrAdmin(): boolean {
    return (
      this.effectiveUserRole === 'PROFESOR' ||
      this.effectiveUserRole === 'ADMINISTRADOR'
    );
  }

  public get canSeeCategories(): boolean {
    return this.isProfesorOrAdmin;
  }

  public get canSeeReports(): boolean {
    return this.isProfesorOrAdmin;
  }
}
