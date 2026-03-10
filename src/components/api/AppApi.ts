import { ApiOrder, ApiOrderBody, Product, ProductList } from '../../types';
import { Api, ApiListResponse } from '../base/api';

export class AppApi extends Api {
	readonly cdn: string;

	constructor(baseUrl: string, cdn: string, options?: RequestInit) {
		super(baseUrl, options);
		this.cdn = cdn;
	}

  getProductList(): Promise<ProductList> {
    return this.get('/product/').then((data: ApiListResponse<Product>) => data)
  }

	orderProducts(order: ApiOrderBody): Promise<ApiOrder> {
		return this.post('/order', order).then((data: ApiOrder) => data)
	}
}
