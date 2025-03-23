import { createHashRouter } from "react-router-dom";

const router=createHashRouter([
    {
        path: "/",
        element: <h1>首頁</h1>
    }
])

export default router;