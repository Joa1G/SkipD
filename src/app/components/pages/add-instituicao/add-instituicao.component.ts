import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../../shared/header/header.component';
import {
  FormGroup,
  FormControl,
  Validators,
  ReactiveFormsModule,
  FormsModule,
} from '@angular/forms';
import { AuthService } from '../../../services/auth/auth.service';
import { AbstractInstituicaoService } from '../../../services/instituicao/abstract-instituicao.service';
import { Instituicao } from '../../../models/instituicao/instituicao.model';
import { firstValueFrom } from 'rxjs';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { DialogComponent } from '../../shared/dialogs/dialog.component';
import { AbstractMateriaService } from '../../../services/materia/abstract-materia.service';

@Component({
  selector: 'app-add-instituicao.component',
  imports: [
    HeaderComponent,
    ReactiveFormsModule,
    FormsModule,
    RouterModule,
    CommonModule,
    DialogComponent,
  ],
  templateUrl: './add-instituicao.component.html',
  styleUrl: './add-instituicao.component.scss',
})
export class AddInstituicaoComponent {
  authService = inject(AuthService);
  instituicaoService = inject(AbstractInstituicaoService);
  materiaService = inject(AbstractMateriaService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  submitted = false;
  showCancelDialog = false;
  showSubmitDialog = false;
  incorretFormField = false;
  currentRoute = '';
  isEditMode = false;

  form = new FormGroup({
    id: new FormControl<number | null>(null),
    instituicao_name: new FormControl('', [
      Validators.required,
      Validators.minLength(3),
      Validators.maxLength(50),
    ]),
    percentFaltas: new FormControl('', [
      Validators.required,
      Validators.min(0),
      Validators.max(100),
    ]),
  });

  ngOnInit(): void {
    this.identifyRoute();
    this.handleRouteParams();
  }

  private identifyRoute(): void {
    const url = this.router.url;

    if (url.includes('edit-instituicao')) {
      this.currentRoute = 'edit';
      this.isEditMode = true;
    } else if (url.includes('add-instituicao')) {
      this.currentRoute = 'add';
      this.isEditMode = false;
    } else {
      this.currentRoute = 'unknown';
    }
  }

  private handleRouteParams(): void {
    const idParam = this.route.snapshot.paramMap.get('id');

    if (idParam && this.currentRoute === 'edit') {
      const id = Number(idParam);
      this.loadInstituicaoForEdit(id);
    }
  }

  private loadInstituicaoForEdit(id: number): void {
    this.instituicaoService.getInstituicaoById(id).subscribe((result) => {
      if (result.success && result.data) {
        this.form.patchValue({
          id: result.data.id,
          instituicao_name: result.data.nome,
          percentFaltas: (
            result.data.percentual_limite_faltas * 100
          ).toString(),
        });
        this.isEditMode = true;
      } else {
        console.error(
          'Erro ao carregar a instituição:',
          result.data || 'Dados não encontrados.'
        );
        this.router.navigate(['/home']);
      }
    });
  }

  private adicionarInstituicao() {
    const formValue = this.form.value;
    const currentUser = this.authService.getCurrentUser();

    const instituicao: Omit<Instituicao, 'id'> = {
      nome: formValue.instituicao_name!,
      id_usuario: currentUser?.id!,
      percentual_limite_faltas: Number(formValue.percentFaltas!) / 100,
    };

    return instituicao;
  }

  private atualizarInstituicao() {
    const formValue = this.form.value;
    const currentUser = this.authService.getCurrentUser();

    const instituicao: Instituicao = {
      id: formValue.id!,
      nome: formValue.instituicao_name!,
      id_usuario: currentUser?.id!,
      percentual_limite_faltas: Number(formValue.percentFaltas!) / 100,
    };

    return instituicao;
  }

  async onSubmit() {
    if (this.currentRoute === 'edit') {
      await this.onSubmitEdit();
    } else {
      await this.onSubmitAdd();
    }
  }

  async onSubmitAdd() {
    this.submitted = true;

    if (this.form.invalid) {
      this.incorretFormField = true;
      return;
    }

    const instituicao = this.adicionarInstituicao();
    console.log('Dados da instituição sendo enviados:', instituicao);

    try {
      const result = await firstValueFrom(
        this.instituicaoService.addInstituicao(instituicao)
      );
      console.log('Resposta completa da API:', result);

      if (result.success) {
        console.log('Instituição adicionada com sucesso:', result.data);

        // Atualizar as instituições após adicionar
        await this.instituicaoService.refresh();

        this.showSubmitDialog = true;
      } else {
        console.error('Erro ao adicionar instituição:', {
          message: result.message,
          status: result.status,
          data: result.data,
        });
      }
    } catch (error) {
      console.error('Erro de rede ao adicionar instituição:', error);
    }
  }

  async onSubmitEdit() {
    this.submitted = true;

    if (this.form.invalid) {
      this.incorretFormField = true;
      return;
    }

    try {
      const instituicao = this.atualizarInstituicao();
      const result = await firstValueFrom(
        this.instituicaoService.updateInstituicao(instituicao)
      );

      if (result.success) {
        console.log('Instituição editada com sucesso');

        // Atualizar status das matérias da instituição
        const materias = await firstValueFrom(
          this.materiaService.getMateriasByInstituicaoId(instituicao.id)
        );

        for (const materia of materias.data) {
          await firstValueFrom(this.materiaService.updateStatus(materia.id));
        }

        // Atualizar lista de matérias e instituições
        await this.materiaService.refresh();
        await this.instituicaoService.refresh();

        this.showSubmitDialog = true;
      } else {
        console.error('Erro ao editar instituição:', result.message);
      }
    } catch (error) {
      console.error('Erro ao editar instituição:', error);
    }
  }

  onCancel() {
    this.showCancelDialog = true;
  }

  invalidFieldClass(fieldName: string) {
    const field = this.form.get(fieldName);

    if (
      fieldName === 'confirmPassword' &&
      this.form.hasError('passwordMismatch') &&
      (field!.dirty || this.submitted)
    ) {
      return 'is-invalid';
    }

    if (field!.valid && (field!.dirty || this.submitted)) {
      return 'is-valid';
    } else if (
      (field!.invalid && (field!.dirty || this.submitted)) ||
      this.incorretFormField
    ) {
      return 'is-invalid';
    } else {
      return '';
    }
  }

  changeIncorrectFormField() {
    if (this.form.valid) {
      this.incorretFormField = false;
    }
  }
}
