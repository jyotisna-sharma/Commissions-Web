import { Title } from "@angular/platform-browser";
import { RemoveConfirmationComponent } from "./../../_services/dialogboxes/remove-confirmation/remove-confirmation.component";
import { SuccessMessageComponent } from "./../../_services/dialogboxes/success-message/success-message.component";
import { ResponseCode } from "./../../response.code";
import { ResponseErrorService } from "./../../_services/response-error.service";
import { SettingsAPIURLService } from "./../settings-api-url.service";
import { Router, ActivatedRoute } from "@angular/router";
import { MiListMenuItem } from "./../../shared/mi-list/mi-list-menu-item";
import { GetRouteParamtersService } from "./../../_services/getRouteParamters.service";
import { TableDataSource } from "./../../_services/table.datasource";
import { MiProperties } from "./../../shared/mi-list/mi-properties";
import { Component, OnInit } from "@angular/core";
import { MiListMenu } from "../../shared/mi-list/mi-list-menu";
import { Subject } from "rxjs";
import { MatDialog } from "@angular/material/dialog";
import { SettingsService } from "../settings.service";
import { EditSegmentComponent } from "./../edit-segment/edit-segment.component";

@Component({
  selector: "app-segment-listing",
  templateUrl: "./segment-listing.component.html",
  styleUrls: ["./segment-listing.component.css"],
})
export class SegmentListingComponent implements OnInit {
  title: any;
  MiListProperties: MiProperties = new MiProperties();
  url: any;
  dataToPost: any;
  searchData: any = "";
  userdetail: any;
  showloading: boolean = false;
  needRefresh: Subject<boolean> = new Subject();
  needPageReset: Subject<boolean> = new Subject();
  postData: any;
  errorMessage: any;
  columnLabels: string[] = ["Segment Name", ""];
  displayedColumns: string[] = ["SegmentName", "Action"];
  columnIsSortable: string[] = ["true", "false"];

  constructor(
    private router: Router,
    public getrouteParamters: GetRouteParamtersService,
    public sttngSrvc: SettingsService,
    public settingAPIURLService: SettingsAPIURLService,
    public error: ResponseErrorService,
    public dialog: MatDialog,
    public activateRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.title = "Segment";
    this.userdetail = JSON.parse(localStorage.getItem("loggedUser"));
    this.InitSegmentList();
    this.RefreshList();
  }

  //---------------------------------- this method is used for getting list of segments----------------------------------
  InitSegmentList() {
    this.url = this.settingAPIURLService.SettingAPIRoutes.GetSegmentsListing;
    this.MiListProperties.url = this.url;
    this.MiListProperties.miDataSource = new TableDataSource(this.sttngSrvc);
    this.MiListProperties.displayedColumns = this.displayedColumns;
    this.MiListProperties.columnLabels = this.columnLabels;
    this.MiListProperties.columnIsSortable = this.columnIsSortable;
    this.MiListProperties.refreshHandler = this.needRefresh;
    this.MiListProperties.resetPagingHandler = this.needPageReset;
    this.MiListProperties.miListMenu = new MiListMenu();
    this.MiListProperties.miListMenu.visibleOnDesk = true;
    this.MiListProperties.miListMenu.visibleOnMob = false;
    this.MiListProperties.showPaging = true;
    this.MiListProperties.pageSize = this.getrouteParamters.pageSize;
    this.MiListProperties.initialPageIndex = this.getrouteParamters.pageIndex;
    this.MiListProperties.initialSortBy = "SegmentName";
    this.MiListProperties.initialSortOrder = "asc";
    this.MiListProperties.miListMenu.menuItems = [
      new MiListMenuItem("Edit", 0, true, false, null, "img-icons edit-icn"),
      new MiListMenuItem(
        "Delete",
        1,
        true,
        false,
        null,
        "img-icons delete-icn"
      ),
    ];
  }

  //------------------------------------------------------------------------------------------------------------------------

  //-------------------------Method used for sending a filter parameter for filtered segment list---------------------------
  RefreshList() {
    this.dataToPost = {
      LicenseeId: this.userdetail["LicenseeId"],
      FilterBy: this.searchData,
    };
    this.MiListProperties.requestPostData = this.dataToPost;
    this.MiListProperties.refreshHandler.next(true);
  }

