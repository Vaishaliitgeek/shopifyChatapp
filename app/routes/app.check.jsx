import { authenticate } from "../shopify.server";

export async function loader({ request }) {
  try {
    const session = await authenticate.admin(request);

    if (session?.admin?.rest?.session?.shop) {
      console.log("Shop Found in Session:", session.admin.rest.session.shop);
    } else {
      console.error("Shopify Admin Authentication Failed. No shop found in session.");
    }

    if (!session?.admin?.rest?.session?.shop) {
      console.error("Shopify Admin Authentication Failed. No shop found in session:", session);
      return new Response("Unauthorized - Shop not found", { status: 401 });
    }

    return new Response(JSON.stringify({ shop: session.admin.rest.session.shop }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error during Shopify Admin Authentication:", error);
    return new Response("Error during authentication", { status: 500 });
  }
}
