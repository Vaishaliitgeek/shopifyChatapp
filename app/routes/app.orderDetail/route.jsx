import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "@remix-run/react";
import {
  Page,
  Card,
  ResourceList,
  ResourceItem,
  Spinner,
  Text,
  Thumbnail,
  Button
} from "@shopify/polaris";

const OrderDetail = () => {
  const location = useLocation();
  const { orderId } = location.state || {};
const navigate =useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  console.log("orderdetail", orderId);

  const getOrderDetail = async (orderId) => {
    try {
      const response = await fetch(`/api/orderdetail?orderId=${orderId}`);

      if (!response.ok) {
        throw new Error("Failed to fetch order details");
      }

      const data = await response.json();
      console.log("response", data);
      setOrder(data.data.order);
    } catch (error) {
      console.error("Error fetching order details:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (orderId) {
      getOrderDetail(orderId);
    }
  }, [orderId]);

  if (loading) {
    return (
      <Page title="Order Details">
        <Card sectioned>
          <Spinner size="large" />
        </Card>
      </Page>
    );
  }

  if (!order) {
    return (
      <Page title="Order Details">
        <Card sectioned>
          <p>No order details found.</p>
        </Card>
      </Page>
    );
  }
  const handleNaviate = (orderId) => {
    console.log('orderId navigate', orderId);
    navigate("/app/dbProduct", { state: { orderId } });
  }

  return (
    <Page title={`Order ${order.name}`}>

      <Card sectioned>
        <p style={{ display: "flex", justifyContent: "space-between" }}>
          <span><Text variation="bold">Order ID:</Text> {order.id}</span>
          <Button  onClick={()=>handleNaviate(orderId)} >Add Product</Button>
        </p>
        <p>
          <Text variation="strong">Customer:</Text> {order.customer?.firstName}{" "}
          {order.customer?.lastName} ({order.customer?.email})
        </p>
        <p>
          <Text variation="strong">Status:</Text> {order.displayFulfillmentStatus}
        </p>
        <p>
          <Text variation="strong">Total Price:</Text> {order.totalPriceSet.shopMoney.amount}{" "}
          {order.totalPriceSet.shopMoney.currencyCode}
        </p>
      </Card>

      <Card title="Products in Order">
        <ResourceList
          resourceName={{ singular: "product", plural: "products" }}
          items={order.lineItems.edges}
          renderItem={({ node }) => {
            const { id, title, quantity, variant } = node;
            const productImage = variant?.image?.url || variant?.product?.featuredImage?.url;

            return (
              <ResourceItem id={id} accessibilityLabel={`View details for ${title}`}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  {productImage && (
                    <Thumbnail source={productImage} alt={title} size="large" />
                  )}
                  <div>
                    <h3>
                    <Text variant="headingMd">{title}</Text>
                    </h3>
                    <p>
                      <Text variation="subdued">Variant:</Text> {variant?.title}
                    </p>
                    <p>
                      <Text variation="subdued">Quantity:</Text> {quantity}
                    </p>
                    <p>
                      <Text variation="subdued">Price:</Text> ${variant?.price}
                    </p>
                  </div>
                </div>
              </ResourceItem>
            );
          }}
        />
      </Card>
    </Page>
  );
};

export default OrderDetail;

