import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { HttpClient, HttpRequest, HttpResponse, HttpEventType } from '@angular/common/http';
import { CommonDataService } from '../../common-data.service';
import { Guid } from 'guid-typescript';
import { ResponseCode } from '../../../response.code';
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
}

@Component({
  selector: 'app-upload-file',
  templateUrl: './upload-file.component.html',
  styleUrls: ['./upload-file.component.scss']
})
export class UploadFileComponent implements OnInit {
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
  constructor(
    public dialogRef: MatDialogRef<UploadFileComponent>,
    private http: HttpClient,
    public cmnsrvc: CommonDataService,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {

  }
  ngOnInit() {
  }
  UploadAndProgress(files) {
    const allowFileType = ['xls', 'xlsx', 'pdf'];
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
      this.validationMessage = 'Please upload .pdf, excel(.xls) file.';
      return;
    } else if (this.file.size > 40000000) {
      this.isValidationShown = true;
      this.validationMessage = 'The uploaded file exceeds the maximum size limit.';
      return;
    } else {
      this.isButtonHide = true;
      this.AfterUploadBatchFile(this.file);
    }
  }
  OnDisabledValidation() {
    this.isValidationShown = false;
  }
  AfterUploadBatchFile(fileData) {
    this.percentDone = 1;
    let ManuallyUpload;
    let EntryStatus;
    let UploadStatus;
    const UserData = JSON.parse(localStorage.getItem('loggedUser'));
    if (this.fileType === 'pdf') {
      ManuallyUpload = true;
      EntryStatus = 1;
      UploadStatus = 4;
    } else if (this.fileType === 'xls' || this.fileType === 'xlsx' || this.fileType === 'csv') {
      ManuallyUpload = false;
      EntryStatus = 9;
      UploadStatus = 6;
    }
    this.postdata = {
      'batchData': {
        'BatchId': Guid.create().toJSON().value,
        'CreatedDateString': new Date(),
        'IsManuallyUploaded': ManuallyUpload,
        'EntryStatus': EntryStatus,
        'UploadStatus': UploadStatus,
        'FileType': this.fileType,
        'LicenseeId': UserData.LicenseeId,
        'LicenseeName': UserData.LicenseeName
      }
    };
    this.percentDone = 2;
    this.cmnsrvc.GetUploadBatchNumber(this.postdata).subscribe(response => {
      if (response.ResponseCode === ResponseCode.SUCCESS) {
        this.percentDone = 3;
        this.batchNumber = response.BatchNumber
        if (this.fileType === 'pdf') {
          this.newFileName = UserData.LicenseeName + '_' + this.batchNumber + '.' + this.fileType
        } else if (this.fileType === 'xls' || this.fileType === 'xlsx' || this.fileType === 'csv') {
          this.newFileName = UserData.LicenseeName + '_' + this.batchNumber + '_' + UserData.LicenseeId + '.' + this.fileType
        }
        this.SendFileToServer(this.newFileName);
      }
    });
  }
  SendFileToServer(fileName) {
    const formData = new FormData();
    const file = this.file;
    const key = 'uploadData';
    formData.append(key, file, this.file);
    formData.append('fileName', file, fileName);
    const url = 'api/CommonData/fileUpload'
    const req = new HttpRequest('POST', url, formData, {
      reportProgress: true,
    });
    this.http.request(req).subscribe(event => {
      this.fileUploadingStart = true;
      if (event.type === HttpEventType.UploadProgress) {
        this.percentDone = Math.round(100 * event.loaded / event.total);
      } else if (event instanceof HttpResponse) {
        this.UpdateBatchData();
        this.serverUploadingDone = true;
      }
    }, error => {
    });
  }
  UpdateBatchData() {
    this.postdata = {
      'batchNumber': this.batchNumber,
      'fileName': this.newFileName
    };
    this.cmnsrvc.UpdateBatchFileName(this.postdata).subscribe(response => {
      if (response.ResponseCode === ResponseCode.SUCCESS) {
        this.dialogRef.close(true);
      }
    });
  }
}
