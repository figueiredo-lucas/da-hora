import { Directive, Input } from '@angular/core';
import { NG_VALIDATORS, Validator, AbstractControl, ValidationErrors, Validators } from '@angular/forms';

@Directive({
  selector: '[max]',
  providers: [{ provide: NG_VALIDATORS, useExisting: MaxDirective, multi: true }]
})
export class MaxDirective implements Validator {

  constructor() { }

  @Input()
  max: number;

  validate(control: AbstractControl): ValidationErrors | null {
    return Validators.max(this.max)(control);
  }

}
