import { useEffect, useState } from "react";
import axios from "axios";
import { useForm } from "react-hook-form"
import ReactLoading from 'react-loading';
import { Link } from "react-router-dom"

const BASE_URL = import.meta.env.VITE_BASE_URL;
const API_PATH = import.meta.env.VITE_API_PATH;

export default function CartPage(){
    const [isScreenLoading,setIsScreenLoading]=useState(false); // 整體Loading

    // 定義取得購物車變數
    const [cart, setCart] = useState([]);

    // 取得購物車
    const getCart=async()=>{
    try{
        const res=await axios.get(`${BASE_URL}/v2/api/${API_PATH}/cart`);
        setCart(res.data.data);
    }catch(err){
        alert("購物車列表加載失敗");
    }
    };

    //取得產品
    useEffect(() => {
        getCart();
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
        getCart();
        }catch(err){
        alert("加入購物車失敗");
        }finally{
            setTimeout(() => {
                setIsLoading(false);
            }, 3000);
        }
    };

    // 清空購物車
    const removeCart=async()=>{
        setIsScreenLoading(true);
        try{
        await axios.delete(`${BASE_URL}/v2/api/${API_PATH}/carts`);
        getCart();
        alert("購物車成功清空");
        }catch(err){
        alert("清空購物車失敗");
        console.log(err);
        }finally{
            setTimeout(() => {
                setIsScreenLoading(false);
            }, 3000);
        }
    };

    // 刪除單一商品
    const removeCartItem=async(cartItem_id)=>{
        setIsScreenLoading(true);
        try{
        await axios.delete(`${BASE_URL}/v2/api/${API_PATH}/cart/${cartItem_id}`);
        getCart();
        }catch(err){
        alert("刪除商品失敗");
        }finally{
            setTimeout(() => {
                setIsScreenLoading(false);
            }, 3000);
        }
    };

    // 調整購物車產品數量
    const updateCartItem=async(cartItem_id,product_id,qty)=>{
        setIsScreenLoading(true);
        try{
        await axios.put(`${BASE_URL}/v2/api/${API_PATH}/cart/${cartItem_id}`,{
            data:{
            product_id,
            qty:Number(qty)
            }
        });
        getCart();
        }catch(err){
        alert("購物車數量更新失敗");
        }finally{
            setTimeout(() => {
                setIsScreenLoading(false);
            }, 3000);
        }
    };

    // 定義表單變數
    const {
        register,
        handleSubmit,
        formState:{errors},
        reset
        }=useForm();
    
    //提交表單
    const onSubmit=handleSubmit((data)=>{
    const {message,...user}=data;//解構出需要的變數
    const userInfo={
        data:{
        user,
        message
        }
    };//變數再構築
    
    checkout(userInfo);
    })
    
    //結帳
    const checkout=async(data)=>{
    setIsScreenLoading(true);
    try{
        const res=await axios.post(`${BASE_URL}/v2/api/${API_PATH}/order`,data);
        reset();//清空表單
        alert("結帳成功");
        console.log(res);
    }catch(err){
        alert("結帳失敗");
        console.log(err);
    }finally{
        setTimeout(() => {
        setIsScreenLoading(false);
        }, 3000);
    }
    };


    return (
        <div className="container">
            {/* 購物車列表 */}
            <div>
                {cart.carts?.length>0 && (
                    <div>
                        <div className="text-end py-3">
                            <button className="btn btn-outline-danger" type="button" onClick={removeCart}>
                            清空購物車
                            </button>
                        </div>

                        <table className="table align-middle">
                            <thead>
                            <tr>
                                <th></th>
                                <th>品名</th>
                                <th style={{ width: "150px" }}>數量/單位</th>
                                <th className="text-end">單價</th>
                            </tr>
                            </thead>

                            <tbody>
                            {cart.carts?.map((cartItem)=>(
                                <tr key={cartItem.id}>
                                <td>
                                    <button type="button" className="btn btn-outline-danger btn-sm" onClick={()=>removeCartItem(cartItem.id)}>
                                    x
                                    </button>
                                </td>
                                <td>{cartItem.product.title}</td>
                                <td style={{ width: "150px" }}>
                                    <div className="d-flex align-items-center">
                                    <div className="btn-group me-2" role="group">
                                        <button
                                        type="button"
                                        className="btn btn-outline-dark btn-sm"
                                        onClick={()=>updateCartItem(cartItem.id,cartItem.product_id,cartItem.qty-1)}
                                        disabled={cartItem.qty===1}
                                        >
                                        -
                                        </button>
                                        <span
                                        className="btn border border-dark"
                                        style={{ width: "50px", cursor: "auto" }}
                                        >{cartItem.qty}</span>
                                        <button
                                        type="button"
                                        className="btn btn-outline-dark btn-sm"
                                        onClick={()=>updateCartItem(cartItem.id,cartItem.product_id,cartItem.qty+1)}
                                        >
                                        +
                                        </button>
                                    </div>
                                    <span className="input-group-text bg-transparent border-0">
                                        {cartItem.product.unit}
                                    </span>
                                    </div>
                                </td>
                                <td className="text-end">{cartItem.total}</td>
                                </tr>
                            ))}
                            </tbody>
                            <tfoot>
                            <tr>
                                <td colSpan="3" className="text-end">
                                總計：
                                </td>
                                <td className="text-end" style={{ width: "130px" }}>{cart.total}</td>
                            </tr>
                            </tfoot>
                        </table>
                    </div>
                )}
            </div>
            
            {/* 表單 */}
            <div className="my-5 row justify-content-center">
            <form className="col-md-6" onSubmit={onSubmit}>
                <div className="mb-3">
                <label htmlFor="email" className="form-label">
                    Email
                </label>
                <input
                    id="email"
                    type="email"
                    className={`form-control ${errors.email && "is-invalid"}`}
                    placeholder="請輸入 Email"
                    {...register("email",{
                    required:"Email 欄位必填",
                    pattern:{
                        value:/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                        message:"Email 格式錯誤"
                    }
                    })}
                />
                {errors.email && <p className="text-danger my-2">{errors.email.message}</p>}
                </div>

                <div className="mb-3">
                <label htmlFor="name" className="form-label">
                    收件人姓名
                </label>
                <input
                    id="name"
                    className={`form-control ${errors.name && "is-invalid"}`}
                    placeholder="請輸入姓名"
                    {...register("name",{
                    required:"姓名欄位必填"
                    })}
                />
                {errors.name && <p className="text-danger my-2">{errors.name.message}</p>}
                </div>

                <div className="mb-3">
                <label htmlFor="tel" className="form-label">
                    收件人電話
                </label>
                <input
                    id="tel"
                    type="text"
                    className={`form-control ${errors.tel && "is-invalid"}`}
                    placeholder="請輸入電話"
                    {...register("tel",{
                    required:"電話欄位必填",
                    pattern:{
                        value:/^(0[2-8]\d{7}|09\d{8})$/,
                        message:"電話格式錯誤"
                    }
                    })}
                />
                {errors.tel && <p className="text-danger my-2">{errors.tel.message}</p>}
                </div>

                <div className="mb-3">
                <label htmlFor="address" className="form-label">
                    收件人地址
                </label>
                <input
                    id="address"
                    type="text"
                    className={`form-control ${errors.address && "is-invalid"}`}
                    placeholder="請輸入地址"
                    {...register("address",{
                    required:"地址欄位必填"
                    })}
                />
                {errors.address && <p className="text-danger my-2">{errors.address.message}</p>}
                </div>

                <div className="mb-3">
                <label htmlFor="message" className="form-label">
                    留言
                </label>
                <textarea
                    id="message"
                    className="form-control"
                    cols="30"
                    rows="10"
                    {...register("message")}
                ></textarea>
                </div>
                <div className="text-end">
                <button type="submit" className="btn btn-danger" disabled={cart.carts?.length === 0}>
                    送出訂單
                </button>
                </div>
            </form>
            </div>

            <div className="d-flex justify-content-center align-items-center gap-5">
                <Link to="/products"><button className="btn btn-success">回產品列表</button></Link>
                <Link to="/"><button className="btn btn-success">回首頁</button></Link>
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
        </div>
    )
};