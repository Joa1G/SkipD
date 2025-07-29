import { Component, inject } from '@angular/core';
import { HeaderComponent } from '../../shared/header/header.component';
import { MatIcon } from '@angular/material/icon';
import { MockedAuthService } from '../../../services/auth/mocked-auth.service';
import { Router } from '@angular/router';
import { DialogComponent } from '../../shared/dialog/dialog.component';

@Component({
  selector: 'app-pagina-usuario.component',
  imports: [HeaderComponent, MatIcon, DialogComponent],
  templateUrl: './pagina-usuario.component.html',
  styleUrl: './pagina-usuario.component.scss'
})
export class PaginaUsuarioComponent {

  authService = inject(MockedAuthService);
  router = inject(Router);
  isDialogVisible = false;

  logout(){
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  showLogoutDialog() {
    this.isDialogVisible = true;
  }

}
