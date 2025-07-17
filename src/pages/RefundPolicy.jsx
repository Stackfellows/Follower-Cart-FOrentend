import React from 'react';
import { Shield, Clock, CheckCircle, AlertCircle } from 'lucide-react';

const RefundPolicy = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <div className="w-20 h-20 bg-green-600 rounded-full flex items-center justify-center">
              <Shield className="h-10 w-10 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Refund Policy</h1>
          <p className="text-xl text-gray-600">
            Your satisfaction is our priority. Learn about our comprehensive refund and guarantee policies.
          </p>
        </div>

        {/* Quick Overview */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Quick Overview</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">30-Day Guarantee</h3>
              <p className="text-gray-600 text-sm">Full refund available within 30 days of purchase</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Fast Processing</h3>
              <p className="text-gray-600 text-sm">Refunds processed within 24-48 hours</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">No Questions Asked</h3>
              <p className="text-gray-600 text-sm">Simple refund process with minimal requirements</p>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Refund Policy Details</h2>
            
            <div className="space-y-8">
              {/* Money Back Guarantee */}
              <section>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">30-Day Money Back Guarantee</h3>
                <p className="text-gray-600 mb-4">
                  We stand behind the quality of our services with a comprehensive 30-day money-back guarantee. 
                  If you're not completely satisfied with your purchase, you can request a full refund within 
                  30 days of your order completion.
                </p>
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 mr-3 flex-shrink-0" />
                    <div>
                      <h4 className="font-medium text-green-900">What's Covered</h4>
                      <ul className="text-green-700 text-sm mt-2 space-y-1">
                        <li>• Services not delivered as promised</li>
                        <li>• Quality issues with delivered services</li>
                        <li>• Technical problems preventing delivery</li>
                        <li>• Dissatisfaction with service quality</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </section>

              {/* Refill Guarantee */}
              <section>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">30-Day Refill Guarantee</h3>
                <p className="text-gray-600 mb-4">
                  In addition to our money-back guarantee, we provide a 30-day refill guarantee for all 
                  follower services. If you experience any drops in followers within 30 days, we'll 
                  replace them for free.
                </p>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-start">
                    <Shield className="h-5 w-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0" />
                    <div>
                      <h4 className="font-medium text-blue-900">Refill Coverage</h4>
                      <ul className="text-blue-700 text-sm mt-2 space-y-1">
                        <li>• Automatic monitoring of follower counts</li>
                        <li>• Free replacement of dropped followers</li>
                        <li>• No additional charges for refills</li>
                        <li>• Applies to all follower packages</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </section>

              {/* How to Request */}
              <section>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">How to Request a Refund</h3>
                <p className="text-gray-600 mb-4">
                  Requesting a refund is simple and straightforward. Follow these steps:
                </p>
                <div className="space-y-4">
                  <div className="flex items-start">
                    <div className="w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center text-sm font-semibold mr-4 flex-shrink-0">
                      1
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">Contact Support</h4>
                      <p className="text-gray-600 text-sm">
                        Reach out to our 24/7 support team via live chat, email, or support ticket
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center text-sm font-semibold mr-4 flex-shrink-0">
                      2
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">Provide Order Details</h4>
                      <p className="text-gray-600 text-sm">
                        Share your order number and email address used for the purchase
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center text-sm font-semibold mr-4 flex-shrink-0">
                      3
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">Explain the Issue</h4>
                      <p className="text-gray-600 text-sm">
                        Briefly describe the reason for your refund request
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center text-sm font-semibold mr-4 flex-shrink-0">
                      4
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">Receive Your Refund</h4>
                      <p className="text-gray-600 text-sm">
                        Your refund will be processed within 24-48 hours to your original payment method
                      </p>
                    </div>
                  </div>
                </div>
              </section>

              {/* Processing Time */}
              <section>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Refund Processing Times</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="border border-gray-200 rounded-lg p-4">
                    <h4 className="font-medium text-gray-900 mb-2">Credit/Debit Cards</h4>
                    <p className="text-gray-600 text-sm">3-5 business days after processing</p>
                  </div>
                  <div className="border border-gray-200 rounded-lg p-4">
                    <h4 className="font-medium text-gray-900 mb-2">PayPal</h4>
                    <p className="text-gray-600 text-sm">1-2 business days after processing</p>
                  </div>
                  <div className="border border-gray-200 rounded-lg p-4">
                    <h4 className="font-medium text-gray-900 mb-2">Digital Wallets</h4>
                    <p className="text-gray-600 text-sm">1-3 business days after processing</p>
                  </div>
                  <div className="border border-gray-200 rounded-lg p-4">
                    <h4 className="font-medium text-gray-900 mb-2">Cryptocurrency</h4>
                    <p className="text-gray-600 text-sm">24-48 hours after processing</p>
                  </div>
                </div>
              </section>

              {/* Non-Refundable Items */}
              <section>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Non-Refundable Services</h3>
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <div className="flex items-start">
                    <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5 mr-3 flex-shrink-0" />
                    <div>
                      <h4 className="font-medium text-yellow-900">Limited Exceptions</h4>
                      <p className="text-yellow-700 text-sm mt-2">
                        While we strive to accommodate all refund requests, certain situations may not qualify 
                        for refunds, such as services that have been fully delivered and accepted, or cases 
                        where platform policy violations occurred on the customer's account.
                      </p>
                    </div>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="mt-8 bg-purple-600 rounded-2xl shadow-lg p-8 text-white text-center">
          <h2 className="text-2xl font-bold mb-4">Need to Request a Refund?</h2>
          <p className="text-purple-100 mb-6">
            Our customer support team is available 24/7 to assist with refund requests and any questions.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-purple-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors duration-200">
              Contact Support
            </button>
            <button className="border-2 border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-purple-600 transition-colors duration-200">
              Live Chat
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RefundPolicy;