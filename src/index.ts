import { AppApi } from './components/api/AppApi';
import { EventEmitter } from './components/base/events';
import { OrderModel } from './components/model/order';
import { PageModel } from './components/model/page';
import { ProductListModel } from './components/model/product-list';
import { Basket } from './components/view/basket';
import { CardBasket } from './components/view/card-basket';
import { CardCatalog } from './components/view/card-catalog';
import { CardView } from './components/view/card-view';
import { Modal } from './components/view/common/modal';
import { OrderFormView } from './components/view/order';
import { Page } from './components/view/page';
import { SuccessModalView } from './components/view/success-modal-view';
import { UserForm } from './components/view/user-form';
import './scss/styles.scss';
import { IUserForm, Payment, Product, ProductList } from './types';
import { API_URL, CDN_URL, Events, settings } from './utils/constants';
import { cloneTemplate, ensureElement } from './utils/utils';

const events = new EventEmitter();

const api = new AppApi(API_URL, CDN_URL);

events.onAll(({ eventName, data }) => {
  console.log(eventName, data);
})

// Templates
const cardCatalogTemplate = ensureElement<HTMLTemplateElement>(
	settings.cardCatalogTemplateSelector
);
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>(
	settings.cardPreviewTemplateSelector
);
const basketTemplate = ensureElement<HTMLTemplateElement>(
	settings.basketTemplateSelector
);
const cardBasketTemplate = ensureElement<HTMLTemplateElement>(
	settings.cardBasketTemplateSelector
);
const orderTemplate = ensureElement<HTMLTemplateElement>(
	settings.orderTemplateSelector
);
const userTemplate = ensureElement<HTMLTemplateElement>(
	settings.userTemplateSelector
);
const successModalTemplate = ensureElement<HTMLTemplateElement>(
	settings.successModalTemplateSelector
);

// Models
const productListModel = new ProductListModel({}, events);
const orderModel = new OrderModel({}, events);
const pageModel = new PageModel({ screenState: 'main' }, events);

// Views
const page = new Page(document.body, events);
const modal = new Modal(ensureElement(settings.modalContainerSelector), events);
const basket = new Basket(cloneTemplate(basketTemplate), events);
const orderFormView = new OrderFormView(cloneTemplate(orderTemplate), events);
const userFormView = new UserForm(cloneTemplate(userTemplate), events);
const successModalView = new SuccessModalView(
	cloneTemplate(successModalTemplate),
	events
);

events.on(Events.PRODUCT_LIST_CHANGED, (data: ProductList) => {
	page.catalog = data.items.map((item) => {
		const cardElement = cloneTemplate(cardCatalogTemplate);
		const card = new CardCatalog(cardElement, {
			onClick: () => events.emit(Events.CARD_SELECT, item),
		});
		return card.render({
			title: item.title,
			category: item.category,
			price: item.price,
			image: item.image,
		});
	});
});

events.on(Events.CARD_SELECT, (data: Product) => {
	const cardView = new CardView(cloneTemplate(cardPreviewTemplate), events);
	modal.render({
		content: cardView.render({
			...data,
			isInBasket: orderModel.items.some((item) => item.id === data.id),
		}),
	});
	pageModel.screenState = Events.CARD_SELECT;
});

events.on(Events.BASKET_ADD, (data: { id: string }) => {
	const { id, title, price } = productListModel.findProductById(data.id);
	orderModel.addProduct({ id, title, price });
});

events.on(Events.BASKET_REMOVE, (data: { id: string }) => {
	orderModel.removeProduct({ id: data.id });
});

events.on(Events.BASKET_COUNT_CHANGE, ({ count }: { count: number }) => {
	page.counter = count;
	if (pageModel.screenState === Events.BASKET_OPEN) {
		events.emit(Events.BASKET_OPEN);
	}
});

events.on(Events.BASKET_OPEN, () => {
	modal.render({
		content: basket.render({
			items: orderModel.items.map((item, index) => {
				const cardBasket = new CardBasket(cloneTemplate(cardBasketTemplate), {
					onDelete: () => {
						orderModel.removeProduct({ id: item.id });
					},
				});
				return cardBasket.render({ ...item, index: index + 1 });
			}),
			price: orderModel.items.reduce((prev, cur) => prev + cur.price, 0),
		}),
	});
	pageModel.screenState = Events.BASKET_OPEN;
});

events.on(Events.MODAL_CLOSE_TRIGGER, () => modal.close());

events.on(Events.MODAL_CLOSE, () => {
	pageModel.screenState = 'main';
});

events.on(Events.SHOW_ORDER_FORM, () => {
	pageModel.screenState = Events.SHOW_ORDER_FORM;
	modal.render({
		content: orderFormView.render(),
	});
});

events.on(Events.PAYMENT_CHANGE, (data: { payment: Payment }) => {
	orderModel.payment = data.payment;
});

events.on(Events.ADDRESS_CHANGE, (data: { address: string }) => {
	orderModel.address = data.address;
});

events.on(Events.SHOW_USER_FORM, () => {
	pageModel.screenState = Events.SHOW_USER_FORM;
	modal.render({
		content: userFormView.render({
			phone: '',
			email: '',
			valid: false,
			errors: []
		}),
	});
});

events.on(/^contacts\..*:change/, (data: { field: keyof IUserForm, value: string }) => {
  orderModel.setUserField(data.field, data.value);
});

events.on(Events.CONTACTS_ERRORS_CHANGE, (errors: Partial<IUserForm>) => {
  const { email, phone } = errors;
  userFormView.valid = !email && !phone;
  userFormView.errors = Object.values({phone, email}).filter(i => !!i).join('; ');
});

events.on(Events.USER_FORM_SUBMIT, () => {
	const orderBody = {
		email: orderModel.email,
		phone: orderModel.phone,
		address: orderModel.address,
		items: orderModel.items.map((item) => item.id),
		total: orderModel.total,
		payment: orderModel.payment,
	};
	api.orderProducts(orderBody).then((data) => {
		if ('error' in data) {
			return;
		}
		orderModel.clear();
		modal.render({
			content: successModalView.render({ total: data.total }),
		});
	});
});

api
	.getProductList()
	.then((data) => {
		productListModel.setProducts(data);
	})
	.catch((error) => {
		console.error(error);
	});
