import { Component, computed, inject } from '@angular/core';
import { HeaderComponent } from '../../shared/header/header.component';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import {
  FormGroup,
  FormControl,
  Validators,
  ReactiveFormsModule,
  FormsModule,
} from '@angular/forms';
import { AbstractInstituicaoService } from '../../../services/instituicao/abstract-instituicao.service';
import { AbstractMateriaService } from '../../../services/materia/abstract-materia.service';
import { Materia } from '../../../models/materia/materia.model';
import {
  MateriaCreateAPI,
  MateriaAPI,
} from '../../../models/materia/materia-api.model';
import { Router, ActivatedRoute } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { CommonModule } from '@angular/common';
import { DialogComponent } from '../../shared/dialogs/dialog.component';
import { AuthService } from '../../../services/auth/auth.service';

@Component({
  selector: 'app-add-materia',
  standalone: true,
  imports: [
    HeaderComponent,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
    MatCheckboxModule,
    MatButtonModule,
    MatMenuModule,
    MatIconModule,
    MatCardModule,
    ReactiveFormsModule,
    FormsModule,
    CommonModule,
    DialogComponent,
  ],
  templateUrl: './add-materia.component.html',
  styleUrl: './add-materia.component.scss',
})
export class AddMateriaComponents {
  private serviceInstituicao = inject(AbstractInstituicaoService);

  authService = inject(AuthService);

  instituicoesDoUsuario = computed(() => {
    const currentUser = this.authService.currentUser();
    const todasInstituicoes = this.serviceInstituicao.instituicoes();

    if (!currentUser) {
      return [];
    }

    return todasInstituicoes.filter(
      (instituicao) => instituicao.id_usuario === currentUser.id
    );
  });

  private serviceMateria = inject(AbstractMateriaService);
  materias = this.serviceMateria.materias;
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  submitted = false;
  showCancelDialog = false;
  showSubmitDialog = false;
  isEditMode = false;
  currentRoute = '';
  isPremiumUser = computed(
    () => this.authService.currentUser()?.isPremium ?? false
  );

