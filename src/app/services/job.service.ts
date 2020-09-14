import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Job } from '../shared/job';
import { JobSetback } from '../shared/job-setback';

const JOBS: Job[] = [{
  name: 'Emprego 1',
  valuePerHour: 25,
  startingDate: new Date(2020, 8, 9),
  payOnFifthLaborDay: true,
  jobDays: [{
    weekday: 1,
    hours: 7
  },{
    weekday: 3,
    hours: 7
  },{
    weekday: 5,
    hours: 7
  }]
},{
  name: 'Emprego 2',
  valuePerHour: 25.18,
  startingDate: new Date(2020, 7, 20),
  payOnFifthLaborDay: false,
  paymentDay: 5,
  jobDays: [{
    weekday: 1,
    hours: 7
  },{
    weekday: 3,
    hours: 7
  },{
    weekday: 5,
    hours: 7
  }]
},{
  name: 'Emprego 3',
  valuePerHour: 17.13,
  startingDate: new Date(2020, 7, 20),
  payOnFifthLaborDay: false,
  paymentDay: 30,
  jobDays: [{
    weekday: 2,
    hours: 4
  },{
    weekday: 3,
    hours: 1
  },{
    weekday: 6,
    hours: 8
  }]
},{
  name: 'Emprego 4',
  valuePerHour: 18,
  startingDate: new Date(2020, 7, 20),
  payOnFifthLaborDay: true,
  jobDays: [{
    weekday: 2,
    hours: 2
  },{
    weekday: 4,
    hours: 4
  }],
  setbacks: [{
    day: new Date(2020, 8, 22),
    hours: 1
  },
  {
    day: new Date(2020, 8, 24),
    hours: 4
  }]
}]

@Injectable({
  providedIn: 'root'
})
export class JobService {

  constructor() { }

  private jobs: Job[] = JOBS;

  getJobs(): Observable<Job[]> {
    this.jobs.forEach(this.calculateMonthlyIncome.bind(this));
    return of(this.jobs);
  }

  getSetbacksOnThisMonth(job: Job): JobSetback[] {
    const today = new Date();
    const firstDayMs = new Date(today.getFullYear(), today.getMonth(), 1).getTime();
    const lastDayMs = new Date(today.getFullYear(), today.getMonth()+ 1, 0).getTime();
    return job.setbacks?.filter(s => s.day.getTime() > firstDayMs && s.day.getTime() <= lastDayMs);
  }

  getMaxPayDay(jobs: Job[]): number {
    let fifthLaborDay = 1;
    let amountOfLaborDays = 0;
    let date = new Date();
    date.setMonth(date.getMonth() + 1);
    for(let d = 1; d < 10; d++) {
      date.setDate(d);
      if (date.getDay() > 0 && date.getDay() < 6) amountOfLaborDays++;
      if (amountOfLaborDays === 5) {
        fifthLaborDay = d;
        break;
      }
    }

    return jobs
      .map(j => !j.paymentDay || j.paymentDay > 25 ? fifthLaborDay : j.paymentDay)
      .sort((a, b) => b - a)[0];
  }

  saveJob(job: Job): Observable<Job> {
    this.jobs.push(Object.assign({}, job));
    return of(job);
  }

  private calculateMonthlyIncome(job: Job): void {
    const today = new Date();
    const startingDay = job.startingDate.getMonth() === today.getMonth() ? job.startingDate.getDate() : 1;
    const lastDay = new Date(today.getFullYear(), today.getMonth()+ 1, 0).getDate();
    let sumHours = 0;
    for(let d = startingDay; d <= lastDay; d++) {
      today.setDate(d);
      const jobDay = job.jobDays.find(jd => jd.weekday === today.getDay());
      if (jobDay) {
        sumHours += jobDay.hours;
      }
    }

    const setbacks = this.getSetbacksOnThisMonth(job);
    setbacks?.forEach(s => sumHours -= s.hours);

    job.monthlyIncome = (sumHours * job.valuePerHour);
  }
}
