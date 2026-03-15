import { FormErrors, IOrderForm, IUserForm, Order, OrderProduct, Payment } from '../../types';
import { Events } from '../../utils/constants';
import { Model } from '../base/model';

export class OrderModel extends Model<Order> {
	items: Order['items'] = [];
	_address: Order['address'] = '';
	_payment: Order['payment'] = 'card';
	_email: Order['email'] = '';
	_phone: Order['phone'] = '';
  userFormErrors: FormErrors = {};
  orderFormErrors: FormErrors = {};

	addProduct(product: OrderProduct) {
		this.items.push(product);
		this.events.emit(Events.BASKET_COUNT_CHANGE, { count: this.items.length });
	}

	removeProduct({ id }: { id: string }) {
		this.items = this.items.filter((item) => item.id !== id);
		this.events.emit(Events.BASKET_COUNT_CHANGE, { count: this.items.length });
	}

	set payment(value: Payment) {
		this._payment = value;
	}

	get payment() {
		return this._payment;
	}

	set address(value: string) {
		this._address = value;
	}

	get address() {
		return this._address;
	}

	set email(value: string) {
		this._email = value;
	}

	get email() {
		return this._email;
	}

	set phone(value: string) {
		this._phone = value;
	}

	get phone() {
		return this._phone;
	}

	get total() {
		return this.items.reduce((total, item) => total + item.price, 0);
	}

	setUserField(field: keyof IUserForm, value: string) {
		this[field] = value;

		this.validateUserForm()
	}

	validateUserForm() {
		const errors: typeof this.userFormErrors = {};
		if (!this.email) {
			errors.email = 'Необходимо указать email';
		}
		if (!this.phone) {
			errors.phone = 'Необходимо указать телефон';
		}
		this.userFormErrors = errors;
		this.events.emit(Events.CONTACTS_ERRORS_CHANGE, this.userFormErrors);
		return Object.keys(errors).length === 0;
	}

  setOrderField(field: keyof IOrderForm, value: string) {
		this[field] = value;

		this.validateOrderForm()
	}

  validateOrderForm() {
		const errors: typeof this.orderFormErrors = {};
		if (!this.address) {
			errors.address = 'Необходимо указать адресс';
		}

		this.orderFormErrors = errors;
		this.events.emit(Events.ORDER_ERRORS_CHANGE, this.orderFormErrors);
		return Object.keys(errors).length === 0;
	}

	clear() {
		this.items = [];
		this.events.emit(Events.BASKET_COUNT_CHANGE, { count: 0 });
	}
}
