// import { unauthenticated } from "../shopify.server";

// export async function loader({ request }) {
//   const url = new URL(request.url);
//   const shop = url.searchParams.get("shop");
//   const orderId = `gid://shopify/Order/${url.searchParams.get("orderId")}`;
//   const originalLineItemId = `gid://shopify/LineItem/${url.searchParams.get("originalLineItemId")}`;

//   try {
//     const { admin } = await unauthenticated.admin(shop);

//     // 1. Fetch the original order to get the line items
//     const orderRes = await admin.graphql(`
//       query($id: ID!) {
//         order(id: $id) {
//           lineItems(first: 50) {
//             nodes {
//               id
//               quantity
//               variant { id }
//             }
//           }
//         }
//       }
//     `, { variables: { id: orderId } });

//     const originalLineItems = await orderRes.json();
//     const originalLineItem = originalLineItems.data.order.lineItems.nodes.find(
//       item => item.id === originalLineItemId
//     );

//     if (!originalLineItem) {
//       return Response.json({ error: "Original line item not found" }, { status: 404 });
//     }

//     // 2. Begin order edit session
//     const editRes = await admin.graphql(`
//       mutation orderEditBegin($id: ID!) {
//         orderEditBegin(id: $id) {
//           calculatedOrder {
//             id
//             lineItems(first: 50) {
//               nodes {
//                 id
//                 quantity
//                 variant { id }
//                 calculatedDiscountAllocations {
//                   discountApplication {
//                     id
//                     __typename
//                   }
//                 }
//               }
//             }
//           }
//           userErrors { field message }
//         }
//       }
//     `, { variables: { id: orderId } });

//     const editData = await editRes.json();
//     const calculatedOrder = editData.data?.orderEditBegin?.calculatedOrder;

//     if (!calculatedOrder) {
//       return Response.json({ error: "Could not begin order edit" }, { status: 400 });
//     }

//     // 3. Find the matching line item in calculated order
//     const targetLineItem = calculatedOrder.lineItems.nodes.find(
//       item => item.variant?.id === originalLineItem.variant.id
//     );

//     if (!targetLineItem) {
//       return Response.json({ error: "Line item not found in calculated order" }, { status: 404 });
//     }

//     // 4. Extract the discount application ID
//     let discountApplicationId = null;
//     targetLineItem.calculatedDiscountAllocations.forEach((allocation) => {
//       const discountApp = allocation.discountApplication;
//       if (discountApp?.id) {
//         discountApplicationId = discountApp.id; // Get the discount application ID
//         console.log("Discount Application ID:", discountApplicationId);
//       }
//     });

//     if (!discountApplicationId) {
//       console.log("No discount applied to this line item");
//     }

//     // 5. Apply or remove discount based on quantity and the extracted ID
//     // Assuming you have some logic for applying/removing discounts based on quantity.
//     // Here we'll remove the discount if it exists and apply a new one based on quantity.

//     const targetQuantity = targetLineItem.quantity; // The quantity of the line item

//    // Remove the discount using the order's ID and the discount application ID
// if (discountApplicationId) {
//   console.log("Removing discount with ID:", discountApplicationId);

//   await admin.graphql(`
//     mutation orderEditRemoveLineItemDiscount(
//       $id: ID!,
//       $discountApplicationId: ID!
//     ) {
//       orderEditRemoveLineItemDiscount(
//         id: $id,
//         discountApplicationId: $discountApplicationId
//       ) {
//         calculatedOrder { id }
//         userErrors { field message }
//       }
//     }
//   `, {
//     variables: {
//       id: calculatedOrder.id,
//       discountApplicationId,
//     },
//   });
//   console.log("Discount removed successfully");
// }


//     // Now apply the new discount (example: 10% off if quantity is more than 10)
//     if (targetQuantity >= 10) {
//       // Example mutation to apply a new discount (e.g., 10% off)
//       console.log("Applying new discount: 10% off");

//       await admin.graphql(`
//         mutation orderEditAddLineItemDiscount(
//           $id: ID!,
//           $lineItemId: ID!,
//           $discount: OrderEditAppliedDiscountInput!
//         ) {
//           orderEditAddLineItemDiscount(
//             id: $id,
//             lineItemId: $lineItemId,
//             discount: $discount
//           ) {
//             calculatedOrder { id }
//             userErrors { field message }
//           }
//         }
//       `, {
//         variables: {
//           id: calculatedOrder.id,
//           lineItemId: targetLineItem.id,
//           discount: {
//             description: "10% off for quantity 10 or more",
//             percentValue: 10, // 10% discount
//           },
//         },
//       });
//     }

