

import { CalenderDataService } from '../../_services/calender-data.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs/Subject';
import { DashboarDataService } from '../dashboard-data.service'
import { FormControl, FormGroup } from '@angular/forms';
import { MiProperties } from '../../shared/mi-list/mi-properties';
import { CustomChartProperties } from '../../shared/custom-charts/custom-charts-properties'
import { TableDataSource } from '../../_services/table.datasource';
import { MiListMenu } from '../../shared/mi-list/mi-list-menu';
import { DashboardUrlService } from '../dashboard-url.service';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Guid } from 'guid-typescript';
import { ExportExcelService } from './../../_services/export-excel.service';
@Component({
  selector: 'app-display-dashboard',
  templateUrl: './display-dashboard.component.html',
  styleUrls: ['./display-dashboard.component.scss']
})
export class DisplayDashboardComponent implements OnInit {
  step = 0;
  postData: any;
  userDetails: any;
  yearList: any = [];
  monthList: any;
  showloading: Boolean = true;
  agentCount: any;
  clientCount: any;
  defaultClientId: any;
  refreshTime: any;
  isTabEnabled: boolean
  needPageReset: Subject<boolean> = new Subject();
  // ---------------------Revenue Variables---------------------------------------------------
  Revenue = new FormGroup({
    RevenueYear: new FormControl(),
    RevenueStartMonth: new FormControl(1),
    RevenueEndMonth: new FormControl()
  });
  currentYear: any = new Date().getMonth() == 0 ? new Date().getFullYear() - 1 : new Date().getFullYear();
  currentMonth: any = new Date().getMonth() == 0 ? 12 : new Date().getMonth();
  RevenueTilesData: any = [];
  isResponseOccur: Boolean = false;
  isChartRefreshCount: any = 0;
  netRevenueCharts: CustomChartProperties = new CustomChartProperties();
  grossRevenueCharts: CustomChartProperties = new CustomChartProperties();
  // ---------------------------Top 20 Agents Variables--------------------------------------
  TopTwentyAgent = new FormGroup({
    StartDate: new FormControl({ value: this.calenderData.GetFirstDateOfYear2(this.currentYear), disabled: true }, {}),
    EndDate: new FormControl({ value: this.calenderData.GetLastMonthDate(this.currentMonth, this.currentYear), disabled: true }, {}),
    agentListFilter: new FormControl('Agent', {})
  });
  currentYearFirstDate: any;
  isTop20AgentListShown: Boolean = false;
  AgentListProperties: MiProperties = new MiProperties();
  agentListTitle: any = 'Revenue By Agent';
  AgentListRefresh: Subject<boolean> = new Subject();
  agentFilter: any = ['Agent', 'Account Exec'];
  detailedReportColumns: any = ['Client','PolicyNumber','PayorName','CarrierName','ProductName','ProductType','CompType','NickName','NetRevenue', 'GrossRevenue'];
  
  // ---------------------------Revenue by Loc Variables---------------------------------------
  RevenueByLoc = new FormGroup({
    RevenueStartDate: new FormControl({ value: this.calenderData.GetFirstDateOfYear2(this.currentYear), disabled: true }, {}),
    RevenueEndDate: new FormControl({ value: this.calenderData.GetLastMonthDate(this.currentMonth, this.currentYear), disabled: true }, {})
  });
  RevenueByLocListProperties: MiProperties = new MiProperties();
  RevenueByLocListRefresh: Subject<boolean> = new Subject();
  isRevenueByLocListShown: Boolean = false;
  // ---------------------------New Policy list Variables------------------------------------------
  NewPolicyListProperties: MiProperties = new MiProperties();
  NewPolicyListRefresh: Subject<boolean> = new Subject();
  isNewPolicyListShown: Boolean = false;
  // ---------------------------New Policy list Variables------------------------------------------
  RenewalListProperties: MiProperties = new MiProperties();
  RenewalListRefresh: Subject<boolean> = new Subject();
  isRenewalListShown: Boolean = false;

  // ---------------------------Receivables list Variables------------------------------------------------
  ReceivableListProperties: MiProperties = new MiProperties();
  ReceivableListRefresh: Subject<boolean> = new Subject();
  isReceivableListShown: Boolean = false;

  // ---------------------------Clients list Variables------------------------------------------
  ClientListProperties: MiProperties = new MiProperties();
  ClientListRefresh: Subject<boolean> = new Subject();
  isClientListShown: Boolean = false;


