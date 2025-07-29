import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { MatIcon } from '@angular/material/icon';
import { Location } from '@angular/common';

@Component({
  selector: 'app-dialog',
  imports: [CommonModule, RouterModule, MatIcon],
  templateUrl: './dialog.component.html',
  styleUrl: './dialog.component.scss'
})
export class DialogComponent {
  @Input() title: string = '';
  @Input() message: string = '';
  @Input() confirmText: string = 'OK';
  @Input() isVisible: boolean = false;
  @Output() isVisibleChange = new EventEmitter<boolean>();
  @Input() route: any[] = [''];
  @Input() dialogType: 'info' | 'warning' | 'confirmation' | 'logo' = 'info';
  @Input() showCancelButton: boolean = true;
  @Output() confirmAction = new EventEmitter<boolean>();

  isExcluirDialog: boolean = false;
  isLogoutDialog: boolean = false;
  router = inject(Router);
  private location = inject(Location);

  ngOnInit() {
    this.setExcluirDialog();
  }

  setExcluirDialog() {
    if (this.confirmText === 'Excluir') {
      this.isExcluirDialog = true;
    } else if (this.confirmText === 'Sair') {
      this.isLogoutDialog = true;
    }
  }

  turnDialogVisible() {
    return this.isVisible ? 'is-visible' : '';
  }

  closeDialog() {
    this.isVisibleChange.emit(false);
  }

  useRouter(){
    if(this.route[0] === ''){
      this.location.back();
    }else{
      this.router.navigate(this.route);
    }
  }

  emitConfirmAction() {
    this.confirmAction.emit(true);
    this.location.back();
  }

  emitConfirmActionInLogout(){
    this.confirmAction.emit(true);
  }


  dialogTypeClass() {
    switch (this.dialogType) {
      case 'info':
        return 'dialog-box--info';
      case 'warning':
        return 'dialog-box--warning';
      case 'confirmation':
        return 'dialog-box--success';
      case 'logo':
        return 'dialog-box--logo';
    }
  }
}
