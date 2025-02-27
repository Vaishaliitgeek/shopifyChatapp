import React, { useEffect, useState } from "react";
import { Page, Card, DataTable, Text, Button } from "@shopify/polaris";
import { useNavigate } from "react-router-dom";

const OrderList = () => {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate(); 

  const fetchOrders = async () => {
  try {
    const response = await fetch("/api/orders");
    const result = await response.json();
    console.log("Fetched Orders:", result); 

    if (result.error) {
      setError(result.error);
      setLoading(false);
      return;
    }

    const orderList =
    result?.data?.orders?.edges?.map(order => ({
      ...order.node,
      totalItems: order.node.lineItems?.edges?.reduce(
        (total, item) => total + item.node.quantity,
        0
      ) || 0, 
    })) || [];
  
    console.log("Processed Orders:", orderList);
    
    setOrders(orderList);
    setLoading(false);
  } catch (error) {
    console.error("Error fetching orders:", error);
    setError("Failed to fetch orders.");
    setLoading(false);
  }
};

  
  const updateOrder = async (orderId, variantId, quantity) => {
    try {
      const response = await fetch("/api/update-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId, variantId, quantity }),
      });
  
      const result = await response.json();
      if (result.error) {
        console.error("Order update failed:", result.error);
        alert("Failed to update order!");
      } else {
        console.log("Order updated:", result);
        alert("Product added to order successfully!");
      }
    } catch (error) {
      console.error("Error updating order:", error);
    }
  };
  
  <button onClick={() => updateOrder("gid://shopify/Order/5941694267613", "gid://shopify/ProductVariant/1234567890", 1)}>
    Add Product to Order
  </button>;
  // const handleNaviate = (orderId) => {
  //   console.log('orderId navigate', orderId);
  //   navigate("/app/dbProduct", { state: { orderId } });
  // }

  const getOrderDetail = async (orderId) => {
    navigate("/app/orderDetail", { state: { orderId } });
    // try {
    //   const response = await fetch(`/api/orderdetail?orderId=${orderId}`);
  
    //   if (!response.ok) {
    //     throw new Error("Failed to fetch order details");
    //   }
  
    //   const data = await response.json();
    //   console.log("Order Details:", data);
  
    //   // navigate("/app/orderDetail");
    // } catch (error) {
    //   console.error("Error fetching order details:", error);
    // }
  };
  
  useEffect(() => {
    fetchOrders();
  }, []);

  const rows = orders.map((order) => [
    // order.id.split("/").pop(),
    order.name,
    order.customer?.firstName || "Guest", 
    `${order.totalPriceSet?.shopMoney?.amount} ${order.totalPriceSet?.shopMoney?.currencyCode}`, 
    order.totalItems, 
    new Date(order.createdAt).toLocaleString(), 
    order.displayFulfillmentStatus, 
    order.displayFinancialStatus, 
    // <Button onClick={()=>handleNaviate(order.id)}>Update</Button>,
    <Button onClick={()=>getOrderDetail(order.id)}>Get Detail</Button>

  ]);

  return (
    <Page title="Orders">
      <Card>
        {loading ? (
          <Text as="span" variant="bodyMd" tone="subdued">
            Loading orders...
          </Text>
        ) : error ? (
          <Text as="span" variant="bodyMd" tone="critical">
            {error}
          </Text>
        ) : (
          <DataTable
            columnContentTypes={[
              "text",
              "text",
              "text",
              "numeric",
              "text",
              "text",
              "text",
              "text",
              
            ]}
            headings={[
              "Order ID",
              "Customer",
              "Total Price",
              "Items",
              "Created At",
              "Fulfillment Status",
              "Payment Status",
              
              "Get Order Detail"
            ]}
            rows={rows}
          />
        )}
      </Card>
    </Page>
  );
};

export default OrderList;
