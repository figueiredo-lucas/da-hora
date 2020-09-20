import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { User } from 'src/app/shared/user';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  constructor(private authService: AuthService, private router: Router) { }

  user = {} as User;

  login() {
    this.authService.login(this.user).then(r => {
      this.router.navigate(['/p/balance']);
    }, console.error);
  }

  ngOnInit(): void {
  }

}
