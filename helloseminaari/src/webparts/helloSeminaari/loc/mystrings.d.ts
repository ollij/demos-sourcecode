declare interface IHelloSeminaariStrings {
  PropertyPaneDescription: string;
  BasicGroupName: string;
  DescriptionFieldLabel: string;
}

declare module 'helloSeminaariStrings' {
  const strings: IHelloSeminaariStrings;
  export = strings;
}
