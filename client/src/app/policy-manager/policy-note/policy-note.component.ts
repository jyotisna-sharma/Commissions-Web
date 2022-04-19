import { Component, OnInit, ViewChild } from '@angular/core';
import { GetRouteParamtersService } from '../../_services/getRouteParamters.service';
import { ActivatedRoute } from '@angular/router';
import { MatInput } from '@angular/material/input';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { PolicymanagerService } from '../policymanager.service';
import { Guid } from 'guid-typescript';
import { ResponseCode } from '../../response.code';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ServerURLS } from '../../../assets/config/CONSTANTS';
import { UploadNotesFileComponent } from '../policy-note/upload-notes-file/upload-notes-file.component';
import { CommonDataService } from '../../_services/common-data.service';
import { RemoveConfirmationComponent } from '../../_services/dialogboxes/remove-confirmation/remove-confirmation.component';
@Component({
  selector: 'app-policy-note',
  templateUrl: './policy-note.component.html',
  styleUrls: ['./policy-note.component.scss']
})
export class PolicyNoteComponent implements OnInit {
  moduleName: any;
  pagename: any;
  clientName: any;
  text: string;
  isButtonEnabled: Boolean = false;
  notesList: any;
  notesCount: any;
  userdetails: any;
  noteId: any;
  isEditButtonDisabled: Boolean = false;
  isUpdateButtonShown: Boolean = false;
  lastSelectedTr: any;
  showLoader: Boolean = true;
  buttonClicked: Boolean = false;
  policyNumber: any;
  uploadedFileList: any;
  Notes = new FormGroup({
    noteData: new FormControl('', [Validators.maxLength(5000)])
  });
  dataToPost: any;
  @ViewChild('note', { static: true }) noteref: MatInput;
  constructor(
    public getrouteParamters: GetRouteParamtersService,
    public activateRoute: ActivatedRoute,
    public policyService: PolicymanagerService,
    public dialog: MatDialog,
    public routers: Router,
    public commonSvc: CommonDataService
  ) { }
  ngOnInit() {
    this.showLoader = true;
    this.policyNumber = localStorage.getItem('PolicyNumber');
    this.text = 'Maximum characters 5000';
    this.getrouteParamters.getparameterslist(this.activateRoute)
    this.moduleName = this.routers.url.indexOf('advance-Search') > -1 ? 'Policy Manager - Advance Search ' : 'Policy manager';
    this.pagename = 'Edit Policy';
    this.userdetails = JSON.parse(localStorage.getItem('loggedUser'));
    this.noteref.focus();
    this.GetNotesList();
  }
  OnGetNoteValueLength(value) {
    this.text = value.length + ' ' + 'out of  5000';
    if (value.length > 0) {
      this.isButtonEnabled = true;
      this.buttonClicked = false;
    } else if (value.length === 0) {
      this.isButtonEnabled = false;
    }
  }
  GetNotesList() {
    this.showLoader = true;
    this.dataToPost = {
      'policyId': this.getrouteParamters.PolicyId
    }
    this.policyService.GetPolicyNotesList(this.dataToPost).subscribe(response => {
      if (response.ResponseCode === ResponseCode.SUCCESS) {
        this.uploadedFileList = response.UploadedFileList;
        this.notesList = response.PolicyNotesList;
        this.notesCount = response.policyNotesCount;
        this.showLoader = false;
      } else {

      }
    });
  }
  OnSaveNotes() {
    this.showLoader = true;
    this.buttonClicked = true;
    if (!this.Notes.valid) {
      return;
    }
    if (this.noteId) {
      this.dataToPost = {
        'policyId': this.getrouteParamters.PolicyId,
        'noteId': this.noteId,
        'note': this.Notes.controls.noteData.value,
        'createdBy': null,
        'modifiedBy': this.userdetails['UserCredentialID']
      }
    } else {
      this.dataToPost = {
        'policyId': this.getrouteParamters.PolicyId,
        'noteId': Guid.create().toJSON().value,
        'note': this.Notes.controls.noteData.value,
        'createdBy': this.userdetails['UserCredentialID'],
        'modifiedBy': null
      }
    }
    this.policyService.addUpdatePolicyNotes(this.dataToPost).subscribe(response => {
      if (response.ResponseCode === ResponseCode.SUCCESS) {
        this.GetNotesList();
        this.text = 'Maximum characters 250';
        this.isUpdateButtonShown = false;
        this.Notes.controls.noteData.setValue('');
        this.noteId = '';
      }
    });
  }
  OnNoteDetailsEdit(value, data) {
    this.noteref.focus();
    if (this.lastSelectedTr) {
      this.lastSelectedTr.classList.remove('disable');
    }
    this.isUpdateButtonShown = true;
    this.Notes.controls.noteData.setValue(data.Content);
    this.noteId = data.NoteID;
    this.isEditButtonDisabled = true;
    this.lastSelectedTr = value.currentTarget;
    value.currentTarget.classList.add('disable');
  }

