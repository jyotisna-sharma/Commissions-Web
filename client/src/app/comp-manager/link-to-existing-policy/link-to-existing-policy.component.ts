import { Component, OnInit } from '@angular/core';
import { CompManagerService } from '../comp-manager.service';
import { CompManagerURLService } from '../comp-manager-url.service';
import { MiProperties } from '../../shared/mi-list/mi-properties';
import { MiListMenu } from '../../shared/mi-list/mi-list-menu';
import { TableDataSource } from '../../_services/table.datasource';
import { Subject } from 'rxjs/Subject';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MiListFieldType } from 'src/app/shared/mi-list/mi-list-field-type';
import { MiListMenuItem } from '../../shared/mi-list/mi-list-menu-item';
import { ResponseCode } from '../../response.code';
import { AppLevelDataService } from '../../_services/app-level-data.service';
import { GetRouteParamtersService } from '../../_services/getRouteParamters.service';
import { CommonDataService } from '../../_services/common-data.service';
import { ShowConfirmationComponent } from '../../_services/dialogboxes/show-confirmation/show-confirmation.component';
import { MatDialog } from '@angular/material/dialog';
import { SuccessMessageComponent } from '../../_services/dialogboxes/success-message/success-message.component';
import { clientObject } from 'src/app/shared/dataObjects/clientObject';
import { Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged, map, startWith } from 'rxjs/operators';
import { PolicymanagerService } from 'src/app/policy-manager/policymanager.service';
@Component({
  selector: 'app-link-to-existing-policy',
  templateUrl: './link-to-existing-policy.component.html',
  styleUrls: ['./link-to-existing-policy.component.scss']
})
export class LinkToExistingPolicyComponent implements OnInit {
  selectedPolicy: MiProperties = new MiProperties();
  MiListProperties: MiProperties = new MiProperties();
  needRefreshFirstList: Subject<boolean> = new Subject();
  selectedPolicyNeedRefresh: Subject<boolean> = new Subject();
  needPageReset: Subject<boolean> = new Subject();
  accordionPanelNeedRefresh: Subject<boolean> = new Subject();
  accordionPanelList: MiProperties = new MiProperties();
  isaccordionPanelShow: Boolean = false;
  postdata: any;
  userDetail: any;
  dataTopost: any;
  clients: any;
  payorList: any;
  lastSelectedClass: any;
  policyPaymentData: any;
  responseData: any;
  defaultPayorId: any;
  toggleSelect = false;
  isdefaultPayorShown: Boolean = false;
  moduleName: any;
  shownSuccesspopup: Boolean = false;
  showloading: Boolean = false;
  previousName:  string = "";
  //txtValue:  string = "";
  pagename: any;
  selectedActivePolicy: any;
  pendingPolicyClientId: any;
  selectedClientId: any;
  isLinkDisabled: Boolean = true;
  isPolicySelected: Boolean = false;
  pendingPolicyId: any;
  columnIsSortable = [
    ['OriginDateString', 'date']
  ];
  selectedPolicyPayments: any;
  activePolicyList: any;
  ClientListing: Observable<clientObject[]>;

  filters = new FormGroup({
    Payor: new FormControl('', []),
    Client: new FormControl('', []),
    ClientObject: new FormControl('', [])
  });

  isFirstLoad: any = true;
  
  constructor(
    public activatedRoute: ActivatedRoute,
    public route: Router,
    public compMangrSvc: CompManagerService,
    public compManagerUrl: CompManagerURLService,
    public appData: AppLevelDataService,
    public getrouterParamters: GetRouteParamtersService,
    public CommanDataSvc: CommonDataService,
    public policyService: PolicymanagerService,
    public dilog: MatDialog
  ) {
  }

