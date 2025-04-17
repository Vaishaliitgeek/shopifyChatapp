import { authenticate } from "../../shopify.server";
import { Product } from "../../server/models/product.model";

export async function loader({ request }) {
  try {
    const { admin, session } = await authenticate.admin(request);
    console.log("Session scope", session.scope);
    console.log("Admin Authenticated:", admin);

    const response = await admin.graphql(
      `#graphql
     query {
  products(first: 50) {
    edges {
      node {
        id
        title
        status
        vendor
        handle
        images(first: 1) { 
          edges {
            node {
              originalSrc  
              altText      
            }
          }
        }
      }
    }
    pageInfo {
      hasNextPage
    }
  }
}
`
    );



    const data = await response.json();


    const shopifyProducts = data.data.products.edges.map((edge) => edge.node);
    console.log("Shopify Products:", shopifyProducts);

    const existingProducts = await Product.find({}, "productId");
    const existingProductIds = existingProducts.map((product) => product.productId);

    const newProducts = shopifyProducts.filter((product) => !existingProductIds.includes(product.id));
    console.log("newProducts", newProducts.length);
    if (newProducts.length >= 5) {
      return new Response(JSON.stringify({ products: newProducts.slice(0, 5) }), {
        headers: { "Content-Type": "application/json" },
        status: 200,
      });
    }
    else {
      return new Response(JSON.stringify({ message: "Product is Emptyyy" }));
    }


  } catch (error) {
    console.error("Error in loader:", error);
    return new Response(JSON.stringify({ error: "Failed to fetch products" }), {
      headers: { "Content-Type": "application/json" },
      status: 500,
    });
  }
}


export async function action({ request }) {
  if (request.method !== "POST") {
    return new Response("Method Not Allowed", { status: 405 });
  }

  try {
    const { products } = await request.json();
    console.log("Received products:", products);

    const formattedProducts = products.map(product => ({
      productId: product.id,
      title: product.title,
      vendor: product.vendor,
      status: product.status,
      handle: product.handle,
      shopifyId: product.id,
    }));

    await Product.insertMany(formattedProducts, { ordered: false }).catch(err => {
      console.error("Error inserting products:", err);
    });

    return Response.json({ success: true, message: "Products added to database" });
  } catch (error) {
    console.error("Error in action:", error);
    return Response.json({ error: "Failed to save products" }, { status: 500 });
  }
}

