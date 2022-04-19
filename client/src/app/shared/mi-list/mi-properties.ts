import { TableDataSource } from '../../_services/table.datasource';
import { Subject } from 'rxjs/Subject';
import { MiListMenu } from './mi-list-menu';
import { MultipleColumLabels } from '../../shared/commission-dashboard-list/Commission-dahboard-multiple-ColumnLabel';
import { MiListingRowClasses } from './mi-listing-row-classes';

export class MiProperties {
    miDataSource: TableDataSource;
    displayedColumns: string[] = [];
    isFooterRequired: Boolean = false;
    isClientSidePagination: Boolean = false;
    footerDisplayData: string[] = [];
    columnLabels: string[] = [];
    multiplecolumnLabels: string[] = [];
    columnIsSortable: string[] = [];
    columnDataTypes: string[][] = [];
    dataStatus: string[] = [];
    idPropertyName = '';
    refreshHandler: Subject<boolean>;
    miListMenu: MiListMenu;
    requestPostData: any = {};
    url: any;
    showDeleteOption: boolean; // show delete option or not in list.
    showPaging: boolean; //  pagination  hide/show based on this conditon
    cachedList: any[]; // existing data source
    cachedListPageLength: Number;
    pageSize: any;
    initialPageIndex: any;
    resetPagingHandler: Subject<boolean>;
    hideActionMenu: boolean;
    initialSortOrder: any;
    initialSortBy: any;
    isRowClickable: boolean;
    fieldType: {};
    isEditablegrid: boolean;
    isClientSideList: Boolean = false;
    clientSideSearch: Subject<boolean>;
    rowClass: MiListingRowClasses;
    isMultipleColumnShown: Boolean = false;
    multipleColumns: {};
    isContextMenu: Boolean = false;
    isSimpletextMenu: Boolean = false;
    subMenuItems: any;
    multipleColumHeader: MultipleColumLabels;
    accordingPanelHeader: string[] = [];
    isaccordingPanelShown: Boolean = false;
    isFirstRowSelected: Boolean = false;
    isClientSideListRefresh: Subject<boolean>;
}
