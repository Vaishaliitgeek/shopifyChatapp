import { authenticate } from "../../shopify.server";
export const loader = async ({ request }) => {
  try {
    const { admin } = await authenticate.admin(request);

    const url = new URL(request.url);
    const orderId = url.searchParams.get("orderId");
  console.log("orderId backend",orderId);
    if (!orderId) {
      return json({ error: "Missing orderId parameter" }, { status: 400 });
    }

    const response = await admin.graphql(`
      query {
  order(id: "${orderId}") {
    id
    name
    createdAt
    updatedAt
    displayFulfillmentStatus
    displayFinancialStatus

    totalPriceSet {
      shopMoney {
        amount
        currencyCode
      }
    }
    customer {
      id
      firstName
      lastName
      email
    }
    lineItems(first: 5) {
      edges {
        node {
          id
          title
          quantity
          variant {
            id
            title
            sku
            price
            image {
              url
              altText
            }
            product {
              id
              title
              vendor
              featuredImage {
                url
                altText
              }
            }
          }
        }
      }
    }
  }
}

    `);

    const data = await response.json();

    return Response.json(data);
  } catch (error) {
    console.error("Error fetching order:", error);
    return Response.json({ error: "Failed to fetch order" }, { status: 500 });
  }
};
