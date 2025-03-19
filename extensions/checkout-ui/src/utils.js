export async function coinpalApi(requestBody) {
    try {
        const response = await fetch(" https://pay-dev.coinpal.io/gateway/shopify/create", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(requestBody),
        });

        if (!response.ok) {
            throw new Error("Failed to fetch data from external API");
        }

        const data = await response.json();
        console.log("外部 API 数据:", data);
        return data;
    } catch (error) {
        console.error("调用外部 API 失败:", error);
    }
}

export async function fetchOrderDetails(orderId) {
    const query = `
    query getOrderDetails($id: ID!) {
      order(id: $id) {
        id
        name
        createdAt
        totalPriceSet {
          shopMoney {
            amount
            currencyCode
          }
        }
        customer {
          displayName
          email
        }
        lineItems(first: 5) {
          edges {
            node {
              title
              quantity
            }
          }
        }
      }
    }
  `;

    const response = await fetch('/admin/api/2025-01/graphql.json', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-Shopify-Access-Token': process.env.SHOPIFY_API_KEY,
        },
        body: JSON.stringify({ query, variables: { id: orderId } }),
    });

    const data = await response.json();
    return data;
}