  // #####################################################################################################
  constructor(
    public router: Router,
    public dashboarddataservice: DashboarDataService,
    public calenderData: CalenderDataService,
    public dashBoardURL: DashboardUrlService,
    public breakpointObserver: BreakpointObserver,
    public excelService: ExportExcelService
  ) {
    this.userDetails = JSON.parse(localStorage.getItem('loggedUser'));
  }
  ngOnInit() {
    const date = new Date();
    const month = date.getMonth();


    if (month == 0) { //Handle January 01 
      this.currentYear = date.getFullYear() - 1;
      this.currentYearFirstDate = this.calenderData.GetFirstDateOfYear(this.currentYear);
      this.currentMonth = 12;
    }
    else {
      this.currentYear = date.getFullYear();
      this.currentYearFirstDate = this.calenderData.GetFirstDateOfYear(this.currentYear);
      this.currentMonth = date.getMonth();
    }


    this.yearList = this.calenderData.GetLast5YearList(this.currentYear);
    this.monthList = this.calenderData.GetMonthList();
    let data = [];
    data = [this.currentYear, (this.currentYear - 1)]
    this.Revenue.controls.RevenueYear.patchValue(data);
    this.Revenue.controls.RevenueEndMonth.setValue(this.currentMonth)
    if (this.userDetails['LicenseeId'] !== Guid.createEmpty().toJSON().value) {
      this.GetAgentClientCount();
      this.GetRevenueData('');
    }
    this.breakpointObserver.observe([
      '(max-width: 1023px)'
    ]).subscribe(result => {
      if (result.matches) {
        this.isTabEnabled = true;
      } else {
        this.isTabEnabled = false;
      }
    });
  };
  // ------------------------------------------- Agnet Count and Client Count---------------------------------------------------------
  GetAgentClientCount() {
    this.postData = {
      'LicenseeID': this.userDetails['LicenseeId']
    };
    this.dashboarddataservice.GetAgentsClientCount(this.postData).subscribe(response => {
      this.agentCount = response['AgentCount']
      this.clientCount = response['ClientCount']
    });
  }
  // #################################################################################################################################

  // ---------------------------------- Revenue Data Tile and Graph-------------------------------------------------------------
  GetRevenueData(value) {
    this.postData = {
      'LicenseeID': this.userDetails['LicenseeId'],
      'UserCredentialID': this.userDetails['HouseAccountDetails'].UserCredentialId,
      'Years': this.Revenue.controls.RevenueYear.value,
      'StartMonth': this.Revenue.controls.RevenueStartMonth.value,
      'EndMonth': this.Revenue.controls.RevenueEndMonth.value
    }
    if (value === 'buttonClicked') {
      this.showloading = true;
      this.dashboarddataservice.GetRevenueData(this.postData).subscribe(response => {
        this.OnCreateRevenueCharts(response);
        this.showloading = false;
        this.isChartRefreshCount++;
      });
    } else {
      this.dashboarddataservice.GetRevenueData(this.postData).subscribe(response => {
        this.OnCreateRevenueCharts(response);
        this.isChartRefreshCount = 0;
        this.defaultClientId = response['DefaultClient'];
        this.refreshTime = response['RefreshTime'];
        this.RevenueTilesData.push(response['NetRevenueNumbers']);
        this.RevenueTilesData.push(response['GrossRevenueNumbers']);
        this.isResponseOccur = true;
        this.showloading = false;
        this.isTop20AgentListShown = true;
        this.GetTop20AgentList();
        this.OnSendingTop20AgentListParmtrs();
      });
    }

  }
  OnCreateRevenueCharts(ChartsData) {
    this.netRevenueCharts.ChartData = ChartsData['NetRevenueData'];
    this.netRevenueCharts.ChartType = 'line';
    this.netRevenueCharts.ChartLabels = ChartsData['MonthsRange'];
    this.grossRevenueCharts.ChartData = ChartsData['GrossRevenueData'];
    this.grossRevenueCharts.ChartType = 'line';
    this.grossRevenueCharts.ChartLabels = ChartsData['MonthsRange'];
  }
  // #######################################################################################################################
  // ----------------------------------This methods used for Initalize a list -------------------------------------------------------------
  GetTop20AgentList() {
    this.AgentListProperties.url = this.dashBoardURL.DashBoardAPIRoute.GetTop20Agents;
    this.AgentListProperties.miDataSource = new TableDataSource(this.dashboarddataservice);
    this.AgentListProperties.displayedColumns = ['NickName', 'NetRevenue', 'GrossRevenue'];
    this.AgentListProperties.columnLabels = ['Name', 'Net Revenue', 'Gross Revenue'];
    this.AgentListProperties.columnDataTypes = [['Nickname', 'string'], ['NetRevenue', 'currency'],
    ['GrossRevenue', 'currency']];
    this.AgentListProperties.columnIsSortable = ['true', 'true', 'true'];
    this.AgentListProperties.isClientSideList = true;
    this.AgentListProperties.refreshHandler = this.AgentListRefresh;
    this.AgentListProperties.resetPagingHandler = this.needPageReset;
    this.AgentListProperties.miListMenu = new MiListMenu();
    this.AgentListProperties.miListMenu.visibleOnDesk = true;
    this.AgentListProperties.miListMenu.visibleOnMob = false;
    this.AgentListProperties.miDataSource.dataSubject.subscribe(isloadingDone => {
      if ((isloadingDone && isloadingDone.length > 0)) {
        this.isRevenueByLocListShown = true;
      } else if (this.AgentListProperties.miDataSource.pageLength >= 0) {
        this.isRevenueByLocListShown = true;
      }
    });
    this.GetRevenueByLocList();
    this.OnSendingRevenueByLocListParmtrs()
  }
  OnSendingTop20AgentListParmtrs(isFirstTimeList: any = true) {
    const postData = {
      'Filter': this.TopTwentyAgent.controls.agentListFilter.value,
      'LicenseeID': this.userDetails['LicenseeId'],
      'StartDate': this.calenderData.GetmmDDyyyFormat(this.TopTwentyAgent.controls.StartDate.value),
      'EndDate': this.calenderData.GetmmDDyyyFormat(this.TopTwentyAgent.controls.EndDate.value),
      'isFirstTimeList': isFirstTimeList
    };
    this.AgentListProperties.requestPostData = postData;
    this.AgentListProperties.refreshHandler.next(true);
  }
  OnExportAgentSummary() {
    this.excelService.exportAsExcelFile(this.AgentListProperties.miDataSource.getResponse.ExportDataList,
      this.agentListTitle, this.AgentListProperties.displayedColumns);

  }

