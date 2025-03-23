import { createHashRouter } from "react-router-dom";
import FrontLayout from "../layouts/FrontLayout";
import HomePage from "../pages/HomePage";
import ProductsPage from "../pages/ProductsPage";
import ProductDetailPage from "../pages/ProductDetailPage";
import CartPage from "../pages/CartPage";

const router=createHashRouter([
    {
        path: "/",
        element: <FrontLayout/>,
        children: [
            {
                path: "",
                element: <HomePage/>
            },
            {
                path: "products",
                element: <ProductsPage/>
            },
            {
                path: "products/:id",
                element: <ProductDetailPage/>
            },
            {
                path: "cart",
                element: <CartPage/>
            }
        ]
    }
]);

export default router;