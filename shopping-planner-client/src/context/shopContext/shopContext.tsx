import { createContext, ReactNode, useContext, useState } from "react";
import { CognitoUserSession } from "amazon-cognito-identity-js";

import {
  // shopListItems,
  ShopListItemInterface,
} from "../../services/temp/shoppingListItems";
import { useAuth } from "../authContext/authContext";

interface ShopContextInterface {
  shoppingLists: ShopListItemInterface[];
  setShoppingLists: (shoppingLists: ShopListItemInterface[]) => void;
  listsFetched: boolean;
  setListsFetched: (value: boolean) => void;
  getShoppingLists: () => void;
  removeShoppingList: (id: string) => void;
  addShoppingList: (newList: ShopListItemInterface) => void;
  updateShoppingList: (newList: ShopListItemInterface) => void;
  completeItem: (listId: string, itemId: string) => void;
}

export const ShopContext = createContext<ShopContextInterface | undefined>(
  undefined
);

export const ShoppingProvider = ({ children }: { children: ReactNode }) => {
  const auth = useAuth();
  const [shoppingLists, setShoppingLists] = useState<ShopListItemInterface[]>(
    []
  );
  const [listsFetched, setListsFetched] = useState(false);

  const getAuthToken = () =>
    auth.user?.getSession((err: unknown, session: CognitoUserSession) => {
      if (err) return console.log(err);
      if (!session.isValid()) return console.log("Invalid session");

      return session.getIdToken().getJwtToken();
    });

  const getShoppingLists = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_LISTS_API}/prod/lists`, {
        headers: {
          Authorization: `Bearer ${getAuthToken()}`,
        },
      });
      const shoppingLists = (await res.json()) as ShopListItemInterface[];
      setShoppingLists(shoppingLists);
    } catch (error) {
      console.log(error);
    }
    // setShoppingLists(shopListItems);
    setListsFetched(true);
  };

  const addShoppingList = async (newList: ShopListItemInterface) => {
    try {
      await fetch(`${import.meta.env.VITE_LISTS_API}/prod/list/new`, {
        method: "POST",
        body: JSON.stringify(newList),
        headers: {
          Authorization: `Bearer ${getAuthToken()}`,
        },
      });
      setShoppingLists([...shoppingLists, newList]);
    } catch (error) {
      console.log(error);
    }
  };

  const removeShoppingList = async (listId: string) => {
    try {
      await fetch(`${import.meta.env.VITE_LISTS_API}/prod/list/${listId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${getAuthToken()}`,
        },
      });

      const newLists = shoppingLists.filter((list) => list.listId !== listId);
      setShoppingLists(newLists);
    } catch (error) {
      console.log(error);
    }
  };

  const updateShoppingList = async (newList: ShopListItemInterface) => {
    try {
      await fetch(
        `${import.meta.env.VITE_LISTS_API}/prod/list/${newList.listId}`,
        {
          method: "POST",
          body: JSON.stringify(newList),
          headers: {
            Authorization: `Bearer ${getAuthToken()}`,
          },
        }
      );

      setShoppingLists(
        shoppingLists.map((list) => {
          if (list.listId === newList.listId) {
            return newList;
          }
          return list;
        })
      );
    } catch (error) {
      console.log(error);
    }
  };

  const completeItem = (listId: string, itemId: string) => {
    setShoppingLists(
      shoppingLists.map((list) => {
        if (list.listId === listId) {
          return {
            ...list,
            items: list.items.map((item) => {
              if (item.itemId === itemId) {
                return { ...item, completed: !item.completed };
              }
              return item;
            }),
          };
        }
        return list;
      })
    );
  };

  const contextValue: ShopContextInterface = {
    shoppingLists: shoppingLists,
    listsFetched: listsFetched,
    setListsFetched: (value) => setListsFetched(value),
    getShoppingLists: () => getShoppingLists(),
    setShoppingLists: (payload) => setShoppingLists(payload),
    removeShoppingList: (id) => removeShoppingList(id),
    addShoppingList: (newList) => addShoppingList(newList),
    updateShoppingList: (newList) => updateShoppingList(newList),
    completeItem: (listId, itemId) => completeItem(listId, itemId),
  };

  return (
    <ShopContext.Provider value={contextValue}>{children}</ShopContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useShopping = () => {
  const context = useContext(ShopContext);
  if (context === undefined) {
    throw new Error("useShopping must be used within an ShoppingProvider");
  }
  return context;
};