  form = new FormGroup({
    id: new FormControl<number | null>(null),
    nome: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(3), Validators.maxLength(50)],
    }),
    cargaHorariaTotal: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.min(1)],
    }),
    faltas: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.min(0)],
    }),
    is_dom_checked: new FormControl(false, { nonNullable: true }),
    is_seg_checked: new FormControl(false, { nonNullable: true }),
    is_ter_checked: new FormControl(false, { nonNullable: true }),
    is_qua_checked: new FormControl(false, { nonNullable: true }),
    is_qui_checked: new FormControl(false, { nonNullable: true }),
    is_sex_checked: new FormControl(false, { nonNullable: true }),
    is_sab_checked: new FormControl(false, { nonNullable: true }),
    hor_dom: new FormControl(1, { nonNullable: true }),
    hor_seg: new FormControl(1, { nonNullable: true }),
    hor_ter: new FormControl(1, { nonNullable: true }),
    hor_qua: new FormControl(1, { nonNullable: true }),
    hor_qui: new FormControl(1, { nonNullable: true }),
    hor_sex: new FormControl(1, { nonNullable: true }),
    hor_sab: new FormControl(1, { nonNullable: true }),
    idInstituicao: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
  });

  diasDaSemana = [
    { id: 1, value: 'domingo', viewValue: 'Dom', formControlName: 'hor_dom' },
    { id: 2, value: 'segunda', viewValue: 'Seg', formControlName: 'hor_seg' },
    { id: 3, value: 'terca', viewValue: 'Ter', formControlName: 'hor_ter' },
    { id: 4, value: 'quarta', viewValue: 'Qua', formControlName: 'hor_qua' },
    { id: 5, value: 'quinta', viewValue: 'Qui', formControlName: 'hor_qui' },
    { id: 6, value: 'sexta', viewValue: 'Sex', formControlName: 'hor_sex' },
    { id: 7, value: 'sabado', viewValue: 'Sab', formControlName: 'hor_sab' },
  ];

  aulasSemanaData: Record<string, number> = {};

  ngOnInit(): void {
    this.loadUserInstituicoes();
    this.identifyRoute();
    this.handleRouteParams();
  }

  private identifyRoute(): void {
    const url = this.router.url;

    if (url.includes('/edit-materia')) {
      this.currentRoute = 'edit';
      this.isEditMode = true;
    } else if (url.includes('/add-materia')) {
      this.currentRoute = 'add';
      this.isEditMode = false;
    } else {
      this.currentRoute = 'unknown';
    }
  }

  private handleRouteParams(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    console.log('ID Param:', idParam, ' Current Route:', this.currentRoute);

    if (idParam) {
      const id = Number(idParam);

      switch (this.currentRoute) {
        case 'edit':
          this.loadMateriaForEdit(id);
          break;
        case 'add':
          this.loadInstituicaoForAdd(id);
          break;
        default:
          console.warn('Rota não reconhecida:', this.currentRoute);
          this.router.navigate(['/home']);
      }
    }
  }

  private loadMateriaForEdit(id: number): void {
    this.serviceMateria.getMateriaById(id).subscribe((result) => {
      if (result.success && result.data) {
        this.form.patchValue(result.data);
        this.aulasSemanaData = result.data.aulasDaSemana;
        this.applyAulasSemanaToForm(this.aulasSemanaData);
        this.isEditMode = true;
      } else {
        console.error(
          'Erro ao carregar a matéria:',
          result.data || 'Dados não encontrados.'
        );
        this.router.navigate(['/home']);
      }
    });
  }

  private loadInstituicaoForAdd(id: number): void {
    this.serviceInstituicao.getInstituicaoById(id).subscribe((result) => {
      if (result.success && result.data) {
        this.form.patchValue({ idInstituicao: result.data.id });
      } else {
        console.error(
          'Erro ao carregar a instituição:',
          result.data || 'Dados não encontrados.'
        );
      }
    });
  }

  private async loadUserInstituicoes() {
    const currentUser = this.authService.currentUser();
    if (currentUser) {
      try {
        await firstValueFrom(
          this.serviceInstituicao.getInstituicoesByUsuarioId(currentUser.id)
        );
      } catch (error) {
        console.error('Error loading user institutions:', error);
      }
    }
  }

  private applyAulasSemanaToForm(aulas: Record<string, number>): void {
    // monta um objeto { 'is_dom_checked': true, 'hor_dom': 2, … }
    const patch = Object.entries(aulas).reduce((acc, [dia, horas]) => {
      // supondo que o sufixo seja sempre os 3 primeiros caracteres
      const suf = dia.slice(0, 3);
      return {
        ...acc,
        [`is_${suf}_checked`]: horas > 0,
        [`hor_${suf}`]: horas > 0 ? horas : 1,
      };
    }, {} as Record<string, any>);

    // aplica tudo de uma vez
    this.form.patchValue(patch);
  }

  adicionarMateria(): MateriaCreateAPI {
    const formValue = this.form.value;

    const nome: string = formValue.nome!;
    const carga_horaria: number = Number(formValue.cargaHorariaTotal!);
    const faltas: number = Number(formValue.faltas!);
    const instituicao_id: number = Number(formValue.idInstituicao!);
    const status: string = 'Aprovado';

    // Mapeando para o formato esperado pela API
    const materiaForApi: MateriaCreateAPI = {
      nome: nome,
      carga_horaria: carga_horaria,
      faltas: faltas,
      status: status,
      aulas_domingo: formValue.is_dom_checked ? Number(formValue.hor_dom!) : 0,
      aulas_segunda: formValue.is_seg_checked ? Number(formValue.hor_seg!) : 0,
      aulas_terca: formValue.is_ter_checked ? Number(formValue.hor_ter!) : 0,
      aulas_quarta: formValue.is_qua_checked ? Number(formValue.hor_qua!) : 0,
      aulas_quinta: formValue.is_qui_checked ? Number(formValue.hor_qui!) : 0,
      aulas_sexta: formValue.is_sex_checked ? Number(formValue.hor_sex!) : 0,
      aulas_sabado: formValue.is_sab_checked ? Number(formValue.hor_sab!) : 0,
      instituicao_id: instituicao_id,
    };

    return materiaForApi;
  }

  atualizarMateria(): MateriaAPI {
    const formValue = this.form.value;

    const id: number = formValue.id!;
    const nome: string = formValue.nome!;
    const carga_horaria: number = Number(formValue.cargaHorariaTotal!);
    const faltas: number = Number(formValue.faltas!);
    const instituicao_id: number = Number(formValue.idInstituicao!);
    const status: string = 'Aprovado';

    // Mapeando para o formato esperado pela API
    const materiaForApi: MateriaAPI = {
      id: id,
      nome: nome,
      carga_horaria: carga_horaria,
      faltas: faltas,
      status: status,
      aulas_domingo: formValue.is_dom_checked ? Number(formValue.hor_dom!) : 0,
      aulas_segunda: formValue.is_seg_checked ? Number(formValue.hor_seg!) : 0,
      aulas_terca: formValue.is_ter_checked ? Number(formValue.hor_ter!) : 0,
      aulas_quarta: formValue.is_qua_checked ? Number(formValue.hor_qua!) : 0,
      aulas_quinta: formValue.is_qui_checked ? Number(formValue.hor_qui!) : 0,
      aulas_sexta: formValue.is_sex_checked ? Number(formValue.hor_sex!) : 0,
      aulas_sabado: formValue.is_sab_checked ? Number(formValue.hor_sab!) : 0,
      instituicao_id: instituicao_id,
    };

    return materiaForApi;
  }

  async onSubmit(): Promise<void> {
    if (this.currentRoute === 'edit') {
      await this.onSubmitEdit();
    } else {
      await this.onSubmitAdd();
    }
  }

  async onSubmitAdd(): Promise<void> {
    this.submitted = true;
    if (this.form.invalid) {
      return;
    }
    const materia = this.adicionarMateria();
    console.log('Adicionando matéria:', materia);

    try {
      const result = await firstValueFrom(
        this.serviceMateria.addMateria(materia)
      );

      if (result.success) {
        console.log('Matéria adicionada com sucesso:', result.data);

        // Atualizar o status da matéria se necessário
        if (result.data?.id) {
          const resultSetStatus = await firstValueFrom(
            this.serviceMateria.updateStatus(result.data.id)
          );
          console.log('Status atualizado:', resultSetStatus);
        }

        // Recarregar a lista de matérias
        await this.serviceMateria.refresh();

        this.showSubmitDialog = true;
      } else {
        console.error('Erro ao adicionar matéria:', result.data);
      }
    } catch (error) {
      console.error('Erro de rede ao adicionar matéria:', error);
    }
  }

  async onSubmitEdit(): Promise<void> {
    this.submitted = true;
    if (this.form.invalid) {
      return;
    }
    const materia = this.atualizarMateria();
    console.log('Editando matéria:', materia);
    const id = this.form.get('id')?.value;
    if (id) {
      try {
        const result = await firstValueFrom(
          this.serviceMateria.updateMateria(materia)
        );

        if (result.success) {
          console.log('Matéria editada com sucesso:', result.data);

          const resultSetStatus = await firstValueFrom(
            this.serviceMateria.updateStatus(id)
          );
          console.log('Status atualizado:', resultSetStatus);

          // Recarregar a lista de matérias
          await this.serviceMateria.refresh();

          this.showSubmitDialog = true;
        } else {
          console.error('Erro ao editar matéria:', result.data);
        }
      } catch (error) {
        console.error('Erro de rede ao editar matéria:', error);
      }
    }
  }

  onCancel(): void {
    this.showCancelDialog = true;
  }

  invalidFieldClass(field: string) {
    const control = this.form.get(field);
    return {
      'is-invalid': !!(
        control &&
        control.invalid &&
        (control.touched || this.submitted)
      ),
    };
  }
}
