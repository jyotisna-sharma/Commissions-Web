import { interval as observableInterval, Subscription } from 'rxjs';
import { Directive, ElementRef, EventEmitter, HostListener, OnDestroy, Output } from '@angular/core';


@Directive({
  selector: '[appNumberWithDefault]'
})
export class NumberWithDefaultDirective {
  IntervalSubscription: Subscription;
  @Output() ngModelChange = new EventEmitter();


  constructor(private el: ElementRef) {
    this.IntervalSubscription = observableInterval(500).subscribe(x => {
      if (x === 0) {
        if (((this.el || {})['nativeElement'] || {}).value) {
          this.onChange();
        }
      } else {
        this.IntervalSubscription.unsubscribe();
      }
    });
  }

  ngOnDestroy(): void {
    this.IntervalSubscription.unsubscribe();
  }

  @HostListener('keypress', ['$event']) onKeyPress($event): boolean {
    const charCode = ($event.which) ? $event.which : $event.keyCode;
    if ( charCode !== 45 && charCode !== 46 && charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }

  @HostListener('keyup') onKeyUp(): void {
    if (!this.el.nativeElement.value) {
      this.ngModelChange.emit(null);
    }
  }

  @HostListener('change') onChange(): void {
    const maxValue = (this.el.nativeElement.id.toLowerCase().indexOf('markup') > -1) ? 3 : 6;
    this.el.nativeElement.value = this.el.nativeElement.value.replace(/^ -?[\d.]/g, '');
    const beforeVal = (this.el.nativeElement.value || '').split('.')[0] || '';
    const afterVal = (this.el.nativeElement.value || '').split('.')[1] || '';
    // tslint:disable-next-line:max-line-length
    this.el.nativeElement.value = (beforeVal.substring(0, maxValue) + ((afterVal || this.el.nativeElement.value.indexOf('.') > -1) ? '.' : '') + afterVal.substring(0, 2));
    if (this.el.nativeElement.value) {
      const vTs = parseFloat(this.el.nativeElement.value).toFixed(2);
      if (vTs !== 'NaN') {
        this.el.nativeElement.value = vTs;
        this.ngModelChange.emit(this.el.nativeElement.value);
      } else {
        this.el.nativeElement.value = null;
        this.ngModelChange.emit(null);
      }
    }
  }

  modifyValue = (field, value) => {
    const createEvent = function (name) {
      const event = document.createEvent('Event');
      event.initEvent(name, true, true);
      return event;
    }
    // field.dispatchEvent(createEvent('focus'));
    // $(field).val(value);
    field.dispatchEvent(createEvent('change'));
    field.dispatchEvent(createEvent('input'));
  }

  @HostListener('blur') onBlur(): void {
    let val = (this.el.nativeElement.value && this.el.nativeElement.value !== '') ? this.el.nativeElement.value : '0.00';
    this.el.nativeElement.value = val;
    this.modifyValue(this.el.nativeElement, this.el.nativeElement.value || null);
  }

}
