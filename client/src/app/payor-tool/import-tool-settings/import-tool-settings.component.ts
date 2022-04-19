import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { CommonDataService } from '../../_services/common-data.service';
import { ResponseCode } from './../../response.code';
import { FormControl, FormGroup, FormArray, FormBuilder } from '@angular/forms';
import { AddFieldComponent } from '../add-field/add-field.component';
import { MatDialog } from '@angular/material/dialog';
import { ShowConfirmationComponent } from '../../_services/dialogboxes/show-confirmation/show-confirmation.component';
import { Guid } from 'guid-typescript';
import { GetRouteParamtersService } from '../../_services/getRouteParamters.service';
import { Router, ActivatedRoute } from '@angular/router';
import { SuccessMessageComponent } from '../../_services/dialogboxes/success-message/success-message.component';
import { MiProperties } from '../../shared/mi-list/mi-properties';
import { TableDataSource } from '../../_services/table.datasource';
import { MiListMenu } from '../../shared/mi-list/mi-list-menu';
import { MiListMenuItem } from '../../shared/mi-list/mi-list-menu-item';
import { Subject } from 'rxjs/Subject';
import { MiListFieldType } from 'src/app/shared/mi-list/mi-list-field-type';
import { AddEditPhraseComponent } from '../add-edit-phrase/add-edit-phrase.component';
import { MultiplesColumns } from '../../shared/commission-dashboard-list/multiples-columns';
import { MultipleColumLabels } from '../../shared/commission-dashboard-list/Commission-dahboard-multiple-ColumnLabel';
@Component({
  selector: 'app-import-tool-settings',
  templateUrl: './import-tool-settings.component.html',
  styleUrls: ['./import-tool-settings.component.scss']
})
export class ImportToolSettingsComponent implements OnInit {
  moduleName: any = 'Import Tool Settings';
  payorName: any = '';
  postData: any;
  templateList: any = [];
  selectedTemplateId: any;
  showloading: Boolean = false;
  isSaveNextButtonShown: Boolean = false;
  isFirstTimeListLoad: Boolean = false;
  selectedTabIndex: Number = 0;
  // First tab variable initalized
  fileTypeList: any = ['xlsx', 'xls', 'csv', 'txt'];
  format: any = ['Tab', 'Comma'];
  payorTemplate: FormGroup = new FormGroup({
    fileType: new FormControl('xlsx', []),
    formatType: new FormControl('Tab', [])
  });
  MiListProperties: MiProperties = new MiProperties();
  needRefresh: Subject<boolean> = new Subject();
  needPageReset: Subject<boolean> = new Subject();
  columnLabels: string[] = ['Phrase', ''];
  displayedColumns: string[] = ['PayorPhrases', 'Action'];
  columnIsSortable: string[] = ['true', 'false'];
  // ####################################£

  statementDataListProperties: MiProperties = new MiProperties();
  outgoingNeedRefresh: Subject<boolean> = new Subject();
  outgoingPayColumnLabel: any = ['', 'Row', 'Column', 'Then',
    'Row', 'Column', 'End Data Indicator'];
  outgoingPayDisplayColumn: any = ['StatementData', 'FixedRowLocation', 'FixedColLocation',
    'RelativeSearch', 'RelativeRowLocation', 'RelativeColLocation', 'BlankFieldsIndicator'];
  isTemplateChange: Subject<boolean> = new Subject();
  // ££££££££££££££££££££££££££££££££££££££££££££
  constructor(
    private commonService: CommonDataService,
    private dialog: MatDialog,
    public router: Router,
    private getRouterParams: GetRouteParamtersService,
    private activatedRoute: ActivatedRoute,
    private fb: FormBuilder) { }

