import { Component, OnInit } from '@angular/core';
import { Job } from 'src/app/shared/job';
import { JobService } from 'src/app/services/job.service';




@Component({
  selector: 'app-job-list',
  templateUrl: './job-list.component.html',
  styleUrls: ['./job-list.component.scss']
})
export class JobListComponent implements OnInit {

  constructor(private jobService: JobService) { }

  jobs: Job[];

  ngOnInit(): void {
    this.jobService.getJobs().subscribe(jobs => {
      this.jobs = jobs;
    })
  }

}
