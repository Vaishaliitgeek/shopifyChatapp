// import { request } from "http";
import { authenticate } from "../../shopify.server";
import { createBuyXgetYdiscount } from '../../server/services/BuyXgetY.service'
import { createAmountoffDiscount } from '../../server/services/Amountoff.service'
import { createLineItemdiscount } from "../../server/services/LineItemDiscount.service";
// import {createFreeShippingDiscount} from '../../services/FreeShipping.service'
import { createFreeShippingDiscount } from "../../server/services/FreeShipping.service";
// import { sendResponse } from "../../utils/sendResponse";
import { sendResponse } from "../../server/utils/sendResponse";
// import { statusCode } from "../utils/statusCodes"; 
import { statusCode } from '../../server/constants/constant';
import { errorMessage, successMessage } from '../../server/constants/message';




export const loader = async ({ request }) => {
  console.log("callllllllllllllllllllllllllllllllllllll")
  try {
    const { admin } = await authenticate.admin(request);

    const QUERY = `#graphql
     query GetAllDiscounts($first: Int = 10, $after: String) {
  discountNodes(first: $first, after: $after) {
    edges {
      node {
        id
       
        discount {
          __typename
          ... on DiscountAutomaticBxgy {
            title
            startsAt
            endsAt
            status
          }
          ... on DiscountAutomaticBasic {
            title
            startsAt
            endsAt
            status
          }
          ... on DiscountCodeBasic {
            title
            startsAt
            endsAt
            status
            codes(first: 5) {
              nodes {
                code
              }
            }
          }
          ... on DiscountCodeBxgy {
            title
            startsAt
            endsAt
            status
            codes(first: 5) {
              nodes {
                code
              }
            }
          }
          ... on DiscountCodeFreeShipping {
            title
            startsAt
            endsAt
            status
            codes(first: 5) {
              nodes {
                code
              }
            }
          }
        }
      }
    }
    pageInfo {
      hasNextPage
      endCursor
    }
  }
}`;

    const response = await admin.graphql(QUERY);
    const dta = await response.json();
    const resSend = await dta?.data?.discountNodes?.edges;
    console.log("discount get", dta?.data?.discountNodes?.edges)
    return resSend;
  } catch (error) {
    console.error("Error fetching discounts:", error);
    return Response.json({ error: "Failed to fetch discounts" }, { status: 500 });
  }
};