  OnExportAgentDetails (isFirstTimeList: any = true) { 
    this.showloading = true;
    const postData = {
      'Filter': this.TopTwentyAgent.controls.agentListFilter.value,
      'LicenseeID': this.userDetails['LicenseeId'],
      'StartDate': this.calenderData.GetmmDDyyyFormat(this.TopTwentyAgent.controls.StartDate.value),
      'EndDate': this.calenderData.GetmmDDyyyFormat(this.TopTwentyAgent.controls.EndDate.value),
      'isFirstTimeList': isFirstTimeList,
    };

    this.dashboarddataservice.GetReportDetails(postData).subscribe(response => {
      this.excelService.exportAsExcelFile(response.ExportDataList,
        this.agentListTitle,this.detailedReportColumns);
        response.ExportDataList
        this.showloading = false;
    });
}
  
  OnChangeAgentListDropDown(selectedOption) {
    if (selectedOption.value !== 'Agent') {
      this.agentListTitle = 'Revenue By Account Exec'
    } else {
      this.agentListTitle = 'Revenue By Agent'
    }
    this.TopTwentyAgent.controls.agentListFilter.setValue(selectedOption.value);
    this.OnSendingTop20AgentListParmtrs(false);
  }
  // #######################################################################################################################
  GetRevenueByLocList() {
    this.RevenueByLocListProperties.url = this.dashBoardURL.DashBoardAPIRoute.GetRevenueByLOC;
    this.RevenueByLocListProperties.miDataSource = new TableDataSource(this.dashboarddataservice);
    this.RevenueByLocListProperties.displayedColumns = ['Product', 'NetRevenue', 'GrossRevenue'];
    this.RevenueByLocListProperties.columnLabels = ['Product', 'Net Revenue', 'Gross Revenue'];
    this.RevenueByLocListProperties.columnIsSortable = ['true', 'true', 'true'];
    this.RevenueByLocListProperties.refreshHandler = this.RevenueByLocListRefresh;
    this.RevenueByLocListProperties.miListMenu = new MiListMenu();
    this.RevenueByLocListProperties.miListMenu.visibleOnDesk = true;
    this.RevenueByLocListProperties.miListMenu.visibleOnMob = false;
    this.RevenueByLocListProperties.isClientSideList = true;
    this.RevenueByLocListProperties.resetPagingHandler = this.needPageReset;
    this.RevenueByLocListProperties.columnDataTypes = [['NetRevenue', 'currency'],
    ['GrossRevenue', 'currency']];
    this.RevenueByLocListProperties.miDataSource.dataSubject.subscribe(isloadingDone => {
      if ((isloadingDone && isloadingDone.length > 0)) {
        this.isNewPolicyListShown = true;
      } else if (this.RevenueByLocListProperties.miDataSource.pageLength >= 0) {
        this.isNewPolicyListShown = true;
      }
    });
    this.GetNewPolicyList();
    this.OnSendingNewPolicyListParmtrs();
  }
  OnSendingRevenueByLocListParmtrs(isFirstTimeList: any = true) {
    const postData = {
      'LicenseeID': this.userDetails['LicenseeId'],
      'UserCredentialID': this.userDetails['HouseAccountDetails'].UserCredentialId,
      'StartDate': this.calenderData.GetmmDDyyyFormat(this.RevenueByLoc.controls.RevenueStartDate.value),
      'EndDate': this.calenderData.GetmmDDyyyFormat(this.RevenueByLoc.controls.RevenueEndDate.value),
      'isFirstTimeList': isFirstTimeList
    };
    this.RevenueByLocListProperties.requestPostData = postData;
    this.RevenueByLocListProperties.refreshHandler.next(true);
  }
  OnSendingRevenueByLocListRefresh() {
    this.OnSendingRevenueByLocListParmtrs();
  }
  OnExportRevenueByLocList() {
    this.excelService.exportAsExcelFile(this.RevenueByLocListProperties.miDataSource.getResponse.ExportDataList,
      'RevenueByLoc', this.RevenueByLocListProperties.displayedColumns);

  }
  OnExportList(value) {
    if (value === 'NewPolicyListProperties') {
      this.excelService.exportAsExcelFile(this.NewPolicyListProperties.miDataSource.getResponse.ExportDataList,
        'NewPolicyList', this.NewPolicyListProperties.displayedColumns);
    } else if (value === 'RenewalListProperties') {
      this.excelService.exportAsExcelFile(this.RenewalListProperties.miDataSource.getResponse.ExportDataList,
        'RenewalList', this.RenewalListProperties.displayedColumns);
    }
  }
  // ---------------------------------- Get The list of New POlicy List -------------------------------------------------------------
  GetNewPolicyList() {
    this.NewPolicyListProperties.url = this.dashBoardURL.DashBoardAPIRoute.GetNewPolicyList;
    this.NewPolicyListProperties.miDataSource = new TableDataSource(this.dashboarddataservice);
    this.NewPolicyListProperties.displayedColumns = ['ClientName', 'PAC'];
    this.NewPolicyListProperties.columnLabels = ['Client Name', 'PAC'];
    this.NewPolicyListProperties.columnIsSortable = ['true', 'true'];
    this.NewPolicyListProperties.refreshHandler = this.NewPolicyListRefresh;
    this.NewPolicyListProperties.miListMenu = new MiListMenu();
    this.NewPolicyListProperties.miListMenu.visibleOnDesk = true;
    this.NewPolicyListProperties.miListMenu.visibleOnMob = false;
    this.NewPolicyListProperties.isClientSideList = true;
    this.NewPolicyListProperties.columnDataTypes = [['PAC', 'currency']];
    this.NewPolicyListProperties.miDataSource.dataSubject.subscribe(isloadingDone => {
      if ((isloadingDone && isloadingDone.length > 0)) {
        this.isRenewalListShown = true;
      } else if (this.NewPolicyListProperties.miDataSource.pageLength >= 0) {
        this.isRenewalListShown = true;
      }
    });

    this.GetRenewalList();
    this.OnSendingRenewalListParmtrs();
  }
  OnSendingNewPolicyListParmtrs() {

    const postData = {
      'licenseeId': this.userDetails['LicenseeId'],
      'date': this.calenderData.GetmmDDyyyFormat(this.calenderData.GetFirstDateOfYear2(this.currentYear)),
    };
    this.NewPolicyListProperties.requestPostData = postData;
    this.NewPolicyListProperties.refreshHandler.next(true);
  }
  // #######################################################################################################################



