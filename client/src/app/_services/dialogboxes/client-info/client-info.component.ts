import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup, FormControl } from '@angular/forms';
import { ClientService } from '../../../client/client.service';
import { ResponseCode } from '../../../response.code';

@Component({
  selector: 'app-client-info',
  templateUrl: './client-info.component.html',
  styleUrls: ['./client-info.component.css']
})
export class ClientInfoComponent implements OnInit {

  //  clientForm = new FormGroup({
    name: any;
    email: any;
    address: any;
    ssn: any;
    dob : any;
    gender : any;
    maritalStatus : any;
    showLoading: boolean = false;
    phone: any;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: {clientId: any},
    public dialogRef: MatDialogRef<ClientInfoComponent>,
    public clientService: ClientService
  ) { }

  ngOnInit(): void {
    debugger;
    this.showLoading = true;
    let postdata = {
      'clientId': this.data.clientId,
      'licenseeId': JSON.parse(localStorage.getItem('loggedUser'))['LicenseeId']
    };
    this.clientService.getClientDetails(postdata).subscribe(response => {
     
      if (response.ResponseCode === ResponseCode.SUCCESS) {
        this.SetClientDetails(response.ClientObject);
        //this.showLoader = this.SetClientDetails(response.ClientObject)
      //  this.showLoader = true;
        // 
        //address=response.ClientObject.Address);
      }
      else
      {
        this.showLoading = false;
      }
    });
  }

  public SetClientDetails(getResponse) {  debugger;
    this.name = getResponse.Name ? getResponse.Name : 'NA';
    this.email=getResponse.Email ? getResponse.Email : 'NA';;
    this.address=getResponse.Address ? getResponse.Address : 'NA';;
    this.ssn=getResponse.SSN ? getResponse.SSN : 'NA';;
    this.gender=getResponse.Gender? getResponse.Gender : 'NA';;
    this.maritalStatus=getResponse.MaritalStatus ? getResponse.MaritalStatus : 'NA';;
    this.dob=getResponse.DOBString ? getResponse.DOBString : 'NA';

    let phone = 'NA';
    if(getResponse.Phone.PhoneNumber){
      if(getResponse.Phone.DialCode){
        phone = getResponse.Phone.DialCode + '-' + getResponse.Phone.PhoneNumber;
      }
      else{
        phone = getResponse.Phone.PhoneNumber;
      }
    }
    this.phone = phone;
    this.showLoading = false;
  }

  OnClosePopup(){
    this.dialogRef.close();
  }

}
