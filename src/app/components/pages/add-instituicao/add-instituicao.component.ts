import { Component, inject } from '@angular/core';
import { HeaderComponent } from '../../shared/header/header.component';
import { FormGroup, FormControl, Validators, ReactiveFormsModule, FormsModule} from '@angular/forms';
import { MockedAuthService } from '../../../services/auth/mocked-auth.service';
import { AbstractInstituicaoService } from '../../../services/instituicao/abstract-instituicao.service';
import { Instituicao } from '../../../models/instituicao/instituicao.model';
import { firstValueFrom } from 'rxjs';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-add-instituicao.component',
  imports: [HeaderComponent, ReactiveFormsModule, FormsModule, RouterModule],
  templateUrl: './add-instituicao.component.html',
  styleUrl: './add-instituicao.component.scss'
})
export class AddInstituicaoComponent {

  authService = inject(MockedAuthService);
  instituicaoService = inject(AbstractInstituicaoService);

  submitted = false;
  showCancelDialog = false;
  showSubmitDialog = false;

  form = new FormGroup({
    instituicao_name: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]),
    percentFaltas: new FormControl('', [Validators.required, Validators.min(0), Validators.max(100)])
  });

  private adicionarInstituicao() {
    const formValue = this.form.value;
    const currentUser = this.authService.currentUser();

    const instituicao: Omit<Instituicao, 'id'> = {
      nome: formValue.instituicao_name!,
      id_usuario: currentUser?.id!,
      percentual_limite_faltas: Number(formValue.percentFaltas!) / 100
    }

    return instituicao;
  }

  async onSubmit() {
    this.submitted = true;

    if (this.form.invalid){
      return;
    }

    const instituicao = this.adicionarInstituicao();
    const result = await firstValueFrom(this.instituicaoService.addInstituicao(instituicao));

    if (result.success) {
      this.showSubmitDialog = true;
      console.log('Instituição adicionada com sucesso:')
    } else {
      console.error('Erro ao adicionar instituição:', result.message);
    }

  }

  onCancel() {}
}
