export class MultiplesColumns {
    columnName: any;
    displayedColumns: any;
    visible: true;
    class: string;
    colspan: any;

    constructor(_columnName, _displayedColumns, _visible, _class, _colspan ) {
        this.columnName = _columnName;
        this.displayedColumns = _displayedColumns;
        this.visible = _visible;
        this.colspan = _colspan;
        this.class = _class;
    }
}