  ngOnInit() {
    this.pagename = 'Link payment to policies ';
    this.moduleName = 'Comp Manager';
    this.getrouterParamters.getparameterslist(this.activatedRoute);
    this.userDetail = JSON.parse(localStorage.getItem('loggedUser'));
    this.GetSelectedPolicyData();
    this.GetSelectedPolicyDataPrmtrs(this.getrouterParamters.PolicyId);
    this.isaccordionPanelShow = false;
  }
/*********************Auto suggestion client code Begins **************************************** */
OnClientChange(value) { debugger;
  this.filters.controls.ClientObject.setValue(value.option.value.Name);
  this.filters.controls.Client.setValue(value.option.value.ClientId);
  this.OnPayorChange();

  //improve autosuggestion of client name
  //this.previousName = value.option.value.Name;
  //improve autosuggestion of client name
}

  GetClientList() {
    const userdetail = JSON.parse(localStorage.getItem('loggedUser'));
    this.postdata = {
      'licenseeId': userdetail['LicenseeId'],
      'loggedInUserId': userdetail['UserCredentialID'],
      'clientId': this.pendingPolicyClientId
    }
    this.policyService.getClientName(this.postdata).subscribe(response => {
      this.clients = response.ClientList;  // JSON.parse(localStorage.getItem('ClientList'));
      this.SetAllFiltersValue();
      //this.client.controls.ClientList.setValue(this.getRouteParamtersService.ClientId);
      let name = this.clients.filter(client => client['ClientId'] === this.pendingPolicyClientId)[0].Name
      //this.filters.controls.ClientObject.setValue(name);
      //this.filters.controls.Client.setValue(this.pendingPolicyClientId);

      this.GetPayorList();
    });
    // this.postdata = {
    //   'licenseeId': userdetails.LicenseeId,
    // }
    // this.CommanDataSvc.getAllClientName(this.postdata).subscribe(response => {
    //   if (response.ResponseCode === ResponseCode.SUCCESS) {
    //     const lst = response.ClientList;
    //     const all = { 'ClientId': '', 'Name': 'All' }
    //     lst.unshift(all);
    //     this.clients = lst;  // response.ClientList;
    //   }

    // });
  }

  getClientSuggestList(searchString: any) {
    //alert("in1");

    if(searchString.length === 0)
    {
      //alert("in1");
      this.isPolicySelected = false;
      this.ClientListing = new Observable<clientObject[]>();
      //this.refreshList();
      this.doSearch();
      return;
    }

    const userdetail = JSON.parse(localStorage.getItem('loggedUser'));
    this.postdata = {
      'licenseeId': userdetail['LicenseeId'],
      'loggedInUserId': userdetail['UserCredentialID'],
      'searchString': searchString
    }
    this.policyService.getSearchedClientName(this.postdata).subscribe(response => {
      this.clients = response.ClientList;
      this.SetAllFiltersValue();
     // this.client.controls.ClientList.setValue(this.getRouteParamtersService.ClientId);
      // this.client.controls.ClientObject.setValue(this.clientListing.filter(client => client['ClientId'] === this.getRouteParamtersService.ClientId)[0].Name);

      // this.setClientName();
    })
  }

  SetAllFiltersValue() {
    //alert("in");

    let checkValue = this.filters.controls.ClientObject.value;//this handle starting autosuggestion when we focus on TextBox immediately after pageload(so that no value should populate)
    //alert("checkValue="+checkValue);

    if(checkValue !== "")
    {
      //alert("in2");
      this.ClientListing = this.filters.controls.ClientObject.valueChanges.pipe(
        startWith(''),
        debounceTime(700),
        distinctUntilChanged(),
        map(value => value ? this._Clientfilter(value) : this.clients.slice())
      );
    }
  }
  _Clientfilter(value: any): clientObject[] {
    //alert("value="+value);
    const filterValue = (value.Name) ? value.Name.toLowerCase() : value.toLowerCase();
    //alert("filterValue="+filterValue);
    return this.clients.filter(option => option.Name.toLowerCase().indexOf(filterValue) === 0);
  }
  /*********************Auto suggestion client code ends **************************************** */

