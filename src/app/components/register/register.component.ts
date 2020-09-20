import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { User } from 'src/app/shared/user';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  constructor(private authService: AuthService, private router: Router) { }

  user = {} as User;

  ngOnInit(): void {
  }

  register() {
    this.authService.register(this.user)
    .then(res => {
      this.router.navigate(['/p/balance']);
    }, err => {
      console.log(err);
    })
  }

}
