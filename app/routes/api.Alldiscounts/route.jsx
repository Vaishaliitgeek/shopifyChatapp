import { authenticate } from "../../shopify.server";
import { createBuyXgetYdiscount } from "../../server/services/BuyXgetY.service";
// import { createAmountoffDiscount } from "../../services/amountOff.service.js";
import { createAmountoffDiscount } from "../../server/services/Amountoff.service";
import { createLineItemdiscount } from "../../server/services/LineItemDiscount.service";
import { createFreeShippingDiscount } from "../../server/services/FreeShipping.service";

import { sendResponse } from "../../server/utils/sendResponse";
import { statusCode } from '../../server/constants/constant';
import { errorMessage, successMessage } from '../../server/constants/message';




export const loader = async ({ request }) => {
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
  const url = new URL(request.url);
  const type = url.searchParams.get("type");

  if (type == "BuyXGetY") {
    if (request.method === "POST") {
      try {
        const { admin } = await authenticate.admin(request);
        const { variables } = await request.json();
        const response = await createBuyXgetYdiscount(variables, admin);
        const data = await response.json();
        console.log("responseeebuyxgety", data)
        console.log("dataaaaaadisss", data.shopifyErrors?.[0]?.message || "No Shopify errors");
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
  if (type === "discount") {
    if (request.method === "POST") {
      try {
        const { admin } = await authenticate.admin(request);
        const { variables } = await request.json();
  
        const response = await createAmountoffDiscount (variables, admin);
        console.log("Discount API Response:", response);
  
        if (!response.status) {
          return sendResponse(
            statusCode.BAD_REQUEST,
            false,
            response.message ,
            response.errors || []
          );
        }
  
        return sendResponse(
          statusCode.OK,
          true,
          response.message || "Discount created successfully",
          response.data || {}
        );
  
      } catch (error) {
        console.error("Error in BuyXGetY discount action:", error);
        return sendResponse(
          statusCode.INTERNAL_SERVER_ERROR,
          false,
          "Internal server error",
          error.message
        );
      }
    }
  }
  
  if (type == "freeShipping") {
    if (request.method === "POST") {
      try {
        const { admin } = await authenticate.admin(request);
        const { variables } = await request.json();
        const response = await createFreeShippingDiscount(variables, admin);
        const data = await response.json();
        console.log("responseeeee", data)
       
        if (!response.status) {
          return sendResponse(
            statusCode.BAD_REQUEST,
            false,
            response.message || "Failed to create discount",
            response.errors || []
          );
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
      try {
        const { admin } = await authenticate.admin(request);
        const { orderId, description, amount } = await request.json();
        const response = await createLineItemdiscount(orderId, description, amount, admin);
        const data = await response.json();
        console.log("responseeelineitem", data)
        console.log("dataaaaalineitem", data.shopifyErrors?.[0]?.message || "No Shopify errors");
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

