import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PayorToolUrlService {
  public PayorToolURL: any = {
    'TemplateList': 'api/PayorTool/getPayorTemplateList',
    'GetFieldList': 'api/PayorTool/getFieldList',
    'AddField': 'api/PayorTool/addField',
    'DeleteField': 'api/PayorTool/deleteField',
    'GetTemplateData': 'api/PayorTool/getTemplateData',
    'SavePayorToolData': 'api/PayorTool/savePayorToolData',
    'AddTemplate':'/api/PayorTool/addTemplate',
    'DeleteTemplateField':'/api/PayorTool/DeleteTemplate',
    'DuplicateTemplate':'/api/PayorTool/duplicateTemplate',
    'GetMaskTypeFieldList': 'api/PayorTool/GetMaskFieldList',
    'IfPayorTemplateHasValue': 'api/PayorTool/checkIfTemplateHasFields',
    'FetchTestFormulaResult':'api/PayorTool/fetchTestFormulaResult'
  }
  public ImportPayorToolURL: any = { 
    'DeleteTemplateField':'/api/PayorTool/DeleteImportPayorTemplate',
  }

  constructor() { }
}