  OnCancel() {
    this.buttonClicked = true;
    this.text = 'Maximum characters 5000';
    this.isUpdateButtonShown = false;
    this.Notes.controls.noteData.setValue('');
    this.noteId = '';
    if (this.lastSelectedTr) {
      this.lastSelectedTr.classList.remove('disable');
    }
    this.lastSelectedTr = '';
  }
  openDeleteDialogBox(data) {
    const dialogRef = this.dialog.open(RemoveConfirmationComponent, {
      data: {
        headingTitle: 'Delete Policy',
        subTitle: ' Are you sure you want to delete policy Notes?',
        primaryButton: 'Yes, Delete'
      },
      width: '450px',
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result === true) {
        this.dataToPost = {
          'policyId': data.PolicyId,
          'noteId': data.NoteID
        }
        this.policyService.DeletePolicyNote(this.dataToPost).subscribe(response => {
          if (response.ResponseCode === ResponseCode.SUCCESS) {
            this.GetNotesList();
            this.text = 'Maximum characters 5000';
            this.isUpdateButtonShown = false;
            this.Notes.controls.noteData.setValue('');
            this.noteId = '';
            if (this.lastSelectedTr) {
              this.lastSelectedTr.classList.remove('disable');
            }
          }
        });
      }
    });

  }
  OnPageRedirection() {
    if (this.routers.url.indexOf('advance-Search') > -1) {
      this.routers.navigate(['policy/advance-Search', this.getrouteParamters.parentTab,
        this.getrouteParamters.pageSize, this.getrouteParamters.pageIndex]);
    } else {
      this.routers.navigate(['policy/policyListing', this.getrouteParamters.parentTab,
        this.getrouteParamters.pageSize, this.getrouteParamters.pageIndex]);
    }
  }
  OpenFileUploadDialog(): any {
    const dialogRef = this.dialog.open(UploadNotesFileComponent, {
      width: '450px',
      data: {
        Title: 'Upload Notes',
        secondaryButton: 'Cancel',
        primaryButton: 'Ok',
        policyId: this.getrouteParamters.PolicyId,
        uploadedFileList: this.uploadedFileList
      },
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.GetNotesList();
      }
    });
  }
  DownloadPDFile(element) {
    debugger;
    const anchor = document.createElement('a');
    const fileExt = element.UploadedFileName.slice((element.UploadedFileName.lastIndexOf(".") - 1 >>> 0) + 2);
    if (fileExt) {

      if (fileExt.toLowerCase() === 'pdf') {

        anchor.href = ServerURLS.PolicyNoteURL + element.UploadedFileName;
        anchor.target = '_blank';
      }
      document.body.appendChild(anchor);
      anchor.click();
      document.body.removeChild(anchor);
    }
  }
  OnDeleteUploadedFile(data) {
    const dialogRef = this.dialog.open(RemoveConfirmationComponent, {
      data: {
        headingTitle: 'Delete Uploaded File',
        subTitle: ' Are you sure you want to delete selected File?',
        primaryButton: 'Yes, Delete'
      },
      width: '450px',
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result === true) {
        this.dataToPost = {
          'policyId': data.PolicyId,
          'noteId': data.PolicyNoteId,
          'fileName': data.UploadedFileName,
          URL: 'DeletePolicyNotesFile'
        };
        this.showLoader = true;
        this.commonSvc.RequestSendsToAPI(this.dataToPost).subscribe(response => {
          if (response.ResponseCode === ResponseCode.SUCCESS) {
            this.showLoader = false;
            this.GetNotesList();
            this.text = 'Maximum characters 5000';
            this.isUpdateButtonShown = false;
            this.Notes.controls.noteData.setValue('');
            this.noteId = '';
            if (this.lastSelectedTr) {
              this.lastSelectedTr.classList.remove('disable');
            }
          }
        });
      }
    });

  }
}
