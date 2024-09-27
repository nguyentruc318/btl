import "./AddProduct.css";
import upload_area from "../../assets/upload_area.svg";
import { useState } from "react";
function Addproduct() {
  const [image, setImage] = useState(false);
  const [productDetail, setProductDetail] = useState({
    name: "",
    image: "",
    category: "",
    new_price: "",
    old_price: "",
  });
  const imageHanlder = (e) => {
    setImage(e.target.files[0]);
  };
  const changeHandler = (e) => {
    setProductDetail({ ...productDetail, [e.target.name]: e.target.value });
  };
  const addProduct = async () => {
    let responeData;
    let product = productDetail;
    let formData = new FormData();
    formData.append("product", image);
    await fetch("http://localhost:4000/upload", {
      method: "POST",
      //   headers: {
      //     Accept: "application/json",
      //   },
      body: formData,
    })
      .then((res) => res.json())
      .then((data) => {
        responeData = data;
      });
    if (responeData.success) {
      product.image = responeData.image_url;
      //   console.log(product);
      await fetch("http://localhost:4000/addproduct", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(product),
      })
        .then((res) => res.json())
        .then((data) => {
          data.success ? alert("đã thêm sản phẩm vào db") : alert("có lỗi");
        });
    }
  };
  return (
    <div className="add-product">
      <div className="addproduct-field">
        <div className="addproduct-itemfield">
          <p>Tên sản phẩm</p>
          <input
            value={productDetail.name}
            onChange={changeHandler}
            type="text"
            name="name"
            placeholder="nhập tên"
          />
        </div>
        <div className="addproduct-price">
          <div className="addproduct-itemfield">
            <p>Giá</p>
            <input
              type="text"
              value={productDetail.old_price}
              onChange={changeHandler}
              name="old_price"
              placeholder="nhập giá"
            />
          </div>
          <div className="addproduct-itemfield">
            <p>Giá ưu đãi</p>
            <input
              value={productDetail.new_price}
              onChange={changeHandler}
              type="text"
              name="new_price"
              placeholder="nhập giá ưu đãi"
            />
          </div>
        </div>
        <div className="addproduct-itemfield">
          <p>Loại sản phẩm </p>
          <select
            value={productDetail.category}
            onChange={changeHandler}
            name="category"
            className="addproduct-selector"
            id=""
          >
            <option value="women">Women</option>
            <option value="men">Men</option>
            <option value="kid">Kid</option>
          </select>
        </div>
        <div className="addproduct-itemfield">
          <label htmlFor="file-input">
            <img
              src={image ? URL.createObjectURL(image) : upload_area}
              className="thumnail-img"
              alt=""
            />
          </label>
          <input
            onChange={imageHanlder}
            type="file"
            name="image"
            id="file-input"
            hidden
          />
        </div>
        <button
          onClick={() => {
            addProduct();
          }}
          className="addproduct-btn"
        >
          Add
        </button>
      </div>
    </div>
  );
}

export default Addproduct;
