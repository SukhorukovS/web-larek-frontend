import { Order, OrderProduct } from "../../types";
import { Model } from "../base/model";

export class OrderModel extends Model<Order> {
  items: Order['items'] = [];

  addProduct(product: OrderProduct) {
    this.items.push(product);
    this.events.emit('basket:countChange', ({ count: this.items.length }))
  }

  removeProduct({ id }: { id: string }) {
    this.items = this.items.filter(item => item.id !== id);
    this.events.emit('basket:countChange', ({ count: this.items.length }))
  }
}
