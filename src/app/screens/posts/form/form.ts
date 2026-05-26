import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SHARED_IMPORTS } from '../../../shared/shared_imports';
import { Navbar } from '../../../partials/navbar/navbar';
import { Footer } from '../../../partials/footer/footer';
import { Sidebar } from '../../../partials/sidebar/sidebar';
import { AuthService } from '../../../services/auth.service';
import {
  PostsService,
  PostForm,
  PostErrors,
  CategoryItem,
} from '../../../services/posts-service';
import { UserRole } from '../../../models/auth-user.model';

@Component({
  selector: 'app-posts-form',
  standalone: true,
  imports: [
    ...SHARED_IMPORTS,
    Navbar,
    Sidebar,
    Footer,
  ],
  templateUrl: './form.html',
  styleUrls: ['./form.scss'],
})
export class PostsForm implements OnInit {
  public drawerOpen: boolean = false;
  public isLogin: boolean = false;
  public userRole: UserRole = 'ESTUDIANTE';
  public currentUserName: string = '';

  public isEditMode: boolean = false;
  public postId: number | null = null;

  public post: PostForm;
  public errors: PostErrors = {};

  public categorias: CategoryItem[] = [];

  constructor(
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private readonly authService: AuthService,
    private readonly postsService: PostsService,
  ) {
    this.post = this.postsService.esquemaPost();
  }

  ngOnInit(): void {
    this.cargarContenidoEditor();
    this.syncAuthState();
    this.categorias = this.postsService.getCategories();

    const idParam = this.route.snapshot.paramMap.get('id');

    if (!idParam) {
      return;
    }

    this.isEditMode = true;
    this.postId = Number(idParam);

    const foundPost = this.postsService.getPostById(this.postId);

    if (!foundPost) {
      this.router.navigate(['/posts']);
      return;
    }

    this.post = {
      id: foundPost.id,
      titulo: foundPost.titulo,
      contenido: foundPost.contenido,
      categoriaId: foundPost.categoriaId,
      etiquetas: foundPost.etiquetas,
      estado: foundPost.estado,
    };
    this.cargarContenidoEditor();
  }

  public toggleSidebar(): void {
    this.drawerOpen = !this.drawerOpen;
  }

  public closeSidebar(): void {
    this.drawerOpen = false;
  }

  public goBack(): void {
    if (this.isEditMode && this.postId) {
      this.router.navigate(['/posts', this.postId]);
      return;
    }

    this.router.navigate(['/posts']);
  }

public aplicarFormato(tipo: 'bold' | 'italic' | 'list' | 'link' | 'code'): void {
  const editor = document.querySelector('.posts-form__rich-editor') as HTMLElement | null;

  if (!editor) {
    return;
  }

  editor.focus();

  if (tipo === 'bold') {
    document.execCommand('bold');
  }

  if (tipo === 'italic') {
    document.execCommand('italic');
  }

  if (tipo === 'list') {
    document.execCommand('insertUnorderedList');
  }

  if (tipo === 'link') {
    const url = prompt('Ingresa la URL del enlace');

    if (url) {
      document.execCommand('createLink', false, url);
    }
  }

  if (tipo === 'code') {
    document.execCommand('formatBlock', false, 'pre');
  }

  this.sincronizarContenidoEditor();
}

public sincronizarContenidoEditor(): void {
  const editor = document.querySelector('.posts-form__rich-editor') as HTMLElement | null;

  if (!editor) {
    return;
  }

  this.post.contenido = editor.innerHTML.trim();
  this.errors.contenido = undefined;
}

public cargarContenidoEditor(): void {
  setTimeout(() => {
    const editor = document.querySelector('.posts-form__rich-editor') as HTMLElement | null;

    if (editor) {
      editor.innerHTML = this.post.contenido || '';
    }
  });
}
  public guardar(): void {
    this.errors = this.postsService.validarPost(this.post);

    if (Object.keys(this.errors).length > 0) {
      return;
    }

    if (this.isEditMode && this.postId) {
      const result = this.postsService.updatePost(this.postId, this.post);

      if (!result.ok && result.errors) {
        this.errors = result.errors;
        return;
      }

      this.router.navigate(['/posts', this.postId]);
      return;
    }

    const result = this.postsService.createPost(this.post, this.currentUserName);

    if (!result.ok && result.errors) {
      this.errors = result.errors;
      return;
    }

    this.router.navigate(['/posts', result.postId]);
  }

  public limpiar(): void {
    this.post = this.postsService.esquemaPost();
    this.errors = {};
  }

  private syncAuthState(): void {
    this.isLogin = this.authService.isAuthenticated();
    this.userRole = this.authService.getUserRole() ?? 'ESTUDIANTE';
    this.currentUserName = this.authService.getUserName();
  }
}
