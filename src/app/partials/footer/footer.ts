import { Component, Input } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { SHARED_IMPORTS } from '../../shared/shared_imports';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [...SHARED_IMPORTS, RouterModule],
  templateUrl: './footer.html',
  styleUrl: './footer.scss',
})
export class Footer {
  @Input() mode: 'public' | 'private' = 'public';

  constructor(private readonly router: Router) {}

  public goInicio(): void {
    this.router.navigate(['/landing']).then(() => {
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 80);
    });
  }

  public goProposito(): void {
    this.router.navigate(['/landing']).then(() => {
      setTimeout(() => {
        document
          .getElementById('proposito')
          ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    });
  }
}
