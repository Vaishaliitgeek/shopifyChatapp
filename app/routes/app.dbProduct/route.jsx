import React, { useEffect, useState } from "react";
import { Card, Page, DataTable, Button, TextField } from "@shopify/polaris";

const DbProduct = () => {
  const [products, setProducts] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const [updatedTitle, setUpdatedTitle] = useState("");

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
  

  const rows = products.map((product) => [
    editingProduct === product._id ? (
      <TextField value={updatedTitle} onChange={setUpdatedTitle} />
    ) : (
      product.title
    ),
    product.vendor,
    product.status,
    product.handle,
    editingProduct === product._id ? (
      <Button onClick={() => handleUpdate(product.productId)}>Save</Button>
    ) : (
      <Button onClick={() => startEditing(product)}>Update</Button>
    ),
    <Button onClick={() => handleDelete(product.productId)}>Delete</Button>
  ]);

  return (
    <Page title="Products From Database">
      <Card>
        <DataTable
          columnContentTypes={["text", "text", "text", "text", "text","text"]}
          headings={["Title", "Vendor", "Status", "Handle", "Update","DElete"]}
          rows={rows}
        />
      </Card>
    </Page>
  );
};

export default DbProduct;
