import { Order, OrderProduct } from "../../types";
import { Model } from "../base/model";

export class OrderModel extends Model<Order> {
  items: Order['items'] = [];

  addProduct(product: OrderProduct) {
    this.items.push(product);
    this.events.emit('basket:countChange', ({ count: this.items.length }))
  }
}
