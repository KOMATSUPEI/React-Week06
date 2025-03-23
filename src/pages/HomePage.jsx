import { Link } from "react-router-dom"

export default function HomePage(){
    return (
        <>
        <h1>首頁內容</h1>
        <Link to="/products"><button className="btn btn-success">產品列表</button></Link>
        </>
)
};