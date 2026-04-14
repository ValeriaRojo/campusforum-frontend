import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SHARED_IMPORTS } from '../../shared/shared_imports';
import { Navbar } from '../../partials/navbar/navbar';
import { LeftSidebar } from '../../partials/left-sidebar/left-sidebar';
import { Footer } from '../../partials/footer/footer';

type UserRole = 'ESTUDIANTE' | 'PROFESOR' | 'ADMINISTRADOR';

interface DashboardCard {
  title: string;
  value: string;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    ...SHARED_IMPORTS,
    Navbar,
    LeftSidebar,
    Footer,
  ],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.scss'],
})
export class Dashboard implements OnInit {
  public drawerOpen = false;
  public userRole: UserRole = 'ADMINISTRADOR';

  public tendenciasCards: DashboardCard[] = [
    { title: 'Categoría más comentada', value: 'Programación' },
    { title: 'Segunda tendencia', value: 'Matemáticas' },
    { title: 'Tercera tendencia', value: 'Inteligencia Artificial' },
  ];

  public publicacionesPorCategoria: DashboardCard[] = [
    { title: 'Programación', value: '24 publicaciones' },
    { title: 'Matemáticas', value: '16 publicaciones' },
    { title: 'Redes', value: '9 publicaciones' },
  ];

  public topPosters: DashboardCard[] = [
    { title: 'Ana López', value: '18 aportes' },
    { title: 'Carlos Pérez', value: '15 aportes' },
    { title: 'María Torres', value: '12 aportes' },
  ];

  constructor(private readonly router: Router) {}

  ngOnInit(): void {
    const savedRole = localStorage.getItem('userRole') as UserRole | null;

    if (
      savedRole === 'ESTUDIANTE' ||
      savedRole === 'PROFESOR' ||
      savedRole === 'ADMINISTRADOR'
    ) {
      this.userRole = savedRole;
    }
  }

  public toggleSidebar(): void {
    this.drawerOpen = !this.drawerOpen;
  }

  public closeSidebar(): void {
    this.drawerOpen = false;
  }

  public goToPosts(): void {
    this.router.navigate(['/posts']);
  }

  public goToCategories(): void {
    this.router.navigate(['/categories']);
  }

  public goToReports(): void {
    this.router.navigate(['/reports']);
  }

  public get isEstudiante(): boolean {
    return this.userRole === 'ESTUDIANTE';
  }

  public get isProfesor(): boolean {
    return this.userRole === 'PROFESOR';
  }

  public get isAdministrador(): boolean {
    return this.userRole === 'ADMINISTRADOR';
  }

  public get isProfesorOrAdmin(): boolean {
    return this.userRole === 'PROFESOR' || this.userRole === 'ADMINISTRADOR';
  }

public get canManagePost(): boolean {
  return this.userRole === 'ADMINISTRADOR'
    || this.userRole === 'PROFESOR';
}

}
