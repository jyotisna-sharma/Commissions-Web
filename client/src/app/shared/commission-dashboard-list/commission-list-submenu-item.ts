export class CommissionListSubmenuItem {
    itemName: '';
    itemLabel: '';
    itemIndex: number;
    visible: true;
    class: string;
    // This will keep track if menu item shall be
    // rendered through function or property(itemLabel).
    isFunction: false;
    // This property shall keep the function
    // which needs to be executed to render the menu item
    // (this is required only if isFunction property is true).
    functionToReturnSubMenuItem: any;


    constructor(_itemName, _itemIndex, _visible, _isFunction, _functionToReturnSubMenuItem, _class) {
        this.itemName = _itemName;
        this.itemIndex = _itemIndex;
        this.visible = _visible;
        this.isFunction = _isFunction;
        this.functionToReturnSubMenuItem = _functionToReturnSubMenuItem;
        this.class = _class;
    }
}
