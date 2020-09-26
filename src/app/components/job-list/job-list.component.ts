import { Component, OnInit } from '@angular/core';
import { Job } from 'src/app/shared/job';
import { JobService } from 'src/app/services/job.service';
import { map } from 'rxjs/operators';
import { Subscription } from 'rxjs';




@Component({
  selector: 'app-job-list',
  templateUrl: './job-list.component.html',
  styleUrls: ['./job-list.component.scss']
})
export class JobListComponent implements OnInit {

  constructor(private jobService: JobService) { }

  jobs: Job[];
  private jobSub: Subscription;
  loading: boolean = true;

  ngOnInit(): void {
    this.jobSub = this.jobService.getJobs().subscribe(jobs => {
      this.loading = false;
      this.jobs = jobs;
    })
  }

  ngOnDestroy(): void {
    this.jobSub.unsubscribe();
  }

}