  ngOnInit(): void {
    this.getRouterParams.getparameterslist(this.activatedRoute);
    this.GetTemplateList();

  }
  /*
  CreatedBy:AcmeMinds
  CreatedOn:04-Feb-2020
  Purpose:Getting List of Templates based on payor name
   */
  GetTemplateList(): void {
    this.showloading = true;
    this.postData = {
      'payorId': this.getRouterParams.payorId,
      'selectedTabName': 'ImportToolTemplate',
    };
    this.postData['URL'] = 'GetImportPayorTemplate';
    this.commonService.RequestSendsToAPI(this.postData).subscribe(response => {
      this.showloading = false;
      if (ResponseCode.SUCCESS === response.ResponseCode) {
        this.templateList = response.TotalRecords;
        this.payorName = 'Payor name-' + response['PayorName'];
        this.selectedTemplateId = this.getRouterParams.templateId ? this.getRouterParams.templateId : response.TotalRecords[0].TemplateID;
        this.PayorTemplatePhraseList();
        this.StatementDataList();
      }
    });
  }
  OnChangeTemplate(): void {
    this.isSaveNextButtonShown = false;
    this.PayorTemplatePhraseList();
    this.StatementDataList();
    const that = this;
    setTimeout(function (): void {
      that.isTemplateChange.next(true);
    }, 100);
  }
  PayorTemplatePhraseList(): void {
    this.isFirstTimeListLoad = true;
    this.MiListProperties.url = '/api/CommonData/CommTableListRequestSends';
    this.MiListProperties.miDataSource = new TableDataSource(this.commonService);
    this.MiListProperties.displayedColumns = this.displayedColumns;
    this.MiListProperties.columnLabels = this.columnLabels;
    this.MiListProperties.columnIsSortable = this.columnIsSortable;
    this.MiListProperties.refreshHandler = this.needRefresh;
    this.MiListProperties.resetPagingHandler = this.needPageReset;
    this.MiListProperties.miListMenu = new MiListMenu();
    this.MiListProperties.miListMenu.visibleOnDesk = true;
    this.MiListProperties.miListMenu.visibleOnMob = false;
    this.MiListProperties.showPaging = true;
    this.MiListProperties.pageSize = this.getRouterParams.pageSize;
    this.MiListProperties.initialPageIndex = this.getRouterParams.pageIndex;
    this.MiListProperties.miListMenu.menuItems =
      [
        new MiListMenuItem('Edit', 1, true, false, undefined, 'img-icons edit-icn'),
        new MiListMenuItem('Delete', 3, true, false, undefined, 'img-icons delete-icn'),
      ]
    this.PayorTemplatePhraseListRefresh();
    this.MiListProperties.miDataSource.dataSubject.subscribe(isloadingDone => {
      if (isloadingDone && this.MiListProperties.miDataSource.getResponse) {
        if (this.isFirstTimeListLoad && this.MiListProperties.miDataSource.getResponse.TotalLength === 0) {
          this.isSaveNextButtonShown = true;
        }
        const Templatedetails = this.MiListProperties.miDataSource.getResponse['ImportPayorTemplateDetails'];
        this.payorTemplate.controls.fileType.setValue(Templatedetails['FileType']);
        this.payorTemplate.controls.formatType.setValue(Templatedetails['FormatType']);
      }
    });
  }

  // // ************************************************************************************************** */
  // /*
  //  Purpose:method used for refresh a list
  // */
  PayorTemplatePhraseListRefresh(): void {
    this.postData = {
      'payorId': this.getRouterParams.payorId,
      'templateId': this.selectedTemplateId
    };
    this.postData['URL'] = 'GetImportTemplatePhraseList';
    this.MiListProperties.requestPostData = this.postData;
    this.MiListProperties.refreshHandler.next(true);
  }
  OnTabChange(data: any): void {
    this.selectedTabIndex = data.index;
  }

