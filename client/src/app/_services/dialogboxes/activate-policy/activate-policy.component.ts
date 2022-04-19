import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CommissionOutgoingPaymentData } from '../commission-dashboard-reverse-payment/CommisssionOutgoingPaymentData.model';
import { PolicymanagerService } from '../../../policy-manager/policymanager.service';
import { FormGroup, FormControl } from '@angular/forms';
import { CompManagerService } from '../../../comp-manager/comp-manager.service';
import { clientObject } from '../../../shared/dataObjects/clientObject';
import { Observable } from 'rxjs';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { debounceTime, distinctUntilChanged, map, startWith } from 'rxjs/operators';


@Component({
  selector: 'app-activate-policy',
  templateUrl: './activate-policy.component.html',
  styleUrls: ['./activate-policy.component.scss']
})
export class ActivatePolicyComponent implements OnInit {
  ActivatePolicy = new FormGroup({
    ClientList: new FormControl('', []),
    CurrentClient: new FormControl('', []),
    ClientObject: new FormControl('', [])
  });
  clientsList: any = [];
  ClientListing: Observable<clientObject[]>
  showloading: boolean = false;
  userDetails: any;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: CommissionOutgoingPaymentData,
    public dialogRef: MatDialogRef<ActivatePolicyComponent>,
    public policyService: PolicymanagerService,
    public compMgrService: CompManagerService
  ) { }

  ngOnInit() {
     this.ActivatePolicy.controls.CurrentClient.disable();
     this.ActivatePolicy.controls.CurrentClient.setValue(this.data.extraData.CurrentClient);
    this.userDetails = JSON.parse(localStorage.getItem('loggedUser'));
    //this.clientsList = this.data.extraData.ClientList;
    //this.ActivatePolicy.controls.ClientList.setValue(this.clientsList[0].ClientId);
    debugger;
    this.getClientNameFromAPI();
    //this.SetAllFiltersValue();
    this.ActivatePolicy.controls.ClientObject.valueChanges.subscribe((changedValue) => {
      //if ((this.client.controls.ClientObject.value as string).length >= 3 && this.previousFormContorlValue != this.client.controls.ClientObject.value) {
      this.getClientSuggestList(changedValue);
      //} 
      // else if ((this.client.controls.Client.value as string).length < 3) {
      //   // this.ClientListing
      // }
    });

  }

  /*********************Get clients list from Auto suggestion API ******************************/
  getClientSuggestList(searchString: any) {
    //this.showloading = true;
    let postdata = {
      'licenseeId': this.userDetails['LicenseeId'],
      'loggedInUserId': this.userDetails['UserCredentialID'],
      'searchString': searchString
    }
    
    this.policyService.getSearchedClientName(postdata).subscribe(response => {
      //this.showloading = false;
      this.clientsList = response.ClientList;
      this.SetAllFiltersValue();
     // this.client.controls.ClientList.setValue(this.getRouteParamtersService.ClientId);
      //this.ActivatePolicy.controls.ClientObject.setValue(this.clientsList.filter(client => client['ClientId'] === this.getRouteParamtersService.ClientId)[0].Name);

      // this.setClientName();
    })
  }

  OnClosePopup() {
    this.dialogRef.close(false)
  }

  getClientNameFromAPI() {
    this.showloading = true;
    let postdata = {
      'licenseeId': this.userDetails['LicenseeId'],
      'loggedInUserId': this.userDetails['UserCredentialID'],
      'clientId': null //this.getRouteParamtersService.ClientId
    }
    this.policyService.getClientName(postdata).subscribe(response => {
      this.showloading = false;
      this.clientsList = response.ClientList;  // JSON.parse(localStorage.getItem('ClientList'));
     
      // this.client.controls.ClientList.setValue(this.getRouteParamtersService.ClientId);
      // let name = this.clientsListing.filter(client => client['ClientId'] === this.getRouteParamtersService.ClientId)[0].Name
      // this.client.controls.ClientObject.setValue(name);
      this.ActivatePolicy.controls.ClientObject.setValue(this.clientsList[0].Name);
      // this.SetAllFiltersValue();
     
    });
  }

  //----------------------------------------------------------------------------------------------
  // -----------------Client Filter --------------------------------------
  SetAllFiltersValue() {
    this.ClientListing = this.ActivatePolicy.controls.ClientObject.valueChanges.pipe(
      startWith(''),
      debounceTime(700),
      distinctUntilChanged(),
      map(value => value ? this._Clientfilter(value) : this.clientsList.slice())
    );
  }
  _Clientfilter(value: any): clientObject[] {
    const filterValue = (value.Name) ? value.Name.toLowerCase() : value.toLowerCase();
    return this.clientsList.filter(option => option.Name.toLowerCase().indexOf(filterValue) === 0);
  }
  
  OnClientChange(value) {
    this.ActivatePolicy.controls.ClientObject.setValue(value.option.value.Name);
    this.ActivatePolicy.controls.ClientList.setValue(value.option.value.ClientId);
  }

}
