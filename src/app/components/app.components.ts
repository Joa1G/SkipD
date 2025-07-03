import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.components.html',
  styleUrl: './app.component.scss'
})
export class App {
  protected title = 'SkipD';
}
