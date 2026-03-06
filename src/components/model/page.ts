import { Model } from "../base/model";

interface IPageModel {
  screenState: string
}

export class PageModel extends Model<IPageModel> {
  _screenState: string;

  set screenState(screen: string) {
    this._screenState = screen;
  }

  get screenState() {
    return this._screenState;
  }
}
