import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  CreditCard,
  Banknote,
  Loader2,
  CheckCircle,
  XCircle,
  UploadCloud, // For screenshot upload icon
  ShieldCheck, // For security icon
  Wallet, // General payment icon
  DollarSign, // For bank transfer
} from "lucide-react";

const PaymentMethodForm = () => {
  const { orderId } = useParams(); // Get orderId from URL
  const navigate = useNavigate();

  const [selectedMethod, setSelectedMethod] = useState("easypaisa");
  const [transactionId, setTransactionId] = useState("");
  const [screenshotFile, setScreenshotFile] = useState(null); // State for screenshot file
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submittingPayment, setSubmittingPayment] = useState(false);
  const [message, setMessage] = useState(null); // For success/error messages

  // Fetch order details when the component mounts or orderId changes
  useEffect(() => {
    const fetchOrderDetails = async () => {
      console.log("PaymentMethodForm: useEffect triggered.");
      console.log("PaymentMethodForm: orderId from URL params:", orderId); // DEBUG LOG

      if (!orderId) {
        setMessage({
          type: "error",
          text: "No order ID provided. Cannot proceed with payment.",
        });
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        const response = await axios.get(
          `http://localhost:5000/followerApi/getOrder/${orderId}`
        );
        setOrder(response.data);
        console.log("PaymentMethodForm: Fetched order data:", response.data); // DEBUG LOG
        setMessage(null); // Clear previous messages
      } catch (error) {
        console.error(
          "PaymentMethodForm: Error fetching order details:",
          error
        );
        setMessage({
          type: "error",
          text: "Failed to load order details. Please try again or ensure the order ID is valid.",
        });
        setOrder(null);
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [orderId]); // Dependency array includes orderId

  const handleFileChange = (e) => {
    setScreenshotFile(e.target.files[0]);
  };

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();
    setSubmittingPayment(true);
    setMessage(null); // Clear previous messages

    if (!order) {
      setMessage({
        type: "error",
        text: "Order details not loaded. Cannot process payment.",
      });
      setSubmittingPayment(false);
      return;
    }

    if (!screenshotFile) {
      setMessage({
        type: "error",
        text: "Please upload a screenshot of your payment.",
      });
      setSubmittingPayment(false);
      return;
    }

    if (!transactionId.trim()) {
      setMessage({
        type: "error",
        text: `Please enter the ${selectedMethod} transaction ID or reference number.`,
      });
      setSubmittingPayment(false);
      return;
    }

    try {
      let screenshotUrl = "";
      // 1. Upload screenshot to Cloudinary
      if (screenshotFile) {
        const formData = new FormData();
        formData.append("image", screenshotFile);

        const uploadResponse = await axios.post(
          "http://localhost:5000/followerApi/upload",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        screenshotUrl = uploadResponse.data.imageUrl;
        console.log("Screenshot uploaded:", screenshotUrl);
      }

      let paymentAmount = order.price;
      if (typeof paymentAmount === "string") {
        paymentAmount = parseFloat(paymentAmount.replace("PKR ", ""));
      }
      if (isNaN(paymentAmount) || paymentAmount <= 0) {
        setMessage({
          type: "error",
          text: "Invalid order amount detected. Please contact support.",
        });
        setSubmittingPayment(false);
        return;
      }

      // 2. Create a new payment record using the /createPayment API
      const paymentData = {
        orderId: order._id,
        // Ensure clientName and clientEmail are always strings, even if order.name/email are null/undefined
        clientName: order.name ? String(order.name) : "Unknown Client",
        clientEmail: order.email ? String(order.email) : "unknown@example.com",
        amount: paymentAmount,
        paymentMethod: selectedMethod,
        transactionId: transactionId,
        status: "Pending",
        screenshotUrl: screenshotUrl,
        remarks: `Payment for order ${
          order._id || "N/A"
        } via ${selectedMethod}`,
      };

      const paymentCreationResponse = await axios.post(
        "http://localhost:5000/followerApi/createPayment",
        paymentData
      );

      console.log("Payment record created:", paymentCreationResponse.data);

      // 3. Update the associated order's status to "Payment Pending"
      const updateOrderResponse = await axios.patch(
        `http://localhost:5000/followerApi/updateOrder/${order._id}`,
        {
          status: "Payment Pending",
        }
      );
      console.log(
        "Order status updated to 'Payment Pending':",
        updateOrderResponse.data
      );

      setMessage({
        type: "success",
        text: "Payment details submitted! Your payment is pending review and your order status has been updated. Redirecting to dashboard...",
      });

      // Redirect to client dashboard after successful payment submission
      setTimeout(() => {
        navigate("/client-dashboard");
      }, 2500);
    } catch (error) {
      console.error("Payment submission failed:", error);
      let errorMessage = "Failed to submit payment. Please try again.";
      if (axios.isAxiosError(error)) {
        errorMessage = error.response?.data?.msg || error.message;
        if (error.response?.status === 409) {
          errorMessage =
            "This transaction ID has already been recorded. Please check your details or contact support.";
        }
      }
      setMessage({
        type: "error",
        text: errorMessage,
      });
    } finally {
      setSubmittingPayment(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="h-12 w-12 mx-auto text-purple-600 animate-spin" />
          <p className="text-gray-600 mt-4">Loading payment details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 space-y-6">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900">
            Complete Your Payment
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            For Order ID:{" "}
            <span className="font-semibold text-purple-600">
              {order?._id || "N/A"}
            </span>
          </p>
          {order && (
            <p className="text-xl font-bold text-purple-700 mt-2">
              Total: PKR {parseFloat(order.price).toFixed(0)}
            </p>
          )}
        </div>

        {message && (
          <div
            className={`flex items-center justify-center p-4 rounded-lg text-white font-semibold ${
              message.type === "success" ? "bg-green-500" : "bg-red-500"
            }`}
          >
            {message.type === "success" ? (
              <CheckCircle className="h-5 w-5 mr-2" />
            ) : (
              <XCircle className="h-5 w-5 mr-2" />
            )}
            {message.text}
          </div>
        )}

        <form onSubmit={handlePaymentSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Payment Method
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {/* EasyPaisa */}
              <label
                className={`flex flex-col items-center justify-center p-4 border rounded-lg cursor-pointer transition-all duration-200 ${
                  selectedMethod === "easypaisa"
                    ? "border-purple-600 bg-purple-50 shadow-md"
                    : "border-gray-300 hover:border-gray-400"
                }`}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  value="easypaisa"
                  checked={selectedMethod === "easypaisa"}
                  onChange={() => setSelectedMethod("easypaisa")}
                  className="hidden"
                />
                <CreditCard className="h-6 w-6 text-purple-600 mb-1" />
                <span className="font-medium text-gray-800 text-sm">
                  EasyPaisa
                </span>
              </label>

              {/* JazzCash */}
              <label
                className={`flex flex-col items-center justify-center p-4 border rounded-lg cursor-pointer transition-all duration-200 ${
                  selectedMethod === "jazzcash"
                    ? "border-purple-600 bg-purple-50 shadow-md"
                    : "border-gray-300 hover:border-gray-400"
                }`}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  value="jazzcash"
                  checked={selectedMethod === "jazzcash"}
                  onChange={() => setSelectedMethod("jazzcash")}
                  className="hidden"
                />
                <Banknote className="h-6 w-6 text-purple-600 mb-1" />
                <span className="font-medium text-gray-800 text-sm">
                  JazzCash
                </span>
              </label>

              {/* Bank Transfer */}
              <label
                className={`flex flex-col items-center justify-center p-4 border rounded-lg cursor-pointer transition-all duration-200 ${
                  selectedMethod === "bankTransfer"
                    ? "border-purple-600 bg-purple-50 shadow-md"
                    : "border-gray-300 hover:border-gray-400"
                }`}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  value="bankTransfer"
                  checked={selectedMethod === "bankTransfer"}
                  onChange={() => setSelectedMethod("bankTransfer")}
                  className="hidden"
                />
                <DollarSign className="h-6 w-6 text-purple-600 mb-1" />
                <span className="font-medium text-gray-800 text-sm">
                  Bank Transfer
                </span>
              </label>

              {/* PayPal (Placeholder - requires real integration) */}
              <label
                className={`flex flex-col items-center justify-center p-4 border rounded-lg cursor-pointer transition-all duration-200 ${
                  selectedMethod === "paypal"
                    ? "border-purple-600 bg-purple-50 shadow-md"
                    : "border-gray-300 hover:border-gray-400"
                }`}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  value="paypal"
                  checked={selectedMethod === "paypal"}
                  onChange={() => setSelectedMethod("paypal")}
                  className="hidden"
                />
                <Wallet className="h-6 w-6 text-purple-600 mb-1" />
                <span className="font-medium text-gray-800 text-sm">
                  PayPal
                </span>
              </label>

              {/* Google Pay (Placeholder - requires real integration) */}
              <label
                className={`flex flex-col items-center justify-center p-4 border rounded-lg cursor-pointer transition-all duration-200 ${
                  selectedMethod === "googlePay"
                    ? "border-purple-600 bg-purple-50 shadow-md"
                    : "border-gray-300 hover:border-gray-400"
                }`}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  value="googlePay"
                  checked={selectedMethod === "googlePay"}
                  onChange={() => setSelectedMethod("googlePay")}
                  className="hidden"
                />
                <Wallet className="h-6 w-6 text-purple-600 mb-1" />
                <span className="font-medium text-gray-800 text-sm">
                  Google Pay
                </span>
              </label>
            </div>
          </div>

          <div>
            <label
              htmlFor="transactionId"
              className="block text-sm font-medium text-gray-700"
            >
              {selectedMethod === "easypaisa" && "EasyPaisa Transaction ID"}
              {selectedMethod === "jazzcash" && "JazzCash Transaction ID"}
              {selectedMethod === "bankTransfer" &&
                "Bank Transaction ID / Reference No."}
              {selectedMethod === "paypal" && "PayPal Transaction ID"}
              {selectedMethod === "googlePay" && "Google Pay Transaction ID"}
              <span className="text-red-500">*</span>
            </label>
            <textarea
              id="transactionId"
              name="transactionId"
              value={transactionId}
              onChange={(e) => setTransactionId(e.target.value)}
              placeholder={`Enter your ${selectedMethod} transaction ID or reference number`}
              rows="3"
              required
              className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 resize-y"
            ></textarea>
          </div>

          {/* Screenshot Upload Input */}
          <div>
            <label
              htmlFor="screenshot"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Upload Payment Screenshot <span className="text-red-500">*</span>
            </label>
            <div className="flex items-center justify-center w-full">
              <label
                htmlFor="screenshot"
                className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors duration-200"
              >
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <UploadCloud className="w-8 h-8 mb-3 text-gray-400" />
                  <p className="mb-2 text-sm text-gray-500">
                    <span className="font-semibold">Click to upload</span> or
                    drag and drop
                  </p>
                  <p className="text-xs text-gray-500">
                    PNG, JPG, JPEG (MAX. 5MB)
                  </p>
                </div>
                <input
                  id="screenshot"
                  type="file"
                  className="hidden"
                  accept="image/png, image/jpeg, image/jpg"
                  onChange={handleFileChange}
                  required
                />
              </label>
            </div>
            {screenshotFile && (
              <p className="mt-2 text-sm text-gray-600">
                Selected file:{" "}
                <span className="font-medium">{screenshotFile.name}</span>
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={
              submittingPayment ||
              !order ||
              !screenshotFile ||
              !transactionId.trim()
            }
            className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-md shadow-sm text-lg font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submittingPayment ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin mr-2" />
                Processing Payment...
              </>
            ) : (
              `Submit Payment - PKR ${
                order ? parseFloat(order.price).toFixed(0) : "0"
              }`
            )}
          </button>
        </form>

        <div className="text-center mt-4 text-sm text-gray-500 flex items-center justify-center">
          <ShieldCheck className="h-4 w-4 mr-1 text-green-500" />
          <p>Your payment details are securely processed.</p>
        </div>
      </div>
    </div>
  );
};

export default PaymentMethodForm;
