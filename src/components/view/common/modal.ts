import { IEvents } from "../../base/events";
import { View } from "../../base/view";

interface IModalData {
  content: HTMLElement;
}

export class Modal extends View<IModalData> {
  protected _closeButton: HTMLButtonElement;
  protected _content: HTMLElement;

  constructor(container: HTMLElement, protected events: IEvents) {
    super(container);

    this._closeButton = this.ensure<HTMLButtonElement>('.modal__close', container);
    this._content = this.ensure<HTMLElement>('.modal__content', container);

    this._closeButton.addEventListener('click', this.close.bind(this));
  }

  close() {
    this.container.classList.remove('modal_active');
    this.content = null;
    this.events.emit('modal:close');
  }

  set content(value: HTMLElement) {
    this._content.replaceChildren(value);
  }

  open() {
    this.container.classList.add('modal_active');
    this.events.emit('modal:open');
  }

  render(data: IModalData): HTMLElement {
    super.render(data);
    this.open();
    return this.container;
  }
}
