import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SHARED_IMPORTS } from '../../../shared/shared_imports';
import { Navbar } from '../../../partials/navbar/navbar';
import { LeftSidebar } from '../../../partials/left-sidebar/left-sidebar';
import { Footer } from '../../../partials/footer/footer';

type UserRole = 'ESTUDIANTE' | 'PROFESOR' | 'ADMINISTRADOR';

interface PostItem {
  id: number;
  titulo: string;
  contenido: string;
  categoria: string;
  autor: string;
  fecha: string;
  comentarios: number;
}

@Component({
  selector: 'app-posts-list',
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
export class PostsList implements OnInit {
  public drawerOpen = false;
  public userRole: UserRole = 'ESTUDIANTE';

  public currentUserName: string = '';

  public search: string = '';
  public selectedCategory: string = 'TODAS';

  public categories: string[] = [
    'TODAS',
    'Programación',
    'Matemáticas',
    'Inteligencia Artificial',
    'Bases de Datos',
    'Redes',
  ];

  public posts: PostItem[] = [
    {
      id: 1,
      titulo: '¿Cómo empezar con Angular?',
      contenido: 'Quiero conocer una ruta clara para comenzar a trabajar con Angular desde cero.',
      categoria: 'Programación',
      autor: 'Ana López',
      fecha: '22/03/2026',
      comentarios: 14,
    },
    {
      id: 2,
      titulo: 'Dudas sobre normalización en bases de datos',
      contenido: 'Tengo dudas con primera, segunda y tercera forma normal para un proyecto escolar.',
      categoria: 'Bases de Datos',
      autor: 'Carlos Pérez',
      fecha: '21/03/2026',
      comentarios: 8,
    },
    {
      id: 3,
      titulo: 'Recursos para aprender redes',
      contenido: 'Compartan libros, videos o prácticas para entender mejor subnetting y VLANs.',
      categoria: 'Redes',
      autor: 'María Torres',
      fecha: '20/03/2026',
      comentarios: 11,
    },
    {
      id: 4,
      titulo: 'Aplicaciones de IA en educación',
      contenido: 'Me interesa debatir cómo se puede usar la inteligencia artificial en contextos académicos.',
      categoria: 'Inteligencia Artificial',
      autor: 'Luis Ramírez',
      fecha: '19/03/2026',
      comentarios: 17,
    },
  ];

  constructor(private readonly router: Router) {}

  ngOnInit(): void {
    const savedRole = localStorage.getItem('userRole') as UserRole | null;
    const savedUserName = localStorage.getItem('userName');

    if (
      savedRole === 'ESTUDIANTE' ||
      savedRole === 'PROFESOR' ||
      savedRole === 'ADMINISTRADOR'
    ) {
      this.userRole = savedRole;
    }

    this.currentUserName = savedUserName ? savedUserName.trim() : '';
  }

  public toggleSidebar(): void {
    this.drawerOpen = !this.drawerOpen;
  }

  public closeSidebar(): void {
    this.drawerOpen = false;
  }

  public goCreatePost(): void {
    this.router.navigate(['/posts/create']);
  }

  public goPostDetail(postId: number): void {
    this.router.navigate(['/posts', postId]);
  }

  public goEditPost(postId: number): void {
    this.router.navigate(['/posts', postId, 'edit']);
  }

  public reportarPost(postId: number): void {
    this.router.navigate(['/reports/create'], {
      queryParams: {
        type: 'post',
        referenciaId: postId,
        postId,
      },
    });
  }

  public isOwner(post: PostItem): boolean {
    if (!this.currentUserName.trim()) {
      return false;
    }

    return post.autor.trim().toLowerCase() === this.currentUserName.trim().toLowerCase();
  }

  public canEditPost(post: PostItem): boolean {
    return this.canManagePosts || this.isOwner(post);
  }

  public get filteredPosts(): PostItem[] {
    return this.posts.filter((post) => {
      const text = this.search.toLowerCase();

      const matchesSearch =
        post.titulo.toLowerCase().includes(text) ||
        post.contenido.toLowerCase().includes(text) ||
        post.autor.toLowerCase().includes(text);

      const matchesCategory =
        this.selectedCategory === 'TODAS' ||
        post.categoria === this.selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }

  public get canManagePosts(): boolean {
    return this.userRole === 'PROFESOR' || this.userRole === 'ADMINISTRADOR';
  }

  public get canCreatePost(): boolean {
    return true;
  }

  public get canReportPosts(): boolean {
    return true;
  }
}
