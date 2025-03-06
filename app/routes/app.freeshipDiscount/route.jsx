import React, { useState } from "react";
import { Page, Card, Form, FormLayout, TextField, Button, Toast, Frame } from "@shopify/polaris";
import { useNavigate } from "react-router-dom";

const Route = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "FreeShipping",
    code: "FreeShipping2",
    startsAt: "",
    endsAt: "",
    minimumSubtotal: "20.0",
  });

  const [loading, setLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);
  const [errors, setErrors] = useState({}); // Error state

  const handleChange = (value, name) => {
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: "" }); 
  };

  const handleSubmit = async () => {
    let newErrors = {};

    if (!formData.startsAt.trim()) {
      newErrors.startsAt = "Start Date is required";
    }
    if (!formData.code.trim()) {
      newErrors.code = "Discount Code is required";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setToastMessage("Error: Please fix the required fields.");
      return;
    }

    setLoading(true);

    const variables = {
      freeShippingCodeDiscount: {
        title: formData.title,
        code: formData.code,
        startsAt: formData.startsAt, 
        appliesOncePerCustomer: false,
        minimumRequirement: {
          subtotal: { greaterThanOrEqualToSubtotal: parseFloat(formData.minimumSubtotal) },
        },
        customerSelection: { all: true },
        destination: { all: true },
        ...(formData.endsAt.trim() !== "" && { endsAt: formData.endsAt }),
      },
    };
// /api/BuyXGetY?type=BuyXGetY`
    try {
      const res = await fetch(`/api/Alldiscounts?type=freeShipping`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ variables }),
      });

      const data = await res.json();
      console.log("responseeeee",data)
      // console.log("dataaaaaaa",data.shopifyErrors[0].message)

      if (data.status && !data.error) {
        setToastMessage("Discount Code Created Successfully!");
      } else {
        setToastMessage(data.message || "Failed to create discount");
      }
      
    } catch (error) {
      console.error("Error:", error);
      setToastMessage("Failed to create discount");
    }

    setLoading(false);
  };

  return (
    <Frame>
      <Page title="Create Free Shipping Discount">
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
                label="Discount Code"
                value={formData.code}
                onChange={(value) => handleChange(value, "code")}
                requiredIndicator
                error={errors.code} 
              />
              <TextField
                label="Starts At"
                type="datetime-local"
                value={formData.startsAt}
                onChange={(value) => handleChange(value, "startsAt")}
                requiredIndicator
                error={errors.startsAt} 
              />
              <TextField
                label="Ends At"
                type="datetime-local"
                value={formData.endsAt}
                onChange={(value) => handleChange(value, "endsAt")}
              />
              {/* <TextField
                label="Minimum Subtotal ($)"
                type="number"
                value={formData.minimumSubtotal}
                onChange={(value) => handleChange(value, "minimumSubtotal")}
                requiredIndicator
              /> */}

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

