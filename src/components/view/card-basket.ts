import { settings } from '../../utils/constants';
import { Card } from './common/card';

interface ICardBasketActions {
	onDelete: (event: MouseEvent) => void;
}

interface ICardBasket {
	index: number;
}

export class CardBasket extends Card<ICardBasket> {
	protected _index: HTMLElement;
	protected _deleteButton: HTMLButtonElement;

	constructor(container: HTMLElement, actions?: ICardBasketActions) {
		super(container, {
			titleSelector: settings.basketItemTitleSelector,
			priceSelector: settings.basketItemPriceSelector,
		});

		this._index = this.ensure<HTMLElement>(
			settings.basketItemIndexSelector,
			container
		);

		this._deleteButton = this.ensure<HTMLButtonElement>(
			settings.basketItemDeleteSelector,
			container
		);

		if (actions?.onDelete) {
			this._deleteButton.addEventListener('click', actions.onDelete);
		}
	}

	set index(value: number) {
		this.setValue(this._index, `${value}`);
	}
}
