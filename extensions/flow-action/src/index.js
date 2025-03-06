export default async function (request, context) {
  try {
    const body = await request.json();
    console.log("Received Flow Action Request:", body);

    return new Response(JSON.stringify({ success: true, message: "Flow action executed successfully!" }), {
      headers: { "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error("Flow Action Error:", error);
    return new Response(JSON.stringify({ error: "Failed to execute Flow action" }), {
      headers: { "Content-Type": "application/json" },
      status: 500,
    });
  }
}
// runtime_url = "https://detective-pets-illustrated-threshold.trycloudflare.com/api/floww"

//  runtime_url = "https://url.com/api/execute"