import { Injectable } from '@angular/core';
import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { FormControl, FormGroupDirective, NgForm, Validators, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { SuccessMessageComponent } from './dialogboxes/success-message/success-message.component'

@Injectable({
  providedIn: 'root'
})
export class ErrorMessageService {

  constructor( public dialog: MatDialog) { }
   public OpenResponseErrorDialog( Message: string) {
    const dialogRef = this.dialog.open(SuccessMessageComponent, {
      width: '450px',
      data: {
        Title: 'Error occured',
        subTitle: Message,
        buttonName: 'ok'
      }
    });
}
}
