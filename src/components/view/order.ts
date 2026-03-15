import { Payment } from '../../types';
import { Events, settings } from '../../utils/constants';
import { IEvents } from '../base/events';
import { Form } from './common/Form';

export class OrderFormView extends Form<{ address: string }> {
	protected _paymentButtons: HTMLElement;

	constructor(container: HTMLFormElement, protected events: IEvents) {
		super(container, events);
		this._paymentButtons = this.ensure(settings.paymentButtonListSelector);

		this._paymentButtons.addEventListener(
			'click',
			this.handlePaymentButtonClick.bind(this)
		);
	}

	set address(value: string) {
		(this.container.elements.namedItem('address') as HTMLInputElement).value = value;
	}

	handlePaymentButtonClick(event: MouseEvent) {
		const button = event.target as HTMLButtonElement;

		const container = event.currentTarget as HTMLElement;

		Array.from(
			container.getElementsByClassName(settings.paymentButtonClass)
		).forEach((button) => {
			button.classList.remove(settings.paymentButtonClassActive);
		});

		button.classList.add(settings.paymentButtonClassActive);

		this.events.emit(Events.PAYMENT_CHANGE, { payment: button.name });
	}
}
