import { AppApi } from './components/api/AppApi';
import { EventEmitter } from './components/base/events';
import { ProductListModel } from './components/model/product-list';
import './scss/styles.scss';
import { API_URL, CDN_URL } from './utils/constants';

const events = new EventEmitter();

const api = new AppApi(API_URL, CDN_URL);

const productListModel = new ProductListModel({}, events);

events.on('productListChanged', (data) => {
  console.log('Product list changed:', data);
});

api.getProductList().then(data => {
  productListModel.setProducts(data)
}).catch(error => {
  console.error(error);
});
