import { Routes } from '@angular/router';
import { Landing } from './screens/landing/landing';
import { Registro } from './screens/auth/registro/registro';
import { LoginScreen } from './screens/auth/login/login';
import { Profile } from './screens/profile/profile';
import { Dashboard } from './screens/dashboard/dashboard';
import { PostsList } from './screens/posts/list/list';
import { PostsDetail } from './screens/posts/detail/detail';
import { PostsCreate } from './screens/posts/create/create';
import { PostsEdit } from './screens/posts/edit/edit';
import { CategoriesList } from './screens/categories/list/list';
import { CategoriesForm } from './screens/categories/form/form';
import { CategoriesEdit } from './screens/categories/edit/edit';
import { ReportsCreate } from './screens/reports/create/create';
import { ReportsList } from './screens/reports/list/list';
import { ReportsDetail } from './screens/reports/detail/detail';


export const routes: Routes = [
  { path: '', component: Landing, pathMatch: 'full' },
  { path: 'registro', component: Registro, pathMatch: 'full' },
  { path: 'auth/login', component: LoginScreen, pathMatch: 'full' },
  { path: 'auth/registro', component: Registro, pathMatch: 'full' },
  { path: 'profile', component: Profile, pathMatch: 'full' },
  { path: 'dashboard', component: Dashboard, pathMatch: 'full' },

  { path: 'posts', component: PostsList, pathMatch: 'full' },
  { path: 'posts/create', component: PostsCreate, pathMatch: 'full' },
  { path: 'posts/:id/edit', component: PostsEdit, pathMatch: 'full' },
  { path: 'posts/:id', component: PostsDetail, pathMatch: 'full' },

  { path: 'categories/form', component: CategoriesForm, pathMatch: 'full' },
  { path: 'categories', component: CategoriesList, pathMatch: 'full' },
  { path: 'categories/:id/edit', component: CategoriesEdit, pathMatch: 'full' },

  { path: 'reports/create', component: ReportsCreate, pathMatch: 'full' },
  { path: 'reports', component: ReportsList, pathMatch: 'full' },
  { path: 'reports/:id', component: ReportsDetail, pathMatch: 'full' },
  { path: '**', redirectTo: '', pathMatch: 'full' },

];
