import { ElementProps, ElementValue, SelectorElement } from '../../types/html';
import {
	ensureElement,
	isChildElement,
	isPlainObject,
	isSelector,
	setElementChildren,
	setElementProps,
} from '../../utils/utils';

export abstract class View<T> {
	protected cache: Record<string, HTMLElement> = {};

	constructor(protected readonly container: HTMLElement) {}

	protected ensure<T extends HTMLElement>(
		query: SelectorElement<T>,
		root: HTMLElement = this.container
	): T {
		if (!isSelector(query)) {
			return ensureElement(query);
		} else {
			if (!this.cache[query]) {
				this.cache[query] = ensureElement(query, root);
			}
			return this.cache[query] as T;
		}
	}

	protected setHidden(element: HTMLElement) {
		element.style.display = 'none';
	}

	protected setVisible(element: HTMLElement) {
		element.style.removeProperty('display');
	}

	setVisibility<T extends HTMLElement>(
		query: SelectorElement<T>,
		isVisible: boolean
	) {
		const el = this.ensure(query);
		if (isVisible) this.setVisible(el);
		else this.setHidden(el);
	}

	protected setValue<T extends HTMLElement>(
		query: SelectorElement<T>,
		value: ElementValue<T>
	) {
		const el = query instanceof HTMLElement ? query : this.ensure(query);
		if (typeof value === 'string') {
			el.textContent = value;
		} else if (isChildElement(value)) {
			setElementChildren(el, value);
		} else if (isPlainObject(value)) {
			setElementProps(el as T, value as ElementProps<T>);
		} else {
			throw new Error('Unknown value type');
		}
	}

	protected setImage(element: HTMLImageElement, src: string, alt?: string) {
		if (element) {
			element.src = src;
			if (alt) {
				element.alt = alt;
			}
		}
	}

	render(data?: Partial<T>): HTMLElement {
		Object.assign(this as object, data ?? {});
		return this.container;
	}
}
