import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatIcon } from '@angular/material/icon';

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
  @Input() route: string = '';
  @Input() dialogType: 'info' | 'warning' | 'confirmation' = 'info';
  @Input() showCancelButton: boolean = true;


  turnDialogVisible() {
    return this.isVisible ? 'is-visible' : '';
  }

  closeDialog() {
    this.isVisibleChange.emit(false);
  }

  dialogTypeClass() {
    switch (this.dialogType) {
      case 'info':
        return 'dialog-box--info';
      case 'warning':
        return 'dialog-box--warning';
      case 'confirmation':
        return 'dialog-box--success';
    }
  }
}