//     // 6. Commit the order edit
//     const commitRes = await admin.graphql(`
//       mutation orderEditCommit($id: ID!) {
//         orderEditCommit(id: $id, notifyCustomer: false) {
//           order { id name }
//           userErrors { field message }
//         }
//       }
//     `, { variables: { id: calculatedOrder.id } });

//     const commitData = await commitRes.json();
//     return Response.json({
//       message: discountApplicationId
//         ? "Discount removed and new discount applied"
//         : "No discount was applied",
//       order: commitData.data.orderEditCommit.order,
//     });

//   } catch (err) {
//     console.error("Unhandled error:", err);
//     return new Response("Server error", { status: 500 });
//   }
// }
// ----------------------------------------------------
// import { unauthenticated } from "../shopify.server";

// export async function loader({ request }) {
//   const url = new URL(request.url);
//   const shop = url.searchParams.get("shop");
//   const orderId = `gid://shopify/Order/${url.searchParams.get("orderId")}`;
//   const originalLineItemId = `gid://shopify/LineItem/${url.searchParams.get("originalLineItemId")}`;

//   try {
//     const { admin } = await unauthenticated.admin(shop);

//     // 1. Fetch the original order to get the line items
//     const orderRes = await admin.graphql(`
//       query($id: ID!) {
//         order(id: $id) {
//           lineItems(first: 50) {
//             nodes {
//               id
//               quantity
//               variant { id }
//             }
//           }
//         }
//       }
//     `, { variables: { id: orderId } });

//     const originalLineItems = await orderRes.json();
//     const originalLineItem = originalLineItems.data.order.lineItems.nodes.find(
//       item => item.id === originalLineItemId
//     );

//     if (!originalLineItem) {
//       return Response.json({ error: "Original line item not found" }, { status: 404 });
//     }

//     // 2. Begin order edit session
//     const editRes = await admin.graphql(`
//       mutation orderEditBegin($id: ID!) {
//         orderEditBegin(id: $id) {
//           calculatedOrder {
//             id
//             lineItems(first: 50) {
//               nodes {
//                 id
//                 quantity
//                 variant { id }
//                 calculatedDiscountAllocations {
//                   discountApplication {
//                     id
//                     __typename
//                   }
//                 }
//               }
//             }
//           }
//           userErrors { field message }
//         }
//       }
//     `, { variables: { id: orderId } });

//     const editData = await editRes.json();
//     const calculatedOrder = editData.data?.orderEditBegin?.calculatedOrder;

//     if (!calculatedOrder) {
//       return Response.json({ error: "Could not begin order edit" }, { status: 400 });
//     }

//     // 3. Find the matching line item in calculated order
//     const targetLineItem = calculatedOrder.lineItems.nodes.find(
//       item => item.variant?.id === originalLineItem.variant.id
//     );

//     if (!targetLineItem) {
//       return Response.json({ error: "Line item not found in calculated order" }, { status: 404 });
//     }

//     // 4. Extract the discount application ID
//     let discountApplicationId = null;
//     targetLineItem.calculatedDiscountAllocations.forEach((allocation) => {
//       const discountApp = allocation.discountApplication;
//       if (discountApp?.id) {
//         discountApplicationId = discountApp.id; // Get the discount application ID
//         console.log("Discount Application ID:", discountApplicationId);
//       }
//     });

//     if (!discountApplicationId) {
//       console.log("No discount applied to this line item");
//     }

//     // 5. Determine the best matching discount based on quantity (as per your original logic)
//     const bestDiscount = discounts
//       .filter(d => targetLineItem.quantity >= d.quantity)
//       .sort((a, b) => b.percentage - a.percentage)[0];

//     const alreadyHasDiscount = targetLineItem.calculatedDiscountAllocations.length > 0;

//     // 6A. Apply discount if quantity qualifies (and best discount found)
//     if (bestDiscount) {
//       const description = bestDiscount.type === "DiscountCodeBasic"
//         ? `${bestDiscount.title} (${bestDiscount.percentage * 100}% off) - Code: ${bestDiscount.code}`
//         : `${bestDiscount.title} (${bestDiscount.percentage * 100}% off)`;

//       console.log("Applying discount:", description);

