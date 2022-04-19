import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-mi-button',
  templateUrl: './mi-button.component.html',
  styleUrls: ['./mi-button.component.scss']
})
export class MiButtonComponent implements OnInit {
  @Input() btnLabel: string;
  @Input() showSpinner: boolean;
  @Output() onBtnClick = new EventEmitter<object>();
  constructor() { }

  ngOnInit() {
  }
  btnClicked() {
    this.onBtnClick.emit({  });
  }
}
