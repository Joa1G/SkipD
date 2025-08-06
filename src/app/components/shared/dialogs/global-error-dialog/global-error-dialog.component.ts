import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subject, takeUntil } from 'rxjs';
import {
  ErrorDialogService,
  ErrorDialogConfig,
} from '../../../../services/error-dialog.service';
import { ErrorDialogComponent } from '../error-dialog/error-dialog.component';

@Component({
  selector: 'app-global-error-dialog',
  imports: [CommonModule, ErrorDialogComponent],
  template: `
    <app-error-dialog
      [title]="currentError?.title || 'Erro'"
      [message]="currentError?.message || ''"
      [errorCode]="currentError?.errorCode"
      [showTryAgain]="currentError?.showTryAgain || false"
      [isVisible]="!!currentError"
      (isVisibleChange)="onDialogClose()"
      (tryAgain)="onTryAgain()"
    >
    </app-error-dialog>
  `,
})
export class GlobalErrorDialogComponent implements OnInit, OnDestroy {
  private errorDialogService = inject(ErrorDialogService);
  private destroy$ = new Subject<void>();

  currentError: ErrorDialogConfig | null = null;

  ngOnInit() {
    this.errorDialogService.errorDialog$
      .pipe(takeUntil(this.destroy$))
      .subscribe((error) => {
        this.currentError = error;
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onDialogClose() {
    this.errorDialogService.hideError();
  }

  onTryAgain() {
    if (this.currentError?.onRetry) {
      this.currentError.onRetry();
    }
    this.errorDialogService.hideError();
  }
}
