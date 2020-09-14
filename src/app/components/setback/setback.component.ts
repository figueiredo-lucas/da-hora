import { Component, OnInit, ViewChild } from '@angular/core';
import { JobSetback } from 'src/app/shared/job-setback';
import { Job } from 'src/app/shared/job';
import { JobService } from 'src/app/services/job.service';
import { NgModel, NgForm } from '@angular/forms';
import { NgIf } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-setback',
  templateUrl: './setback.component.html',
  styleUrls: ['./setback.component.scss']
})
export class SetbackComponent implements OnInit {

  constructor(private jobService: JobService,
    private snackBar: MatSnackBar) { }

  setback = {} as JobSetback;
  jobs: Job[];
  selectedJob: Job;
  @ViewChild('selectedJobDirective')
  selectedJobDirective: NgModel;
  @ViewChild('setbackFormDirective')
  setbackFormDirective: NgForm;


  onlyAvailableJobDays = (d: Date): boolean => {
    return this.selectedJob.jobDays.map(j => j.weekday).includes(d.getDay());
  }

  getMaxHoursForSelectedDay(): number {
    return this.selectedJob.jobDays.find(jd => jd.weekday === this.setback.day.getDay()).hours;
  }

  onSubmit(): void {
    this.setback.hours = Math.min(this.setback.hours, this.getMaxHoursForSelectedDay());
    this.jobService.saveSetback(this.selectedJob, this.setback).subscribe(setback => {
      this.setbackFormDirective.reset();
      this.setbackFormDirective.resetForm();
      this.snackBar.open('A facada tá salva. Boa sorte na próxima!', null, { duration: 5000, verticalPosition: 'top' });
    });
  }

  ngOnInit(): void {
    this.jobService.getJobs().subscribe(jobs => this.jobs = jobs);
  }

  ngAfterViewInit(): void {
    this.selectedJobDirective.valueChanges.subscribe(v => {
      this.setback.day = undefined;
      this.setback.hours = undefined;
    })
  }

}
