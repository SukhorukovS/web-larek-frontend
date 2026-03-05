import { View } from "../base/view";

interface IBasket {
  items: HTMLElement[];
  price: number;
}

export class Basket extends View<IBasket> {
  protected _itemList: HTMLElement;
  protected _totalPrice: HTMLElement;

  constructor(container: HTMLElement) {
    super(container);

    this._itemList = this.ensure<HTMLElement>('.basket__list');
    this._totalPrice = this.ensure<HTMLElement>('.basket__price')
  }

  set items(value: HTMLElement[]) {
    this.setValue(this._itemList, value);
  }

  set price(value: number) {
    this.setValue(this._totalPrice, `${value} синапсов`)
  }
}