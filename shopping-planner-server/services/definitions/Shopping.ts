export interface ShopItemInterface {
  itemId: string;
  title: string;
  completed: boolean;
}

export interface ShopListItemInterface {
  listId: string;
  title: string;
  username: string;
  items: ShopItemInterface[];
}