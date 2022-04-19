import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { PayorToolUrlService } from '../payor-tool-url.service'
import { PayorToolService } from '../payor-tool.service'
import { ResponseCode } from '../../response.code';
@Component({
  selector: 'app-copy-template',
  templateUrl: './copy-template.component.html',
  styleUrls: ['./copy-template.component.scss']
})
export class CopyTemplateComponent implements OnInit {
  CopyTemplate = new FormGroup({
    PayorName: new FormControl('', []),
    TemplateName: new FormControl('', [])
  });
  templateList: any = [];
  showLoader: Boolean = false;
  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<CopyTemplateComponent>,
    public payortoolURLSvc: PayorToolUrlService,
    private payorSvc: PayorToolService,
  ) { }

  ngOnInit() {
    this.CopyTemplate.controls.TemplateName.disable();
  //  this.CopyTemplate.controls.PayorName.setValue(this.data.PayorList[0].PayorID);
  //  this.GetTemplateList();
  }
  //************************************************************************************************************************ */
  /* 
  CreatedBy:Jasmine
  CreatedOn:Feb19,20202
  Purpose:Getting template List based on PayorId 
  */
  GetTemplateList() {
    this.showLoader = true;
    const postData = {
      'payorId': this.CopyTemplate.controls.PayorName.value,
      'selectedTabName': this.data.selectedTabName
    }
    this.payorSvc.GetPayorTemplateList(postData).subscribe(response => {
      this.showLoader = false;
      if (response['ResponseCode'] === ResponseCode.SUCCESS) {
        this.templateList = response.TotalRecords;
        this.CopyTemplate.controls.TemplateName.setValue(response.TotalRecords[0].TemplateID);
        this.CopyTemplate.controls.TemplateName.enable();
      }
      else {
        this.templateList = [];
        this.CopyTemplate.controls.TemplateName.setValue('');
        this.CopyTemplate.controls.TemplateName.disable();
      }
    });
  }
  OnCloseDialog() {

    this.dialogRef.close(false);
  }
  //###########################################################################################################################

}
