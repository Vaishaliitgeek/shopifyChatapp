import { statusCode } from "../constants/constant";
import { successMessage,errorMessage } from "../constants/message";
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

    

    
      const data = await response.json();
      console.log("Discount creation response", data);

      const userErrors = data?.errors || data?.data?.discountCodeBasicCreate?.userErrors || [];
// ampountOff

      if (userErrors.length > 0) {
        console.error("Shopify discount creation error:", userErrors);
        // return new Response(
        //   JSON.stringify({
        //     error: errorMessage.DISCOUNT_FAILED,
        //     shopifyErrors: userErrors.map(err => ({
        //       field: err.field,
        //       code: err.code,
        //       message: err.message
        //     })),
        //   }),
        //   { status: statusCode.BAD_REQUEST, headers: { "Content-Type": "application/json" } }
        // );
        return {
          status: false,
          message: errorMessage.DISCOUNT_FAILED,
          errors: userErrors.map(err => ({
            field: err.field,
            message: err.message
          })),
        };
      }
      return {
        status: true,
        message: successMessage.DISCOUNT_CREATED,
        data: {
          discountCode: data.data.discountCodeBasicCreate.codeDiscountNode
        }
      };
    } catch (error) {
      console.error("Error creating discount code:", error);
      return {
        status: false,
        message: errorMessage.SERVER_ERROR,
        error: error.message,
      };
    }
  };

      