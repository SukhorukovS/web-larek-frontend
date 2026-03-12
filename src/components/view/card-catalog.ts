import { Product } from '../../types';
import { CDN_URL, settings } from '../../utils/constants';
import { categoryCard } from '../../utils/utils';
import { View } from '../base/view';

interface ICardActions {
	onClick: (event: MouseEvent) => void;
}

export class CardCatalog extends View<Product> {
	protected _category: HTMLElement;
	protected _image: HTMLImageElement;
	protected _title: HTMLElement;
	protected _price: HTMLElement;
	protected id: string;

	constructor(container: HTMLElement, actions?: ICardActions) {
		super(container);
		this._category = this.ensure(settings.cardCategorySelector, container);
		this._image = this.ensure(
			settings.cardImageSelector,
			container
		) as HTMLImageElement;
		this._title = this.ensure(settings.cardTitleSelector, container);
		this._price = this.ensure(settings.cardPriceSelector, container);

		if (actions.onClick) {
			container.addEventListener('click', actions.onClick);
		}
	}

	set title(value: string) {
		this.setValue(this._title, value);
	}

	set category(value: keyof typeof categoryCard) {
		this.setValue(this._category, value);
		this._category.classList.add(`card__category_${categoryCard[value]}`);
	}

	set price(value: number) {
		if (value === null) {
			this.setValue(this._price, 'Бесценно');
			return;
		}
		this.setValue(this._price, `${value} синапсов`);
	}

	set image(value: string) {
		this.setImage(this._image, `${CDN_URL}${value}`);
	}
}
