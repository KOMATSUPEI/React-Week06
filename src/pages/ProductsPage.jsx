import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { Modal } from "bootstrap";
import { useForm } from "react-hook-form"
import ReactLoading from 'react-loading';

const BASE_URL = import.meta.env.VITE_BASE_URL;
const API_PATH = import.meta.env.VITE_API_PATH;

export default function ProductsPage(){

    const [products, setProducts] = useState([]);
    const [isScreenLoading,setIsScreenLoading]=useState(false); // 整體Loading
    const [isLoading,setIsLoading]=useState(false);// 局部Loading

    //取得產品
    useEffect(() => {
        const getProducts = async () => {
        setIsScreenLoading(true);
        try {
            const res = await axios.get(`${BASE_URL}/v2/api/${API_PATH}/products`);
            setProducts(res.data.products);
        } catch (error) {
            alert("取得產品失敗");
        }finally{
            setTimeout(() => {
            setIsScreenLoading(false);
            }, 3000);
        }
        };
        getProducts();
        // getCart();
    }, []);

    // 加入購物車
    const addCartItem=async(product_id,qty)=>{
        setIsLoading(true);
        try{
        await axios.post(`${BASE_URL}/v2/api/${API_PATH}/cart`,{
            data:{
            product_id,
            qty:Number(qty)
            }
        });
        // getCart();
        }catch(err){
        alert("加入購物車失敗");
        }finally{
        setTimeout(() => {
            setIsLoading(false);
        }, 3000);
        }
    };

    return (
        <>
            <div className="container">
                <table className="table align-middle">
                    <thead>
                        <tr>
                            <th>圖片</th>
                            <th>商品名稱</th>
                            <th>價格</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                    {products.map((product) => (
                        <tr key={product.id}>
                            <td style={{ width: "200px" }}>
                                <img
                                className="img-fluid"
                                src={product.imageUrl}
                                alt={product.title}
                                />
                            </td>
                            <td>{product.title}</td>
                            <td>
                                <del className="h6">原價 {product.origin_price} 元</del>
                                <div className="h5">特價 {product.origin_price}元</div>
                            </td>
                            <td>
                                <div className="btn-group btn-group-sm">
                                <button
                                    // onClick={() => handleSeeMore(product)}
                                    type="button"
                                    className="btn btn-outline-secondary"
                                >
                                    查看更多
                                </button>
                                <button type="button" className="btn btn-danger d-flex align-items-center gap-2"
                                        onClick={()=>addCartItem(product.id,1)}
                                        disabled={isLoading}
                                >
                                    <div>加到購物車</div>
                                    {isLoading && ( <ReactLoading
                                    type={"spin"}
                                    color={"#000"}
                                    height={"1.5rem"}
                                    width={"1.5rem"}
                                    />)}
                                </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
            {/* Loading 模板 */}
            {isScreenLoading && (
            <div className="d-flex justify-content-center align-items-center"
                style={{
                position: "fixed",
                inset: 0,
                backgroundColor: "rgba(105, 105, 105, 0.3)",
                zIndex: 999,
                }}
            >
                <ReactLoading type="spin" color="black" width="4rem" height="4rem" />
            </div>
            )}
        </>
    )
};