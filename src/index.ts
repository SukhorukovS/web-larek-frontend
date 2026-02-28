import { AppApi } from './components/api/AppApi';
import { EventEmitter } from './components/base/events';
import { ProductListModel } from './components/model/product-list';
import { CardCatalog } from './components/view/card-catalog';
import { Page } from './components/view/page';
import './scss/styles.scss';
import { ProductList } from './types';
import { API_URL, CDN_URL } from './utils/constants';
import { cloneTemplate, ensureElement } from './utils/utils';

const events = new EventEmitter();

events.onAll(({ eventName, data }) => {
  console.log(eventName, data);
})

const api = new AppApi(API_URL, CDN_URL);

const cardCatalogTemplate = ensureElement('#card-catalog') as HTMLTemplateElement;

// Models
const productListModel = new ProductListModel({}, events);

// Views
const page = new Page(document.body, events);

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

api.getProductList().then(data => {
  productListModel.setProducts(data)
}).catch(error => {
  console.error(error);
});
