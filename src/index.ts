import { AppApi } from './components/api/AppApi';
import { EventEmitter } from './components/base/events';
import { OrderModel } from './components/model/order';
import { ProductListModel } from './components/model/product-list';
import { CardCatalog } from './components/view/card-catalog';
import { CardView } from './components/view/card-view';
import { Modal } from './components/view/common/modal';
import { Page } from './components/view/page';
import './scss/styles.scss';
import { OrderProduct, Product, ProductList } from './types';
import { API_URL, CDN_URL } from './utils/constants';
import { cloneTemplate, ensureElement } from './utils/utils';

const events = new EventEmitter();

events.onAll(({ eventName, data }) => {
  console.log(eventName, data);
})

const api = new AppApi(API_URL, CDN_URL);

// Templates
const cardCatalogTemplate = ensureElement('#card-catalog') as HTMLTemplateElement;
const cardPreviewTemplate = ensureElement('#card-preview') as HTMLTemplateElement;

// Models
const productListModel = new ProductListModel({}, events);
const orderModel = new OrderModel({}, events)

// Views
const page = new Page(document.body, events);
const modal = new Modal(ensureElement('#modal-container'), events);

events.on('productListChanged', (data: ProductList) => {
  page.catalog = data.items.map(item => {
    const cardElement = cloneTemplate(cardCatalogTemplate);
    const card = new CardCatalog(cardElement, {
      onClick: () => events.emit('card:select', item),
    })
    return card.render({
      title: item.title,
      category: item.category,
      price: item.price,
      image: item.image,
    })
  })
});

events.on('card:select', (data: Product) => {
  const cardView = new CardView(cloneTemplate(cardPreviewTemplate), events);
  modal.render({
    content: cardView.render({...data, isInBasket: orderModel.items.some(item => item.id === data.id)})
  })
})

events.on('basket:add', (data: { id: string }) => {
  const { id, title, price } = productListModel.items.find(item => item.id === data.id);
  orderModel.addProduct({ id, title, price });
})

events.on('basket:remove', (data: { id: string }) => {
  orderModel.removeProduct({ id: data.id });
})

events.on('basket:countChange', ({ count }: { count: number }) => {
  page.counter = count;
})

api.getProductList().then(data => {
  productListModel.setProducts(data)
}).catch(error => {
  console.error(error);
});
