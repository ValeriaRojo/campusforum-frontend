import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SHARED_IMPORTS } from '../../../shared/shared_imports';
import { Navbar } from '../../../partials/navbar/navbar';
import { LeftSidebar } from '../../../partials/left-sidebar/left-sidebar';
import { Footer } from '../../../partials/footer/footer';

type UserRole = 'ESTUDIANTE' | 'PROFESOR' | 'ADMINISTRADOR';
type PostStatus = 'PUBLICADO' | 'BORRADOR' | 'ARCHIVADO';

interface CategoryItem {
  id: number;
  nombre: string;
}

interface CommentItem {
  id: number;
  autor: string;
  contenido: string;
  fecha: string;
}

interface PostItem {
  id: number;
  titulo: string;
  contenido: string;
  categoriaId: number;
  etiquetas: string;
  estado: PostStatus;
  autor: string;
  fecha: string;
  comentarios: CommentItem[];
}

@Component({
  selector: 'app-posts-detail',
  standalone: true,
  imports: [
    ...SHARED_IMPORTS,
    Navbar,
    LeftSidebar,
    Footer,
  ],
  templateUrl: './detail.html',
  styleUrls: ['./detail.scss'],
})
export class PostsDetail implements OnInit {
  public drawerOpen = false;
  public userRole: UserRole = 'ADMINISTRADOR';
  public currentUserName: string = '';

  public postId: number = 0;
  public post: PostItem | null = null;
  public categoriaNombre: string = '';

  public categories: CategoryItem[] = [
    { id: 1, nombre: 'Programación' },
    { id: 2, nombre: 'Matemáticas' },
    { id: 3, nombre: 'Inteligencia Artificial' },
    { id: 4, nombre: 'Bases de Datos' },
    { id: 5, nombre: 'Redes' },
  ];

  public posts: PostItem[] = [
    {
      id: 1,
      titulo: '¿Cómo empezar con Angular?',
      contenido:
        'Quiero conocer una ruta clara para comenzar a trabajar con Angular desde cero. Me interesa saber qué temas debo estudiar primero, cómo organizar mi aprendizaje y qué recomendaciones prácticas podrían ayudarme a construir proyectos reales desde las bases hasta temas más avanzados.',
      categoriaId: 1,
      etiquetas: 'angular, frontend, rutas',
      estado: 'PUBLICADO',
      autor: 'Ana López',
      fecha: '22/03/2026',
      comentarios: [
        {
          id: 1,
          autor: 'Carlos Pérez',
          contenido: 'Te recomiendo empezar por componentes, rutas y servicios antes de pasar a estado global.',
          fecha: '23/03/2026',
        },
        {
          id: 2,
          autor: 'María Torres',
          contenido: 'Haz proyectos pequeños primero, como un CRUD o una app de tareas.',
          fecha: '23/03/2026',
        },
      ],
    },
    {
      id: 2,
      titulo: 'Dudas sobre normalización en bases de datos',
      contenido:
        'Tengo dudas con primera, segunda y tercera forma normal para un proyecto escolar. Quisiera entender cómo identificar dependencias, cuándo dividir tablas y qué errores suelen cometerse al momento de diseñar el esquema relacional en etapas iniciales.',
      categoriaId: 4,
      etiquetas: 'sql, bases de datos, normalización',
      estado: 'BORRADOR',
      autor: 'Carlos Pérez',
      fecha: '21/03/2026',
      comentarios: [
        {
          id: 1,
          autor: 'Luis Ramírez',
          contenido: 'Lo primero es detectar dependencias parciales y transitivas para decidir cuándo separar tablas.',
          fecha: '22/03/2026',
        },
      ],
    },
    {
      id: 3,
      titulo: 'Recursos para aprender redes',
      contenido:
        'Compartan libros, videos o prácticas para entender mejor subnetting, VLANs y configuración básica de switches en laboratorio. También me servirían simuladores o rutas de estudio recomendadas para reforzar la parte práctica.',
      categoriaId: 5,
      etiquetas: 'redes, subnetting, vlan',
      estado: 'PUBLICADO',
      autor: 'María Torres',
      fecha: '20/03/2026',
      comentarios: [],
    },
    {
      id: 4,
      titulo: 'Aplicaciones de IA en educación',
      contenido:
        'Me interesa debatir cómo se puede usar la inteligencia artificial en contextos académicos, qué ventajas puede traer y qué riesgos existen en términos de dependencia tecnológica, evaluación automática o pérdida de criterio crítico.',
      categoriaId: 3,
      etiquetas: 'ia, educación, tecnología',
      estado: 'ARCHIVADO',
      autor: 'Luis Ramírez',
      fecha: '19/03/2026',
      comentarios: [
        {
          id: 1,
          autor: 'Ana López',
          contenido: 'Puede ser útil si se usa como apoyo, pero no debería reemplazar el análisis del estudiante.',
          fecha: '20/03/2026',
        },
      ],
    },
  ];

  constructor(
    private readonly router: Router,
    private readonly route: ActivatedRoute,
  ) {}

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

    const idParam = this.route.snapshot.paramMap.get('id');
    this.postId = Number(idParam ?? 0);

    const foundPost = this.posts.find((item) => item.id === this.postId);

    if (!foundPost) {
      this.router.navigate(['/posts']);
      return;
    }

    this.post = foundPost;

    const foundCategory = this.categories.find((item) => item.id === foundPost.categoriaId);
    this.categoriaNombre = foundCategory ? foundCategory.nombre : 'Sin categoría';
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
    this.router.navigate(['/posts']);
  }

  public goEditPost(): void {
    if (!this.post || !this.canEditCurrentPost) {
      return;
    }

    this.router.navigate(['/posts', this.postId, 'edit']);
  }

  public reportarPublicacion(): void {
    if (!this.post) {
      return;
    }

    this.router.navigate(['/reports/create'], {
      queryParams: {
        type: 'post',
        referenciaId: this.post.id,
        postId: this.post.id,
      },
    });
  }

  public reportarComentario(comment: CommentItem): void {
    if (!this.post) {
      return;
    }

    this.router.navigate(['/reports/create'], {
      queryParams: {
        type: 'comment',
        referenciaId: comment.id,
        postId: this.post.id,
      },
    });
  }

  public eliminarComentario(comment: CommentItem): void {
    if (!this.post || !this.canDeleteComment(comment)) {
      return;
    }

    this.post.comentarios = this.post.comentarios.filter((item) => item.id !== comment.id);
  }

  public isOwner(post: PostItem): boolean {
    if (!this.currentUserName.trim()) {
      return false;
    }

    return post.autor.trim().toLowerCase() === this.currentUserName.trim().toLowerCase();
  }

  public isCommentOwner(comment: CommentItem): boolean {
    if (!this.currentUserName.trim()) {
      return false;
    }

    return comment.autor.trim().toLowerCase() === this.currentUserName.trim().toLowerCase();
  }

  public canDeleteComment(comment: CommentItem): boolean {
    return this.canManagePosts || this.isCommentOwner(comment);
  }

  public get canEditCurrentPost(): boolean {
    if (!this.post) {
      return false;
    }

    return this.canManagePosts || this.isOwner(this.post);
  }

  public get canManagePosts(): boolean {
    return this.userRole === 'PROFESOR' || this.userRole === 'ADMINISTRADOR';
  }

  public get canReportContent(): boolean {
    return true;
  }
}
