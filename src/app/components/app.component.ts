import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FooterComponents } from './shared/footer/footer.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, FooterComponents],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class App {
  protected title = 'SkipD';
}
