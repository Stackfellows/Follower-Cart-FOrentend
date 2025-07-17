import React, { useState, useEffect, useMemo } from "react";
import { ShoppingCart, CheckCircle, XCircle, Info } from "lucide-react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";

// Helper component for input fields, wrapped with React.memo for optimization
const InputField = React.memo(
  ({
    label,
    name,
    type = "text",
    value,
    onChange,
    placeholder,
    isRequired = true,
    error, // Directly pass the error for this field
  }) => {
    return (
      <div className="space-y-2">
        <label
          htmlFor={name}
          className="block text-sm font-medium text-gray-700"
        >
          {label} {isRequired && <span className="text-red-500">*</span>}
        </label>
        <input
          type={type}
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-200 ${
            error ? "border-red-500" : "border-gray-300"
          }`}
        />
        {error && (
          <p className="text-red-500 text-sm mt-1 animate-pulse">{error}</p>
        )}
      </div>
    );
  }
);

const BuyNow = ({ user, service = "Followers", platform = "Instagram" }) => {
  const [selectedPackage, setSelectedPackage] = useState(0);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [postLink, setPostLink] = useState("");
  const [profileLink, setProfileLink] = useState("");
  const [socialId, setSocialId] = useState("");

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionMessage, setSubmissionMessage] = useState(null);

  const navigate = useNavigate();
  const location = useLocation();

  // USD to PKR conversion rate (as requested)
  const USD_TO_PKR = 50;

  // Use useMemo for packages to prevent re-creation on every render
  const packages = useMemo(
    () => [
      { id: 0, amount: 100, price: 4.99, popular: false },
      { id: 1, amount: 500, price: 19.99, popular: true },
      { id: 2, amount: 1000, price: 34.99, popular: false },
      { id: 3, amount: 2500, price: 79.99, popular: false },
      { id: 4, amount: 5000, price: 149.99, popular: false },
      { id: 5, amount: 10000, price: 279.99, popular: false },
    ],
    []
  );

  // Effect to pre-fill form if reorderData is present in location state OR user prop is available
  useEffect(() => {
    // Prioritize reorderData if available
    if (location.state && location.state.reorderData) {
      const { reorderData } = location.state;
      setName(reorderData.name || "");
      setEmail(reorderData.email || "");
      setPhoneNumber(reorderData.phoneNumber || "");
      setPostLink(reorderData.postLink || "");
      setProfileLink(reorderData.profileLink || "");
      setSocialId(reorderData.socialId || "");

      const pkgIndex = packages.findIndex(
        (pkg) => pkg.amount === reorderData.amount // Use reorderData.amount as it's the raw amount
      );
      if (pkgIndex !== -1) {
        setSelectedPackage(pkgIndex);
      } else {
        // If reorder amount doesn't match a package, select the first one or handle as needed
        setSelectedPackage(0);
        setSubmissionMessage({
          type: "info",
          text: "Reorder amount not found in packages. Defaulting to first package.",
        });
      }
      setSubmissionMessage({
        type: "info",
        text: "Form pre-filled for reorder.",
      });
    } else if (user) {
      // If no reorderData, but user is logged in, pre-fill from user data
      setName(user.name || "");
      setEmail(user.email || "");
      setPhoneNumber(user.phoneNumber || "");
      setSubmissionMessage({
        type: "info",
        text: "Form pre-filled with your user information.",
      });
    }
  }, [location.state, user, packages]); // Add user and packages to dependency array

  // Function to validate form inputs
  const validateForm = () => {
    const newErrors = {};
    if (!name.trim()) newErrors.name = "Name is required";
    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Invalid email address";
    }
    if (!phoneNumber.trim()) newErrors.phoneNumber = "Phone number is required";
    if (!profileLink.trim()) newErrors.profileLink = "Profile link is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // Return true if no errors
  };

  const handlePurchase = async () => {
    setSubmissionMessage(null); // Clear previous messages

    const isValid = validateForm();
    if (!isValid) {
      setSubmissionMessage({
        type: "error",
        text: "Please fill in all required fields correctly.",
      });
      return;
    }

    setIsSubmitting(true); // Start submission

    const selectedPkg = packages[selectedPackage];

    const data = {
      name,
      email,
      phoneNumber,
      postLink: postLink.trim(),
      profileLink: profileLink.trim(),
      requiredFollowers: selectedPkg.amount, // Ensure this matches backend expected field
      platform, // This comes from props or dynamic selection
      socialId: socialId.trim(),
      service, // This comes from props or dynamic selection
      price: selectedPkg.price * USD_TO_PKR,
    };

    try {
      const res = await axios.post(
        "http://localhost:5000/followerApi/createOrder",
        data,
        { timeout: 15000 }
      );

      setSubmissionMessage({
        type: "success",
        text: `Order placed successfully! Order ID: ${res.data.id}. Redirecting to payment...`,
      });

      // --- Navigate to /payment/:orderId after successful order creation ---
      setTimeout(() => {
        navigate(`/payment/${res.data.id}`); // Navigate to the /payment route with order ID
      }, 2500); // Give user 2.5 seconds to see success message
    } catch (error) {
      console.error("Error creating order:", error);
      let errorMessage =
        "Failed to create order. Please check your details and try again.";

      if (axios.isAxiosError(error)) {
        if (error.response) {
          errorMessage =
            error.response.data?.msg ||
            `Server Error: ${error.response.status}`;
        } else if (error.request) {
          errorMessage =
            "No response from server. Please check your internet connection or try again later.";
        } else {
          errorMessage = error.message;
        }
        if (error.code === "ECONNABORTED") {
          errorMessage =
            "Request timed out. The server took too long to respond.";
        }
      }

      setSubmissionMessage({
        type: "error",
        text: errorMessage,
      });
    } finally {
      setIsSubmitting(false); // End submission
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 flex justify-center items-center">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md mx-auto w-full">
        <div className="text-center mb-6">
          <h3 className="text-2xl font-bold text-gray-900 mb-2">
            Buy {platform} {service}
          </h3>
          <p className="text-gray-600">
            Choose your package and boost your social presence.
          </p>
        </div>

        {submissionMessage && (
          <div
            className={`flex items-center justify-center p-4 rounded-lg text-white font-semibold mb-4 ${
              submissionMessage.type === "success"
                ? "bg-green-500"
                : submissionMessage.type === "info"
                ? "bg-blue-500"
                : "bg-red-500"
            }`}
          >
            {submissionMessage.type === "success" ? (
              <CheckCircle className="h-5 w-5 mr-2" />
            ) : (
              <XCircle className="h-5 w-5 mr-2" />
            )}
            {submissionMessage.text}
          </div>
        )}

        <div className="space-y-4 mb-6">
          {packages.map((pkg) => (
            <div
              key={pkg.id}
              onClick={() => setSelectedPackage(pkg.id)}
              className={`relative p-4 border-2 rounded-xl cursor-pointer transition-all duration-200 ${
                selectedPackage === pkg.id
                  ? "border-purple-500 bg-purple-50"
                  : "border-gray-200 hover:border-purple-300"
              }`}
            >
              {pkg.popular && (
                <div className="absolute -top-2 left-1/2 transform -translate-x-1/2">
                  <span className="bg-purple-600 text-white px-3 py-1 rounded-full text-xs font-semibold">
                    Most Popular
                  </span>
                </div>
              )}

              <div className="flex justify-between items-center">
                <div>
                  <div className="font-semibold text-gray-900">
                    {pkg.amount.toLocaleString()} {service}
                  </div>
                  <div className="text-sm text-gray-500">
                    ~PKR{" "}
                    {((pkg.price / pkg.amount) * 1000 * USD_TO_PKR).toFixed(0)}{" "}
                    per 1K
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-purple-600">
                    PKR {(pkg.price * USD_TO_PKR).toFixed(0)}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="space-y-4 mb-6">
          <InputField
            label="Your Name"
            name="name"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              setErrors((prev) => {
                const newErrors = { ...prev };
                delete newErrors.name;
                return newErrors;
              });
            }}
            placeholder="Enter your full name"
            isRequired={true}
            error={errors.name} // Pass error directly
          />
          <InputField
            label="Your Email"
            name="email"
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setErrors((prev) => {
                const newErrors = { ...prev };
                delete newErrors.email;
                return newErrors;
              });
            }}
            placeholder="Enter your email address"
            isRequired={true}
            error={errors.email} // Pass error directly
          />
          <InputField
            label="Your Phone Number"
            name="phoneNumber"
            type="tel"
            value={phoneNumber}
            onChange={(e) => {
              setPhoneNumber(e.target.value);
              setErrors((prev) => {
                const newErrors = { ...prev };
                delete newErrors.phoneNumber;
                return newErrors;
              });
            }}
            placeholder="e.g., +923XX-XXXXXXX"
            isRequired={true}
            error={errors.phoneNumber} // Pass error directly
          />
          <InputField
            label="Post Link (Optional)"
            name="postLink"
            type="url"
            value={postLink}
            onChange={(e) => {
              setPostLink(e.target.value);
              setErrors((prev) => {
                const newErrors = { ...prev };
                delete newErrors.postLink;
                return newErrors;
              });
            }}
            placeholder="e.g., https://instagram.com/p/..."
            isRequired={false}
            error={errors.postLink} // Pass error directly
          />
          <InputField
            label="Profile Link"
            name="profileLink"
            type="url"
            value={profileLink}
            onChange={(e) => {
              setProfileLink(e.target.value);
              setErrors((prev) => {
                const newErrors = { ...prev };
                delete newErrors.profileLink;
                return newErrors;
              });
            }}
            placeholder="e.g., https://instagram.com/yourprofile"
            isRequired={true}
            error={errors.profileLink} // Pass error directly
          />
          <InputField
            label="Social ID (Optional)"
            name="socialId"
            value={socialId}
            onChange={(e) => {
              setSocialId(e.target.value);
              setErrors((prev) => {
                const newErrors = { ...prev };
                delete newErrors.socialId;
                return newErrors;
              });
            }}
            placeholder="Your social media username/ID"
            isRequired={false}
            error={errors.socialId} // Pass error directly
          />
        </div>

        <button
          onClick={handlePurchase}
          disabled={isSubmitting}
          className="w-full bg-purple-600 text-white py-4 rounded-xl font-semibold text-lg hover:bg-purple-700 transform hover:scale-105 transition-all duration-200 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
        >
          {isSubmitting ? (
            <div className="flex items-center space-x-2">
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Processing...</span>
            </div>
          ) : (
            <>
              <ShoppingCart className="h-5 w-5 mr-2" />
              Buy Now - PKR{" "}
              {(packages[selectedPackage].price * USD_TO_PKR).toFixed(0)}
            </>
          )}
        </button>

        <div className="mt-4 text-center text-xs text-gray-500">
          <p>✓ No password required ✓ 30-day refill guarantee ✓ 24/7 support</p>
        </div>
      </div>
    </div>
  );
};

export default BuyNow;
