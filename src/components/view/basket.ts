import { IEvents } from "../base/events";
import { View } from "../base/view";

interface IBasket {
  items: HTMLElement[];
  price: number;
}

export class Basket extends View<IBasket> {
  protected _itemList: HTMLElement;
  protected _totalPrice: HTMLElement;
  protected _checkoutButton: HTMLElement;

  constructor(container: HTMLElement, protected events: IEvents) {
    super(container);

    this._itemList = this.ensure<HTMLElement>('.basket__list');
    this._totalPrice = this.ensure<HTMLElement>('.basket__price');
    this._checkoutButton = this.ensure<HTMLButtonElement>('.basket__button');

    this._checkoutButton.addEventListener('click', this.handleCheckoutClick.bind(this))
  }

  set items(value: HTMLElement[]) {
    this.setValue(this._itemList, value);
  }

  set price(value: number) {
    this.setValue(this._totalPrice, `${value} синапсов`)
  }

  handleCheckoutClick() {
    this.events.emit('show:orderForm')
  }
}