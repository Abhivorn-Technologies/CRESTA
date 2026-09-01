// No static imports here

export interface CalculationResult {
  productSubtotal: number;
  gstAmount: number;
  deliveryDistanceKm: number | null;
  deliveryCharge: number;
  isFreeDelivery: boolean;
  grandTotal: number;
  error?: string;
}

export interface ConfigContext {
  maxDistanceKm: number;
  freeDeliveryThreshold: number;
  gstPercentage: number;
}

// Temporary default config if DB settings aren't loaded in client
export const defaultConfig: ConfigContext = {
  maxDistanceKm: 20,
  freeDeliveryThreshold: 500,
  gstPercentage: 5,
};

export function calculateOrderTotals(
  cartItems: { price: number; quantity: number }[],
  providedDistanceKm: number | null,
  config: ConfigContext = defaultConfig
): CalculationResult {
  // 1. Product Subtotal
  const productSubtotal = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  // 2. GST (e.g. 5%)
  const gstAmount = productSubtotal * (config.gstPercentage / 100);

  // 3. Delivery
  let deliveryDistanceKm: number | null = null;
  let deliveryCharge = 0;
  let isFreeDelivery = false;
  let error: string | undefined = undefined;

  if (providedDistanceKm !== null) {
    if (providedDistanceKm > config.maxDistanceKm) {
      error = `Sorry, we currently deliver within ${config.maxDistanceKm} km of our service area.`;
      deliveryDistanceKm = providedDistanceKm;
    } else {
      deliveryDistanceKm = providedDistanceKm;

      // Check Free Delivery first
      if (productSubtotal > config.freeDeliveryThreshold) {
        isFreeDelivery = true;
        deliveryCharge = 0;
      } else {
        // Calculate Distance-based charges
        if (deliveryDistanceKm <= 5) {
          deliveryCharge = 15;
        } else if (deliveryDistanceKm <= 10) {
          deliveryCharge = 20;
        } else if (deliveryDistanceKm <= 15) {
          deliveryCharge = 25;
        } else {
          deliveryCharge = 30; // up to 20km
        }
      }
    }
  } else {
      // Base case for cart before address selection
      if (productSubtotal > config.freeDeliveryThreshold) {
          isFreeDelivery = true;
      } else {
          deliveryCharge = 15; // default estimate
      }
  }

  // 4. Grand Total
  // Formula: Product Subtotal + GST + Delivery Charge
  const grandTotal = productSubtotal + gstAmount + deliveryCharge;

  return {
    productSubtotal,
    gstAmount,
    deliveryDistanceKm,
    deliveryCharge,
    isFreeDelivery,
    grandTotal,
    error,
  };
}
