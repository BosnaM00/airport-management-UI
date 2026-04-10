import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { inject } from '@angular/core';
@Component({
  selector: 'app-sign-up-dialog',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
  ],
  templateUrl: './sign-up-dialog.html',
})
export class SignUpDialogComponent {

  private fb = inject(FormBuilder);
  private router = inject(Router);
  private dialogRef = inject(MatDialogRef<SignUpDialogComponent>);

  form = this.fb.group({
    username: ['', [Validators.required, Validators.minLength(3)]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  close(): void {
    this.dialogRef.close();
  }

  submit(): void {
    this.form.markAllAsTouched();
    if (this.form.invalid) return;

    this.dialogRef.close(this.form.value);
  }

  goToRegister(): void {
    this.dialogRef.close();
    this.router.navigate(['/register']);
  }
}
