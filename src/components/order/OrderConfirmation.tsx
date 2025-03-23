import React from "react";

const OrderConfirmation = () => {
  const cartItems = [
    { id: 11, name: "Shirt", quantity: 1 },
    { id: 129, name: "Pants", quantity: 2 }
  ];
  const cartTotal = 35.00;

  const submitOrderToLaravel = async (orderItems, paymentMethod) => {
    const token = localStorage.getItem("accessToken");
    const userId = localStorage.getItem("user_id");

    const res = await fetch("https://eazyy.app/api/user/place-order", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user_id: userId,
        user_address_id: 0,
        items: orderItems,
        payment_method: paymentMethod,
        driver_note: "",
        facility_note: "",
        minimum_order_charge: 0,
        discount: 0,
      }),
    });

    const data = await res.json();
    if (!res.ok || !data.order_number) {
      throw new Error("Failed to submit order");
    }

    return data.order_number;
  };

  const createMolliePayment = async (orderNumber, total) => {
    const res = await fetch("https://eazyy.app/api/user/create-payment", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        order_id: orderNumber,
        amount: total
      })
    });

    if (!res.ok) {
      const text = await res.text(); // handle HTML error gracefully
      throw new Error("❌ Server error: " + text);
    }

    const data = await res.json();
    console.log("✅ Mollie response:", data);

    if (!data.checkout_url) {
      throw new Error("Payment failed: " + JSON.stringify(data));
    }

    window.location.href = data.checkout_url;
  };

  const handlePlaceOrder = async () => {
    try {
      const orderItems = cartItems.map(item => ({
        item_id: item.id,
        quantity: item.quantity,
      }));

      const orderNumber = await submitOrderToLaravel(orderItems, "ONLINE");
      await createMolliePayment(orderNumber, cartTotal);
    } catch (err) {
      console.error("❌ Order failed:", err);
      alert(err.message || "Order failed. Try again.");
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold mb-4">Order Summary</h1>
      <ul className="mb-4">
        {cartItems.map((item) => (
          <li key={item.id}>
            {item.name} × {item.quantity}
          </li>
        ))}
      </ul>
      <p className="mb-4">Total: €{cartTotal}</p>
      <button
        onClick={handlePlaceOrder}
        className="bg-black text-white px-6 py-3 rounded-xl"
      >
        Pay Now with Mollie
      </button>
    </div>
  );
};

export default OrderConfirmation;
