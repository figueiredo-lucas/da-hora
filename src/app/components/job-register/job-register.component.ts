import { Component, OnInit, ViewChild } from '@angular/core';
import { Job } from 'src/app/shared/job';
import { JobDays } from 'src/app/shared/job-days';
import { JobService } from 'src/app/services/job.service';
import { NgForm } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ContainerService } from 'src/app/services/container.service';

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

  job = { payOnFifthLaborDay: true } as Job;
  selectedDays: SelectedDay[] = WEEK;

  hasSelectedDays(): boolean {
    return this.selectedDays.some(s => s.checked)
  }

  onSubmit(): void {
    this.job.valuePerHour = parseFloat(this.job.valuePerHour.toString().replace(',', '.'));
    this.job.jobDays = this.getJobDaysFromSelectedDays();
    this.jobService.saveJob(this.job).subscribe(job => {
      this.snackBar.open(`Agora que o trampo "${job.name}" já tá salvo, bora pra luta!`, null, { duration: 5000, verticalPosition: 'top' })
      this.jobForm.reset();
      this.jobForm.resetForm();
      setTimeout(() => {
        this.job = { payOnFifthLaborDay: true } as Job;
      })
      this.containerService.scrollToTop();
    });
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

}
