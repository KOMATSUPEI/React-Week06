import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { Modal } from "bootstrap";
import { useForm } from "react-hook-form"
import ReactLoading from 'react-loading';

const BASE_URL = import.meta.env.VITE_BASE_URL;
const API_PATH = import.meta.env.VITE_API_PATH;

function App() {
  const [products, setProducts] = useState([]);
  const [tempProduct, setTempProduct] = useState([]);
  const [isScreenLoading,setIsScreenLoading]=useState(false); // 整體Loading
  const [isLoading,setIsLoading]=useState(false);// 局部Loading

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
    getCart();
  }, []);

  const productModalRef = useRef(null);
  useEffect(() => {
    new Modal(productModalRef.current, { backdrop: false });
  }, []);

  const openModal = () => {
    const modalInstance = Modal.getInstance(productModalRef.current);
    modalInstance.show();
  };

  const closeModal = () => {
    const modalInstance = Modal.getInstance(productModalRef.current);
    modalInstance.hide();
  };

  const handleSeeMore = (product) => {
    setTempProduct(product);
    openModal();
  };

  const [qtySelect, setQtySelect] = useState(1);

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
      <div className="mt-4">
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
                      onClick={() => handleSeeMore(product)}
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

        <div
          ref={productModalRef}
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
          className="modal fade"
          id="productModal"
          tabIndex="-1"
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h2 className="modal-title fs-5">
                  產品名稱：{tempProduct.title}
                </h2>
                <button
                  onClick={closeModal}
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                ></button>
              </div>
              <div className="modal-body">
                <img
                  src={tempProduct.imageUrl}
                  alt={tempProduct.title}
                  className="img-fluid"
                />
                <p>內容：{tempProduct.content}</p>
                <p>描述：{tempProduct.description}</p>
                <p>
                  價錢：{tempProduct.price}{" "}
                  <del>{tempProduct.origin_price}</del> 元
                </p>
                <div className="input-group align-items-center">
                  <label htmlFor="qtySelect">數量：</label>
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
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-primary d-flex align-items-center gap-2" 
                        onClick={()=>addCartItem(tempProduct.id,qtySelect)}
                        disabled={isLoading}
                >
                  <div>加入購物車</div>
                  {isLoading && ( <ReactLoading
                    type={"spin"}
                    color={"#000"}
                    height={"1.5rem"}
                    width={"1.5rem"}
                  />)}
                </button>
              </div>
            </div>
          </div>
        </div>
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
  );
}

export default App;
