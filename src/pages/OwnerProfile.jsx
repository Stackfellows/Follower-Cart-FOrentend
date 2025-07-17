import React, { useEffect, useState } from "react";
import {
  User as UserIcon,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  Info as InfoIcon,
  Loader2, // For loading spinner
} from "lucide-react";
import axios from "axios"; // Axios import for API calls

const OwnerProfile = () => {
  const [ownerData, setOwnerData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOwnerProfile = async () => {
      setLoading(true);
      setError(null);
      try {
        // Assuming a backend endpoint for owner profile data
        // You would need to implement this endpoint in your Node.js backend (e.g., in auth.js or a new ownerRoutes.js)
        // Example backend structure for owner data: { _id, name, title, email, phone, location, bio, profileImageUrl }
        const res = await axios.get(
          "http://localhost:5000/followerApi/ownerProfile"
        );

        // Mock data for demonstration if API is not yet implemented or returns empty
        const mockOwnerData = {
          name: "Mustahab Ali",
          title: "Founder & CEO, FollowersCart",
          email: "followerscart90@gmail.com",
          phone: "+92 341 3732952",
          location: "Lahore, Pakistan",
          bio: "Mustahab Ali is the visionary behind FollowersCart, dedicated to helping individuals and businesses enhance their digital presence across various social media platforms. With years of experience in digital marketing and social media growth strategies, Usman founded FollowersCart to provide reliable and effective solutions for online visibility. He is passionate about empowering clients to achieve their social media goals through ethical and sustainable practices.",
          profileImageUrl:
            "https://placehold.co/150x150/A78BFA/ffffff?text=Usman",
          vision:
            "My vision for FollowersCart is to be the most trusted and effective partner for individuals and businesses aiming to amplify their voice and presence in the digital world. We believe in fostering genuine connections and providing tools that truly help our clients thrive, without compromising on quality or ethics.",
        };

        // Use fetched data if available, otherwise use mock data
        setOwnerData(res.data.owner || mockOwnerData);
      } catch (err) {
        console.error("Error fetching owner profile:", err);
        setError("Failed to load owner profile. Please try again later.");
        // Fallback to mock data on error as well, for better UX
        setOwnerData({
          name: "Mustahab Ali",
          title: "Founder & CEO, FollowersCart",
          email: "followerscart90@gmail.com",
          phone: "+92 341 3732952",
          location: "Lahore, Pakistan",
          bio: "Mustahab Ali is the visionary behind FollowersCart, dedicated to helping individuals and businesses enhance their digital presence across various social media platforms. With years of experience in digital marketing and social media growth strategies, Usman founded FollowersCart to provide reliable and effective solutions for online visibility. He is passionate about empowering clients to achieve their social media goals through ethical and sustainable practices.",
          profileImageUrl:
            "https://placehold.co/150x150/A78BFA/ffffff?text=Usman",
          vision:
            "My vision for FollowersCart is to be the most trusted and effective partner for individuals and businesses aiming to amplify their voice and presence in the digital world. We believe in fostering genuine connections and providing tools that truly help our clients thrive, without compromising on quality or ethics.",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchOwnerProfile();
  }, []); // Empty dependency array means this runs once on mount

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 flex justify-center items-center">
        <Loader2 className="h-12 w-12 animate-spin text-purple-600" />
        <span className="ml-4 text-xl text-gray-600">
          Loading owner profile...
        </span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 flex flex-col items-center justify-center text-red-600">
        <InfoIcon className="h-12 w-12 mb-4" />
        <p className="text-lg">{error}</p>
        <p className="text-md text-gray-500 mt-2">
          Please ensure your backend server is running and the owner profile API
          is accessible.
        </p>
      </div>
    );
  }

  if (!ownerData) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 flex flex-col items-center justify-center text-gray-500">
        <InfoIcon className="h-12 w-12 mb-4" />
        <p className="text-lg">Owner profile data not available.</p>
        <p className="text-md mt-2">There was an issue loading the profile.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Profile Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 text-center relative">
          {/* Profile Image */}
          <div className="relative w-32 h-32 mx-auto -mt-20 mb-6 rounded-full overflow-hidden border-4 border-white shadow-lg">
            <img
              src={ownerData.profileImageUrl}
              alt={`${ownerData.name}'s Profile`}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src =
                  "https://placehold.co/150x150/A78BFA/ffffff?text=User";
              }} // Fallback
            />
          </div>

          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {ownerData.name}
          </h1>
          <p className="text-purple-600 text-lg font-semibold mb-4">
            {ownerData.title}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left mt-6">
            <div className="flex items-center text-gray-700">
              <Mail className="h-5 w-5 text-gray-500 mr-3" />
              <span>{ownerData.email}</span>
            </div>
            <div className="flex items-center text-gray-700">
              <Phone className="h-5 w-5 text-gray-500 mr-3" />
              <span>{ownerData.phone}</span>
            </div>
            <div className="flex items-center text-gray-700">
              <MapPin className="h-5 w-5 text-gray-500 mr-3" />
              <span>{ownerData.location}</span>
            </div>
            <div className="flex items-center text-gray-700">
              <Briefcase className="h-5 w-5 text-gray-500 mr-3" />
              <span>FollowersCart</span>
            </div>
          </div>
        </div>

        {/* About Me Section */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
            <InfoIcon className="h-6 w-6 text-purple-600 mr-2" /> About Me
          </h2>
          <p className="text-gray-700 leading-relaxed">{ownerData.bio}</p>
        </div>

        {/* My Vision Section */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
            <Briefcase className="h-6 w-6 text-purple-600 mr-2" /> My Vision
          </h2>
          <p className="text-gray-700 leading-relaxed">{ownerData.vision}</p>
        </div>
      </div>
    </div>
  );
};

export default OwnerProfile;
