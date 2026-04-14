import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SHARED_IMPORTS } from '../../../shared/shared_imports';
import { Navbar } from '../../../partials/navbar/navbar';
import { LeftSidebar } from '../../../partials/left-sidebar/left-sidebar';
import { Footer } from '../../../partials/footer/footer';

type UserRole = 'ESTUDIANTE' | 'PROFESOR' | 'ADMINISTRADOR';
type CategoryStatus = 'ACTIVA' | 'INACTIVA';

interface CategoryItem {
  id: number;
  nombre: string;
  estado: CategoryStatus;
  totalPosts: number;
}

@Component({
  selector: 'app-categories-list',
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
export class CategoriesList implements OnInit {
  public drawerOpen = false;
  public userRole: UserRole = 'ADMINISTRADOR';

  public categories: CategoryItem[] = [
    { id: 1, nombre: 'Programación', estado: 'ACTIVA', totalPosts: 24 },
    { id: 2, nombre: 'Matemáticas', estado: 'ACTIVA', totalPosts: 16 },
    { id: 3, nombre: 'Redes', estado: 'INACTIVA', totalPosts: 9 },
    { id: 4, nombre: 'Bases de Datos', estado: 'ACTIVA', totalPosts: 12 },
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

  public goCreateCategory(): void {
    this.router.navigate(['/categories/form']);
  }

  public goEditCategory(categoryId: number): void {
    this.router.navigate(['/categories', categoryId, 'edit']);
  }

  public eliminarCategoria(category: CategoryItem): void {
    if (category.totalPosts > 0) {
      alert('No puedes eliminar una categoría con publicaciones.');
      return;
    }

    this.categories = this.categories.filter((item) => item.id !== category.id);
  }

  public get canManageCategories(): boolean {
    return (
      this.userRole === 'PROFESOR' ||
      this.userRole === 'ADMINISTRADOR'
    );
  }
}
