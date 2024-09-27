import { useEffect, useState } from "react";
import "./ListProduct.css";
import cross_icon from "../../assets/cross_icon.png";
function ListProduct() {
  const [allproducts, setAllProducts] = useState([]);
  const fetchInfor = async () => {
    const res = await fetch("http://localhost:4000/allproducts");
    const data = await res.json();
    setAllProducts(data);
  };
  useEffect(() => {
    fetchInfor();
  }, []);
  const remove_product = async (id) => {
    await fetch("http://localhost:4000/removeproduct", {
      method: "POST",
      headers: {
        Accept: "application.json",
        "Content-type": "application/json",
      },
      body: JSON.stringify({ id: id }),
    });
    await fetchInfor();
  };
  return (
    <div className="list-product">
      <h1>All Product List</h1>
      <div className="listproduct-format-main">
        <p>sản phẩm</p>
        <p>tên</p>
        <p>giá cũ</p>
        <p>giá mới</p>
        <p>loại sản phẩm</p>
        <p>xóa</p>
      </div>
      <div className="listproduct-allproducts">
        <hr />
        {allproducts.map((item, index) => {
          return (
            <>
              <div
                key={index}
                className="listproduct-format-main listproduct-format"
              >
                <img src={item.image} alt="" className="product-img" />
                <p>{item.name}</p>
                <p>${item.old_price}</p>
                <p>${item.new_price}</p>
                <p>{item.category}</p>
                <img
                  onClick={() => {
                    remove_product(item.id);
                  }}
                  className="listproduct-remove_icon"
                  src={cross_icon}
                  alt=""
                />
              </div>
              <hr />
            </>
          );
        })}
      </div>
    </div>
  );
}

export default ListProduct;
