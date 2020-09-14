import { JobDays } from './job-days';
import { JobSetback } from './job-setback';

export interface Job {
  name: string,
  startingDate: Date,
  paymentDay?: number,
  payOnFifthLaborDay: boolean,
  valuePerHour: number,
  monthlyIncome?: number,
  jobDays: JobDays[],
  setbacks?: JobSetback[]
}