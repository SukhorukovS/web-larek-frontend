import { Events, settings } from '../../utils/constants';
import { IEvents } from '../base/events';
import { View } from '../base/view';

interface ISuccessView {
	total: number;
}

export class SuccessModalView extends View<ISuccessView> {
	protected _total: HTMLElement;
	protected _successClose: HTMLElement;

	constructor(container: HTMLElement, protected events: IEvents) {
		super(container);

		this._total = this.ensure(settings.successTotalSelector, container);
		this._successClose = this.ensure(
			settings.successCloseButtonSelector,
			container
		);

		this._successClose.addEventListener(
			'click',
			this.handleCloseClick.bind(this)
		);
	}

	handleCloseClick() {
		this.events.emit(Events.MODAL_CLOSE_TRIGGER);
	}

	set total(value: number) {
		this.setValue(this._total, `Списано ${value} синапсов`);
	}
}