//       await admin.graphql(`
//         mutation orderEditAddLineItemDiscount(
//           $id: ID!,
//           $lineItemId: ID!,
//           $discount: OrderEditAppliedDiscountInput!
//         ) {
//           orderEditAddLineItemDiscount(
//             id: $id,
//             lineItemId: $lineItemId,
//             discount: $discount
//           ) {
//             calculatedOrder { id }
//             userErrors { field message }
//           }
//         }
//       `, {
//         variables: {
//           id: calculatedOrder.id,
//           lineItemId: targetLineItem.id,
//           discount: {
//             description,
//             percentValue: bestDiscount.percentage * 100,
//           },
//         },
//       });
//       console.log("Discount applied successfully");
//     }

//     // 6B. Remove discount if quantity doesn't qualify but it had a discount
//     if (!bestDiscount && discountApplicationId) {
//       console.log("Removing discount with ID:", discountApplicationId);

//       await admin.graphql(`
//         mutation orderEditRemoveLineItemDiscount(
//           $id: ID!,
//           $discountApplicationId: ID!
//         ) {
//           orderEditRemoveLineItemDiscount(
//             id: $id,
//             discountApplicationId: $discountApplicationId
//           ) {
//             calculatedOrder { id }
//             userErrors { field message }
//           }
//         }
//       `, {
//         variables: {
//           id: calculatedOrder.id,
//           discountApplicationId,
//         },
//       });
//       console.log("Discount removed successfully");
//     }

//     // 7. Commit the order edit
//     const commitRes = await admin.graphql(`
//       mutation orderEditCommit($id: ID!) {
//         orderEditCommit(id: $id, notifyCustomer: false) {
//           order { id name }
//           userErrors { field message }
//         }
//       }
//     `, { variables: { id: calculatedOrder.id } });

//     const commitData = await commitRes.json();
//     return Response.json({
//       message: bestDiscount
//         ? "Discount applied and order edit committed"
//         : alreadyHasDiscount
//         ? "Discount removed due to quantity change"
//         : "No discount applied",
//       order: commitData.data.orderEditCommit.order,
//     });

//   } catch (err) {
//     console.error("Unhandled error:", err);
//     return new Response("Server error", { status: 500 });
//   }
// }
// =====================================
import { unauthenticated } from "../shopify.server";

