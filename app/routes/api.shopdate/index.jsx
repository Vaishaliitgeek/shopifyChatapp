import { unauthenticated } from "../../shopify.server";
import { json } from "@remix-run/node";

export const loader = async ({ request }) => {
  console.log("------------------runnnnn")
  const url = new URL(request.url);
  const shop = url.searchParams.get("shop"); 

  if (!shop) {
    return json({ error: "Shop parameter is missing" }, { status: 400 });
  }

  try {
    const { session,admin} = await unauthenticated.admin(shop);
    
console.log("Session",session)
console.log("Admin",admin)

    const shopDataResponse = await admin.rest.resources.Shop.all({ session });

    if (!shopDataResponse?.data?.length) {
      return json({ error: "Failed to fetch shop data" }, { status: 500 });
    }

    const shopData = shopDataResponse.data[0];
    console.log("shopData--", shopData);

    return json({ shopData });
  } catch (error) {
    console.error("Error fetching shop data:", error);
    return json({ error: "Internal server error" }, { status: 500 });
  }
};
export const action=async({request})=>{

  const url = new URL(request.url);
  const shop = url.searchParams.get("shop"); 
  const { session,admin} = await unauthenticated.admin(shop);
  const response = await admin.graphql(`
    #graphql
      query {
        orders(reverse: true, first:1) {
          
          pageInfo {
            hasNextPage
          }
          edges {
          node{
            id
          }
            cursor
          }
        }
      }
    `,
)

const data = await response.json();
const orderId = data?.data?.orders?.edges[0]?.node?.id;
return {
status: true,
data: orderId
};
}