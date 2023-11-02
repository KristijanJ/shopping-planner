import "./home.scss";
import ShoppingListItem from "../../components/ShoppingListItem/ShoppingListItem";
import { useShopping } from "../../context/shopContext/shopContext";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useAuth } from "../../context/authContext/authContext";
import { v4 as uuidV4 } from "uuid";

function Home() {
  const auth = useAuth();
  const shopping = useShopping();
  const navigate = useNavigate();

  const handleAddNewList = async () => {
    const listId = uuidV4();

    await shopping.addShoppingList({
      title: "New list",
      items: [],
      listId,
      username: auth.user?.username || "",
    });

    navigate(`/list/${listId}`);
  };

  useEffect(() => {
    if (!shopping.listsFetched) {
      shopping.getShoppingLists();
    }
  });

  return (
    <div className="homepage">
      <h2 className="homepage__title">Lists</h2>

      {!shopping.listsFetched ? (
        <div>Loading...</div>
      ) : (
        <>
          <div className="homepage__shop-list">
            {shopping.shoppingLists.length === 0 ? (
              <div className="homepage__shop-list__empty">
                <div>No lists</div>
                <div>Click the button below to add a new list</div>
              </div>
            ) : (
              shopping.shoppingLists.map((list) => (
                <ShoppingListItem key={list.listId} list={list} />
              ))
            )}
          </div>

          <div className="homepage__add-new-list">
            <button onClick={handleAddNewList}>Add new list</button>
          </div>
        </>
      )}
    </div>
  );
}

export default Home;
