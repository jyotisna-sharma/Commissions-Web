export class MiListFieldType {
    class: any;
    type: any;
    visibility: any;
    disabled: any;
    itemName: any;
    columnName: any;
    displayColumnName: any;
    isfunctionRequired: any;
    functionToReturnFieldValue: any;
    value: any;
    labelName: any;
    thisRef: any;
    // tslint:disable-next-line:max-line-length
    constructor(_columnName, _displayColumnName, _visibility, _class, _type, _disabled, _itemName, _isfunctionRequired, _functionToReturnFieldValue, _value, _labelName, _thisRef) {
        this.class = _class;
        this.value = _value;
        this.columnName = _columnName;
        this.displayColumnName = _displayColumnName;
        this.type = _type;
        this.visibility = _visibility;
        this.disabled = _disabled;
        this.itemName = _itemName;
        this.isfunctionRequired = _isfunctionRequired;
        this.displayColumnName = _displayColumnName
        this.functionToReturnFieldValue = _functionToReturnFieldValue;
        this.labelName = _labelName;
        this.thisRef = _thisRef;
    }
	
	setLabel(labelName)
    {
        this.labelName = labelName;
    }
}

