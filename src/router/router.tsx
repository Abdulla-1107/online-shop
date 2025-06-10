import { Home } from "../pages/home/home";
import { Categoryes } from "../pages/catogoryes/categoryes";
import { Products } from "../pages/products/products";
import { Order } from "../pages/order/order";
import { Colors } from "../pages/colors/colors";
import { Users } from "../pages/users/users";

export default [
  {
    element: Home,
  },
  //CATEGORY
  {
    path: "categoryes",
    element: Categoryes,
  },
  //CATEGORY
  {
    path: "products",
    element: Products,
  },
  {
    path: "orders",
    element: Order,
  },
  {
    path: "colors",
    element: Colors,
  },
  {
    path: "users",
    element: Users,
  },
];
