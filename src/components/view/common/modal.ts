import { IEvents } from "../../base/events";
import { View } from "../../base/view";

interface IModalData {
  content: HTMLElement;
}

export class Modal extends View<IModalData> {
  protected _content: HTMLElement;

  constructor(container: HTMLElement, protected events: IEvents) {
    super(container);

    this._content = this.ensure<HTMLElement>('.modal__content', container);

    this.container.addEventListener('click', this.close.bind(this))
  }

	close(event?: MouseEvent) {
		const target = event?.target as HTMLElement;
		const isClickEvent =
			target?.classList.contains('modal__close') ||
			target?.classList.contains('modal');

		if (!event || isClickEvent) {
			this.container.classList.remove('modal_active');
			this.content = null;
			this.events.emit('modal:close');
		}
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