  GetPayorList() {
    this.showloading = true;
    const userdetails = JSON.parse(localStorage.getItem('loggedUser'));
    this.CommanDataSvc.getPayorsList({ 'LicenseeID': userdetails['LicenseeId'] }).subscribe(response => {
      if (response.ResponseCode === ResponseCode.SUCCESS) {
        const lst = response.PayorList;
        const all = { 'PayorID': '', 'PayorName': 'All' }
        lst.unshift(all);
        this.payorList = lst; // response.PayorList;
        this.filters.controls.Payor.setValue(this.defaultPayorId);
        this.isdefaultPayorShown = true;
        this.initList();
        this.refreshList();
        this.showloading = false;
      }

    });
    // this.isdefaultPayorShown = true;
    // this.initList();
    // this.refreshList();
  }
  OnPageRedirection(data, name) {
    this.route.navigate(['comp-manager/link-policies', this.getrouterParamters.parentTab, this.getrouterParamters.pageIndex,
      this.getrouterParamters.pageSize]);
  }
  OnCancelbuttonClick() {
    this.route.navigate(['comp-manager/link-policies', this.getrouterParamters.parentTab, this.getrouterParamters.pageIndex,
      this.getrouterParamters.pageSize]);

  }
  GetSelectedPolicyData() {
    const url = this.compManagerUrl.LinkPolicies.GetPolicyPaymentData;
    this.selectedPolicy.url = url;
    this.selectedPolicy.miDataSource = new TableDataSource(this.compMangrSvc);
    this.selectedPolicy.columnLabels = ['Payor', 'Client',
      'Policy #', 'Insured/Div', 'Carrier', 'Product', 'Comp type', 'Product type', ''];
    this.selectedPolicy.displayedColumns = ['Payor', 'Client', 'PolicyNumber', 'Insured', 'Carrier', 'Product',
      'CompType', 'ProductType', 'Action'];
    this.selectedPolicy.columnIsSortable = ['false', 'false', 'false', 'false', 'false', 'false', 'false', 'false', 'false'];
    this.selectedPolicy.isClientSideList = false;
    this.selectedPolicy.refreshHandler = this.selectedPolicyNeedRefresh;
    this.selectedPolicy.showPaging = false;
    this.selectedPolicy.resetPagingHandler = this.needPageReset;
    this.selectedPolicy.miListMenu = new MiListMenu();
    this.selectedPolicy.miListMenu.visibleOnDesk = true;
    this.selectedPolicy.miListMenu.visibleOnMob = false;
    this.selectedPolicy.isaccordingPanelShown = true;
    this.selectedPolicy.isEditablegrid = true;
    this.selectedPolicy.accordingPanelHeader = ['Insur'];
    this.selectedPolicy.fieldType = {
      'SelectData': new MiListFieldType('', 'SelectData', '', '', 'radio-button', '', '', false, null, '', '', ''),
    }
    this.selectedPolicy.miListMenu.menuItems =
      [
        new MiListMenuItem('Hide Data', 3, true, false, null, 'img-icons arrow-down-icn'),
      ];
    this.selectedPolicy.miDataSource.dataSubject.subscribe(isloadingdone => {
      if (isloadingdone && isloadingdone.length > 0) {
        this.isaccordionPanelShow = true;
        this.selectedPolicy.miDataSource.tableData[0].show = true;
        this.pendingPolicyId = this.selectedPolicy.miDataSource.tableData[0].PayorID
        this.pendingPolicyClientId = this.selectedPolicy.miDataSource.tableData[0].ClientID
        this.policyPaymentData = this.selectedPolicy.miDataSource.getResponse.LinkPaymentList;
        this.defaultPayorId = this.selectedPolicy.miDataSource.tableData[0].PayorID
        this.filters.controls.Payor.setValue(this.defaultPayorId);
        this.GetAccordionPanelList();
        this.GetClientList();
     //   this.GetPayorList();

        this.filters.controls.ClientObject.valueChanges.subscribe((changedValue) => {
          //alert("changedValue="+changedValue);
          this.getClientSuggestList(changedValue);

          //improve autosuggestion of client name
          // if(this.previousName === "")
          // {
          //   this.previousName = changedValue;
          // }
          //improve autosuggestion of client name
        });
      }
    });
  }

  /*searchData(event)
  {
    //alert("in");
    let txtValue = event.target.value;
    //alert("txtValue="+txtValue);
    if(txtValue.length === 0)
    {
      //alert("in1");
      this.refreshList();
    }
  }*/

