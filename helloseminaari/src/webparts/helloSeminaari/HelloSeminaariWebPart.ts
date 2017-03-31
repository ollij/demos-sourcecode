import { Version, Environment, EnvironmentType } from '@microsoft/sp-core-library';
import {
  BaseClientSideWebPart,
  IPropertyPaneConfiguration,
  PropertyPaneTextField,
  PropertyPaneDropdown,
  IPropertyPaneDropdownOption
} from '@microsoft/sp-webpart-base';
import { escape } from '@microsoft/sp-lodash-subset';
import { SPHttpClient, SPHttpClientResponse } from '@microsoft/sp-http';

import styles from './HelloSeminaari.module.scss';
import * as strings from 'helloSeminaariStrings';
import { IHelloSeminaariWebPartProps } from './IHelloSeminaariWebPartProps';

export default class HelloSeminaariWebPart extends BaseClientSideWebPart<IHelloSeminaariWebPartProps> {

  public render(): void {
    this.domElement.innerHTML = `
      <div class="${styles.helloWorld}">
        <div class="${styles.container}">
          <div class="ms-Grid-row ms-bgColor-themeDark ms-fontColor-white ${styles.row}">
            <div class="ms-Grid-col ms-u-lg10 ms-u-xl8 ms-u-xlPush2 ms-u-lgPush1">
              <span class="ms-font-xl ms-fontColor-white">Welcome to SharePoint!</span>
              <p class="ms-font-l ms-fontColor-white">Customize SharePoint experiences using Web Parts.</p>
              <p class="ms-font-l ms-fontColor-white">${escape(this.properties.description)}</p>
              <a href="https://aka.ms/spfx" class="${styles.button}">
                <span class="${styles.label}">Learn more</span>
              </a>
              <p class="ms-font-l ms-fontColor-white">Selected list: ${escape(this.properties.listName)}</p>              
            </div>
          </div>
        </div>
      </div>`;
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }

  private _options: IPropertyPaneDropdownOption[];

  protected onInit(): Promise<void> {
    return this._getLists().then(lists => {
      this._options = lists.map(list => {
        return {
          key: list.Id,
          text: list.Title
        };
      });
    });
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: {
            description: strings.PropertyPaneDescription
          },
          groups: [
            {
              groupName: strings.BasicGroupName,
              groupFields: [
                PropertyPaneTextField('description', {
                  label: strings.DescriptionFieldLabel
                }),
                PropertyPaneDropdown('listName', {
                  label: 'Select a list',
                  selectedKey: this._options.length > 0 ? this._options[0].key : null,
                  options: this._options
                })
              ]
            }
          ]
        }
      ]
    };
  }

  private _getLists(): Promise<any> {
    if(Environment.type === EnvironmentType.Local) {
      return new Promise<any>(resolve => {
        setTimeout(() => resolve([
          {Id: '1', Title: 'Mock List 1'},
          {Id: '2', Title: 'Mock List 2'}]),
          500);
        });
    }
    else {
      const url: string = this.context.pageContext.web.absoluteUrl + `/_api/web/lists?$filter=Hidden eq false`;
      return this.context.spHttpClient.get(url, SPHttpClient.configurations.v1)
      .then((response: SPHttpClientResponse) => {
        return response.json();
      }).then((json) => {
        return json.value;
      });
    }
  }
}
