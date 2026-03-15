import { Product, ProductList } from "../../types";
import { Events } from "../../utils/constants";
import { Model } from "../base/model";

export class ProductListModel extends Model<ProductList> {
  total: number
  items: Product[];

  setProducts(data: ProductList) {
    this.total = data.total;
    this.items = data.items;
    this.emitChanges(Events.PRODUCT_LIST_CHANGED, { items: this.items })
  }

  findProductById(id: string) {
    return this.items.find(
      (item) => item.id === id
    )
  }
}
