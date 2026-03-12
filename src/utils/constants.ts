export const API_URL = `${process.env.API_ORIGIN}/api/weblarek`;
export const CDN_URL = `${process.env.API_ORIGIN}/content/weblarek`;

export const settings = {

};

export enum Events {
  PRODUCT_LIST_CHANGED = 'product:listChanged',
  CARD_SELECT = 'card:select',
  BASKET_ADD = 'basket:add',
  BASKET_REMOVE = 'basket:remove',
  BASKET_COUNT_CHANGE = 'basket:countChange',
  BASKET_OPEN = 'basket:open',
  MODAL_CLOSE = 'modal:close',
  MODAL_CLOSE_TRIGGER = 'modal:close:trigger',
  SHOW_ORDER_FORM = 'show:orderForm',
  PAYMENT_CHANGE = 'orderForm:paymentChange',
  ADDRESS_CHANGE = 'orderForm:addressChange',
  SHOW_USER_FORM = 'show:userForm',
  EMAIL_CHANGE = 'userForm:emailChange',
  PHONE_CHANGE = 'userForm:phoneChange',
  USER_FORM_SUBMIT = 'userForm:submit',
  SHOW_SUCCESS_MODAL = 'show:successModal'
};

