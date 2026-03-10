import { IEvents } from "../base/events";
import { View } from "../base/view";

export class UserForm extends View<object> {
  protected _email: HTMLInputElement;
  protected _phone: HTMLInputElement;
  protected _submitButton: HTMLButtonElement;

  constructor(container: HTMLFormElement, protected events: IEvents) {
    super(container);

    this._email = container.elements.namedItem('email') as HTMLInputElement;
    this._phone = container.elements.namedItem('phone') as HTMLInputElement;
    this._submitButton = this.ensure<HTMLButtonElement>('.button');

    this._submitButton.addEventListener('click', this.handleSubmitButtonClick.bind(this));
    this._email.addEventListener('input', this.handleEmailInput.bind(this));
    this._phone.addEventListener('input', this.handlePhoneInput.bind(this));
  }

  handleEmailInput() {
    const email = this._email.value;

    this.events.emit('userForm:emailChange', { email });

    this.validateForm();
  }

  handlePhoneInput() {
    const phone = this._phone.value;
  
    this.events.emit('userForm:phoneChange', { phone });
  }

  handleSubmitButtonClick(event: Event) {
    event.preventDefault();
    if (this.isValid) {
      this.events.emit('userForm:submit', { email: this._email.value, phone: this._phone.value });
    }
  }

  validateForm() {
    if(this.isValid) {
      this._submitButton.disabled = false;
      return;
    }

    this._submitButton.disabled = true;
  }

  isValid() {
    return this._email.validity.valid && this._phone.validity.valid;
  }
}