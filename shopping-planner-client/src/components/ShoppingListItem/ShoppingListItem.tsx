import { useNavigate } from "react-router-dom";
import { ShopListItemInterface } from "../../services/temp/shoppingListItems";
import "./shoppingListItem.scss";
import RightChevronDecoration from "../Decorations/Arrows/RightChevronDecoration";

interface ShoppingListItemProps {
  list: ShopListItemInterface;
}

export default function ShoppingListItem(props: ShoppingListItemProps) {
  const navigate = useNavigate();

  const handleEdit = () => {
    navigate(`/list/${props.list.listId}`);
  };

  const totalItems = props.list.items.length;
  const completedItems = props.list.items.filter(
    (item) => item.completed
  ).length;

  return (
    <div className="shop-list-item-container">
      <div className="shop-list-item" onClick={handleEdit}>
        <div className="shop-list-item__title line-clamp-2">
          {props.list.title}
        </div>
        <div className="shop-list-item__actions">
          <RightChevronDecoration />
        </div>
      </div>
      <div className="shop-list-item__progress">
        <div
          className="shop-list-item__progress__bar"
          style={{
            width: `${(completedItems / totalItems) * 100}%`,
          }}
        ></div>
        Completed items: {completedItems}/{totalItems}
      </div>
    </div>
  );
}
