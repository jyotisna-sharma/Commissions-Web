import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { RemoveAgentData } from './removeAgent.model'
import { PeoplemanagerService } from '../../../people-manager/peoplemanager.service';
import { PeopleManagerAPIUrlService } from '../../../people-manager/people-manager-url.service';

@Component({
  selector: 'app-remove-confirmation',
  templateUrl: './remove-confirmation.component.html',
  styleUrls: ['./remove-confirmation.component.scss']
})
export class RemoveConfirmationComponent implements OnInit {
  dataToPost: any;
  isOKbuttonshows: boolean;
  buttonText: string
  constructor(
    public dialogRef: MatDialogRef<RemoveConfirmationComponent>,
    @Inject(MAT_DIALOG_DATA) public data: RemoveAgentData,
    public peoplemanagerService: PeoplemanagerService,
    public peopleManagerAPIUrlService: PeopleManagerAPIUrlService) {

  }
  ngOnInit() {
    if (this.data.forceToDelete === false) {
      this.isOKbuttonshows = true;
      this.buttonText = 'Ok'
    } else {
      this.isOKbuttonshows = false;
    }
  }

}
