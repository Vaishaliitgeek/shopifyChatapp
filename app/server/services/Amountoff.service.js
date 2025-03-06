// import { authenticate } from "../../shopify.server"
export const createAmountoffDiscount=async(variables,admin)=>{
 try {
      console.log("variables",variables);
      console.log("Creating discount code...", variables);

      const response = await admin.graphql(
        `#graphql
        mutation CreateDiscountCode($basicCodeDiscount: DiscountCodeBasicInput!) {
  discountCodeBasicCreate(basicCodeDiscount: $basicCodeDiscount) {
    codeDiscountNode {
      id
      codeDiscount {
        ... on DiscountCodeBasic {
          title
          startsAt
          endsAt
          
          customerGets {
            value {
              ... on DiscountPercentage {
                percentage
              }
            }
          }
        }
      }
    }
    userErrors {
      field
      message
    }
  }
}
`,
        { variables }
      );

    

      // if (data.data?.discountCodeBasicCreate?.userErrors?.length > 0) {
      //   console.error("Shopify discount code creation error:", data.data.discountCodeBasicCreate.userErrors);
      //   return new Response(
      //     JSON.stringify({
      //       error: "Failed to create discount code",
      //       details: data.data.discountCodeBasicCreate.userErrors
      //     }),
      //     { status: 400, headers: { "Content-Type": "application/json" } }
      //   );
      // }
      const data = await response.json();
      console.log("Discount creation response: shippppingggkjjjjjjjjjjjj", data);

      const userErrors = data?.errors || data?.data?.discountCodeBasicCreate?.userErrors || [];
ampountOff

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
          message: "Discount code created successfully",
          discountCode: data.data.discountCodeBasicCreate.codeDiscountNode
        }),
        { status: 200, headers: { "Content-Type": "application/json" } }
      );
    } catch (error) {
      console.error("Error creating discount code:", error);
      return new Response(
        JSON.stringify({ error: "Failed to create discount code"}),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }
  };

      