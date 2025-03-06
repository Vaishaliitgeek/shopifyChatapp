export const createFreeShippingDiscount=async(variables,admin)=>{
  try {
       console.log("Creating free shipping discount freeeeeeeeeeeee...", variables);
 
       const response = await admin.graphql(
         `#graphql
         mutation discountCodeFreeShippingCreate($freeShippingCodeDiscount: DiscountCodeFreeShippingInput!) {
           discountCodeFreeShippingCreate(freeShippingCodeDiscount: $freeShippingCodeDiscount) {
             codeDiscountNode {
               id
               codeDiscount {
                 ... on DiscountCodeFreeShipping {
                   title
                   startsAt
                   endsAt
                   maximumShippingPrice {
                     amount
                   }
                   customerSelection {
                     ... on DiscountCustomerAll {
                       allCustomers
                     }
                   }
                   destinationSelection {
                     ... on DiscountCountryAll {
                       allCountries
                     }
                   }
                   minimumRequirement {
                     ... on DiscountMinimumSubtotal {
                       greaterThanOrEqualToSubtotal {
                         amount
                       }
                     }
                   }
                   codes(first: 2) {
                     nodes {
                       code
                     }
                   }
                 }
               }
             }
             userErrors {
               field
               code
               message
             }
           }
         }`,
         { variables }
       );
 
       const data = await response.json();
       console.log("Discount creation response: shippppingggkjjjjjjjjjjjj", data);
 
       const userErrors = data.data?.discountCodeFreeShippingCreate?.userErrors || [];
 
       if (userErrors.length > 0) {
         console.error("Shopify discount creation error:", userErrors);
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
           message: "Free shipping discount created successfully",
           discount: data.data.discountCodeFreeShippingCreate.codeDiscountNode,
         }),
         { status: 200, headers: { "Content-Type": "application/json" } }
       );
     } catch (error) {
       console.error("Error creating discount:", error);
       return new Response(JSON.stringify({ error: "Failed to create discount" }), {
         status: 500,
         headers: { "Content-Type": "application/json" },
       });
     }
      }
    