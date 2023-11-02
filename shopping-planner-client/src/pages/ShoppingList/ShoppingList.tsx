import {
  ChangeEvent,
  KeyboardEventHandler,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import Input from "../../components/Input/Input";
import "./shoppingList.scss";
import { useShopping } from "../../context/shopContext/shopContext";
import { useLocation, useNavigate } from "react-router-dom";
import { v4 as uuidV4 } from "uuid";
import {
  ShopItemInterface,
  ShopListItemInterface,
} from "../../services/temp/shoppingListItems";
import ShopItem from "../../components/ShopItem/ShopItem";
import { LocationService } from "../../services/locationService";
import { AnimatePresence, Reorder } from "framer-motion";
import { useAuth } from "../../context/authContext/authContext";
import TrashDecoration from "../../components/Decorations/Icons/TrashDecoration";
import { debounce } from "../../services/utils";

export default function ShoppingList() {
  const shopping = useShopping();
  const navigate = useNavigate();
  const location = useLocation();
  const auth = useAuth();
  const addNewItemInputRef = useRef<HTMLInputElement>(null);

  const locationService = new LocationService(location);

  const newListData = {
    listId: uuidV4(),
    title: "",
    items: [],
    username: auth.user?.username || "",
  };

  const [singleList, setSingleList] =
    useState<ShopListItemInterface>(newListData);
  const [listError, setListError] = useState("");
  const [newItem, setNewItem] = useState<ShopItemInterface>({
    itemId: uuidV4(),
    title: "",
    completed: false,
  });

  useEffect(() => {
    if (!shopping.listsFetched) {
      shopping.getShoppingLists();
    }

    const existingListData = shopping.shoppingLists.find(
      (list) => list.listId === locationService.getShoppingListIdFromUrl()
    );

    setSingleList(existingListData || newListData);
  }, [shopping.listsFetched]);

  const handleListTitleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setListError("");
    const payload = {
      ...singleList,
      title: e.target.value,
    };
    setSingleList(payload);
    debouncedSaveToDatabase(payload);
  };

  const debouncedSaveToDatabase = useCallback(
    debounce(
      async (payload: ShopListItemInterface) => await patchList(payload),
      1500
    ),
    []
  );

  const handleItemTitleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setNewItem({
      ...newItem,
      title: e.target.value,
      completed: false,
    });
  };

  const patchList = async (payload: ShopListItemInterface) => {
    if (!payload.title) {
      setListError("Enter title...");
      return;
    }

    await shopping.updateShoppingList(payload);
  };

  const handleDeleteList = async () => {
    await shopping.removeShoppingList(singleList.listId);
    navigate("/");
  };

  const handleAddNewItem = async () => {
    const payload = {
      ...singleList,
      items: [...singleList.items, newItem],
    };

    setSingleList(payload);
    setNewItem({ itemId: uuidV4(), title: "", completed: false });
    addNewItemInputRef?.current?.focus();
    await patchList(payload);
  };

  const handleCompleteItem = async (itemId: string) => {
    const payload = {
      ...singleList,
      items: singleList.items.map((item) => {
        if (item.itemId === itemId) {
          return { ...item, completed: !item.completed };
        }
        return item;
      }),
    };
    setSingleList(payload);
    await patchList(payload);
  };

  const handleDeleteItem = async (itemId: string) => {
    const payload = {
      ...singleList,
      items: singleList.items.filter((item) => item.itemId !== itemId),
    };
    setSingleList(payload);
    await patchList(payload);
  };

  const handleOnKeyDown: KeyboardEventHandler<HTMLInputElement> = (e) => {
    if (e.key !== "Enter") {
      return;
    }

    handleAddNewItem();
  };

  const handleReorder = () => {};

  return (
    <div className="shop-list">
      {shopping.listsFetched ? (
        <>
          <div className="shop-list__title">
            <Input
              id="title"
              type="text"
              value={singleList.title}
              error={listError}
              onChange={handleListTitleChange}
            />
            <button className="btn btn-danger" onClick={handleDeleteList}>
              <TrashDecoration fill="#ffffff" />
            </button>
          </div>

          <div className="shop-list__items-container">
            <div className="shop-list__items">
              {singleList.items.length === 0 ? (
                <div className="shop-list__empty">No items in list...</div>
              ) : (
                <Reorder.Group
                  values={singleList.items}
                  onReorder={handleReorder}
                  axis="y"
                >
                  <AnimatePresence>
                    {singleList.items
                      .sort((a, b) => Number(a.completed) - Number(b.completed))
                      .map((item) => (
                        <Reorder.Item
                          key={item.itemId}
                          value={item}
                          dragListener={false}
                        >
                          <ShopItem
                            item={item}
                            list={singleList}
                            handleDeleteItem={() =>
                              handleDeleteItem(item.itemId)
                            }
                            handleCompleteItem={() =>
                              handleCompleteItem(item.itemId)
                            }
                          />
                        </Reorder.Item>
                      ))}
                  </AnimatePresence>
                </Reorder.Group>
              )}
            </div>

            <div className="shop-list__footer">
              <div className="shop-list__add-new-item">
                <Input
                  id="title"
                  type="text"
                  value={newItem.title}
                  onChange={handleItemTitleChange}
                  onKeyDown={handleOnKeyDown}
                  inputRef={addNewItemInputRef}
                />
                <button className="btn btn-outline" onClick={handleAddNewItem}>
                  + Add item
                </button>
              </div>
            </div>
          </div>
        </>
      ) : (
        <div>Loading...</div>
      )}
    </div>
  );
}
