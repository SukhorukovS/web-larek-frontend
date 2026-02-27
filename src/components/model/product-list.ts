import { Product, ProductList } from "../../types";
import { Model } from "../base/model";

export class ProductListModel extends Model<ProductList> {
  total: number
  items: Product[];

  setProducts(data: ProductList) {
    this.total = data.total;
    this.items = data.items;
    this.emitChanges('productListChanged', { items: this.items })
  }
}
