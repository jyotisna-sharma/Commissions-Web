import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { HttpClient, HttpRequest, HttpResponse, HttpEventType } from '@angular/common/http';
import { CommonDataService } from '../../../_services/common-data.service';
import { Guid } from 'guid-typescript';
import { ResponseCode } from '../../../response.code';
;
export interface DialogData {
  Title: string;
  subTitle: string;
  userName: string;
  licenseeId: string;
  primaryButton: string;
  secondaryButton: string;
  roleId: any;
  isCommanFunction: boolean;
  numberofButtons: any;
  policyId: any;
  uploadedFileList: any;
}

@Component({
  selector: 'app-upload-notes-file',
  templateUrl: './upload-notes-file.component.html',
  styleUrls: ['./upload-notes-file.component.scss']
})
export class UploadNotesFileComponent implements OnInit {
  percentDone: any = 0;
  isButtonHide: Boolean = false;
  postdata: any;
  isFileValid: Boolean = false;
  fileType: any;
  fileUploadingStart: Boolean = false;
  file: any;
  newFileName: any;
  serverUploadingDone: Boolean = false;
  validationMessage: any;
  isValidationShown: Boolean = false;
  batchNumber: any;
  originalFileName: any;
  constructor(
    public dialogRef: MatDialogRef<UploadNotesFileComponent>,
    private http: HttpClient,
    public cmnsrvc: CommonDataService,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {

  }
  ngOnInit() {
  }
  UploadAndProgress(files) {
    const allowFileType = ['pdf'];
    this.file = files.currentTarget.files[0];
    this.fileType = this.file.name.substring(this.file.name.lastIndexOf('.') + 1);
    for (const filetypeMatch of allowFileType) {
      if (filetypeMatch === this.fileType) {
        this.isFileValid = true;
        break;
      }
    }
    if (this.isFileValid === false) {
      this.isValidationShown = true;
      this.validationMessage = 'Please upload .pdf.';
      return;
    } else if (this.file.size > 10000000) {
      this.isValidationShown = true;
      this.validationMessage = 'The uploaded file exceeds the maximum size limit.';
      return;
    } else {
     
      this.isButtonHide = true;
      //  this.AfterUploadBatchFile(this.file);
      this.percentDone = 1;

      this.SendFileToServer(this.file.name);
    }
  }
  OnDisabledValidation() {
    this.isValidationShown = false;
  }


  SendFileToServer(fileName) {
    this.newFileName = this.GetFileName(fileName);
    const formData = new FormData();
    const file = this.file;
    const key = 'uploadData';
    formData.append(key, file, this.file);
    formData.append('fileName', file, this.newFileName);
    formData.append('FileSavingLocation', file, 'PolicyNotePDFFile');
    const url = 'api/CommonData/fileUpload';
    const req = new HttpRequest('POST', url, formData, {
      reportProgress: true,
    });
    this.http.request(req).subscribe(event => {
     
      this.fileUploadingStart = true;
      if (event.type === HttpEventType.UploadProgress) {
        this.percentDone = Math.round(100 * event.loaded / event.total);
      } else if (event instanceof HttpResponse) {
        this.UpdateNotesData();
        this.serverUploadingDone = true;
      }
    }, error => {
    });
  }
  GetFileName(fileName: any): any {
   
    this.originalFileName = fileName;
    let newFileName = this.data.policyId + '_' + fileName;
    const list = [];
    if (this.data.uploadedFileList.length > 0) {
      this.data.uploadedFileList.map(fileDetails => {
        if (fileDetails.FileName ===  this.originalFileName) {
          const duplicatefileName = fileDetails.UploadedFileName.split('/').slice(-1).join().split('.').shift();
          list.push(duplicatefileName);
        }
      });
    }
    if (list.length > 0) {

      const splitFileName = list[0];
      let splitFileNameList: any = [];
      splitFileNameList = splitFileName.split('_');
      const lastIndexValue = splitFileNameList[splitFileNameList.length - 1];
      const fileExt = newFileName.slice((newFileName.lastIndexOf(".") - 1 >>> 0) + 2);
      newFileName = newFileName.split('/').slice(-1).join().split('.').shift();
      if (!isNaN(lastIndexValue)) {
        newFileName = newFileName + '_' + (Number(lastIndexValue) + 1) + '.' + fileExt;
        return newFileName;
      } else {

        return newFileName = newFileName + '_1' + '.' + fileExt;
      }
    } else {
      return newFileName;
    }
  }
  UpdateNotesData(): any {
    const userDetails = JSON.parse(localStorage.getItem('loggedUser'));
    this.postdata = {
      'policyId': this.data.policyId,
      'fileName': this.originalFileName,
      'uploadedBy': userDetails.UserCredentialID,
      'uploadedFileName': this.newFileName,
      'URL': 'UploadNotesFile'
    };
    this.cmnsrvc.RequestSendsToAPI(this.postdata).subscribe(response => {
      if (response.ResponseCode === ResponseCode.SUCCESS) {
        this.dialogRef.close(true);
      }
    });
  }
}

