// import { authenticate } from "../../shopify.server"
import { successMessage,errorMessage } from "../constants/message";
// import { statusCode } from "../constants/constant";
export const createBuyXgetYdiscount = async (variables, admin) => {
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
      return {
               status: false,
               message: errorMessage.DISCOUNT_FAILED,
               errors: userErrors.map(err => ({
                 field: err.field,
                 message: err.message
               })),
             };
    }


    return new Response(
      JSON.stringify({
        message: "BXGY discount created successfully",
        discount: data.data.discountAutomaticBxgyCreate.automaticDiscountNode
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
    // return {
    //         status: true,
    //         message: successMessage.DISCOUNT_CREATED,
    //         data: {
    //           discountCode: data.data.discountAutomaticBxgyCreate.codeDiscountNode
    //         }
    //       };
  } catch (error) {
    console.error("Error creating BXGY discount:", error);
     return {
            status: false,
            message: errorMessage.SERVER_ERROR,
            error: error.message,
          };
  }
}


