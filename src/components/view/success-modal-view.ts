import { IEvents } from "../base/events";
import { View } from "../base/view";

interface ISuccessView {
  total: number
}

export class SuccessModalView extends View<ISuccessView> {
  protected _total: HTMLElement;
  protected _successClose: HTMLElement;


  constructor(container: HTMLElement, protected events: IEvents) {
    super(container);

    this._total = this.ensure('.order-success__description', container);
    this._successClose = this.ensure('.order-success__close', container);

    this._successClose.addEventListener('click', this.handleCloseClick.bind(this));
  }

  handleCloseClick() {
    this.events.emit('modal:close:trigger');
  }

  set total(value: number) {
    this.setValue(this._total, `Списано ${value} синапсов`);
  }
}
