import { Component, OnInit, AfterViewInit, Input, EventEmitter, Output, ElementRef, ViewChild, Renderer2 } from '@angular/core';
import { AutocompleteData, IAutocompleteData } from './mi-data';
import { FormBuilder, FormGroup } from '@angular/forms';
import {
  FormControl, Validators, AbstractControl,
  ValidationErrors, ValidatorFn
} from '@angular/forms';
import { AutocompleteDataService } from '../../_services/autocomplete-data.service';
import { switchMap, debounceTime, tap, finalize } from 'rxjs/operators';
import { Observable, Subject } from 'rxjs';
import { AppLevelDataService } from '../../_services/app-level-data.service';
import { CONSTANTS } from '../../../assets/config/CONSTANTS';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-mi-autocomplete',
  templateUrl: './mi-autocomplete.component.html',
  styleUrls: ['./mi-autocomplete.component.scss']
})
export class MiAutocompleteComponent implements OnInit, AfterViewInit {
  @Input() isdisabled: boolean;
  @Input() dataURL: string;
  @Input() postData: any;
  @Input() setPlaceholder: string;
  @Input() editSelValue: string;
  @Input() isAddressFound: Subject<boolean> = new Subject();
  @Input() tabSequancing: string;
  @Output() selAutoData = new EventEmitter();
  @Output() autocompleteData: EventEmitter<any> = new EventEmitter<any>();
  // @Input() isVehicleList: boolean; // set value for chauffeur List.

  @Input() addressData: Subject<boolean> = new Subject();

  // save address
  @Output() textBoxValue: EventEmitter<string> = new EventEmitter<string>();
  // save address

  filteredUsers: AutocompleteData[] = [];
  usersForm: FormGroup;
  isLoading = false;
  notFoundMsg = CONSTANTS.noRecordFound;
  notFoundAuto = false;
  autoSelectobj: any;
  validationMessage: string;
  isSelected: boolean; // check value selected or not.
 // isdisabled: boolean;
  hideNotFound: boolean;
  autocomplete: google.maps.places.Autocomplete;
  address1Field: HTMLInputElement;

  @ViewChild('userInput', { static: true }) private userInputAuto: ElementRef;
  constructor (
    private fb: FormBuilder, private _autocompleteDataService: AutocompleteDataService,
    private renderer: Renderer2,
    public appDataObj: AppLevelDataService,
    public http: HttpClient
  ) {
  }

  ngOnInit () {
    this.hideNotFound = true;
    this.usersForm = this.fb.group({
      userInput: ['', []]
    });

    this.usersForm
      .get('userInput')
      .valueChanges
      .pipe(
        debounceTime(300),
        tap(() => this.isLoading = true),
        switchMap(value => this._autocompleteDataService.searchData(value, this.dataURL, this.postData)
          .pipe(
            finalize(() => this.isLoading = false),
          )
        )
      )
      .subscribe(users => {
        this.filteredUsers = users.TotalRecords;
        this.notFoundAuto = ((users.TotalRecords.length === 0) && (this.usersForm.controls.userInput.value)) ? true : false;
        if (this.notFoundAuto) {
          this.selAutoData.emit('');
        }
      });
    if (this.editSelValue) {
      console.log('editSelValue', this.editSelValue);
      this.textBoxValue.emit(this.editSelValue);
      const autoSelectobj: any = { formattedName: this.editSelValue, formattedValue: '' };
      this.usersForm.controls.userInput.setValue(autoSelectobj);
    }
    this.usersForm.controls.userInput.valueChanges.subscribe(inputData => {
      if (this.usersForm.controls.userInput.value.formattedValue) {
        this.selAutoData.emit(this.usersForm.controls.userInput.value.formattedValue);
      } else {
        //
        this.selAutoData.emit(this.usersForm.controls.userInput.value.formattedName);
      }
    });
    if (this.appDataObj.disabledmatInupt === true) {
      this.usersForm.controls.userInput.disable();
      this.hideNotFound = false;
    } else {
      this.usersForm.controls.userInput.enable();
      this.hideNotFound = true;
    }
    // this.subscribeDisabledAuto();

    //this.inittAutocomplete();
  }

  ngAfterViewInit() {
    this.inittAutocomplete();
  }
  displayFn (user?: any): string | undefined {
    return user ? user.formattedName : undefined;
  }

  openAutoComplete (eventObject) {
  }

  inittAutocomplete() {
    this.address1Field = document.querySelector("#userInput") as HTMLInputElement;
    this.autocomplete = new google.maps.places.Autocomplete(this.address1Field, {
      componentRestrictions: { country: ["us"] },
      fields: ["address_components", "geometry"],
      types: ["address"],
    });

    this.autocomplete.addListener("place_changed", () => {
      this.fillInAddress(this.autocomplete);
      this.textBoxValue.emit(this.address1Field.value);
    });
  }

  fillInAddress(autocomplete) {
    const place = autocomplete.getPlace();

    let valueToEmit = {}; 
    for (const component of place.address_components as google.maps.GeocoderAddressComponent[]) {
      const componentType = component.types[0];

      valueToEmit = {
        ...valueToEmit,
        ...this.getValueToEmit(component, componentType)
      };
    }

    this.autocompleteData.emit(valueToEmit);
  }

  getValueToEmit(component, componentType): {} {
    let address1 = "";
    let postcode = "";
    let valueToEmit = {};
    switch (componentType) {
      case "street_number": {
        address1 = `${component.long_name} ${address1}`;
        valueToEmit[componentType] = address1;
        break;
      }

      case "route": {
        address1 += component.short_name;
        valueToEmit[componentType] = address1;
        break;
      }

      case "postal_code": {
        postcode = `${component.long_name}${postcode}`;
        valueToEmit[componentType] = postcode;
        break;
      }

      case "postal_code_suffix": {
        postcode = `${postcode}-${component.long_name}`;
        valueToEmit[componentType] = postcode;
        break;
      }

      case "locality": {
        valueToEmit[componentType] = component.long_name;
        break;
      }

      case "administrative_area_level_1": {
        valueToEmit[componentType] = component.short_name;
        break;
      }

      case "country": {
        valueToEmit[componentType] = component.long_name;
        break;
      }

      default: {
        break;
      }
    }

    return valueToEmit;
  }
}