  GetRenewalList() {
    this.RenewalListProperties.url = this.dashBoardURL.DashBoardAPIRoute.GetRenewalsList;
    this.RenewalListProperties.miDataSource = new TableDataSource(this.dashboarddataservice);
    this.RenewalListProperties.displayedColumns = ['Months', 'AnnualizedRevenue', 'TotalPercentage'];
    this.RenewalListProperties.columnLabels = ['Month', 'Annualized Revenue', '% of Total'];
    this.RenewalListProperties.columnIsSortable = ['false', 'true', 'true'];
    this.RenewalListProperties.refreshHandler = this.RenewalListRefresh;
    this.RenewalListProperties.miListMenu = new MiListMenu();
    this.RenewalListProperties.miListMenu.visibleOnDesk = true;
    this.RenewalListProperties.miListMenu.visibleOnMob = false;
    this.RenewalListProperties.isClientSideList = true;
    this.RenewalListProperties.columnDataTypes = [['AnnualizedRevenue', 'currency'], ['TotalPercentage', 'percentage']];
    this.RenewalListProperties.miDataSource.dataSubject.subscribe(isloadingDone => {
      if ((isloadingDone && isloadingDone.length > 0)) {
        this.isClientListShown = true;
      } else if (this.NewPolicyListProperties.miDataSource.pageLength >= 0) {
        this.isClientListShown = true;
      }
    });
    this.GetClientsList();
    this.OnSendingClientListParmtrs();
  }

