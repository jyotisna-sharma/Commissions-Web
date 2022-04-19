import { Component, OnInit, Input} from '@angular/core';
@Component({
  selector: 'app-autocomplete-dropdown',
  templateUrl: './autocomplete-dropdown.component.html',
  styleUrls: ['./autocomplete-dropdown.component.css']
})
export class AutocompleteDropdownComponent implements OnInit {
 @Input() dataList:any;

  constructor(
  ) { }

  ngOnInit(): void {
    
  }

}
