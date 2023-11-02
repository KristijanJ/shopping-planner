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

export const shopListItems: ShopListItemInterface[] = [
  {
    listId: "1",
    title: "Grocery List",
    username: "kristijan",
    items: [
      { itemId: "1", title: "Milk", completed: false },
      { itemId: "2", title: "Bread", completed: true },
      { itemId: "3", title: "Eggs", completed: false },
      { itemId: "4", title: "Cheese", completed: true },
      { itemId: "5", title: "Apples", completed: true },
      { itemId: "6", title: "Bananas", completed: false },
    ],
  },
  {
    listId: "2",
    title: "Hardware Store List",
    username: "kristijan",
    items: [
      { itemId: "7", title: "Hammer", completed: false },
      { itemId: "8", title: "Screws", completed: false },
      { itemId: "9", title: "Nails", completed: false },
      { itemId: "10", title: "Saw", completed: false },
      { itemId: "11", title: "Paint", completed: true },
      { itemId: "12", title: "Brushes", completed: false },
    ],
  },
  {
    listId: "3",
    title: "To-Do List",
    username: "kristijan",
    items: [
      { itemId: "13", title: "Finish project", completed: false },
      { itemId: "14", title: "Call mom", completed: false },
      { itemId: "15", title: "Go for a run", completed: true },
      { itemId: "16", title: "Read a book", completed: true },
      { itemId: "17", title: "Write report", completed: true },
      { itemId: "18", title: "Grocery shopping", completed: true },
    ],
  },
  {
    listId: "4",
    title: "Home Improvement List",
    username: "kristijan",
    items: [
      { itemId: "19", title: "Fix leaky faucet", completed: false },
      { itemId: "20", title: "Install new light fixtures", completed: true },
      { itemId: "21", title: "Paint living room", completed: false },
      { itemId: "22", title: "Organize garage", completed: false },
      { itemId: "23", title: "Replace kitchen cabinets", completed: true },
      { itemId: "24", title: "Plant garden", completed: false },
    ],
  },
];
