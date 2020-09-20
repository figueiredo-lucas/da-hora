import { Component, OnInit } from '@angular/core';
import { JobService } from 'src/app/services/job.service';
import { UserService } from 'src/app/services/user.service';
import { User } from 'src/app/shared/user';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-balance',
  templateUrl: './balance.component.html',
  styleUrls: ['./balance.component.scss']
})
export class BalanceComponent implements OnInit {

  constructor(private jobService: JobService, private userService: UserService,
    private authService: AuthService, private router: Router) { }
  showBalance: boolean = true;
  balance: number;
  maxPayDay: number;
  user: User;
  private jobSub: Subscription;

  logout() {
    this.authService.logout().then(() => {
      this.jobSub.unsubscribe();
      this.router.navigate(['/login']);
    })
  }

  ngOnInit(): void {
    this.jobSub = this.jobService.getJobs().subscribe(jobs => {
      this.balance = jobs.reduce((acc, curr) => acc + curr.monthlyIncome, 0);
      this.maxPayDay = this.jobService.getMaxPayDay(jobs);
    });

    this.user = this.userService.getUser();
  }

}