  AddEditPhraseDialogBox(selectedRecord: any): void {
    let payorTemplateData = {};
    if (!selectedRecord) {
      payorTemplateData = {
        'TemplateID': this.selectedTemplateId,
        'PayorID': this.getRouterParams.payorId,
        'FileType': this.payorTemplate.controls.fileType.value,
        'FileFormat': this.payorTemplate.controls.formatType.value,
        'TemplateName': '',
        'PayorName': '',
        'ID': 0
      };
    }
    const dialogRef = this.dialog.open(AddEditPhraseComponent, {
      data: {
        title: selectedRecord && selectedRecord.ID ? 'Edit Phrase' : 'Add Phrase',
        fieldName: 'Phrase Name',
        selectedRecordData: selectedRecord ? selectedRecord : payorTemplateData

      },
      disableClose: true,
      width: '400px',
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.MiListProperties.refreshHandler.next(true);
      }
    })
  }
  OnActionButtonClick(clickedRecord: any): void {
    if (clickedRecord.name === 'Edit') {
      this.AddEditPhraseDialogBox(clickedRecord.data);
    }
    if (clickedRecord.name === 'Delete') {
      this.OnDeleteTemplatePhrase(clickedRecord.data['ID']);
    }
  }
  OnPageRedirection(linkname: string): void {
    if (linkname === 'breadCrumb') {
    }
    this.router.navigate(['/payor-tool/payor-tool-import-listing',
      this.getRouterParams.pageSize, this.getRouterParams.pageIndex, this.getRouterParams.payorId]);
  }
  OnDeleteTemplatePhrase(Id: Number): void {
    const dilogref = this.dialog.open(ShowConfirmationComponent, {
      data: {
        headingTitle: 'Delete',
        subTitle: 'Are you sure you want to delete the selected phrase?'
      },
      width: '400px',
      disableClose: true,
    });
    dilogref.afterClosed().subscribe(result => {
      if (result === true) {
        const postData = {
          'phraseId': Id,
        };
        postData['URL'] = 'DeleteTemplatePhrase';
        this.commonService.RequestSendsToAPI(postData).subscribe(response => {
          if (response['ResponseCode'] === ResponseCode.SUCCESS) {
            this.MiListProperties.refreshHandler.next(true);
          }
        });
      }
    });
  }
  SavePayorTemplateDetails(buttonName: string): void {
    this.showloading = true;
    const postData = {
      payorId: this.getRouterParams.payorId,
      templateId: this.selectedTemplateId,
      templateData: {
        FormatType: this.payorTemplate.controls.formatType.value,
        FileType: this.payorTemplate.controls.fileType.value
      }
    };
    postData['URL'] = 'SavePayorTemplateDetails';
    this.commonService.RequestSendsToAPI(postData).subscribe(response => {
      this.showloading = false;
      if (response['ResponseCode'] === ResponseCode.SUCCESS) {
        if (buttonName === 'saveNextClicked') {
          this.selectedTabIndex = 1;
        }
      }
    });
  }
  // $$$$$$$$$$$$$$$$$$$$$$$$$$$$$$ Second Tab Methods Starts $$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$
  StatementDataList(): void {
    this.statementDataListProperties.url = '/api/CommonData/CommTableListRequestSends';
    this.statementDataListProperties.miDataSource = new TableDataSource(this.commonService);
    this.statementDataListProperties.columnLabels = this.outgoingPayColumnLabel;
    this.statementDataListProperties.displayedColumns = this.outgoingPayDisplayColumn;
    this.statementDataListProperties.refreshHandler = this.outgoingNeedRefresh;
    this.statementDataListProperties.isEditablegrid = true;
    this.statementDataListProperties.isMultipleColumnShown = true;
    this.statementDataListProperties.multipleColumHeader = new MultipleColumLabels();
    this.statementDataListProperties.multipleColumHeader.multiplecolumnLabels = ['hidden', 'Fixed Location', 'Relative Search'];
    this.statementDataListProperties.multipleColumHeader.multipleColumType = {
      'hidden': new MultiplesColumns('', '', '', 'hidden', 1),
      'Fixed Location': new MultiplesColumns('Fixed Location', '', '', '', 2),
      'Relative Search': new MultiplesColumns('Relative Search', '', '', '', 7),
    };
    this.statementDataListProperties.fieldType = {
      'FixedRowLocation': new MiListFieldType('', 'FixedRowLocation', '', '',
        'numberInput', false, '', '', '', '', '', ''),
      'FixedColLocation': new MiListFieldType('', 'FixedRowLocation', '', '',
        'numberInput', false, '', '', '', '', '', ''),
      'RelativeRowLocation': new MiListFieldType('', 'FixedRowLocation', '', '',
        'numberInput', false, '', '', '', '', '', ''),
      'RelativeColLocation': new MiListFieldType('', 'FixedRowLocation', '', '',
        'numberInput', true, '', '', '', '', '', ''),
      'BlankFieldsIndicator': new MiListFieldType('', 'BlankFieldsIndicator', '', '',
        'selectDropDown', true, '', '', '', '', '', ''),
      'RelativeSearch': new MiListFieldType('', 'RelativeSearch', '', '',
        'input', true, '', '', '', '', '', ''),
    };
    this.StatementRefreshList();

  }

  StatementRefreshList(): void {
    this.postData = {
      'payorID': this.getRouterParams.payorId,
      'templateID': this.selectedTemplateId
    };
    this.postData['URL'] = 'GetImportToolStatementDetails';
    this.statementDataListProperties.requestPostData = this.postData;
    this.statementDataListProperties.refreshHandler.next(true);
  }

  ImportStatemntListSave(buttonName: any): void {

    const postData = {
      data: this.statementDataListProperties.miDataSource.tableData
    };
    postData['URL'] = 'SaveImportToolStatementDetails';

    const data = this.statementDataListProperties.miDataSource.tableData[4];
    if (!data.RelativeColLocation && !data.RelativeRowLocation && !data.FixedColLocation && !data.FixedRowLocation) {
      this.StatemntListValidationDialog();
    } else {
      this.showloading = true;
      this.commonService.RequestSendsToAPI(postData).subscribe(response => {
        this.showloading = false;
        if (response['ResponseCode'] === ResponseCode.SUCCESS) {
          if (buttonName === 'saveNextClicked') {
            this.selectedTabIndex = 2;
          }
        }

      });
    }

  }
  StatemntListValidationDialog(): void {
    const dilogref = this.dialog.open(SuccessMessageComponent,
      {
        width: '450px',
        data: {
          Title: 'Missing Data!',
          subTitle: 'Start data must have at least one value specified in row or column field.',
          buttonName: 'ok',
          isCommanFunction: false
        },
        disableClose: true,
      });
  }
}

