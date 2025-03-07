import React, { useState } from "react";
import { Page, Card, Form, FormLayout, TextField, Button, Toast, Frame } from "@shopify/polaris";

const DiscountCodeForm = () => {
  const [formData, setFormData] = useState({
    title: "20% off selected items",
    code: "10FORYOUU",
    startsAt: "",
    endsAt: "",
    customerId: "gid://shopify/Customer/7863943463133",
    percentage: "3",
    minimumSubtotal: "50.0",
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
      newErrors.startsAt = "Starts At is required";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setToastMessage("Error: Please fix the required fields.");
      return;
    }

    setLoading(true);

    const variables = {
      basicCodeDiscount: {
        title: formData.title,
        code: formData.code,
        startsAt: formData.startsAt, 
        customerSelection: {
          customers: { add: [formData.customerId] },
        },
        customerGets: {
          value: { percentage: formData.percentage / 100 },
          items: { all: true },
        },
        minimumRequirement: {
          subtotal: { greaterThanOrEqualToSubtotal: formData.minimumSubtotal },
        },
        usageLimit: 100,
        appliesOncePerCustomer: true,
        ...(formData.endsAt.trim() !== "" && { endsAt: formData.endsAt }) 
      },
    };


    try {
      const res = await fetch(`/api/Alldiscounts?type=discount`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ variables }),
      });

      const data = await res.json();
      console.log("dataaaaaa",data)

      if (data.status && !data.error) {
        setToastMessage("Discount Code Created Successfully!");
      } else {
        console.log(data?.result[0]?.message)
        setToastMessage(data?.result[0]?.message|| "Failed to create discount");
      }
    } catch (error) {
      console.error("Error:", error);
      setToastMessage("Failed to create discount code");
    }
    finally{
      setLoading(false);
    }

    // setLoading(false);
  };

  return (
    <Frame>
      <Page title="Create a Discount Code">
        <Card sectioned>
          <Form onSubmit={handleSubmit}>
            <FormLayout>
              <TextField
                label="Title"
                value={formData.title}
                onChange={(value) => handleChange(value, "title")}
                requiredIndicator
                disabled={loading}
              />
              <TextField
                label="Code"
                value={formData.code}
                onChange={(value) => handleChange(value, "code")}
                requiredIndicator
                disabled={loading}
              />
              <TextField
                label="Starts At"
                type="datetime-local"
                value={formData.startsAt}
                onChange={(value) => handleChange(value, "startsAt")}
                requiredIndicator
                error={errors.startsAt} 
                disabled={loading}
              />
              <TextField
                label="Ends At"
                type="datetime-local"
                value={formData.endsAt}
                onChange={(value) => handleChange(value, "endsAt")}
                disabled={loading}
              />
              <TextField
                label="Discount Percentage"
                type="number"
                value={formData.percentage}
                onChange={(value) => handleChange(value, "percentage")}
                requiredIndicator
                disabled={loading}
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

export default DiscountCodeForm;





// discount on line item

// mutation orderEditAddLineItemDiscount(
//   $discount: OrderEditAppliedDiscountInput!,
//   $id: ID!,
//   $lineItemId: ID!
// ) {
//   orderEditAddLineItemDiscount(discount: $discount, id: $id, lineItemId: $lineItemId) {
//     addedDiscountStagedChange {
//       id
//     }
//     calculatedLineItem {
//       id
//       calculatedDiscountAllocations {
//         allocatedAmountSet {
//           presentmentMoney {
//             amount
//             currencyCode
//           }
//         }
//       }
//     }
//     calculatedOrder {
//       id
//       totalPriceSet {
//         presentmentMoney {
//           amount
//           currencyCode
//         }
//       }
//     }
//     userErrors {
//       field
//       message
//     }
//   }
// }
// {
//   "discount": {
//     "description": "Special Discount2",
//     "fixedValue": {
//       "amount": "40.00",
//       "currencyCode": "AED"
//     }
//   },
//   "id": "gid://shopify/CalculatedOrder/114604114141",
//   "lineItemId": "gid://shopify/CalculatedLineItem/7ace85af-14f6-4e18-9107-782166cd4380"
// }
