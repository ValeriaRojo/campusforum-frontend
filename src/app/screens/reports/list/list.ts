import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SHARED_IMPORTS } from '../../../shared/shared_imports';
import { Navbar } from '../../../partials/navbar/navbar';
import { LeftSidebar } from '../../../partials/left-sidebar/left-sidebar';
import { Footer } from '../../../partials/footer/footer';

type UserRole = 'ESTUDIANTE' | 'PROFESOR' | 'ADMINISTRADOR';
type ReportStatus = 'PENDIENTE' | 'APROBADO' | 'RECHAZADO';

interface ReportItem {
  id: number;
  motivo: string;
  descripcion: string;
  usuario: string;
  fecha: string;
  estado: ReportStatus;
}

@Component({
  selector: 'app-reports-list',
  standalone: true,
  imports: [
    ...SHARED_IMPORTS,
    Navbar,
    LeftSidebar,
    Footer,
  ],
  templateUrl: './list.html',
  styleUrls: ['./list.scss'],
})
export class ReportsList implements OnInit {
  public drawerOpen = false;
  public userRole: UserRole = 'ADMINISTRADOR';

  public reports: ReportItem[] = [
    {
      id: 1,
      motivo: 'Contenido inapropiado',
      descripcion: 'El post contiene lenguaje ofensivo',
      usuario: 'Juan Pérez',
      fecha: '2026-03-25',
      estado: 'PENDIENTE',
    },
    {
      id: 2,
      motivo: 'Spam',
      descripcion: 'Publicación repetida varias veces',
      usuario: 'Ana López',
      fecha: '2026-03-24',
      estado: 'APROBADO',
    },
    {
      id: 3,
      motivo: 'Información falsa',
      descripcion: 'Contenido incorrecto académicamente',
      usuario: 'Carlos Ruiz',
      fecha: '2026-03-23',
      estado: 'RECHAZADO',
    },
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

  public goToProfile(): void {
    this.router.navigate(['/profile']);
  }

  public cambiarEstado(report: ReportItem, estado: ReportStatus): void {
    report.estado = estado;
  }

public verDetalle(reportId: number): void {
  this.router.navigate(['/reports', reportId]);
}

  public get canManageReports(): boolean {
    return (
      this.userRole === 'PROFESOR' ||
      this.userRole === 'ADMINISTRADOR'
    );
  }
}
