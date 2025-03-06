import React, { useState } from "react";
import { Page, Card, Form, FormLayout, TextField, Button, Toast, Frame } from "@shopify/polaris";
import { useNavigate } from "react-router-dom";

const Route = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "Buy first product, get second product free",
    startsAt: "",
    endsAt: "",
    buyProductId: "gid://shopify/Product/8921139970269",
    buyQuantity: "1",
    getProductId: "gid://shopify/Product/8921135546589",
    getQuantity: "1",
    discountPercentage: "100",
    usesPerOrderLimit: "1",
  });

  const [loading, setLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);
  const [errors, setErrors] = useState({}); 

  const handleChange = (value, name) => {
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: "" }); 
  };

  const handleSubmit = async () => {
    let newErrors = {};

    if (!formData.startsAt.trim()) {
      newErrors.startsAt = "Start Date is required";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setToastMessage("Error: Please fix the required fields.");
      return;
    }

    setLoading(true);

    const variables = {
      automaticBxgyDiscount: {
        title: formData.title,
        startsAt: formData.startsAt,
        customerBuys: {
          items: {
            products: { productsToAdd: [formData.buyProductId] },
          },
          value: { quantity: formData.buyQuantity },
        },
        customerGets: {
          items: {
            products: { productsToAdd: [formData.getProductId] },
          },
          value: {
            discountOnQuantity: {
              quantity: formData.getQuantity,
              effect: { percentage: parseFloat(formData.discountPercentage) / 100 },
            },
          },
        },
        usesPerOrderLimit: formData.usesPerOrderLimit,
        ...(formData.endsAt.trim() !== "" && { endsAt: formData.endsAt }), // Only include endsAt if not empty
      },
    };
    // orderdetail?orderId=${orderId}

    try {
      const res = await fetch(`/api/BuyXGetY?type=BuyXGetY`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ variables }),
      });

      const data = await res.json();
      console.log("dataa",data)
      console.log("resss",res)

      if (data.result=="Discount created successfully" && !data.error) {
        setToastMessage("Discount Code Created Successfully!");
      } else {
        setToastMessage(data.message|| "Failed to create discount");
      }
    } catch (error) {
      console.error("Error:", error);
      setToastMessage("Failed to create BXGY discount");
    }

    setLoading(false);
  };

  return (
    <Frame>
      <Page title="Create BXGY Discount">
        <Card sectioned>
          <Form onSubmit={handleSubmit}>
            <FormLayout>
              <TextField
                label="Title"
                value={formData.title}
                onChange={(value) => handleChange(value, "title")}
                requiredIndicator
              />
              <TextField
                label="Starts At"
                type="datetime-local"
                value={formData.startsAt}
                onChange={(value) => handleChange(value, "startsAt")}
                requiredIndicator
                error={errors.startsAt} // Show error if empty
              />
              <TextField
                label="Ends At"
                type="datetime-local"
                value={formData.endsAt}
                onChange={(value) => handleChange(value, "endsAt")}
              />
              <TextField
                label="Buy Product ID"
                value={formData.buyProductId}
                onChange={(value) => handleChange(value, "buyProductId")}
                requiredIndicator
              />
              <TextField
                label="Buy Quantity"
                type="number"
                value={formData.buyQuantity}
                onChange={(value) => handleChange(value, "buyQuantity")}
                requiredIndicator
              />
              <TextField
                label="Get Product ID"
                value={formData.getProductId}
                onChange={(value) => handleChange(value, "getProductId")}
                requiredIndicator
              />
              <TextField
                label="Get Quantity"
                type="number"
                value={formData.getQuantity}
                onChange={(value) => handleChange(value, "getQuantity")}
                requiredIndicator
              />
              <Button primary submit loading={loading}>
                {loading ? "Processing..." : "Create Discount"}
              </Button>
            </FormLayout>
          </Form>
        </Card>

        {toastMessage && <Toast content={toastMessage} onDismiss={() => setToastMessage(null)} />}
      </Page>
    </Frame>
  );
};

export default Route;
