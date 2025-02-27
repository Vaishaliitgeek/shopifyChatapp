import React, { useEffect, useState } from "react";
import { Card, Page, DataTable, Button, TextField } from "@shopify/polaris";
import { useLocation } from "@remix-run/react";
import { useNavigate } from "@remix-run/react";

const DbProduct = () => {
  const [products, setProducts] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const [updatedTitle, setUpdatedTitle] = useState("");
  const location = useLocation();
  const { orderId } = location.state || {};
  const navigate = useNavigate();
  console.log("orderId producttt",orderId);
  useEffect(() => {
    fetch("/api/dbProduct")
      .then((response) => response.json())
      .then((data) => setProducts(data?.dbproduct || []))
      .catch((error) => console.error("Error fetching products:", error));
  }, []);

  const startEditing = (product) => {
    setEditingProduct(product._id);
    setUpdatedTitle(product.title);
  };

  const handleUpdate = async (productId) => {
    try {
      const response = await fetch(`/api/update`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: updatedTitle, productId }),
      });
  
      const result = await response.json();
      console.log("Update response:", result);
  
      if (response.ok) {
        const updatedProducts = await fetch("/api/dbProduct").then((res) => res.json());
  
        setProducts(updatedProducts?.dbproduct || []); 
        setEditingProduct(null);
      }
    } catch (error) {
      console.error("Error updating product:", error);
    }
  };
  const handleDelete = async (productId) => {
    try {
      const response = await fetch(`/api/update`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId }),
      });
  
      const result = await response.json();
      console.log("Delete response:", result);
  
      if (response.ok) {
        const updatedProducts = await fetch("/api/dbProduct").then((res) => res.json());
  
        setProducts(updatedProducts?.dbproduct || []); 
      }
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  }
  const AddToOrder=async(productId,orderId)=>{
    console.log("productId",productId);
    console.log("orderId",orderId);
    try {
      const response = await fetch(`/api/orders`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId, productId, quantity: 1 }),
      });
  
      const result = await response.json();
      console.log("Add to order response:", result);
  
      if (response.ok) {
        // alert("Product added to order successfully!");
        navigate('/app/order');
      } else {
        console.error("Failed to add product to order:", result.error);
        alert("Failed to add product to order!");
      }
    } catch (error) {
      console.error("Error adding product to order:", error);
      alert("Failed to add product to order!");
    }
  }
  

  const rows = products.map((product) => [
    editingProduct === product._id ? (
      <TextField value={updatedTitle} onChange={setUpdatedTitle} />
    ) : (
      product.title.slice(0,20)
    ),
    product.vendor,
    product.status,
    product.handle.slice(0,20),
    editingProduct === product._id ? (
      <Button onClick={() => handleUpdate(product.productId)}>Save</Button>
    ) : (
      <Button onClick={() => startEditing(product)}>Update</Button>
    ),
    <Button onClick={() => handleDelete(product.productId)}>Delete</Button>,
    <Button onClick={() => AddToOrder(product.productId, orderId)}>Add to order</Button>



  ]);

  return (
    <Page title="Products From Database">
      <Card>
        <DataTable
          columnContentTypes={["text", "text", "text", "text", "text","text","text"]}
          headings={["Title", "Vendor", "Status", "Handle", "Update","DElete","add to order"]}
          rows={rows}
        />
      </Card>
    </Page>
  );
};

export default DbProduct;
