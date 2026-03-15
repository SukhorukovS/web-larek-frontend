import { Product } from '../../types';
import { CDN_URL, settings } from '../../utils/constants';
import { categoryCard } from '../../utils/utils';
import { Card } from './common/card';

interface ICardActions {
	onClick: (event: MouseEvent) => void;
}

export class CardCatalog extends Card<Product> {
	protected _category: HTMLElement;
	protected _image: HTMLImageElement;

	constructor(container: HTMLElement, actions?: ICardActions) {
		super(container, {
			titleSelector: settings.cardTitleSelector,
			priceSelector: settings.cardPriceSelector,
		});

		this._category = this.ensure(settings.cardCategorySelector, container);

		this._image = this.ensure(
			settings.cardImageSelector,
			container
		) as HTMLImageElement;

		if (actions.onClick) {
			container.addEventListener('click', actions.onClick);
		}
	}

	set category(value: keyof typeof categoryCard) {
		this.setValue(this._category, value);
		this._category.classList.add(`card__category_${categoryCard[value]}`);
	}

	set image(value: string) {
		this.setImage(this._image, `${CDN_URL}${value}`);
	}
}
