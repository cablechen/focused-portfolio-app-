import { useEffect, useState } from 'react';
import {
  BlockStack,
  reactExtension,
  Text,
  Link,
  Image,
  TextBlock,
  useApi,
  Button,
  View,
  useExtensionApi,
} from '@shopify/ui-extensions-react/checkout';
import { coinpalApi } from "./utils";

// 1. Choose an extension target
export default reactExtension(
    'purchase.thank-you.block.render',
    () => <Extension />,
);

function Extension() {
  const { orderConfirmation,query, selectedPaymentOptions, shop } = useApi();

  const api1 = useApi();


  const orderNumber = orderConfirmation?.current?.number || "Loading...";
  const orderId = orderConfirmation?.current?.order?.id || "Unknown";
  const [paymentUrl, setPaymentUrl] = useState('');
  const [isModalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const paymentMethodType = selectedPaymentOptions?.current?.[0]?.type || "Unknown";
  const paymentMethodHandle = selectedPaymentOptions?.current?.[0]?.handle || "N/A";
  var isCoinpalPayment = paymentMethodType === "creditCard";


  useEffect(() => {
    async function fetchPaymentUrl() {
      console.log(paymentMethodType);
      isCoinpalPayment = 1;
      if (isCoinpalPayment) {
        try {
          const currData = {
            myshopifyDomain: shop?.myshopifyDomain,
            orderId: orderId,
          };
          const resData = await coinpalApi(currData); // 确保 coinpalApi 返回 Promise
          console.log(resData.paymentUrl);
          if (resData && resData.paymentUrl) {
            setPaymentUrl(resData.paymentUrl);
            setLoading(false); // 打开弹框
          } else {
            console.error("Error: paymentUrl not found in response", resData);
          }
        } catch (error) {
          console.error("Error fetching paymentUrl:", error);
        } finally {
          setLoading(false); // 2. 数据加载完成后，隐藏 loading
        }
      }
    }

    fetchPaymentUrl();
  }, [isCoinpalPayment, orderId, shop]);

  return (
      <BlockStack>
        {loading ? (
            <View minInlineSize="100%" blockAlignment="center" inlineAlignment="center" padding="base">
              <Text size="large" emphasis="bold">Loading...</Text>
            </View>

        ) : (
            isCoinpalPayment && paymentUrl && (
                <Link size="extraLarge" to={paymentUrl}>
                  <BlockStack spacing="base">
                    <Image source="https://www.coinpal.io/images/plug_coinpal.png" />
                    <Button>CoinPal Payment</Button>
                  </BlockStack>
                </Link>
            )
        )}
      </BlockStack>
  );
}