  resetValue(event)
  {
    //alert(event.target.value);
    //alert("this.isClientChanged11AA="+this.isClientChanged);
    //alert("this.previousNameReset="+this.previousName);

    let txtValue = event.target.value;

    //alert("this.txtValue="+this.txtValue);

    if(this.previousName != txtValue)//this.previousName != "" && 
    {
      //alert("inaaaa");

       if(this.previousName === "" && txtValue != "")
       {
         //alert("inaaaa1");
        this.filters.controls.ClientObject.setValue(txtValue);
       }
       else
       {
         //alert("inaaaa2");
        this.filters.controls.ClientObject.setValue(this.previousName);
       }
    }
  }

  GetSelectedPolicyDataPrmtrs(value) {
    this.postdata = {
      'policyId': value,
    }
    this.selectedPolicy.requestPostData = this.postdata;
    this.selectedPolicy.refreshHandler.next(true);
  }
  MenuItemClicked(data) {
    //alert("data.name="+data.name);
    if (data.name === 'Hide Data') {
      data.data.show = !data.data.show;
      if (data.data.show === true) {
        data.event.class = 'img-icons arrow-down-icn';
        data.event.itemName = 'Hide Data'
      } else {
        data.event.class = 'img-icons arrow-up-icn'
        data.event.itemName = 'View Data'
      }
      this.isaccordionPanelShow = true;
    } else if (data.name === 'View Data') {
      data.data.show = !data.data.show;
      if (data.data.show === true) {
        data.event.class = 'img-icons arrow-down-icn';
        data.event.itemName = 'Hide Data'
      } else {
        data.event.class = 'img-icons arrow-up-icn'
        data.event.itemName = 'view Data'
      }
      this.isaccordionPanelShow = true;
    } else if (data.name === 'radio-button') {
      if (this.lastSelectedClass) {
        this.lastSelectedClass.removeClass('highlighted-row');
      }
      this.isPolicySelected = true;
      data.event.checked = true;
      this.selectedActivePolicy = data.data.PolicyId;
      $(data.events.currentTarget).closest('.mat-row').addClass('highlighted-row');
      this.lastSelectedClass = $(data.events.currentTarget).closest('.mat-row');
    }
  }
  OnCheckboxClicked(checkedData) {
    checkedData.data.data.Checked = !checkedData.data.data.Checked
    if (this.accordionPanelList.miDataSource.tableData.filter(x =>
      x.Checked === true).length === this.accordionPanelList.miDataSource.tableData.length) {
      this.toggleSelect = true;
    } else {
      this.toggleSelect = false;
    };
    if (this.accordionPanelList.miDataSource.tableData.filter(x =>
      x.Checked === true).length > 0) {
      this.isLinkDisabled = false
      return;
    } else {
      this.isLinkDisabled = true
    }
  }
  onSelectAll(event) {
    this.accordionPanelList.miDataSource.tableData.forEach(element => {
      if (element) {
        const newValue = !this.toggleSelect as boolean
        (element.Checked as boolean) = newValue
      }
    });
    this.toggleSelect = !this.toggleSelect;
    if (this.accordionPanelList.miDataSource.tableData.filter(x =>
      x.Checked === true).length > 0) {
      this.toggleSelect = true;
      this.isLinkDisabled = false;
      return;
    } else {
      this.toggleSelect = false;
      this.isLinkDisabled = true;
    }

  }
  AfterDataLoading() {
    if (this.accordionPanelList.miDataSource.tableData) {
      if (this.accordionPanelList.miDataSource.tableData.filter(x =>
        x.Checked === true).length === this.accordionPanelList.miDataSource.tableData.length) {
        this.toggleSelect = true;
        this.isLinkDisabled = false;
      } else {
        this.toggleSelect = false;
        this.isLinkDisabled = true;
      }
    }

  }
  isObject(val) {
    if (val == null) {
      return false;
    } else {
      return typeof val === 'object';
    }
  }
  initList() {
    this.MiListProperties.url = this.compManagerUrl.LinkPolicies.GetActivePoliciesList;
    this.MiListProperties.miDataSource = new TableDataSource(this.compMangrSvc);
    this.MiListProperties.columnLabels = ['', 'Client', 'Payor', 'Policy #', 'Insured/Div', 'Carrier', 'Product', 'Status', 'Comp type',
      'Product type', 'Effective date'];
    this.MiListProperties.displayedColumns = ['SelectData',
      'ClientName', 'PayorName', 'PolicyNumber', 'Insured', 'CarrierName', 'ProductName',
      'StatusName', 'CompTypeName', 'ProductType', 'OriginDateString'];
    this.MiListProperties.columnIsSortable = ['false', 'true', 'true', 'true',
      'true', 'true', 'true', 'true', 'true', 'true', 'true'],
      this.MiListProperties.refreshHandler = this.needRefreshFirstList;
    this.MiListProperties.miListMenu = new MiListMenu();
    this.MiListProperties.miListMenu.visibleOnDesk = true;
    this.MiListProperties.columnDataTypes = this.columnIsSortable;
    this.MiListProperties.miListMenu.visibleOnMob = false;
    this.MiListProperties.resetPagingHandler = this.needPageReset;
    this.MiListProperties.showPaging = true;
    this.MiListProperties.isEditablegrid = true;
    this.MiListProperties.fieldType = {
      'SelectData': new MiListFieldType('', 'SelectData', '', '', 'radio-button', '', '', false, null, '', '', ''),
    }
    this.MiListProperties.miDataSource.dataSubject.subscribe(isloadingdone => {
      if (isloadingdone && isloadingdone.length > 0) {
        this.activePolicyList = this.MiListProperties.miDataSource.getResponse.AllRecords;
      }
    })
  }
  disableButton()
  {
    //alert("in3");
    this.isPolicySelected = false;
  }
  refreshList() {

    // let ClientId = "";
    // if(this.filters.controls.ClientObject.value === "")
    // {
    //   ClientId = "";
    // }

    //alert("in");
    //alert("in2");

    this.dataTopost = {
      'licenseeId': this.userDetail.LicenseeId,
      'PayorID': this.filters.controls.Payor.value ? this.filters.controls.Payor.value : null,
      'statusId': 0,
      'ClientID': this.filters.controls.ClientObject.value ? this.filters.controls.Client.value : null
    };

    this.MiListProperties.requestPostData = this.dataTopost;
    this.MiListProperties.refreshHandler.next(true);
    //alert("this.dataTopost="+JSON.stringify(this.dataTopost));
  }

