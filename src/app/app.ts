import { Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { RouterOutlet } from '@angular/router';
import { RouterModule } from '@angular/router';


@Component({
  selector: 'app-root',
  imports: [RouterLink,RouterOutlet,RouterModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected title = signal('my-agenda');
}
