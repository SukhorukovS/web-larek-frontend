import { IEvents } from "../base/events";
import { View } from "../base/view";

interface ICardBasket {
  index: number;
  title: string;
  price: number;
}

export class CardBasket extends View<ICardBasket> {
  protected _index: HTMLElement;
  protected _title: HTMLElement;
  protected _price: HTMLElement;
  protected _deleteButton: HTMLButtonElement;
  protected id: string

  constructor(container: HTMLElement, protected events: IEvents) {
    super(container);

    this._index = this.ensure<HTMLElement>('.basket__item-index', container);
    this._title = this.ensure<HTMLElement>('.card__title', container);
    this._price = this.ensure<HTMLElement>('.card__price' , container);
    this._deleteButton = this.ensure<HTMLButtonElement>('.basket__item-delete', container);

    this._deleteButton.addEventListener('click', this.deleteFromBasket.bind(this));
  }

  deleteFromBasket() {
    this.events.emit('basket:remove', { id: this.id })
  }

  set index(value: number) {
    this.setValue(this._index, `${value}`);
  }

  set title(value: string) {
    this.setValue(this._title, value);
  }

  set price(value: number) {
    if (value === null) {
      this.setValue(this._price, 'Бесценно');
      return;
    }
    this.setValue(this._price, `${value} синапсов`);
  }
}