  doSearch() {
    //alert("in1");
    //this.showloading = false;
    this.MiListProperties.initialPageIndex = 0;
    this.MiListProperties.resetPagingHandler.next(true);
    this.refreshList();
  }

  GetAccordionPanelList() {
    this.accordionPanelList.cachedList = this.policyPaymentData;
    this.accordionPanelList.miDataSource = new TableDataSource(this.compMangrSvc);
    this.accordionPanelList.columnLabels = ['Checkbox',
      'Invoice date', 'Amount', 'Incoming %', 'Units', 'Fee', 'Share per', 'Total payment'];
    this.accordionPanelList.displayedColumns = ['Checkbox', 'InvoiceDateString', 'PaymentRecived',
      'CommissionPercentage', 'NumberOfUnits', 'Fee', 'SplitPer', 'TotalPayment'];
    this.accordionPanelList.columnIsSortable = ['false', 'true', 'true', 'true', 'true', 'true', 'true', 'true'];
   this.accordionPanelList.columnDataTypes= [['InvoiceDateString', 'date'],
   ['PaymentRecived', 'currency'],
   ['CommissionPercentage', 'percentage'],
    ['SplitPer', 'percentage'],
   ['TotalPayment', 'currency']];
    this.accordionPanelList.miListMenu = new MiListMenu();
    this.accordionPanelList.miListMenu.visibleOnDesk = true;
    this.accordionPanelList.miListMenu.visibleOnMob = false;
    this.accordionPanelList.isFooterRequired = false;
    this.accordionPanelList.refreshHandler = this.accordionPanelNeedRefresh;
    this.accordionPanelList.resetPagingHandler = this.needPageReset;
    this.accordionPanelList.isClientSideList = true;
    this.accordionPanelList.isRowClickable = false;
    this.accordionPanelList.showPaging = false;
    this.accordionPanelList.isEditablegrid = true;
    this.accordionPanelList.fieldType = {
      'Checkbox': new MiListFieldType('', 'Checkbox', '', '', 'check-box', '', '', false, null, '', '', ''),
    }
  }
  GetAccordionPanelParameterList(value) {
    this.postdata = {
      'policyId': value
    };
    this.accordionPanelList.requestPostData = this.postdata;
    this.accordionPanelList.refreshHandler.next(true);
  }

