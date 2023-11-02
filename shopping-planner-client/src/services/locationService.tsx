import { Location } from "react-router-dom";

export class LocationService {
  private location: Location;

  constructor(location: Location) {
    this.location = location;
  }

  getCurrentLocationTitle() {
    if (this.location.pathname === "/") {
      return "Home";
    }

    if (this.location.pathname.includes("/list/")) {
      return "Shopping list";
    }

    return "Default";
  }

  getShoppingListIdFromUrl() {
    if (this.location.pathname.includes("/list/")) {
      return this.location.pathname.replace("/list/", "");
    }

    return "";
  }
}
