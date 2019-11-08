export interface Component {
  init(): void;
  view(): string;
}

export abstract class DynamicComponent implements Component {
  private callback: Function = () => {};

  public listen(callback: Function): void {
    this.callback = callback;
  }

  private render(): void {
    this.callback();
  }

  abstract init(): void;

  abstract view(): string;
}
