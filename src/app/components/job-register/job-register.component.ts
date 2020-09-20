import { Component, OnInit, ViewChild } from '@angular/core';
import { Job } from 'src/app/shared/job';
import { JobDays } from 'src/app/shared/job-days';
import { JobService } from 'src/app/services/job.service';
import { NgForm, NgModel } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ContainerService } from 'src/app/services/container.service';
import { Subscription } from 'rxjs';
import { snapshotChanges } from '@angular/fire/database';

interface SelectedDay {
  checked?: boolean,
  name: string,
  hours?: number
}

const WEEK: SelectedDay[] = [{ name: 'Domingo' }, { name: 'Segunda' }, { name: 'Terça' }, { name: 'Quarta' }, { name: 'Quinta' }, { name: 'Sexta' }, { name: 'Sábado' }]

@Component({
  selector: 'app-job-register',
  templateUrl: './job-register.component.html',
  styleUrls: ['./job-register.component.scss']
})
export class JobRegisterComponent implements OnInit {

  constructor(private jobService: JobService,
    private snackBar: MatSnackBar,
    private containerService: ContainerService) { }

  @ViewChild('jobFormDirective')
  jobForm: NgForm;
  @ViewChild('typeDirective')
  typeDirective: NgModel;

  job = { type: 'J', payOnFifthLaborDay: true } as Job;
  selectedDays: SelectedDay[] = WEEK;

  hasSelectedDays(): boolean {
    return this.selectedDays.some(s => s.checked)
  }

  onSubmit(): void {
    this.job.value = parseFloat(this.job.value.toString().replace(',', '.'));
    this.job.jobDays = this.getJobDaysFromSelectedDays();
    this.jobService.saveJob(this.job).subscribe(snapshot => {
      this.snackBar.open(`Agora que o trampo "${this.job.name}" já tá salvo, bora pra luta!`, null, { duration: 5000, verticalPosition: 'top' })
      this.jobForm.reset();
      this.jobForm.resetForm();
      setTimeout(() => {
        this.job = { type: 'J', payOnFifthLaborDay: true } as Job;
      })
      this.containerService.scrollToTop();
    })
  }

  private getJobDaysFromSelectedDays(): JobDays[] {
    return this.selectedDays.reduce((acc, curr, idx) => {
      if (curr.checked) {
        acc.push({
          weekday: idx,
          hours: curr.hours
        })
      }
      return acc;
    }, [] as JobDays[])
  }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    this.typeDirective.valueChanges.subscribe(v => {
      if (v === 'J') {
        this.job = { name: this.job.name, type: 'J', payOnFifthLaborDay: true } as Job;
      } else {
        this.job = { name: this.job.name, type: 'E' } as Job;
      }
    })

    this.jobForm.statusChanges.subscribe(v => {
      console.log(v);
    })
  }

}
