import React, { useEffect, useState } from 'react';
import { Card, Page, DataTable } from '@shopify/polaris';
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
    product.title,
    product.vendor,
    product.status,
    product.handle, 
  ]);
}
 

  return (
    <>
    <button onClick={addProduct}>Add Product</button>
 
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

