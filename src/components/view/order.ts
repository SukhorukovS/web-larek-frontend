import { Events, settings } from '../../utils/constants';
import { IEvents } from '../base/events';
import { View } from '../base/view';

export class OrderFormView extends View<object> {
	protected _paymentButtons: HTMLElement;
	protected _addressInput: HTMLInputElement;
	protected _orderButton: HTMLButtonElement;

	constructor(container: HTMLFormElement, protected events: IEvents) {
		super(container);
		this._paymentButtons = this.ensure(settings.paymentButtonListSelector);
		this._addressInput = container.elements.namedItem(
			settings.addressInputName
		) as HTMLInputElement;
		this._orderButton = this.ensure<HTMLButtonElement>(
			settings.orderButtonSelector
		);

		this._paymentButtons.addEventListener(
			'click',
			this.handlePaymentButtonClick.bind(this)
		);
		this._addressInput.addEventListener(
			'change',
			this.handleAddressChange.bind(this)
		);
		this._orderButton.addEventListener(
			'click',
			this.handleSubmitOrder.bind(this)
		);
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
		this.validateOrderForm();
	}

	handleAddressChange() {
		this.events.emit(Events.ADDRESS_CHANGE, {
			address: this._addressInput.value,
		});
		this.validateOrderForm();
	}

	validateOrderForm() {
		if (this.isFormValid) {
			this._orderButton.disabled = false;
		} else {
			this._orderButton.disabled = true;
		}
	}

	isFormValid() {
		return this._addressInput.value;
	}

	handleSubmitOrder(event: Event) {
		event.preventDefault();

		if (this.isFormValid) {
			this.events.emit(Events.SHOW_USER_FORM);
		}
	}
}
