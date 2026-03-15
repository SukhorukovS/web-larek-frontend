import { View } from "../../base/view";

interface ICard {
  price: number;
  title: string;
}

interface ISettings {
  titleSelector: string;
  priceSelector: string;
}

export class Card<T> extends View<ICard & T> {
  protected _title: HTMLElement; 
	protected _price: HTMLElement;

  constructor(container: HTMLElement, settings: ISettings) {
    super(container);

    this._title = this.ensure(settings.titleSelector, container);
    this._price = this.ensure(settings.priceSelector, container);
  }

  set title(value: string) {
    this.setValue(this._title, value);
  }

  set price(value: number) {
		this.setValue(this._price, value === null ? 'Бесценно' : `${value} синапсов`);
	}
}
