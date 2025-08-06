import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FooterComponents } from './shared/footer/footer.component';
import { LoadingComponent } from './shared/loading/loading.component';
import { LoadingService } from '../services/loading.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, FooterComponents, LoadingComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class App {
  protected title = 'SkipD';
  protected loadingService = inject(LoadingService);
}
