import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit {

  constructor(private authService: AuthService,
    private snackBar: MatSnackBar) { }

  @ViewChild('fpwFormDirective')
  fpwForm: NgForm;
  email: string;

  fpw() {
    this.authService.forgotPassword(this.email).then(() => {
      this.snackBar.open(`Enviei um email para "${this.email}". Agora é só recuperar a senha!`, 'Fechar', { duration: 4000, verticalPosition: 'top' })
      this.fpwForm.reset();
      this.fpwForm.resetForm();
    });
  }

  ngOnInit(): void {
  }

}
