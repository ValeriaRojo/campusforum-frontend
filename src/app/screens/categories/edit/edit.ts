import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SHARED_IMPORTS } from '../../../shared/shared_imports';
import { Navbar } from '../../../partials/navbar/navbar';
import { LeftSidebar } from '../../../partials/left-sidebar/left-sidebar';
import { Footer } from '../../../partials/footer/footer';
import { CategoriasService, CategoriaForm, CategoriaErrors } from '../../../services/categorias-service'; 

type UserRole = 'ESTUDIANTE' | 'PROFESOR' | 'ADMINISTRADOR';

@Component({
  selector: 'app-categories-edit',
  standalone: true,
  imports: [
    ...SHARED_IMPORTS,
    Navbar,
    LeftSidebar,
    Footer,
  ],
  templateUrl: './edit.html',
  styleUrls: ['./edit.scss'],
})
export class CategoriesEdit implements OnInit {

  public drawerOpen = false;
  public userRole: UserRole = 'ADMINISTRADOR';

  public categoria: any = {};
  public errors: any = {};
  public categoryId: number | null = null;

  constructor(
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private readonly categoriasService: CategoriasService
  ) {}

  ngOnInit(): void {
    const savedRole = localStorage.getItem('userRole') as UserRole | null;

    if (
      savedRole === 'ESTUDIANTE' ||
      savedRole === 'PROFESOR' ||
      savedRole === 'ADMINISTRADOR'
    ) {
      this.userRole = savedRole;
    }

    if (!this.canManageCategories) {
      this.router.navigate(['/categories']);
      return;
    }

    this.categoria = this.categoriasService.esquemaCategoria();

    const idParam = this.route.snapshot.paramMap.get('id');
    this.categoryId = idParam ? Number(idParam) : null;

    this.cargarCategoria();
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

  public goBack(): void {
    this.router.navigate(['/categories']);
  }

  public guardarCambios(): void {
    this.submit();
  }

  public submit(): void {
    this.errors = this.categoriasService.validarCategoria(this.categoria);

    if (Object.keys(this.errors).length > 0) return;

    const payload = {
      id: this.categoryId,
      nombre: this.categoria.nombre.trim(),
      estado: this.categoria.estado,
    };

    console.log('Categoría editada a enviar al backend después:', payload);

    localStorage.setItem('lastEditedCategoryDraft', JSON.stringify(payload));
    this.router.navigate(['/categories']);
  }

  private cargarCategoria(): void {
    const mockCategorias = [
      { id: 1, nombre: 'General', estado: 'ACTIVA' },
      { id: 2, nombre: 'Avisos', estado: 'ACTIVA' },
      { id: 3, nombre: 'Académico', estado: 'INACTIVA' },
    ];

    const encontrada = mockCategorias.find(item => item.id === this.categoryId);

    if (!encontrada) {
      this.router.navigate(['/categories']);
      return;
    }

    this.categoria = {
      id: encontrada.id,
      nombre: encontrada.nombre,
      estado: encontrada.estado,
    };
  }

  public get canManageCategories(): boolean {
    return (
      this.userRole === 'PROFESOR' ||
      this.userRole === 'ADMINISTRADOR'
    );
  }
}
