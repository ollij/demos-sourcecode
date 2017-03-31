declare interface IHelloKittyStrings {
  PropertyPaneDescription: string;
  BasicGroupName: string;
  DescriptionFieldLabel: string;
}

declare module 'helloKittyStrings' {
  const strings: IHelloKittyStrings;
  export = strings;
}
