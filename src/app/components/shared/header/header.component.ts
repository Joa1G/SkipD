import {
  Component,
  computed,
  inject,
  Input,
  OnInit,
  effect,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { AuthService } from '../../../services/auth/auth.service';
import { AbstractUsuarioService } from '../../../services/usuario/abstract-usuario.service';
import { UserImageService } from '../../../services/urlState.service';
import { PremiumDialogComponent } from '../dialogs/premium-dialog/premium-dialog.component';

@Component({
  selector: 'app-header',
  imports: [
    CommonModule,
    RouterModule,
    MatIconModule,
    MatToolbarModule,
    PremiumDialogComponent,
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent implements OnInit {
  private authService = inject(AuthService);
  private userService = inject(AbstractUsuarioService);
  userImageService = inject(UserImageService); // Tornando público para uso no template
  urlImage = this.userImageService.userImageUrl;

  isPremiumUser = computed(
    () => this.authService.currentUser()?.isPremium ?? false
  );
  showPremiumDialog = false;

  constructor() {
    // Effect para debug - ver quando o estado premium muda
    effect(() => {
      const user = this.authService.currentUser();
      console.log(
        'Header - User changed:',
        user?.nome,
        'Premium:',
        user?.isPremium
      );
    });
  }

  ngOnInit() {
    this.getUserUrlImage();
  }

  getUserUrlImage() {
    // Usar o signal em vez de getCurrentUser()
    const user = this.authService.currentUser();
    if (user) {
      this.userService.getUrlFotoById(user.id).subscribe({
        next: (result) => {
          if (result.success && result.data && result.data.trim() !== '') {
            this.userImageService.updateUserImageUrl(result.data);
          } else {
            console.log(
              'User image URL not available or empty:',
              result.message || 'URL vazia'
            );
            this.userImageService.clearUserImageUrl();
          }
        },
        error: (error) => {
          console.error('Error fetching user image:', error);
          this.userImageService.clearUserImageUrl();
        },
      });
    } else {
      console.log('No user is currently logged in.');
      this.userImageService.clearUserImageUrl();
    }
  }

  showPremiumMessage() {
    this.showPremiumDialog = true;
  }

  onImageError() {
    console.log('Erro ao carregar imagem do usuário, usando ícone padrão');
    this.userImageService.clearUserImageUrl();
  }
}
