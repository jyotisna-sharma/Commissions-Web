import {AfterViewInit, Directive, ElementRef} from "@angular/core";

declare var $: any;
declare var responsiveMultiMenu: any;
declare var adaptMenu: any;

@Directive({
  selector: '[appResponsiveMultiMenu]'
})

export class ResponsiveMultiMenuDrirective implements AfterViewInit {
  constructor(private el: ElementRef) {}

  ngAfterViewInit(): void {
    responsiveMultiMenu();
    adaptMenu();
  }
}
