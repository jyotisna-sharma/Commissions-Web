export class AutocompleteData {
    constructor(public formattedName: string, public formattedValue: string) {}
  }
  export interface IAutocompleteData {
    ResponseCode: number;
    TotalRecords: AutocompleteData[];
  }
