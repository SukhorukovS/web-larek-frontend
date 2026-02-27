import { AppApi } from './components/api/AppApi';
import { EventEmitter } from './components/base/events';
import { ProductListModel } from './components/model/product-list';
import { Page } from './components/view/page';
import './scss/styles.scss';
import { ProductList } from './types';
import { API_URL, CDN_URL } from './utils/constants';
import { cloneTemplate } from './utils/utils';

const events = new EventEmitter();

const api = new AppApi(API_URL, CDN_URL);

// Models
const productListModel = new ProductListModel({}, events);

// Views
const page = new Page(document.body, events);

events.on('productListChanged', (data: ProductList) => {
  page.catalog = data.items.map(item => {
    return cloneTemplate('#card-catalog');
  })
});

api.getProductList().then(data => {
  productListModel.setProducts(data)
}).catch(error => {
  console.error(error);
});
