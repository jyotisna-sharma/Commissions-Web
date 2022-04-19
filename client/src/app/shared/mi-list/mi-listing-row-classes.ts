export class MiListingRowClasses {

    public className: '';
    public functionToLoadClass: any;
    public self: any;
    constructor(
        _className: any,
        _functionToLoadClass: any,
        _self: any
    ) {

        this.className = _className;
        this.functionToLoadClass = _functionToLoadClass;
        this.self = _self;
    }
}
