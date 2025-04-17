export const createLineItemdiscount=async(orderId, description, amount ,admin)=>{
  console.log("dataaaaaa",orderId, description, amount ,admin)
  try {
       const editResponse = await admin.graphql(
            `mutation orderEditBegin($id: ID!) {
        orderEditBegin(id: $id) {
          calculatedOrder {
            id
           lineItems(first:4){
            nodes{
              id
            }
          }
          }
          userErrors {
            field
            message
          }
        }
      }`,{
        variables:{
          id:orderId
        }
      }   );
      console.log("editttt",editResponse);
      const edit=await editResponse.json();
      console.log("editttt res",edit)
          if (edit?.data?.orderEditBegin?.userErrors.length > 0) {
            return new Response(
              JSON.stringify({
                error: "Shopify API Error",
                details: edit.data.orderEditBegin.userErrors,
              }),
              { status: 400 }
            );
          }
         console.log("orderidd get",edit?.data?.orderEditBegin?.calculatedOrder)
          const calculatedOrderId = edit?.data?.orderEditBegin?.calculatedOrder?.id;
          console.log("edittt orderidt",calculatedOrderId);
          if (!calculatedOrderId) {
            return new Response(
              JSON.stringify({ error: "Failed to get Calculated Order ID" }),
              { status: 400 }
            );
          }
          
          const calculatedLineItems =
            edit?.data?.orderEditBegin?.calculatedOrder?.lineItems?.nodes || [];
          console.log(" calculatedLineItemIds",calculatedLineItems)
          if (!Array.isArray(calculatedLineItems) || calculatedLineItems.length === 0) {
            return new Response(
              JSON.stringify({ error: "No calculated line items found" }),
              { status: 400 }
            );
          }
          
          const calculatedLineItemId = calculatedLineItems[0].id; 
          // const calculatedLineItemId = calculatedLineItems.find(item => item.id === someMatchingId)?.id; // If you have logic to match a specific item
          console.log(" calculatedLineItemId", calculatedLineItemId)
          if (!calculatedLineItemId) {
            return new Response(
              JSON.stringify({ error: "No matching calculated line item found" }),
              { status: 400 }
            );
          }
          
          console.log("Step 2: Applying Discount...");
          
          // Step 3: Apply Discount to the calculated line item
          const discountResponse = await admin.graphql(
            `mutation orderEditAddLineItemDiscount(
         $discount: OrderEditAppliedDiscountInput!,
        $id: ID!,
        $lineItemId: ID!
      ) {
        orderEditAddLineItemDiscount(discount: $discount, id: $id, lineItemId: $lineItemId) {
          addedDiscountStagedChange {
            id
          }
          calculatedLineItem {
            id
            calculatedDiscountAllocations {
              allocatedAmountSet {
                presentmentMoney {
                  amount
                  currencyCode
                }
              }
            }
          }
          calculatedOrder {
            id
            totalPriceSet {
              presentmentMoney {
                amount
                currencyCode
              }
            }
            shippingLines{
              id
              price{
                presentmentMoney{
                  amount
                  currencyCode
                }
              }
              
              
            }
          }
          
          userErrors {
            field
            message
          }
        }
      }`,
      {variables: {
        discount: {
          description,
          fixedValue: { amount, currencyCode: "AED" },
          
        },
         targetType: "LINE_ITEM",
        id: calculatedOrderId,
        lineItemId: calculatedLineItemId, 
      }}
           
          );
          const check=await discountResponse.json();
          console.log("discountResponseeeedkhee",check)
      
          if (discountResponse?.data?.orderEditAddLineItemDiscount?.userErrors.length > 0) {
            return new Response(
              JSON.stringify({
                error: "Failed to apply discount",
                details: discountResponse.data.orderEditAddLineItemDiscount.userErrors,
              }),
              { status: 400 }
            );
          }
      
          console.log("Step 3: Committing Order Edit...");
      
          // Step 4: Commit Order Edit
          const commitResponse = await admin.graphql(
            `#graphql
            mutation orderEditCommit($id: ID!) {
              orderEditCommit(id: $id) {
                order {
                  id
                  name
                  totalPriceSet {
                    presentmentMoney {
                      amount
                    }
                  }
                }
                userErrors {
                  field
                  message
                }
              }
            }`,
            {variables:{ id: calculatedOrderId }}
          
          );
          const final=await commitResponse.json();
          console.log("finalll",final)
      
          if (commitResponse?.data?.orderEditCommit?.userErrors.length > 0) {
            // return new Response(
            //   JSON.stringify({
            //     error: "Failed to commit order edit",
            //     details: commitResponse.data.orderEditCommit.userErrors,
            //   }),
            //   { status: 400 }
            // );
             return {
                      status: false,
                      message: errorMessage.DISCOUNT_FAILED,
                      errors: userErrors.map(err => ({
                        field: err.field,
                        message: err.message
                      })),
                    }
          }
      
          return new Response(
            JSON.stringify({ message: "Order edit committed successfully!" }),
            { status: 200 }
          );
        } catch (error) {
          console.error("Server Error:", error);
           return {
                  status: false,
                  message: errorMessage.SERVER_ERROR,
                  error: error.message,
                };
        }
      };