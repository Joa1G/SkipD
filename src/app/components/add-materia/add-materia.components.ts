import { Component, inject, OnInit } from '@angular/core';
import { HeaderComponent } from '../header/header.component';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { FormBuilder, FormGroup, FormArray, FormControl, Validators, ReactiveFormsModule, FormsModule, Form } from '@angular/forms';
import { AbstractInstituicaoService } from '../services/instituicao/abstract-instituicao.service';
import { AbstractMateriaService } from '../services/materia/abstract-materia.service';
import { Materia } from '../models/materia/materia.model';
import { Router } from '@angular/router';


@Component({
  selector: 'app-add-materia',
  standalone: true,
  imports: [HeaderComponent,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
    MatCheckboxModule,
    MatButtonModule,
    MatMenuModule,
    MatIconModule,
    MatCardModule,
    ReactiveFormsModule,
    FormsModule
  ],
  templateUrl: './add-materia.components.html',
  styleUrl: './add-materia.components.scss'
})
export class AddMateriaComponents{

  private serviceInstituicao = inject(AbstractInstituicaoService);
  instituicoes = this.serviceInstituicao.instituicoes;
  private serviceMateria = inject(AbstractMateriaService);
  materias = this.serviceMateria.materias;
  private router = inject(Router)

  form = new FormGroup({
    id: new FormControl<number | null>(null),
    nome: new FormControl('', {nonNullable: true, validators: [Validators.required]}),
    cargaHorariaTotal: new FormControl('', {nonNullable: true, validators: [Validators.required]}),
    faltas: new FormControl('', {nonNullable: true, validators: [Validators.required]}),
    dom: new FormControl('', {nonNullable: true, validators: [Validators.required]}),
    seg: new FormControl('', {nonNullable: true, validators: [Validators.required]}),
    ter: new FormControl('', {nonNullable: true, validators: [Validators.required]}),
    qua: new FormControl('', {nonNullable: true, validators: [Validators.required]}),
    qui: new FormControl('', {nonNullable: true, validators: [Validators.required]}),
    sex: new FormControl('', {nonNullable: true, validators: [Validators.required]}),
    sab: new FormControl('', {nonNullable: true, validators: [Validators.required]}),
    hor_dom: new FormControl(0, {nonNullable: true, validators: [Validators.required]}),
    hor_seg: new FormControl(0, {nonNullable: true, validators: [Validators.required]}),
    hor_ter: new FormControl(0, {nonNullable: true, validators: [Validators.required]}),
    hor_qua: new FormControl(0, {nonNullable: true, validators: [Validators.required]}),
    hor_qui: new FormControl(0, {nonNullable: true, validators: [Validators.required]}),
    hor_sex: new FormControl(0, {nonNullable: true, validators: [Validators.required]}),
    hor_sab: new FormControl(0, {nonNullable: true, validators: [Validators.required]}),
    idInstituicao: new FormControl(0, {nonNullable: true, validators: [Validators.required]}),
  });

  diasDaSemana = [
    { id: 1, value: 'domingo', viewValue: 'Dom'},
    { id: 2, value: 'segunda', viewValue: 'Seg'},
    { id: 3, value: 'terca', viewValue: 'Ter'},
    { id: 4, value: 'quarta', viewValue: 'Qua'},
    { id: 5, value: 'quinta', viewValue: 'Qui'},
    { id: 6, value: 'sexta', viewValue: 'Sex'},
    { id: 7, value: 'sabado', viewValue: 'Sab'},
  ];

  adicionarMateria() {
    const materia: Omit<Materia, 'id'> = {
      nome: this.form.get('nome')!.value,
      cargaHorariaTotal: Number(this.form.get('cargaHorariaTotal')!.value),
      faltas: Number(this.form.get('faltas')!.value),
      idInstituicao: this.form.get('idInstituicao')!.value,
      aulasDaSemana: [{
        dia: 'domingo',
        horas: this.form.get('hor_dom')!.value
      }, {
        dia: 'segunda',
        horas: this.form.get('hor_seg')!.value
      }, {
        dia: 'terça',
        horas: this.form.get('hor_ter')!.value
      }, {
        dia: 'quarta',
        horas: this.form.get('hor_qua')!.value
      }, {
        dia: 'quinta',
        horas: this.form.get('hor_qui')!.value
      }, {
        dia: 'sexta',
        horas: this.form.get('hor_sex')!.value
      }, {
        dia: 'sábado',
        horas: this.form.get('hor_sab')!.value
      }],
      status: 'Aprovado'
    };
    return materia;
  }

  async onSubmit() {
    const materia = this.adicionarMateria();
    try {
      const result = await this.serviceMateria.addMateria(materia).toPromise();
      if (result!.success) {
        const newID = result!.data.id;
        this.serviceMateria.updateStatus(newID);
      }
    } catch (error) {
      console.error('Erro ao adicionar matéria:', error);
    }
  }

  onCancel(): void{
    this.router.navigate(['/'])
  }
}
