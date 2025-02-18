import { authenticate } from "../shopify.server"; // Ensure correct import

export async function loader({ request }) {
  try {
    // Authenticate the session using the custom authenticate logic
    const session = await authenticate.admin(request);
    
    // Safely log the shop from the session
    if (session?.admin?.rest?.session?.shop) {
      console.log("Shop Found in Session:", session.admin.rest.session.shop);
    } else {
      console.error("Shopify Admin Authentication Failed. No shop found in session.");
    }

    // Check if session and shop exist within the session object
    if (!session?.admin?.rest?.session?.shop) {
      console.error("Shopify Admin Authentication Failed. No shop found in session:", session);
      return new Response("Unauthorized - Shop not found", { status: 401 });
    }

    // Return the response with the shop name if the session is valid
    return new Response(JSON.stringify({ shop: session.admin.rest.session.shop }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error during Shopify Admin Authentication:", error);  // Log any errors during the process
    return new Response("Error during authentication", { status: 500 });
  }
}
