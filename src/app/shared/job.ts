import { JobDays } from './job-days';
import { JobSetback } from './job-setback';

export interface Job {
  key: string,
  type: string,
  name: string,
  startingDateObj?: Date,
  startingDate: number,
  paymentDay?: number,
  payOnFifthLaborDay?: boolean,
  value: number,
  monthlyIncome?: number,
  jobDays?: JobDays[],
  setbacks?: JobSetback[]
}