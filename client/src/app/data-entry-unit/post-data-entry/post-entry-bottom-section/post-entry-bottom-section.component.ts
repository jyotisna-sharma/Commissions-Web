import { Component, OnInit, Input, AfterViewInit, Output, EventEmitter } from '@angular/core';
import { MiProperties } from '../../../shared/mi-list/mi-properties';
import { TableDataSource } from '../../../_services/table.datasource';
import { FormGroup, FormControl, FormArray, Validators } from '@angular/forms';
import { Subject, BehaviorSubject } from 'rxjs';
import { CommonDataService } from '../../../_services/common-data.service';
@Component({
  selector: 'app-post-entry-bottom-section',
  templateUrl: './post-entry-bottom-section.component.html',
  styleUrls: ['./post-entry-bottom-section.component.css']
})
export class PostEntryBottomSectionComponent implements OnInit, AfterViewInit {
  searchedPolicyList: MiProperties = new MiProperties();
  isSearchListShown: Boolean = false;
  @Output() policyLearnedFields: any = new EventEmitter();
  searchPolicyListNeedRefresh: Subject<boolean> = new Subject();
  @Input() StatementInfoGroup: FormGroup;
  @Input() isSearchPolicyGridShown: any;
  isListRefresh: any = new BehaviorSubject<boolean>(false);
  isSearchedPolicyListRefresh: Subject<boolean> = new Subject<boolean>();
  uniqueIdentifiersData: any;
  selectedIndex: any = 0;
  Gridtext: any;
  columnIsSortable: string[] = [
    'true', 'true', 'true', 'true', 'true', 'true', 'true', 'true'];
  isClientSideList: Boolean = true;
  constructor(
    public sendAPIRequest: CommonDataService, ) { }

  ngOnInit(): void {
  }
  ngAfterViewInit(): void {
    this.isSearchPolicyGridShown.subscribe(uniqueIdentifiers => {
      
      this.uniqueIdentifiersData = uniqueIdentifiers;
       this.Gridtext = 'Assign payment for policy list';
      if (uniqueIdentifiers && uniqueIdentifiers.length > 0) {
        this.uniqueIdentifiersData.forEach(item => {
          if (item && item.ColumnName === 'PolicyNumber' && item.Text) {
            this.Gridtext = 'Assign payment for policy #' + item.Text + ' To:';
          }
        });
        this.OnSearchedPlicyPrmtrs();
      } else {
        this.OnGettingSearchPolicyList();
        this.searchedPolicyList.cachedList = [];
        this.searchedPolicyList.isClientSideListRefresh.next(true);
      }
      this.isSearchListShown = true;
    });
  }
  OnGettingSearchPolicyList(): void {
    this.searchedPolicyList.miDataSource = new TableDataSource(this.sendAPIRequest);
    this.searchedPolicyList.columnLabels = ['Policy Number', 'Client', 'Division', 'Carrier',
      'Product', 'Comp Schedule', 'Comp Type', 'Mode'];
    this.searchedPolicyList.displayedColumns = ['PolicyNumber', 'ClientName', 'Insured', 'CarrierName',
      'ProductName', 'CompSchedule', 'CompType', 'PolicyMode'];
    // this.searchedPolicyList.columnDataTypes = [['PaymentMode', 'number']];
    this.searchedPolicyList.columnIsSortable = this.columnIsSortable;
    this.searchedPolicyList.isClientSideList = this.isClientSideList;
    this.searchedPolicyList.isClientSideListRefresh = this.isSearchedPolicyListRefresh;
    this.searchedPolicyList.refreshHandler = this.searchPolicyListNeedRefresh;
    this.searchedPolicyList.miDataSource.dataSubject.subscribe(response => {
	  
     // if (response && this.searchedPolicyList.miDataSource.getResponse) {
      //  this.isListRefresh.next(true);
     //}
	   try {
		    console.log('OnGettingSearchPolicyList response ')
			if (response && this.searchedPolicyList.miDataSource.getResponse) {
				console.log('OnGettingSearchPolicyList response recived ')
				this.isListRefresh.next(true);
			}
			else{
				console.log('OnGettingSearchPolicyList response NOT recived, resetting enabled ');
				if(this.policyLearnedFields){
					this.policyLearnedFields.emit({ searchedPolicyList: '' });
				}
			}
      }
      catch (err) { // Error will happen when user is not valid user
			console.log('OnGettingSearchPolicyList error ' + err.message)
            if(this.policyLearnedFields){
               this.policyLearnedFields.emit({ searchedPolicyList: '' });
            }
        }
    });
  }
  OnSearchedPlicyPrmtrs(): void {
    const postData = {
      'licenseeId': this.StatementInfoGroup.controls.licenseeeId.value,
      'uniqueIdentifiers': this.uniqueIdentifiersData,
      'payorId': this.StatementInfoGroup.controls.PayorId.value,
      'URL': 'GetUniqueIdentifierPolicyList'
    };
    this.searchedPolicyList.url = '/api/CommonData/CommTableListRequestSends';
    this.searchedPolicyList.requestPostData = postData;
    this.searchedPolicyList.cachedList = null;
   // this.OnGettingSearchPolicyList();
    this.searchedPolicyList.refreshHandler.next(true);
  }
  OnSearchedPolicyChange(selectedRecord: any): void {
      console.log('OnSearchedPolicyChange response received')
    if (selectedRecord && selectedRecord.data) {
      this.selectedIndex = selectedRecord.index;
      const postData = {
        'policyId': selectedRecord.data.PolicyId,
        'URL': 'GetPolicyLearnedFields'
      };
      this.sendAPIRequest.RequestSendsToAPI(postData).subscribe(response => {
		   console.log('OnSearchedPolicyChange response list')
        this.policyLearnedFields.emit({ searchedPolicyList: response.policyDetails });
      });
    } else {
		  console.log('OnSearchedPolicyChange response blank')
      this.policyLearnedFields.emit({ searchedPolicyList: '' });
    }
  }
}
