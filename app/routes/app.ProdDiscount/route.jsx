import React, { useState } from "react";
import { Card, Page, Layout, TextField, Button, Banner } from "@shopify/polaris";

const ApplyDiscount = () => {
  const [orderId, setOrderId] = useState("gid://shopify/Order/6016885457117");
  // const [lineItemId, setLineItemId] = useState("gid://shopify/LineItem/14569238233309");
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [quantity, setQuantity] = useState(""); // Added Quantity
  const [responseMessage, setResponseMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const applyDiscount = async () => {
    if (!orderId || !lineItemId || !description || !amount || !quantity) {
      setResponseMessage(" Please fill all fields.");
      return;
    }

    setResponseMessage("");
    setLoading(true);

    try {
      const res = await fetch("/api/Alldiscounts?type=LineItemDiscount", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId, description, amount, quantity }),
      });

      const data = await res.json();
      if (res.ok) {
        setResponseMessage(`Success: Discount applied!`);
      } else {
        setResponseMessage(`Error: ${data.error}`);
      }
    } catch (error) {
      setResponseMessage("Request failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Page title="Apply Discount">
      <Layout>
        <Layout.Section>
          <Card sectioned>
            <TextField label="Order ID" value={orderId} onChange={setOrderId} autoComplete="off" placeholder="Enter Order ID" />
            {/* <TextField label="Line Item ID" value={lineItemId} onChange={setLineItemId} autoComplete="off" placeholder="Enter Line Item ID" /> */}
            <TextField label="Quantity" value={quantity} onChange={setQuantity} autoComplete="off" type="number" placeholder="Enter Quantity" /> {/* Added */}
            <TextField label="Discount Description" value={description} onChange={setDescription} autoComplete="off" placeholder="Enter Discount Description" />
            <TextField label="Discount Amount" value={amount} onChange={setAmount} autoComplete="off" type="number" placeholder="Enter Discount Amount" />
            <Button primary fullWidth onClick={applyDiscount} loading={loading}>
              Apply Discount
            </Button>
            {responseMessage && (
              <Banner status={responseMessage.startsWith("✅") ? "success" : "critical"}>
                {responseMessage}
              </Banner>
            )}
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
};

export default ApplyDiscount;
