import { Component, OnInit } from '@angular/core';
import { JobService } from 'src/app/services/job.service';
import { Job } from 'src/app/shared/job';

@Component({
  selector: 'app-balance',
  templateUrl: './balance.component.html',
  styleUrls: ['./balance.component.scss']
})
export class BalanceComponent implements OnInit {

  constructor(private jobService: JobService) { }
  showBalance: boolean = true;
  balance: number;
  maxPayDay: number;

  ngOnInit(): void {
    this.jobService.getJobs().subscribe(jobs => {
      this.balance = jobs.reduce((acc, curr) => acc + curr.monthlyIncome, 0);
      this.maxPayDay = this.jobService.getMaxPayDay(jobs);
    });
  }

}