  OnPayorChange() {
    this.isPolicySelected = false;
    //this.refreshList();
    this.doSearch();

    // const payor = this.filters.controls.Payor.value;
    // const client = this.filters.controls.Client.value;
    // const list = []



    // this.MiListProperties.cachedList = list;
    // this.MiListProperties.refreshHandler.next(true);
    // if (payor === '' && client === '') {

    //   this.MiListProperties.cachedList = Object.assign([], this.activePolicyList);
    //   this.MiListProperties.refreshHandler.next(true);
    // } else if(this.activePolicyList){
    //   for (let i = 0; i < this.activePolicyList.length; i++) {

    //     if ((((payor !== '' && client !== '') &&
    //       (this.activePolicyList[i].PayorId === payor && this.activePolicyList[i].ClientId === client))
    //       ||
    //       (payor === '' && client !== '' && this.activePolicyList[i].ClientId === client)
    //       ||
    //       (client === '' && payor !== '' && this.activePolicyList[i].PayorId === payor))
    //     ) {
    //       list.push(this.activePolicyList[i]);
    //     }
    //   }
    //   this.MiListProperties.cachedList = list;
    //   this.MiListProperties.refreshHandler.next(true);
    // }
  }
  DoLinkPolicy() {
    this.showloading = true;
    this.selectedPolicyPayments = [];
    this.accordionPanelList.miDataSource.tableData.filter(elementname => {
      if (elementname.Checked === true) {
        this.selectedPolicyPayments.push(elementname.PaymentEntryID);
      }
    });
    //data to validate payments data

    const postData = {
              'licenseeId': this.userDetail['LicenseeId'],
              'pendingPolicyId': this.getrouterParamters.PolicyId,
              'activePolicyId': this.selectedActivePolicy,
              'paymentsList': this.selectedPolicyPayments
            }

        this.compMangrSvc.ValidatePaymentsForLinking(postData).subscribe(response =>{
  
          let isResponseReqdOnFalse = response.IsResponseNeededOnFalse;
          
          const msg = (response.StringValue) ? response.StringValue : "Are you sure you want to continue to link?";
          this.ShownAlertMessage(isResponseReqdOnFalse, msg);
    
        })
     /*const postData = {
      'LicenseeId': this.userDetail['LicenseeId']/*,
      'paymentEntryId': '63A24266-FCCD-409D-9D85-62BC231A7A62',
      'activePolicyId': this.selectedActivePolicy*/
    /*};

    this.compMangrSvc.IsAgencyVersion(postData).subscribe(response => {
      const isAgencyVersion = response.BoolFlag;
      const paymentsList = this.selectedPolicyPayments;
      let alertMsg = '';
      let showAlert = true;
      let heading = '';

     for (let i = 0; i < paymentsList.length; i++) {
        const payment = paymentsList[i];

        this.compMangrSvc.ScheduleMatches({ 'EntryId': payment, 'ActivePolicyId': this.selectedActivePolicy }).subscribe(gotresponse => {
          const scheduleMatch = gotresponse.BoolFlag;
          this.compMangrSvc.IsMarkedPaid({ 'PaymentEntryId': payment }).subscribe(resp => {
            const isPaid = resp.BoolFlag;
            if (isAgencyVersion === true && isPaid === true && scheduleMatch === true) {
              alertMsg = 'This payment was already marked as paid.' + ' ' +
                'If you would like to redistribute the payment, you will need to reverse the payment from the House account and pay ' +
                'the policy’s payees.  Would you like the system to reverse and redistribute for you?'
              heading = 'Conrmation'

            } else if (isAgencyVersion === true && isPaid === true && scheduleMatch === false) {
              alertMsg = 'The outgoing payment schedule does not equal the incoming payment and was already marked as paid.' + ' ' +
                'If you would like to redistribute the payment, you will need to adjust the outgoing schedule, ' +
                'reverse the payment from the House account and pay the policy’s payees. ' + ' ' +
                'It is recommended you make the necessary changes prior and link after. Are you sure you want to continue to link?';
            } else if (isAgencyVersion === true && isPaid === false && scheduleMatch === false) {
              alertMsg = 'The outgoing payment schedule does not equal the incoming payment.' + ' ' +
                'If you would like to redistribute the payment, you will need to adjust ' +
                'the outgoing schedule  and pay the policy’s payees. It is recommended ' +
                'you make the necessary changes prior and link after.  Are you sure you want to continue to link?';
            }
            const data = {
              'licenseeId': this.userDetail['LicenseeId'],
              'isReverse': true,
              'isLinkWithExistingPolicy': true,
              'pendingPolicyId': this.getrouterParamters.PolicyId,
              'clientId': this.pendingPolicyClientId,
              'activePolicyId': this.selectedActivePolicy,
              'policyPaymentEntryId': payment,
              'currentUser': this.userDetail['UserCredentialID'],
              'isAgencyVersion': isAgencyVersion,
              'isPaidMarked': isPaid,
              'isScheduleMatches': scheduleMatch,
              'userRole': this.userDetail['Role']
            };
            if (showAlert === true && alertMsg !== '') {
              this.showloading = false;
              showAlert = false;
              this.ShownAlertMessage(data, alertMsg);
            } else {
              this.compMangrSvc.DoLinkPolicy(data).subscribe(getresponse => {
                if (getresponse.ResponseCode === 200) {
                  this.showloading = false;
                  this.route.navigate(['comp-manager/link-policies', this.getrouterParamters.parentTab, this.getrouterParamters.pageIndex,
                    this.getrouterParamters.pageSize]);
                  this.shownSuccesspopup = true;
                }
              })
            }
          })
        })
      }
      if (this.shownSuccesspopup) {
        this.SuccessMessage();
      }

    })*/
  }
  ShownAlertMessage(flag, subHeading) {
    const dilogref = this.dilog.open(ShowConfirmationComponent, {
      data: {
        headingTitle: 'Link Payment',
        subTitle: subHeading
      },
      width: '600px'
    });
    dilogref.afterClosed().subscribe(result => {
      if (result || (!result && flag === true)) {
       
        const data = {
          'licenseeId': this.userDetail['LicenseeId'],
          'pendingPolicyId': this.getrouterParamters.PolicyId,
          'clientId': this.pendingPolicyClientId,
          'activePolicyId': this.selectedActivePolicy,
          'currentUser': this.userDetail['UserCredentialID'],
          'paymentsList': this.selectedPolicyPayments,
          'isReverse': (flag === true) ? result : false //when "yes" clicked and response required for reverse, then send this as true.
        }
        this.showloading = true;
        this.compMangrSvc.DoLinkPolicy(data).subscribe(linkresponse => {
          if (linkresponse.ResponseCode === 200) {
            this.showloading = false;
            this.route.navigate(['comp-manager/link-policies', this.getrouterParamters.parentTab, this.getrouterParamters.pageIndex,
              this.getrouterParamters.pageSize]);
            this.SuccessMessage();
          }
        });
      }
      else{
        this.showloading = false;
      }
    });
  }
  SuccessMessage() {
    const dilogref = this.dilog.open(SuccessMessageComponent, {
      data: {
        Title: 'Payment Linked Successfully',
        subTitle: 'Payment has been linked successfully and distributed to payees.',
        isCommanFunction: true,
        numberofButtons: '1'
      },
      width: '600px'
    });
  }
}
