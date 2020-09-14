import { Component, OnInit, Input } from '@angular/core';
import { Job } from 'src/app/shared/job';
import { JobSetback } from 'src/app/shared/job-setback';
import { JobService } from 'src/app/services/job.service';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss']
})
export class CardComponent implements OnInit {

  constructor(private jobService: JobService) { }

  @Input()
  job: Job;

  calculateWeeklyHours(job: Job): number {
    return job.jobDays.reduce((acc, curr) => acc + curr.hours, 0);
  }

  hasSetbacksForThisMonth(job: Job): boolean {
    return this.getSetbacksAmountPerMonth(job) > 0
  }

  getSetbacksAmountPerMonth(job: Job): number {
    return this.jobService.getSetbacksOnThisMonth(job)?.length || 0;
  }

  ngOnInit(): void {
  }

}
