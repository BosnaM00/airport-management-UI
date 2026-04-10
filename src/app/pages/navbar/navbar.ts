import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { AuthDialogComponent } from './auth-dialog/auth-dialog';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule, MatDialogModule, MatButtonModule],
  templateUrl: './navbar.html',
})
export class Navbar {
  private dialog = inject(MatDialog);
  authService = inject(AuthService);

  openLogin(): void {
    this.dialog.open(AuthDialogComponent, {
      width: '500px',
      maxWidth: '95vw',
      autoFocus: false,
      restoreFocus: true,
      disableClose: false,
      enterAnimationDuration: '180ms',
      exitAnimationDuration: '120ms',
      panelClass: 'auth-dialog-panel'
    });
  }

  logout(): void {
    this.authService.logout();
  }
}
