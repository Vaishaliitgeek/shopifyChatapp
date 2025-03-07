import React, { useState } from "react";
import { Page, Card, Form, FormLayout, TextField, Button, Toast, Frame } from "@shopify/polaris";

const GiftCard = () => {
  const [formData, setFormData] = useState({
    amount: "100.0",
    customerId: "gid://shopify/Customer/6743687102541",
    message: "Happy Birthday!",
    preferredName: "Dad",
    sendNotificationAt: "2025-04-01T12:00:00Z",
    recepientId: "gid://shopify/Customer/6743687102541",
  });

  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState(null);
  const [toastActive, setToastActive] = useState(false);

  const handleChange = (value, name) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async () => {
    setLoading(true);

    const input = {
      initialValue: formData.amount,
      customerId: formData.customerId,
      recipientAttributes: {
        id: formData.recepientId,
        message: formData.message,
        preferredName: formData.preferredName,
        sendNotificationAt: formData.sendNotificationAt,
      },
    };

    try {
      const res = await fetch("/api/giftCard", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ input }),
      });

      const data = await res.json();
      setResponse(data);
      setToastActive(true);
    } catch (error) {
      console.error("Error:", error);
      setResponse({ error: "Failed to create gift card" });
    }

    setLoading(false);
  };

  return (
    <Frame>
    <Page title="🎁 Create a Gift Card">
      <Card sectioned>
        <Form onSubmit={handleSubmit}>
          <FormLayout>
            <TextField
              label="Amount ($)"
              type="text"
              value={formData.amount}
              onChange={(value) => handleChange(value, "amount")}
              requiredIndicator
              disabled={loading}
            />

            <TextField
              label="Customer ID"
              type="text"
              value={formData.customerId}
              onChange={(value) => handleChange(value, "customerId")}
              requiredIndicator
              disabled={loading}
            />

            <TextField
              label="Recipient ID"
              type="text"
              value={formData.recepientId}
              onChange={(value) => handleChange(value, "recepientId")}
              requiredIndicator
              disabled={loading}
            />

            <TextField
              label="Message"
              type="text"
              value={formData.message}
              onChange={(value) => handleChange(value, "message")}
              requiredIndicator
              disabled={loading}
            />

            <TextField
              label="Preferred Name"
              type="text"
              value={formData.preferredName}
              onChange={(value) => handleChange(value, "preferredName")}
              requiredIndicator
              disabled={loading}
            />

            <TextField
              label="Send Notification At"
              type="datetime-local"
              value={formData.sendNotificationAt}
              onChange={(value) => handleChange(value, "sendNotificationAt")}
              requiredIndicator
              disabled={loading}
            />
  
            <Button primary submit loading={loading}>
              {loading ? "Processing..." : "Create Gift Card"}
            </Button>
          </FormLayout>
        </Form>
      </Card>

      {response && (
        <Card title="📩 Response" sectioned>
          <pre style={{ background: "#f4f6f8", padding: "10px", borderRadius: "5px", overflowX: "auto" }}>
            {JSON.stringify(response, null, 2)}
          </pre>
        </Card>
      )}

      {toastActive && <Toast content="Gift Card Created Successfully!" onDismiss={() => setToastActive(false)} />}
    </Page>
    </Frame>
  );
};

export default GiftCard;

