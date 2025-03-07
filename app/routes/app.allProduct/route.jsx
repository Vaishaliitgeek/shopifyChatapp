import React, { useEffect, useState } from 'react';
import { Card, Page, DataTable,Button } from '@shopify/polaris';
import image from './image/one.jpg';

const ProductsList = () => {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(null);

  const fetchProducts = async () => {
    try {
      const response = await fetch("/api/products");
      const result = await response.json();
      if(result.message){
        setError(result.message);
        }
      
      console.log("Fetched products:", result);

      // const productList = result?.data?.products?.edges?.map(edge => edge.node) || [];
      const productList = result.products.map(product => ({
        ...product,
        image: product.images?.edges?.length > 0 ? product.images.edges[0].node.originalSrc : null
      }));
      setProducts(productList);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };
  const addProduct = async () => {
    console.log("clijdkjskdsj")
    try {
      const response = await fetch("/api/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ products })
      });

      const result = await response.json();
      fetchProducts();
      console.log("Product save response:", result);
      // setLoading(false);
    } catch (error) {
      console.error("Error adding products:", error);
      // setLoading(false);
    }
  };
console.log("error",error)
  useEffect(() => {
    fetchProducts();
  }, []);
if(!error){
  var rows = products.map((product) => [
    <img 
      src={product.image || image} 
      alt={product.title} 
      width="50" 
      height="50"
    />,
    product.title.slice(0, 20) ,
    product.vendor,
    product.status,
    product.handle.slice(0,30), 
  ]);
}
 

  return (
    <>
    <p style={{margin:"1rem"}}>
    <Button  onClick={addProduct}>Add Product</Button>

    </p>
    {/* <Select
              label="Add Product"
              options={[
                { label: "Select Discount", value: "" },
                { label: "Amount OFF Order", value: "/app/discount" },
                { label: "Amount OFF Products", value: "/app/ProdDiscount" },
                { label: "Buy X Get Y", value: "/app/BuyXgetYdiscount" },
                { label: "Free Shipping", value: "/app/freeshipDiscount" },
              ]}
              onChange={handleDiscountChange}
              value={selectedDiscount}
            /> */}
 
  {error ? <div>{error}</div> : <Page title="Products">
      <Card>
      <DataTable
              columnContentTypes={['text', 'text', 'text', 'text', 'text']}
              headings={['Image', 'Title', 'Vendor', 'Status', 'Handle']}
              rows={rows}
            />
            
      </Card>
    </Page>}
    
    </>
    
  );
};

export default ProductsList;

