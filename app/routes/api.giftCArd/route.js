import { authenticate } from "../../shopify.server";

export const action = async ({ request }) => {
  if (request.method === "POST") {
    try {
      const { input } = await request.json();
      console.log("Creating gift card...", input);

      const { admin } = await authenticate.admin(request); 
      const response = await admin.graphql(
        `#graphql
        mutation CreateGiftCard($input: GiftCardCreateInput!) {
          giftCardCreate(input: $input) {
            giftCard {
              id
               lastCharacters
              initialValue {
                amount
                currencyCode
              }
                
              balance {
                amount
                currencyCode
              }
              expiresOn
              createdAt
            }
            userErrors {
              field
              message
            }
          }
        }`,
        { variables: { input } }
      );

      const data = await response.json();
      console.log("Gift card create response:", data);

      if (data.data?.giftCardCreate?.userErrors?.length > 0) {
        console.error("Shopify gift card creation error:", data.data.giftCardCreate.userErrors);
        return new Response(
          JSON.stringify({
            error: "Failed to create gift card",
            details: data.data.giftCardCreate.userErrors
          }),
          { status: 400, headers: { "Content-Type": "application/json" } }
        );
      }

      return new Response(
        JSON.stringify({
          message: "Gift card created successfully",
          giftCard: data.data.giftCardCreate.giftCard
        }),
        { status: 200, headers: { "Content-Type": "application/json" } }
      );
    } catch (error) {
      console.error("Error creating gift card:", error);
      return new Response(
        JSON.stringify({ error: "Failed to create gift card" }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }
  }
};