export async function loader({ request }) {
  const url = new URL(request.url);
  const shop = url.searchParams.get("shop");
  const orderId = `gid://shopify/Order/${url.searchParams.get("orderId")}`;
  const originalLineItemId = `gid://shopify/LineItem/${url.searchParams.get("originalLineItemId")}`;

  try {
    const { admin } = await unauthenticated.admin(shop);

    // Fetch automatic discounts
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
          ... on DiscountCodeBasic {
            title
            codes(first: 1) {
              nodes {
                code
              }
            }
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

    const quantityDiscounts = discountData.data.discountNodes.nodes
      .filter(node => {
        const d = node.discount;
        return (
          (d.__typename === "DiscountAutomaticBasic" || d.__typename === "DiscountCodeBasic") &&
          d.minimumRequirement?.greaterThanOrEqualToQuantity &&
          d.customerGets.value?.percentage && d.status==='ACTIVE'
        );
      })
      .map(node => {
        const d = node.discount;
        return {
          type: d.__typename,
          title: d.title,
          minQty: Number(d.minimumRequirement.greaterThanOrEqualToQuantity),
          percent: d.customerGets.value.percentage,
          code: d.__typename === "DiscountCodeBasic" ? d.codes?.nodes?.[0]?.code : null,
        };
      });

    console.log("-----quantityDiscounts", quantityDiscounts);

    if (!quantityDiscounts.length) {
      return Response.json({ message: "No quantity-based discounts available." });
    }

    // Fetch order and line item
    const orderRes = await admin.graphql(`query($id: ID!) {
      order(id: $id) {
        lineItems(first: 50) {
          nodes {
            id
            quantity
            variant { id }
          }
        }
      }
    }`, { variables: { id: orderId } });

    const orderData = await orderRes.json();
    const originalLineItem = orderData.data.order.lineItems.nodes.find(
      item => item.id === originalLineItemId
    );
    if (!originalLineItem) {
      return Response.json({ error: "Line item not found" }, { status: 404 });
    }

    // Begin order edit
    const editRes = await admin.graphql(`mutation orderEditBegin($id: ID!) {
      orderEditBegin(id: $id) {
        calculatedOrder {
          id
          lineItems(first: 50) {
            nodes {
              id
              quantity
              variant { id }
              calculatedDiscountAllocations {
                discountApplication { id __typename }
              }
            }
          }
        }
        userErrors { field message }
      }
    }`, { variables: { id: orderId } });

    const editData = await editRes.json();
    const calculatedOrder = editData.data?.orderEditBegin?.calculatedOrder;
    if (!calculatedOrder) {
      return Response.json({ error: "Failed to begin order edit" }, { status: 400 });
    }

    const targetLineItem = calculatedOrder.lineItems.nodes.find(
      item => item.variant?.id === originalLineItem.variant.id
    );
    if (!targetLineItem) {
      return Response.json({ error: "Line item not found in calculated order" }, { status: 404 });
    }

    // Remove any existing discount
    const existingDiscountId = targetLineItem.calculatedDiscountAllocations[0]?.discountApplication?.id;
    if (existingDiscountId) {
      await admin.graphql(`mutation orderEditRemoveLineItemDiscount(
        $id: ID!, $discountApplicationId: ID!
      ) {
        orderEditRemoveLineItemDiscount(
          id: $id, discountApplicationId: $discountApplicationId
        ) {
          calculatedOrder { id }
          userErrors { field message }
        }
      }`, {
        variables: {
          id: calculatedOrder.id,
          discountApplicationId: existingDiscountId,
        },
      });
    }

    console.log("-------------quantity", targetLineItem.quantity);
    const applicableDiscounts = quantityDiscounts
      .filter(d => targetLineItem.quantity >= d.minQty)
      .sort((a, b) => b.percent - a.percent);

    console.log("-------applicableDiscount", applicableDiscounts);
    const bestDiscount = applicableDiscounts[0];
    console.log("------bestDiscount", bestDiscount);

    if (bestDiscount) {
      await admin.graphql(`mutation orderEditAddLineItemDiscount(
        $id: ID!, $lineItemId: ID!, $discount: OrderEditAppliedDiscountInput!
      ) {
        orderEditAddLineItemDiscount(
          id: $id,
          lineItemId: $lineItemId,
          discount: $discount
        ) {
          calculatedOrder { id }
          userErrors { field message }
        }
      }`, {
        variables: {
          id: calculatedOrder.id,
          lineItemId: targetLineItem.id,
          discount: {
            description: bestDiscount.code
              ? `Discount code ${bestDiscount.code} (${bestDiscount.percent * 100}%)`
              : `${bestDiscount.percent * 100}% off for quantity >= ${bestDiscount.minQty}`,
            percentValue: bestDiscount.percent * 100,
          },
        },
      });
    }

    // // Add refund discrepancy check before commit
    // const finalOrderRes = await admin.graphql(`
    //   query($id: ID!) {
    //     order(id: $id) {
    //       totalPriceSet { shopMoney { amount } }
    //       totalRefundedSet { shopMoney { amount } }
    //       transactions(first: 10) {
    //         amount
    //         kind
    //       }
    //     }
    //   }
    // `, { variables: { id: orderId } });
    // const finalOrderData = await finalOrderRes.json();
    // const finalOrder =  finalOrderData.data?.order;
    // console.log("------------finalOrder",finalOrder)
    // const totalPrice = parseFloat(finalOrder?.totalPriceSet?.shopMoney.amount);
    // const totalRefunded = parseFloat(finalOrder?.totalRefundedSet?.shopMoney.amount);
    // const totalPaid = finalOrder?.transactions
    //   .filter(t => t.kind === "SALE")
    //   .reduce((sum, t) => sum + parseFloat(t.amount), 0);

    // const refundOwed = totalPaid - totalRefunded - totalPrice;
    // console.log("Refund Owed (calculated):", refundOwed.toFixed(2));

    // if (refundOwed > 0 && refundOwed < 0.02) {
    //   await admin.graphql(`mutation orderEditCommit($id: ID!) {
    //     orderEditCommit(id: $id, notifyCustomer: false) {
    //       order { id name }
    //       userErrors { field message }
    //     }
    //   }`, { variables: { id: calculatedOrder.id } });

    //   return Response.json({ message: "Cleared ₹0.01 refund discrepancy via edit commit." });
    // }

    //  Fallback commit
    const commitRes = await admin.graphql(`mutation orderEditCommit($id: ID!) {
      orderEditCommit(id: $id, notifyCustomer: false) {
        order { id name }
        userErrors { field message }
      }
    }`, { variables: { id: calculatedOrder.id } });

    const commitData = await commitRes.json();
    return Response.json({
      message: bestDiscount
        ? `Applied ${bestDiscount.percent * 100}% discount`
        : "No applicable discount found",
      order: commitData.data.orderEditCommit.order,
    });

  } catch (err) {
    console.error("Unhandled error:", err);
    return new Response("Server error", { status: 500 });
  }
}
