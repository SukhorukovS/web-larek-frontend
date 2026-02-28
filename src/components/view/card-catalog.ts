import { Product } from "../../types";
import { CDN_URL } from "../../utils/constants";
import { categoryCard, ensureElement } from "../../utils/utils";
import { View } from "../base/view";

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
    this._category = this.ensure('.card__category', container);
    this._image = this.ensure('.card__image', container) as HTMLImageElement;
    this._title = this.ensure('.card__title', container);
    this._price = this.ensure('.card__price', container);

    if(actions.onClick) {
      container.addEventListener('click', actions.onClick);
    }
  }

  set title(value: string) {
    this.setValue(this._title, value);
  }

  set category(value: keyof typeof categoryCard) {
    this.setValue(this._category, value);
    this.setValue(this._category, {
      classList: `card__category card__category_${categoryCard[value]}`
    })
  }

  set price(value: number) {
    this.setValue(this._price, `${value} синапсов`);
  }

  set image(value: string) {
    this.setImage(this._image, `${CDN_URL}${value}`)
  }
}
