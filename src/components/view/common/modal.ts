import { Events, settings } from '../../../utils/constants';
import { IEvents } from '../../base/events';
import { View } from '../../base/view';

interface IModalData {
	content: HTMLElement;
}

export class Modal extends View<IModalData> {
	protected _content: HTMLElement;

	constructor(container: HTMLElement, protected events: IEvents) {
		super(container);

		this._content = this.ensure<HTMLElement>(
			settings.modalContentSelector,
			container
		);

		this.container.addEventListener('click', this.close.bind(this));
	}

	close(event?: MouseEvent) {
		const target = event?.target as HTMLElement;
		const isClickEvent =
			target?.classList.contains(settings.modalCloseClass) ||
			target?.classList.contains(settings.modalClass);

		if (!event || isClickEvent) {
			this.container.classList.remove(settings.modalActiveClass);
			this.content = null;
			this.events.emit(Events.MODAL_CLOSE);
		}
	}

	set content(value: HTMLElement) {
		this._content.replaceChildren(value);
	}

	open() {
		this.container.classList.add(settings.modalActiveClass);
		this.events.emit(Events.MODAL_OPEN);
	}

	render(data: IModalData): HTMLElement {
		super.render(data);
		this.open();
		return this.container;
	}
}
