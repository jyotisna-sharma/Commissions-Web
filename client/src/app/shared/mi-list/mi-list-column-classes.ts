import { MultiplesColumns } from '../commission-dashboard-list/multiples-columns';
export class MiListColumnClasses {
    columnName: MultiplesColumns[];
    class: any;
    isSortable: any;
    constructor(_columnName, _class, _isSortable) {
        this.columnName = _columnName;
        this.class = _class;
        this.isSortable = _isSortable;
    }
}
