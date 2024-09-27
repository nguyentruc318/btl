import { Route, Routes } from "react-router-dom";
import Sibebar from "../../components/Sidebar/Sibebar";
import "./Admin.css";
import Addproduct from "../../components/Addproduct/Addproduct";
import ListProduct from "../../components/ListProducr/ListProduct";

function Admin() {
  return (
    <div className="admin">
      <Sibebar />
      <Routes>
        <Route path="/addproduct" element={<Addproduct />} />
        <Route path="/listproduct" element={<ListProduct />} />
      </Routes>
    </div>
  );
}

export default Admin;
