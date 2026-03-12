import { Product } from '../../types';
import { CDN_URL, Events, settings } from '../../utils/constants';
import { categoryCard } from '../../utils/utils';
import { IEvents } from '../base/events';
import { View } from '../base/view';

export class CardView extends View<Product & { isInBasket: boolean }> {
	protected _category: HTMLElement;
	protected _image: HTMLImageElement;
	protected _title: HTMLElement;
	protected _price: HTMLElement;
	protected id: string;
	protected _description: HTMLElement;
	protected _button: HTMLButtonElement;
	protected _isInBasket: boolean;

	constructor(container: HTMLElement, protected events: IEvents) {
		super(container);

		this._image = this.ensure(
			settings.cardImageSelector,
			container
		) as HTMLImageElement;
		this._category = this.ensure(settings.cardCategorySelector, container);
		this._title = this.ensure(settings.cardTitleSelector, container);
		this._price = this.ensure(settings.cardPriceSelector, container);
		this._description = this.ensure(
			settings.cardDescriptionSelector,
			container
		);
		this._button = this.ensure(
			settings.cardInBasketButtonSelector,
			container
		) as HTMLButtonElement;

		this._button.addEventListener('click', this.handleButtonClick.bind(this));
	}

	set image(value: string) {
		this.setImage(this._image, `${CDN_URL}${value}`);
	}

	set category(value: keyof typeof categoryCard) {
		this.setValue(this._category, value);
		this._category.classList.add(`card__category_${categoryCard[value]}`);
	}

	set title(value: string) {
		this.setValue(this._title, value);
	}

	set price(value: number) {
		if (value === null) {
			this.setValue(this._price, 'Бесценно');
			this.setHidden(this._button);
			return;
		}
		this.setValue(this._price, `${value} синапсов`);
	}

	set description(value: string) {
		this.setValue(this._description, value);
	}

	set isInBasket(value: boolean) {
		this._isInBasket = value;
		if (value) {
			this.setValue(this._button, settings.outFrombasketButtonText);
			this.setValue(this._button, { dataset: { value: '-1' } });
		}
	}

	handleButtonClick() {
		if (this._button.dataset.value === '-1') {
			this.removeFromBasket();
			return;
		}
		this.addToBasket();
	}

	removeFromBasket() {
		this.events.emit(Events.BASKET_REMOVE, { id: this.id });
		this.setValue(this._button, settings.inBasketButtonText);
		this.setValue(this._button, { dataset: { value: '+1' } });
	}

	addToBasket() {
		this.events.emit(Events.BASKET_ADD, { id: this.id });
		this.setValue(this._button, settings.outFrombasketButtonText);
		this.setValue(this._button, { dataset: { value: '-1' } });
	}
}
