import { authenticate } from "../../shopify.server";

export async function loader({ request }) {
  const orderId = 'gid://shopify/Order/6463052480795';

  try {
    const { admin } = await authenticate.admin(request);

    // 1. Fetch active automatic discounts
    const discountRes = await admin.graphql(`#graphql
      query {
        discountNodes(first: 50) {
          nodes {
            id
            discount {
              __typename
              ... on DiscountAutomaticBasic {
                title
                startsAt
                endsAt
                status
                customerGets {
                  value {
                    ... on DiscountPercentage {
                      percentage
                    }
                  }
                }
                minimumRequirement {
                  ... on DiscountMinimumQuantity {
                    greaterThanOrEqualToQuantity
                  }
                }
              }
            }
          }
        }
      }
    `);
    const discountData = await discountRes.json();
    console.log("----discountData",discountData)
    const quantityDiscount = discountData.data.discountNodes.nodes.find((node) => {
      return node.discount.__typename === 'DiscountAutomaticBasic' &&
        node.discount.minimumRequirement?.greaterThanOrEqualToQuantity;
    });

    if (!quantityDiscount) {
      return Response.json({ message: "No quantity-based discount found." });
    }

    const requiredQty = quantityDiscount.discount.minimumRequirement.greaterThanOrEqualToQuantity;
    const discountPercent = quantityDiscount.discount.customerGets.value.percentage;

    // 2. Begin order edit session
    const beginEditRes = await admin.graphql(`#graphql
      mutation orderEditBegin($id: ID!) {
        orderEditBegin(id: $id) {
          calculatedOrder {
            id
            lineItems(first: 10) {
              nodes {
                id
                quantity
              }
            }
          }
          userErrors {
            field
            message
          }
        }
      }
    `, { variables: { id: orderId } });

    const beginData = await beginEditRes.json();
    const calculatedOrder = beginData.data?.orderEditBegin?.calculatedOrder;
    if (!calculatedOrder) {
      return Response.json({ error: "Failed to begin order edit", details: beginData.data?.orderEditBegin?.userErrors }, { status: 400 });
    }

    // 3. Apply discount manually if eligible
    for (const item of calculatedOrder.lineItems.nodes) {
      if (item.quantity >= requiredQty) {
        const discountApplyRes = await admin.graphql(`#graphql
          mutation orderEditAddLineItemDiscount($id: ID!, $lineItemId: ID!, $discount: OrderEditAppliedDiscountInput!) {
            orderEditAddLineItemDiscount(id: $id, lineItemId: $lineItemId, discount: $discount) {
              calculatedOrder { id }
              userErrors { field message }
            }
          }
        `, {
          variables: {
            id: calculatedOrder.id,
            lineItemId: item.id,
            discount: {
              description: `${discountPercent * 100}% off for quantity >= ${requiredQty}`,
              percentageValue: discountPercent
            }
          }
        });

        const discountApplyData = await discountApplyRes.json();
        console.log("Discount Applied:", discountApplyData);
      }
    }

    // 4. Commit order
    const commitRes = await admin.graphql(`#graphql
      mutation orderEditCommit($id: ID!) {
        orderEditCommit(id: $id, notifyCustomer: false) {
          order { id name }
          userErrors { field message }
        }
      }
    `, { variables: { id: calculatedOrder.id } });

    const commitData = await commitRes.json();
    if (commitData.data?.orderEditCommit?.order) {
      return Response.json({ success: true, order: commitData.data.orderEditCommit.order });
    } else {
      return Response.json({ error: "Failed to commit order edit" }, { status: 400 });
    }

  } catch (error) {
    console.error("Error:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
