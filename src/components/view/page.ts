import { Events, settings } from '../../utils/constants';
import { IEvents } from '../base/events';
import { View } from '../base/view';

interface IPage {
	counter: number;
	catalog: HTMLElement[];
	locked: boolean;
}

export class Page extends View<IPage> {
	protected _counter: HTMLElement;
	protected _catalog: HTMLElement;
	protected _wrapper: HTMLElement;
	protected _basket: HTMLElement;

	constructor(container: HTMLElement, protected events: IEvents) {
		super(container);
		this._counter = this.ensure<HTMLElement>(settings.basketCounterSelector);
		this._catalog = this.ensure<HTMLElement>(settings.gallerySelector);
		this._basket = this.ensure<HTMLElement>(settings.basketSelector);

		this._basket.addEventListener('click', this.onBasketClick.bind(this));
	}

	set counter(value: number) {
		this.setValue(this._counter, `${value}`);
	}

	set catalog(value: HTMLElement[]) {
		this.setValue(this._catalog, value);
	}

	onBasketClick() {
		this.events.emit(Events.BASKET_OPEN);
	}
}
