import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FooterComponents } from './footer/footer.components';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, FooterComponents],
  templateUrl: './app.components.html',
  styleUrl: './app.component.scss'
})
export class App {
  protected title = 'SkipD';
}
