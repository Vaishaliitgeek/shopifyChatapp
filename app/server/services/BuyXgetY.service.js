// import { authenticate } from "../../shopify.server"
export const createBuyXgetYdiscount=async(variables,admin)=>{
  try {
     
          console.log("Creating BXGY discount...", variables);
    
         
          const response = await admin.graphql(
            `#graphql
            mutation CreateBxgyDiscount($automaticBxgyDiscount: DiscountAutomaticBxgyInput!) {
              discountAutomaticBxgyCreate(automaticBxgyDiscount: $automaticBxgyDiscount) {
                automaticDiscountNode {
                  id
                  automaticDiscount {
                    ... on DiscountAutomaticBxgy {
                      title
                      startsAt
                      endsAt
                    }
                  }
                }
                userErrors {
                  field
                  message
                }
              }
            }`,
            { variables }
          );
          // const data = await response.json();
          // console.log("Discount creation response: shippppingggkjjjjjjjjjjjj", data);
    
          // const userErrors = data.data?.discountCodeFreeShippingCreate?.userErrors || [];
    
          // if (userErrors.length > 0) {
          //   console.error("Shopify discount creation error:", userErrors);
          //   return new Response(
          //     JSON.stringify({
          //       error: "Failed to create discount",
          //       shopifyErrors: userErrors.map(err => ({
          //         field: err.field,
          //         code: err.code,
          //         message: err.message
          //       })),
          //     }),
          //     { status: 400, headers: { "Content-Type": "application/json" } }
          //   );
          // }
    
          const data = await response.json();
          console.log("BXGY Discount response:", data);
          const userErrors = data?.errors || data?.data?.discountAutomaticBxgyCreate?.userErrors || [];

          // if (data.data?.discountAutomaticBxgyCreate?.userErrors?.length > 0) {
          //   console.error("Shopify BXGY creation error:", data.data.discountAutomaticBxgyCreate.userErrors);
          //   return new Response(
          //     JSON.stringify({
          //       error: "Failed to create BXGY discount",
          //       details: data.data.discountAutomaticBxgyCreate.userErrors
          //     }),
          //     { status: 400, headers: { "Content-Type": "application/json" } }
          //   );
          // }
          if (userErrors.length > 0) {
              console.error("Shopify discount creation error bxgyyyy:", userErrors);
              return new Response(
                JSON.stringify({
                  error: "Failed to create discount",
                  shopifyErrors: userErrors.map(err => ({
                    field: err.field,
                    code: err.code,
                    message: err.message
                  })),
                }),
                { status: 400, headers: { "Content-Type": "application/json" } }
              );
            }
      
    
          return new Response(
            JSON.stringify({
              message: "BXGY discount created successfully",
              discount: data.data.discountAutomaticBxgyCreate.automaticDiscountNode
            }),
            { status: 200, headers: { "Content-Type": "application/json" } }
          );
        } catch (error) {
          console.error("Error creating BXGY discount:", error);
          return new Response(
            JSON.stringify({ error: "Failed to create BXGY discount" }),
            { status: 500, headers: { "Content-Type": "application/json" } }
          );
        }
      }
    
  
