import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_BASE_URL;
const API_PATH = import.meta.env.VITE_API_PATH;

export default function ProductDetailPage(){

    const [product,setProduct]=useState({});
    const [qtySelect,setQtySelect]=useState(1);
    const { id: product_id } = useParams()

    //取得產品
    useEffect(() => {
        console.log("Product ID from useParams:", product_id);
        const getProduct = async () => {
        // setIsScreenLoading(true);
        try {
            const res = await axios.get(`${BASE_URL}/v2/api/${API_PATH}/product/${product_id}`);
            setProduct(res.data.product);
        } catch (error) {
            alert("取得產品失敗");
            console.log(error);
        }
        };
        getProduct();
        // getCart();
    }, []);

    return (
        <div className="container mt-5">
            <div className="row">
                <div className="col-6">
                    <img className="img-fluid" src={product.imageUrl} alt={product.title} />
                </div>
                <div className="col-6">
                    <div className="d-flex align-items-center gap-2">
                        <h2>{product.title}</h2>
                        <span className="badge text-bg-success">{product.category}</span>
                    </div>
                    <p className="mb-3">{product.description}</p>
                    <p className="mb-3">{product.content}</p>
                    <h5 className="mb-3">NT$ {product.price}</h5>
                    <div className="input-group align-items-center w-75">
                        <select
                        value={qtySelect}
                        onChange={(e) => setQtySelect(e.target.value)}
                        id="qtySelect"
                        className="form-select"
                        >
                        {Array.from({ length: 10 }).map((_, index) => (
                            <option key={index} value={index + 1}>
                            {index + 1}
                            </option>
                        ))}
                        </select>
                        <button type="button" className="btn btn-primary">
                        加入購物車
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
};
