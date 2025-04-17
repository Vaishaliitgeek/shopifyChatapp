import { Card, Page, Text, Spinner, Layout, DataTable, Select } from "@shopify/polaris";
import { useEffect, useState } from "react";
import { useNavigate } from "@remix-run/react";

export default function DiscountsList() {
  const [discounts, setDiscounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDiscount, setSelectedDiscount] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDiscounts = async () => {
      try {
        const response = await fetch("/api/Alldiscounts");
        const data = await response.json();

        if (data.error) {
          console.error("Error fetching discounts:", data.error);
          setDiscounts([]);
        } else {
          setDiscounts(data);
        }
      } catch (error) {
        console.error("Failed to load discounts:", error);
        setDiscounts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchDiscounts();
  }, []);

  const handleDiscountChange = (value) => {
    setSelectedDiscount(value);
    if (value) navigate(value);
  };

  return (
    <Page title="Discounts">
      <Layout>
        <Layout.Section>
          <Card sectioned>
            <Select
              label="Create Discount"
              options={[
                { label: "Select Discount", value: "" },
                { label: "Amount OFF Order", value: "/app/discount" },
                { label: "Amount OFF Products", value: "/app/prodDiscount" },
                { label: "Buy X Get Y", value: "/app/buyXgetYdiscount" },
                { label: "Free Shipping", value: "/app/freeshipDiscount" },
              ]}
              onChange={handleDiscountChange}
              value={selectedDiscount}
            />
          </Card>
        </Layout.Section>

        <Layout.Section>
          <Card>
            {loading ? (
              <div style={{ display: "flex", justifyContent: "center", padding: "20px" }}>
                <Spinner accessibilityLabel="Loading discounts" size="large" />
              </div>
            ) : discounts.length > 0 ? (
              <DataTable
                columnContentTypes={["text", "text", "text", "text", "text"]}
                headings={["Title", "Type", "Start Date", "End Date", "Status"]}
                rows={discounts.map(({ node }) => [
                  node.discount.title,
                  node.discount.__typename.replace("DiscountCode", "").replace("DiscountAutomatic", ""),
                  new Date(node.discount.startsAt).toLocaleDateString(),
                  new Date(node.discount.endsAt).toLocaleDateString(),
                  node.discount.status,
                ])}
              />
            ) : (
              <Text>No discounts found.</Text>
            )}
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
}

