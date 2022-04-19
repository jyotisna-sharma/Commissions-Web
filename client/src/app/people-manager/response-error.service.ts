import { Injectable } from '@angular/core';
import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { FormControl, FormGroupDirective, NgForm, Validators, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { SuccessMessageComponent } from '../_services/dialogboxes/success-message/success-message.component'

@Injectable({
  providedIn: 'root'
})
export class ResponseErrorService {

  constructor(public dialog: MatDialog) { }
  public OpenResponseErrorDilog(Message: string) {
    const dialogRef = this.dialog.open(SuccessMessageComponent, {
      width: '450px',
      data: {
        Title: 'Error occured',
        subTitle: Message,
        buttonName: 'ok',
        isCommanFunction: false
      }
    });
  }
}
