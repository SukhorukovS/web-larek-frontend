import { Order, OrderProduct } from "../../types";
import { Model } from "../base/model";

export class OrderModel extends Model<Order> {
  items: Order['items'] = [];
  _address: Order['address'];
  _payment: Order['payment'];
  _email: Order['email'];
  _phone: Order['phone'];

  addProduct(product: OrderProduct) {
    this.items.push(product);
    this.events.emit('basket:countChange', ({ count: this.items.length }))
  }

  removeProduct({ id }: { id: string }) {
    this.items = this.items.filter(item => item.id !== id);
    this.events.emit('basket:countChange', ({ count: this.items.length }))
  }

  set payment(value: 'card' | 'cash') {
    this._payment = value;
  }

  get payment() {
    return this._payment;
  }

  set address(value: string) {
    this._address = value
  }

  get address() {
    return this._address;
  }

  set email(value: string) {
    this._email = value;
  }

  get email() {
    return this._email;
  }

  set phone(value: string) {
    this._phone = value;
  }

  get phone() {
    return this._phone;
  }

  get total() {
    return this.items.reduce((total, item) => total + item.price, 0);
  }
}
