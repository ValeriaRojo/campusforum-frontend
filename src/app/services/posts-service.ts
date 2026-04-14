import { Injectable } from '@angular/core';
import { ValidatorService } from './tools/validator-service';
import { ErrorsService } from './tools/errors-service';

export interface PostForm {
  id?: number | null;
  titulo: string;
  contenido: string;
  categoriaId: number | null;
  etiquetas: string;
  estado: string;
}

export type PostErrors = Partial<Record<keyof PostForm, string>>;

@Injectable({
  providedIn: 'root',
})
export class PostsService {

  constructor(
    private validadorService: ValidatorService,
    private errorsService: ErrorsService
  ) {}

  /* =========================================================
     1) ESQUEMA (modelo base)
     ========================================================= */
  public esquemaPost(): PostForm {
    return {
      id: null,
      titulo: '',
      contenido: '',
      categoriaId: null,
      etiquetas: '',
      estado: '',
    };
  }

  /* =========================================================
     2) VALIDACIÓN (centralizada)
     ========================================================= */
  public validarPost(post: PostForm): PostErrors {
    const errors: PostErrors = {};

    if (!post.titulo?.trim()) {
      errors.titulo = 'El título es obligatorio.';
    } else if (this.validadorService.regex(post.titulo, /^\s|\s$/)) {
      errors.titulo = 'El título no puede comenzar ni terminar con espacios.';
    } else if (!this.validadorService.minLen(post.titulo, 5)) {
      errors.titulo = 'El título debe tener al menos 5 caracteres.';
    } else if (!this.validadorService.maxLen(post.titulo, 120)) {
      errors.titulo = 'El título no puede exceder los 120 caracteres.';
    }

    if (post.categoriaId === null || post.categoriaId === undefined) {
      errors.categoriaId = 'Debes seleccionar una categoría.';
    }

    if (!post.contenido?.trim()) {
      errors.contenido = 'El contenido es obligatorio.';
    } else if (this.validadorService.regex(post.contenido, /^\s|\s$/)) {
      errors.contenido = 'El contenido no puede comenzar ni terminar con espacios.';
    } else if (!this.validadorService.minLen(post.contenido, 20)) {
      errors.contenido = 'El contenido debe tener al menos 20 caracteres.';
    } else if (!this.validadorService.maxLen(post.contenido, 2500)) {
      errors.contenido = 'El contenido no puede exceder los 2500 caracteres.';
    }

if (!post.etiquetas?.trim()) {
  errors.etiquetas = 'Las etiquetas son obligatorias.';
} else if (this.validadorService.regex(post.etiquetas, /^\s|\s$/)) {
  errors.etiquetas = 'Las etiquetas no pueden comenzar ni terminar con espacios.';
} else if (!this.validadorService.maxLen(post.etiquetas, 100)) {
  errors.etiquetas = 'Las etiquetas no pueden exceder los 100 caracteres.';
}

if (!post.estado?.trim()) {
  errors.estado = 'Debes seleccionar un estado.';
} else if (
  post.estado !== 'PUBLICADO' &&
  post.estado !== 'BORRADOR' &&
  post.estado !== 'ARCHIVADO'
) {
  errors.estado = 'El estado seleccionado no es válido.';
}

    return errors;
  }
}
