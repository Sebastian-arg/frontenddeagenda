import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { trigger, state, style, animate, transition } from '@angular/animations';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink,RouterOutlet],
  templateUrl: './home.html',
  styleUrls: ['./home.css'],
  animations: [
    trigger('welcomeAnimation', [
      state('in', style({ transform: 'scale(1)' })),
      transition(':enter', [
        style({ transform: 'scale(0.5)', opacity: 0 }),
        animate('1s ease-in', style({ transform: 'scale(1)', opacity: 1 }))
      ])
    ]),
    trigger('fadeinAnimation', [
      state('in', style({ opacity: 1 })),
      transition(':enter', [
        style({ opacity: 0 }),
        animate('1.5s 1s ease-in')
      ])
    ])
  ]
})
export class HomeComponent {

}
