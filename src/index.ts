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
import { Product, ProductList } from './types';
import { API_URL, CDN_URL } from './utils/constants';
import { cloneTemplate, ensureElement } from './utils/utils';

const events = new EventEmitter();

const api = new AppApi(API_URL, CDN_URL);

// Templates
const cardCatalogTemplate = ensureElement(
	'#card-catalog'
) as HTMLTemplateElement;
const cardPreviewTemplate = ensureElement(
	'#card-preview'
) as HTMLTemplateElement;
const basketTemplate = ensureElement('#basket') as HTMLTemplateElement;
const cardBasketTemplate = ensureElement('#card-basket') as HTMLTemplateElement;
const orderTemplate = ensureElement('#order') as HTMLTemplateElement;
const userTemplate = ensureElement('#contacts') as HTMLTemplateElement;
const successModalTemplate = ensureElement('#success') as HTMLTemplateElement;

// Models
const productListModel = new ProductListModel({}, events);
const orderModel = new OrderModel({}, events);
const pageModel = new PageModel({ screenState: 'main' }, events);

// Views
const page = new Page(document.body, events);
const modal = new Modal(ensureElement('#modal-container'), events);
const basket = new Basket(cloneTemplate(basketTemplate), events);
const orderFormView = new OrderFormView(cloneTemplate(orderTemplate), events);
const userFormView = new UserForm(cloneTemplate(userTemplate), events);
const successModalView = new SuccessModalView(
	cloneTemplate(successModalTemplate),
	events
);

events.on('productListChanged', (data: ProductList) => {
	page.catalog = data.items.map((item) => {
		const cardElement = cloneTemplate(cardCatalogTemplate);
		const card = new CardCatalog(cardElement, {
			onClick: () => events.emit('card:select', item),
		});
		return card.render({
			title: item.title,
			category: item.category,
			price: item.price,
			image: item.image,
		});
	});
});

events.on('card:select', (data: Product) => {
	const cardView = new CardView(cloneTemplate(cardPreviewTemplate), events);
	modal.render({
		content: cardView.render({
			...data,
			isInBasket: orderModel.items.some((item) => item.id === data.id),
		}),
	});
	pageModel.screenState = 'card:select';
});

events.on('basket:add', (data: { id: string }) => {
	const { id, title, price } = productListModel.items.find(
		(item) => item.id === data.id
	);
	orderModel.addProduct({ id, title, price });
});

events.on('basket:remove', (data: { id: string }) => {
	orderModel.removeProduct({ id: data.id });
});

events.on('basket:countChange', ({ count }: { count: number }) => {
	page.counter = count;
	if (pageModel.screenState === 'basket:open') {
		events.emit('basket:open');
	}
});

events.on('basket:open', () => {
	modal.render({
		content: basket.render({
			items: orderModel.items.map((item, index) => {
				const cardBasket = new CardBasket(
					cloneTemplate(cardBasketTemplate),
					events
				);
				return cardBasket.render({ ...item, index: index + 1 });
			}),
			price: orderModel.items.reduce((prev, cur) => prev + cur.price, 0),
		}),
	});
	pageModel.screenState = 'basket:open';
});

events.on('modal:close:trigger', () => modal.close());

events.on('modal:close', () => {
	pageModel.screenState = 'main';
});

events.on('show:orderForm', () => {
	pageModel.screenState = 'show:orderForm';
	modal.render({
		content: orderFormView.render(),
	});
});

events.on('orderForm:paymentChange', (data: { payment: 'card' | 'cash' }) => {
	orderModel.payment = data.payment;
});

events.on('orderForm:addressChange', (data: { address: string }) => {
	orderModel.address = data.address;
});

events.on('show:userForm', () => {
	pageModel.screenState = 'show:userForm';
	modal.render({
		content: userFormView.render(),
	});
});

events.on('userForm:emailChange', (data: { email: string }) => {
	orderModel.email = data.email;
});

events.on('userForm:phoneChange', (data: { phone: string }) => {
	orderModel.phone = data.phone;
});

events.on('userForm:submit', () => {
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
		orderModel.items = [];
		events.emit('show:successModal', { total: data.total });
		events.emit('basket:countChange', { count: 0 });
	});
});

events.on('show:successModal', ({ total }: { total: number }) => {
	modal.render({
		content: successModalView.render({ total }),
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