  //-------------------------Method used for searching based on search ---------------------------------------------------
  doSearch() {
    //this.showLoading = false;
    this.MiListProperties.resetPagingHandler.next(true);
    this.RefreshList();
  }

  HandleSearchClear = (value) => {
    if (!value) {
      this.searchData = value;
      this.doSearch();
    } else if (value.type === "click") {
      this.searchData = "";
      this.doSearch();
    }
  };
  // **********************************************************************************************************************

  //-------------------------Method used for shown a Edit/Add segment dialog box ---------------------------------------------------
  OnCreateClick(val) {
    const title = val ? "Edit Segment" : "Create Segment";
    const buttonText = val ? "Update" : "Create";
    const dialogRef = this.dialog.open(EditSegmentComponent, {
      data: {
        headingTitle: title,
        subTitle: "",
        primaryButton: buttonText,
        secondryButton: "Cancel",
        extraData: {
          Segment: val,
        },
      },
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result === true) {
        this.searchData = "";
        this.RefreshList();
      }
    });
  }
  // **********************************************************************************************************************

  //-------------------------Method used for take neccessary action on action button click of a record ---------------------------------------------------
  OnMenuClicked(value) {
    if (value.name === "Edit") {
      this.OnCreateClick(value.data);
    } else if (value.name === "Delete") {
      this.showloading = false;
      this.OnDeleteSegmentDialogBox(value);
    }
  }
  //-------------------------Methods used for delete a segment----------- ---------------------------------------------------
  OnSegmentHasPoliciesDialogBox(value: any) {
    if (value === "") {
      const dialogRef = this.dialog.open(SuccessMessageComponent, {
        data: {
          Title: "Delete Segment",
          subTitle:
            "Segment cannot be deleted as there are products or policies associated with segment in the system.",
          buttonName: "ok",
          isCommanFunction: false,
        },
        width: "400px",
        disableClose: true,
      });
    } else {
      const dialogRef = this.dialog.open(SuccessMessageComponent, {
        data: {
          Title: "Error Segment",
          subTitle: "There is error while deleting segment",
          buttonName: "ok",
          isCommanFunction: false,
        },
        width: "400px",
        disableClose: true,
      });
    }
  }
  OnDeleteSegmentDialogBox(value) {
    const dialogRef = this.dialog.open(RemoveConfirmationComponent, {
      data: {
        headingTitle: "Delete Segment",
        subTitle: "Are you sure you want to delete this segment?",
        primaryButton: "Yes, Delete",
      },
      width: "450px",
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result === true) {
        this.showloading = true;
        this.postData = {
          segmentObject: {
            SegmentId: value.data.SegmentId,
            'LicenseeId': this.userdetail['LicenseeId'],
          },
          operationType: "2",
          'LicenseeId': this.userdetail['LicenseeId']
        };
        this.sttngSrvc.saveDeleteSegment(this.postData).subscribe((response) => {
          if(response.ExceptionMessage != "deleted successfully") {
            const dialogRef = this.dialog.open(SuccessMessageComponent, {
              width: '500px',
              data: {
                Title: "Delete Segment",
                subTitle: response.Status.ErrorMessage,
                buttonName: 'ok',
                isCommanFunction: false
              },
              disableClose: true,
            });
          } else {
            const dialogRef = this.dialog.open(SuccessMessageComponent, {
              width: '450px',
              data: {
                Title: "Segment " + response.ExceptionMessage,
                subTitle: "This segment "  + response.Status.ErrorMessage,
                buttonName: 'ok',
                isCommanFunction: false
              },
              disableClose: true,
            });
          }
            this.showloading = false;
            if (response.Status) {
              if (
                response["ResponseCode"] === ResponseCode.Failure &&
                response.Status.IsError
              ) {
                this.errorMessage = response.Status.ErrorMessage;
                this.OnSegmentHasPoliciesDialogBox(this.errorMessage);
                return;
              } else if (
                response["ResponseCode"] === ResponseCode.SUCCESS &&
                response.Status.IsError === false &&
                response.Status.ErrorMessage === "cannot delete segment"
              ) {
                this.OnSegmentHasPoliciesDialogBox("");
                return;
              } else if (
                response["ResponseCode"] === ResponseCode.SUCCESS &&
                response.Status.IsError === false
              ) {
                this.MiListProperties.refreshHandler.next(true);
              }
            }
          });
      }
    });
  }

}
