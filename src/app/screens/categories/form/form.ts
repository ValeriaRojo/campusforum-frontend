import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SHARED_IMPORTS } from '../../../shared/shared_imports';
import { Navbar } from '../../../partials/navbar/navbar';
import { LeftSidebar } from '../../../partials/left-sidebar/left-sidebar';
import { Footer } from '../../../partials/footer/footer';
import { CategoriasService } from '../../../services/categorias-service';
import { CategoriaForm } from '../../../services/categorias-service';

type UserRole = 'ESTUDIANTE' | 'PROFESOR' | 'ADMINISTRADOR';

@Component({
  selector: 'app-categories-form',
  standalone: true,
  imports: [
    ...SHARED_IMPORTS,
    Navbar,
    LeftSidebar,
    Footer,
  ],
  templateUrl: './form.html',
  styleUrls: ['./form.scss'],
})
export class CategoriesForm implements OnInit {
  public drawerOpen = false;
  public userRole: UserRole = 'ADMINISTRADOR';

  public nombre: string = '';
  public estado: string = 'ACTIVA';

  public errors: any = {};

  constructor(
    private readonly router: Router,
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

  this.cargarEsquemaCategoria();
}

  /* =========================
     UI
     ========================= */
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

  public onlyAlphanumeric(event: KeyboardEvent): void {
    const regex = /^[a-zA-Z0-9 ]$/;
    if (!regex.test(event.key) && event.key !== 'Backspace') {
      event.preventDefault();
    }
  }
  /* =========================
     Acciones
     ========================= */
  public guardarCategoria(): void {
    this.submit();
  }

  public submit(): void {
    const categoria = this.obtenerCategoriaDesdeFormulario();

    this.errors = this.categoriasService.validarCategoria(categoria);

    if (Object.keys(this.errors).length > 0) {
      return;
    }

    const payload = {
      nombre: categoria.nombre.trim(),
      estado: categoria.estado,
    };

    console.log('Categoría a enviar al backend después:', payload);

    localStorage.setItem('lastCategoryDraft', JSON.stringify(payload));
    this.router.navigate(['/categories']);
  }

  /* =========================
     Helpers
     ========================= */
  private cargarEsquemaCategoria(): void {
    const esquema = this.categoriasService.esquemaCategoria();

    this.nombre = esquema.nombre;
    this.estado = esquema.estado;
  }

  private obtenerCategoriaDesdeFormulario(): CategoriaForm {
    return {
      nombre: this.nombre,
      estado: this.estado,
    };
  }

  /* =========================
     Permisos
     ========================= */
  public get canManageCategories(): boolean {
    return (
      this.userRole === 'PROFESOR' ||
      this.userRole === 'ADMINISTRADOR'
    );
  }
}
