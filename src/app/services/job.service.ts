import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { Job } from '../shared/job';
import { JobSetback } from '../shared/job-setback';
import { AngularFireDatabase, AngularFireList, SnapshotAction } from '@angular/fire/database'
import { UserService } from './user.service';

// const JOBS: Job[] = [{
//   name: 'Emprego 1',
//   value: 25,
//   startingDate: new Date(2020, 8, 9),
//   payOnFifthLaborDay: true,
//   jobDays: [{
//     weekday: 1,
//     hours: 7
//   }, {
//     weekday: 3,
//     hours: 7
//   }, {
//     weekday: 5,
//     hours: 7
//   }]
// }, {
//   name: 'Emprego 2',
//   value: 25.18,
//   startingDate: new Date(2020, 7, 20),
//   payOnFifthLaborDay: false,
//   paymentDay: 5,
//   jobDays: [{
//     weekday: 1,
//     hours: 7
//   }, {
//     weekday: 3,
//     hours: 7
//   }, {
//     weekday: 5,
//     hours: 7
//   }]
// }, {
//   name: 'Emprego 3',
//   value: 17.13,
//   startingDate: new Date(2020, 7, 20),
//   payOnFifthLaborDay: false,
//   paymentDay: 30,
//   jobDays: [{
//     weekday: 2,
//     hours: 4
//   }, {
//     weekday: 3,
//     hours: 1
//   }, {
//     weekday: 6,
//     hours: 8
//   }]
// }, {
//   name: 'Emprego 4',
//   value: 18,
//   startingDate: new Date(2020, 7, 20),
//   payOnFifthLaborDay: true,
//   jobDays: [{
//     weekday: 2,
//     hours: 2
//   }, {
//     weekday: 4,
//     hours: 4
//   }],
//   setbacks: [{
//     day: new Date(2020, 8, 22),
//     hours: 1
//   },
//   {
//     day: new Date(2020, 8, 24),
//     hours: 4
//   }]
// }]

@Injectable({
  providedIn: 'root'
})
export class JobService {

  constructor(private db: AngularFireDatabase, private userService: UserService) { }

  private jobsList: AngularFireList<Job> = null;

  private getJobsList(): AngularFireList<Job> {
    if (!this.userService.getUser()) { return; }
    const { uid } = this.userService.getUser();
    this.jobsList = this.db.list(`jobs/${uid}`);
    return this.jobsList;
  }

  getJobs(): Observable<Job[]> {
    return this.getJobsList().snapshotChanges().pipe(
      map(actions => {
        return actions.map(a => {
          const job: Job = { key: a.payload.key, ...a.payload.val() };
          this.calculateMonthlyIncome(job);
          return job;
        })
      }));
  }

  getSetbacksOnThisMonth(job: Job): JobSetback[] {
    const today = new Date();
    const firstDayMs = new Date(today.getFullYear(), today.getMonth(), 1).getTime();
    const lastDayMs = new Date(today.getFullYear(), today.getMonth() + 1, 0).getTime();
    job.setbacks?.forEach(s => s.dayObj = new Date(s.day));
    return job.setbacks?.filter(s => s.day > firstDayMs && s.day <= lastDayMs);
  }

  getMaxPayDay(jobs: Job[]): number {
    let fifthLaborDay = 1;
    let amountOfLaborDays = 0;
    let date = new Date();
    date.setMonth(date.getMonth() + 1);
    for (let d = 1; d < 10; d++) {
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

  saveJob(job: Job): Observable<SnapshotAction<Job>[]> {
    const jobs = this.getJobsList();
    job.startingDate = job.startingDateObj.getTime();
    jobs.push(job);
    return jobs.snapshotChanges();
  }

  saveSetback(job: Job, setback: JobSetback): Promise<void> {
    setback.day = setback.dayObj.getTime();
    job.setbacks = job.setbacks || [];
    job.setbacks.push(Object.assign({}, setback));
    return this.jobsList.update(job.key, job);
  }

  private calculateMonthlyIncome(job: Job): void {
    job.startingDateObj = new Date(job.startingDate);
    if (job.type === 'E') {
      job.monthlyIncome = job.value;
      return;
    }
    const today = new Date();
    const startingDay = job.startingDateObj.getMonth() === today.getMonth() ? job.startingDateObj.getDate() : 1;
    const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
    let sumHours = 0;
    for (let d = startingDay; d <= lastDay; d++) {
      today.setDate(d);
      const jobDay = job.jobDays.find(jd => jd.weekday === today.getDay());
      if (jobDay) {
        sumHours += jobDay.hours;
      }
    }

    const setbacks = this.getSetbacksOnThisMonth(job);
    setbacks?.forEach(s => sumHours -= s.hours);

    job.monthlyIncome = (sumHours * job.value);
  }
}
