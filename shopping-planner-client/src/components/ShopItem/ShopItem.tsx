import {
  ShopItemInterface,
  ShopListItemInterface,
} from "../../services/temp/shoppingListItems";
import TrashDecoration from "../Decorations/Icons/TrashDecoration";
import "./shopItem.scss";

interface Props {
  item: ShopItemInterface;
  list: ShopListItemInterface;
  handleCompleteItem: () => void;
  handleDeleteItem: () => void;
}

export default function ShopItem(props: Props) {
  return (
    <div className="shop-item">
      <div className="shop-item__checkbox">
        <input
          type="checkbox"
          name={props.item.itemId}
          id={props.item.itemId}
          checked={props.item.completed}
          onChange={props.handleCompleteItem}
        />
      </div>
      <div
        className={`shop-item__title ${
          props.item.completed ? "shop-item__completed" : ""
        }`}
      >
        {props.item.title}
      </div>
      <div className="shop-item__actions">
        <div className="shop-item__action" onClick={props.handleDeleteItem}>
          <TrashDecoration />
        </div>
      </div>
    </div>
  );
}
