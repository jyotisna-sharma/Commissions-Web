import { Directive, ElementRef, HostListener, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appToggleClass]'
})

export class ToggleClassDirective {
  constructor(public refElement: ElementRef, public render: Renderer2) {}
   @HostListener('click') onclick() {
     if (this.refElement.nativeElement.parentNode.classList.contains('toggleClass')) {
        this.render.removeClass(this.refElement.nativeElement.parentNode, 'toggleClass');
     } else {
        this.render.addClass(this.refElement.nativeElement.parentNode, 'toggleClass');
     }
  }
}
