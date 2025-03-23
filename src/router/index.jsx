import { createHashRouter } from "react-router-dom";
import FrontLayout from "../layouts/FrontLayout";

const router=createHashRouter([
    {
        path: "/",
        element: <FrontLayout/>
    }
]);

export default router;