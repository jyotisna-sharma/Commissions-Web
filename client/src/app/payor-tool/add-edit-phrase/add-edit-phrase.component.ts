import { Component, OnInit, Inject, AfterViewInit } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { CommonDataService } from '../../_services/common-data.service';
import { ResponseCode } from '../../response.code';
@Component({
  selector: 'app-add-edit-phrase',
  templateUrl: './add-edit-phrase.component.html',
  styleUrls: ['./add-edit-phrase.component.scss']
})
export class AddEditPhraseComponent implements OnInit, AfterViewInit {
  pharaseForm: FormGroup = new FormGroup({
    PhraseName: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(30)]),

  });
  errorMsg: any = '';
  isValidationShown: Boolean = false;
  showLoading: Boolean = false;
  constructor(
    public dialogRef: MatDialogRef<AddEditPhraseComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public commonsvc: CommonDataService
  ) { }

  ngOnInit(): void {
    this.pharaseForm.controls.PhraseName.setValue(this.data.selectedRecordData ? this.data.selectedRecordData.PayorPhrases : '');
  }
  ngAfterViewInit(): void {
    this.pharaseForm.valueChanges.subscribe(result => {
      this.isValidationShown = false;
    })
  }
  SavePhraseDetails(): void {
    if (!this.pharaseForm.valid) {
      this.pharaseForm.controls.PhraseName.markAsTouched({ onlySelf: true });
      this.pharaseForm.controls.PhraseName.markAsDirty({ onlySelf: true });
      return;
    } else {
      this.showLoading = true;
      const details = this.data.selectedRecordData;
      const postdata = {
        'objImportToolPayorPhrase': {
          'TemplateID': details.TemplateID,
          'TemplateName': '',
          'PayorID': details.PayorID,
          'PayorName': '',
          'FileType': '',
          'FileFormat': '',
          'PayorPhrases': this.pharaseForm.controls.PhraseName.value,
          'ID': details.ID
        },
        'isForceToAdd': details.ID ? true : false
      };
      postdata['URL'] = 'SaveImportToolPhrase';
      this.commonsvc.RequestSendsToAPI(postdata).subscribe(response => {
        this.showLoading = false;
        if (response.ResponseCode === ResponseCode.SUCCESS) {
          this.dialogRef.close(true);
        } else if (response.ResponseCode === ResponseCode.RecordAlreadyExist) {
          this.isValidationShown = true;
          this.errorMsg = 'Phrase already exist do you want to continue?';
        }
      });
    }
  }
  SaveDuplicatePhrase(): void {
    this.showLoading = true;
    const details = this.data.selectedRecordData;
    const postdata = {
      'objImportToolPayorPhrase': {
        'TemplateID': details.TemplateID,
        'PayorID': details.PayorID,
        'PayorPhrases': this.pharaseForm.controls.PhraseName.value,
        'ID': details.ID
      },
      'isForceToAdd': true
    };
    postdata['URL'] = 'SaveImportToolPhrase';
    this.commonsvc.RequestSendsToAPI(postdata).subscribe(response => {
      this.showLoading = false;
      if (response.ResponseCode === ResponseCode.SUCCESS) {
        this.dialogRef.close(true);
      }
    });
  }

}
