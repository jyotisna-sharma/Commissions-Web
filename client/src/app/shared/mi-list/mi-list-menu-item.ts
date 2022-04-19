export class MiListMenuItem {
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
    functionToReturnMenuItem: any;
    // isSubMenuExist: Boolean = false;
    // functionToReturnSUbMenuItem: [];

    constructor(_itemName, _itemIndex, _visible, _isFunction, _functionToReturnMenuItem, _class, ) {
        this.itemName = _itemName;
        this.itemIndex = _itemIndex;
        this.visible = _visible;
        this.isFunction = _isFunction;
        this.class = _class;
        this.functionToReturnMenuItem = _functionToReturnMenuItem;
    }
}
