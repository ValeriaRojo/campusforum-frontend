import { Injectable } from '@angular/core';
import { ValidatorService } from './tools/validator-service';

export interface CategoriaForm {
  id?: number | null;
  nombre: string;
  estado: string;
}

export type CategoriaErrors = Partial<Record<keyof CategoriaForm, string>>;

@Injectable({
  providedIn: 'root',
})
export class CategoriasService {

  constructor(
    private readonly validatorService: ValidatorService
  ) {}

  public esquemaCategoria(): CategoriaForm {
    return {
      id: null,
      nombre: '',
      estado: 'ACTIVA',
    };
  }

  public validarCategoria(categoria: CategoriaForm): CategoriaErrors {
    const errors: CategoriaErrors = {};

    const nombre = categoria.nombre?.trim() ?? '';
    const estado = categoria.estado?.trim() ?? '';

    if (!nombre) {
      errors.nombre = 'El nombre de la categoría es obligatorio.';
    } else if (this.validatorService.regex(nombre, /^\s|\s$/)) {
      errors.nombre = 'El nombre no puede comenzar ni terminar con espacios.';
    } else if (!this.validatorService.minLen(nombre, 3)) {
      errors.nombre = 'El nombre debe tener al menos 3 caracteres.';
    } else if (!this.validatorService.maxLen(nombre, 30)) {
      errors.nombre = 'El nombre no puede exceder los 30 caracteres.';
    }

    if (!estado) {
      errors.estado = 'Debes seleccionar un estado.';
    }

    return errors;
  }
}