  OnSendingRenewalListParmtrs() {

    const postData = {
      'licenseeId': this.userDetails['LicenseeId'],
      'date': this.calenderData.GetmmDDyyyFormat(this.calenderData.GetFirstDateOfYear2(this.currentYear)),
    };
    this.RenewalListProperties.requestPostData = postData;
    this.RenewalListProperties.refreshHandler.next(true);
  }
  // #######################################################################################################################

  // GetReceivableList() {
  //   this.ReceivableListProperties.url = this.dashBoardURL.DashBoardAPIRoute.GetReceivableList;
  //   this.ReceivableListProperties.miDataSource = new TableDataSource(this.dashboarddataservice);
  //   this.ReceivableListProperties.displayedColumns = ['ClientName', 'PAC'];
  //   this.ReceivableListProperties.columnLabels = ['Client Name', 'PAC'];
  //   this.ReceivableListProperties.columnIsSortable = ['true', 'true'];
  //   this.ReceivableListProperties.refreshHandler = this.ReceivableListRefresh;
  //   this.ReceivableListProperties.miListMenu = new MiListMenu();
  //   this.ReceivableListProperties.miListMenu.visibleOnDesk = true;
  //   this.ReceivableListProperties.miListMenu.visibleOnMob = false;
  //   this.ReceivableListProperties.isClientSideList = true;
  //   this.ReceivableListProperties.columnDataTypes = [['PAC', 'currency']];
  //   this.ReceivableListProperties.miDataSource.dataSubject.subscribe(isloadingDone => {
  //     if ((isloadingDone && isloadingDone.length > 0)) {
  //       this.isRenewalListShown = true;
  //     } else if (!isloadingDone && !this.ReceivableListProperties.miDataSource.tableData) {
  //       this.isRenewalListShown = true;
  //     }
  //   });
  // }
  // OnSendingReceivableListParmtrs() {
  //   const postData = {
  //     'licenseeId': this.userDetails['LicenseeId'],
  //     'numberOfDays': '1',
  //   };
  //   this.ReceivableListProperties.requestPostData = postData;
  //   this.ReceivableListProperties.refreshHandler.next(true);
  // }


  // #######################################################################################################################
  // Clients  List with Consulting/Medical (Group)

  GetClientsList() {

    this.ClientListProperties.url = this.dashBoardURL.DashBoardAPIRoute.GetClientsList;
    this.ClientListProperties.miDataSource = new TableDataSource(this.dashboarddataservice);
    this.ClientListProperties.displayedColumns = ['Client'];
    this.ClientListProperties.columnLabels = ['Clients'];
    this.ClientListProperties.columnIsSortable = ['true'];
    this.ClientListProperties.refreshHandler = this.ClientListRefresh;
    this.ClientListProperties.miListMenu = new MiListMenu();
    this.ClientListProperties.miListMenu.visibleOnDesk = true;
    this.ClientListProperties.miListMenu.visibleOnMob = false;
    this.ClientListProperties.isClientSideList = true;
    this.ClientListProperties.columnDataTypes = [['Clients', 'string']];
  }
  OnSendingClientListParmtrs() {

    const postData = {
      'LicenseeID': this.userDetails['LicenseeId'],
      'UserCredentialID': this.userDetails['HouseAccountDetails'].UserCredentialId,
      'isFirstTimeList': true
    };
    this.ClientListProperties.requestPostData = postData;
    this.ClientListProperties.refreshHandler.next(true);
  }

  OnExportClientList() {
    this.excelService.exportAsExcelFile(this.ClientListProperties.miDataSource.getResponse.TotalRecords,
      "Clients List", this.ClientListProperties.displayedColumns);

  }

  // #######################################################################################################################
  // ---------------------------------- Used For Expension on Tab/mobile-------------------------------------------------------------
  setStep(index: number) {
    this.step = index;
  }

  nextStep() {
    this.step++;
  }

  prevStep() {
    this.step--;
  }
  // #######################################################################################################################
}
