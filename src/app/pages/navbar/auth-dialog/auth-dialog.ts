import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';

import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-auth-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatTabsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
  ],
  templateUrl: './auth-dialog.html',
  styleUrls: ['./auth-dialog.css'],
})
export class AuthDialogComponent {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private dialogRef = inject(MatDialogRef<AuthDialogComponent>);
  private authService = inject(AuthService);

  hidePasswordLogin = true;
  errorMessage = '';

  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  close(): void {
    this.dialogRef.close();
  }

  submitLogin(): void {
    this.loginForm.markAllAsTouched();
    if (this.loginForm.invalid) return;

    const { email, password } = this.loginForm.value;
    this.authService.login({ email: email!, password: password! }).subscribe({
      next: () => this.dialogRef.close({ success: true }),
      error: () => { this.errorMessage = 'Invalid email or password.'; }
    });
  }

  goToRegister(): void {
    this.dialogRef.close();
    this.router.navigate(['/register']);
  }
}
