import { Component, OnInit, Inject, AfterViewInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
@Component({
  selector: 'app-email-dialog',
  templateUrl: './email-dialog.component.html',
  styleUrls: ['./email-dialog.component.scss']
})
export class EmailDialogComponent implements OnInit, AfterViewInit {
  EmailIds = new FormControl('', [])
  isvalidationShown: Boolean = false;
  validationMsg: any;
  isbuttondisabled: Boolean = true;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: EmailDialogComponent,
    public dialogRef: MatDialogRef<EmailDialogComponent>
  ) { }

  ngOnInit() {
  }
  ngAfterViewInit() {
    this.EmailIds.valueChanges.subscribe(response => {
      if (this.EmailIds.value) {
        this.isbuttondisabled = false;
      } else {
        this.isbuttondisabled = true;
      }
    });
  }
  OnValidateEmails() {
    const emailArray = this.EmailIds.value.split(',');
    for (const email of emailArray) {
      const status = this.checkEmail(email);
      if (status === false) {
        this.isvalidationShown = true;
        this.validationMsg = 'Please enter valid email address.'
        return;
      }
      else {
        this.isvalidationShown = false;
      }
    }
    if (!this.isvalidationShown) {
      this.dialogRef.close(this.EmailIds.value);
    }
  }
  OnButtonEnabled() {

  }

  checkEmail(email) {
    email = email.trim();
    const regExp = /(^[a-z]([a-z_\.]*)@([a-z_\.]*)([.][a-z]{3})$)|(^[a-z]([a-z_\.]*)@([a-z_\.]*)(\.[a-z]{3})(\.[a-z]{2})*$)/i;
    return regExp.test(email);
  }
  OnCloseValidationPopup() {
    this.isvalidationShown = false;
  }
}
