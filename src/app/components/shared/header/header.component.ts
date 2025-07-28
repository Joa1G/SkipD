import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MockedAuthService } from '../../../services/auth/mocked-auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  imports: [
    CommonModule,
    RouterModule,
    MatIconModule,
    MatToolbarModule
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
}
