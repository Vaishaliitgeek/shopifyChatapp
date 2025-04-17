import { authenticate } from "../../shopify.server";
import { Product } from "../../server/models/product.model";

export const loader = async ({ request}) => {
  console.log("Loader running...");
  console.log("Product ID from URL:", params.productId);

  return new Response(JSON.stringify({ message: "Loader executed", id: params.productId }), {
    headers: { "Content-Type": "application/json" },
  });
};




export const action = async ({ request }) => {
  if(request.method==='POST'){
    try {
      const { productId, title } = await request.json(); 
      console.log("Updating product title...", { productId, title });
  
      const { admin, session } = await authenticate.admin(request);
  
      const numericProductId = productId.replace("gid://shopify/Product/", "");
  
      const product = new admin.rest.resources.Product({ session });
  
      product.id = numericProductId; 
      product.title = title; 
  
      await product.save({ update: true });
  
      const updatedProduct = await Product.findOneAndUpdate(
        { productId }, 
        { title }, 
        { new: true } 
      );
  
      return new Response(
        JSON.stringify({
          message: "Product title updated successfully",
          shopifyProduct: { id: numericProductId, title },
          dbProduct: updatedProduct,
        }),
        { status: 200, headers: { "Content-Type": "application/json" } }
      );
    } catch (error) {
      console.error("Error updating product title:", error);
      return new Response(
        JSON.stringify({ error: "Failed to update product title" }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }
  }
  if (request.method === 'DELETE') {
    try {
      const { productId } = await request.json();
      console.log("Deleting product...", { productId });
  
      const { admin, session } = await authenticate.admin(request);
      const numericProductId = productId.replace("gid://shopify/Product/", "");
  console.log("numerixcc",numericProductId)
      const response = await admin.graphql(
        `#graphql
        mutation {
          productDelete(input: { id: "gid://shopify/Product/${numericProductId}" }) {
            deletedProductId
            userErrors {
              field
              message
            }
          }
        }`
      );
  
      const data = await response.json(); 
  
      console.log("Product delete response:", data);
  
      if (data.data?.productDelete?.userErrors?.length > 0) {
        console.error("Shopify deletion error:", data.data.productDelete.userErrors);
        return new Response(
          JSON.stringify({ error: "Failed to delete product from Shopify", details: data.data.productDelete.userErrors }),
          { status: 400, headers: { "Content-Type": "application/json" } }
        );
      }
  
      await Product.findOneAndDelete({ productId });
  
      return new Response(
        JSON.stringify({
          message: "Product deleted successfully",
          shopifyProduct: { id: numericProductId },
        }),
        { status: 200, headers: { "Content-Type": "application/json" } }
      );
    } catch (error) {
      console.error("Error deleting product:", error);
      return new Response(
        JSON.stringify({ error: "Failed to delete product" }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }
  }
  
  

};