export const action = async ({ request }) => {
  // console.log("paramsss",params);
  const url = new URL(request.url);
  const type = url.searchParams.get("type");
  console.log(type, "type")

  if (type == "BuyXGetY") {
    if (request.method === "POST") {
      console.log("bjhnbdhcuuuuuuuuuuuuuuuuuuuuuuu")
      try {
        const { admin } = await authenticate.admin(request);
        const { variables } = await request.json();
        const response = await createBuyXgetYdiscount(variables, admin);
        const data = await response.json();
        console.log("responseeebuyxgety", data)
        console.log("dataaaaaadisss", data.shopifyErrors?.[0]?.message || "No Shopify errors");
        // console.log("ressssssssssssssssssssssbuyxgety",response)
        if (data.shopifyErrors && data.shopifyErrors.length > 0) {
          return sendResponse(statusCode.BAD_REQUEST, false, data.shopifyErrors[0]?.message || "Failed to create discount");
        }


        return sendResponse(statusCode.OK, successMessage.DISCOUNT_CREATED, true, response?.message || "Discount created successfully", response?.data);


      } catch (error) {
        console.error("Error in BuyXgetYdiscount action:", error);
        return sendResponse(statusCode.INTERNAL_SERVER_ERROR, errorMessage.INTERNAL_SERVER_ERROR, false, "Internal server error");
      }
    }
  }
  if (type == "discount") {
    if (request.method === "POST") {
      console.log("bjhnbdhcuuuuuuuuuuuuuuuuuuuuuuu")
      try {
        const { admin } = await authenticate.admin(request);
        const { variables } = await request.json();
        const response = await createAmountoffDiscount(variables, admin);
        console.log("resssssssssssssssssssssss", response)
        const data = await response.json();
        console.log("responseeedissss", data)
        console.log("dataaaaaadisss", data.shopifyErrors?.[0]?.message || "No Shopify errors");

        // console.log("resssssssssssssssssssssssshipp",response)
        if (data.shopifyErrors && data.shopifyErrors.length > 0) {
          return sendResponse(statusCode.BAD_REQUEST, false, data.shopifyErrors[0]?.message || "Failed to create discount");
        }
        // if (data?.data?.discountAutomaticBxgyCreate?.automaticDiscountNode?.id) {  return sendResponse(statusCode.OK, successMessage.DISCOUNT_CREATED,true, response?.message || "Discount created successfully", response?.data); }


        // if(data.message=='Discount code created successfully'){
        return sendResponse(statusCode.OK, successMessage.DISCOUNT_CREATED, true, response?.message || "Discount created successfully", response?.data);


      } catch (error) {
        console.error("Error in BuyXgetYdiscount action:", error);
        return sendResponse(statusCode.INTERNAL_SERVER_ERROR, errorMessage.INTERNAL_SERVER_ERROR, false, "Internal server error");
      }
    }
  }
  if (type == "freeShipping") {
    console.log("shipppppppppppppppp");
    if (request.method === "POST") {
      console.log("bjhnbdhcuuuuuuuuuuuuuuuuuuuuuuu")
      try {
        const { admin } = await authenticate.admin(request);
        const { variables } = await request.json();
        const response = await createFreeShippingDiscount(variables, admin);
        const data = await response.json();
        console.log("responseeeee", data)
        // console.log("dataaaaaaa",data.shopifyErrors[0].message)
        // console.log("resssssssssssssssssssssss",response)
        if (data.error || data.shopifyErrors && data.shopifyErrors.length > 0) {
          return sendResponse(statusCode.BAD_REQUEST, false, data.shopifyErrors[0]?.message || "Failed to create discount");
        }

        return sendResponse(statusCode.OK, successMessage.DISCOUNT_CREATED, true, response?.message || "Discount created successfully", response?.data);


      } catch (error) {
        console.error("Error in BuyXgetYdiscount action:", error);
        return sendResponse(statusCode.INTERNAL_SERVER_ERROR, errorMessage.INTERNAL_SERVER_ERROR, false, "Internal server error");
      }
    }
  }
  if (type == "LineItemDiscount") {
    if (request.method === "POST") {
      console.log("bjhnbdhcuuuuuuuuuuuuuuuuuuuuuuu")
      try {
        const { admin } = await authenticate.admin(request);
        const { orderId, description, amount } = await request.json();
        const response = await createLineItemdiscount(orderId, description, amount, admin);
        const data = await response.json();
        console.log("responseeelineitem", data)
        console.log("dataaaaalineitem", data.shopifyErrors?.[0]?.message || "No Shopify errors");
        // console.log("ressssssssssssssssssssssbuyxgety",response)
        if (data.shopifyErrors && data.shopifyErrors.length > 0) {
          return sendResponse(statusCode.BAD_REQUEST, false, data.shopifyErrors[0]?.message || "Failed to create discount");
        }


        return sendResponse(statusCode.OK, successMessage.DISCOUNT_CREATED, true, response?.message || "Discount created successfully", response?.data);


      } catch (error) {
        console.error("Error in BuyXgetYdiscount action:", error);
        return sendResponse(statusCode.INTERNAL_SERVER_ERROR, errorMessage.INTERNAL_SERVER_ERROR, false, "Internal server error");
      }
    }
  }


  return sendResponse(statusCode.METHOD_NOT_ALLOWED, false, "Method not allowed");
};

// export const action = async ({ request }) => {
//   if (request.method === "POST") {
//     try {
//       const { variables } = await request.json();
//       console.log("Creating BXGY discount...", variables);

//       const { admin } = await authenticate.admin(request);
//       const response = await admin.graphql(
//         `#graphql
//         mutation CreateBxgyDiscount($automaticBxgyDiscount: DiscountAutomaticBxgyInput!) {
//           discountAutomaticBxgyCreate(automaticBxgyDiscount: $automaticBxgyDiscount) {
//             automaticDiscountNode {
//               id
//               automaticDiscount {
//                 ... on DiscountAutomaticBxgy {
//                   title
//                   startsAt
//                   endsAt
//                 }
//               }
//             }
//             userErrors {
//               field
//               message
//             }
//           }
//         }`,
//         { variables }
//       );

//       const data = await response.json();
//       console.log("BXGY Discount response:", data);

//       if (data.data?.discountAutomaticBxgyCreate?.userErrors?.length > 0) {
//         console.error("Shopify BXGY creation error:", data.data.discountAutomaticBxgyCreate.userErrors);
//         return new Response(
//           JSON.stringify({
//             error: "Failed to create BXGY discount",
//             details: data.data.discountAutomaticBxgyCreate.userErrors
//           }),
//           { status: 400, headers: { "Content-Type": "application/json" } }
//         );
//       }

//       return new Response(
//         JSON.stringify({
//           message: "BXGY discount created successfully",
//           discount: data.data.discountAutomaticBxgyCreate.automaticDiscountNode
//         }),
//         { status: 200, headers: { "Content-Type": "application/json" } }
//       );
//     } catch (error) {
//       console.error("Error creating BXGY discount:", error);
//       return new Response(
//         JSON.stringify({ error: "Failed to create BXGY discount" }),
//         { status: 500, headers: { "Content-Type": "application/json" } }
//       );
//     }
//   }
// };
