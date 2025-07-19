import React, { useEffect, useState } from "react";
import {
  Rss,
  Calendar,
  User as UserIcon,
  ArrowRight,
  Loader2,
  Info,
  PlusCircle,
  XCircle,
  CheckCircle,
} from "lucide-react";
import axios from "axios"; // Axios import for API calls
import { Link } from "react-router-dom"; // Import Link for navigation

// `user` prop add kiya gaya hai
const Blog = ({ user }) => {
  const [blogPosts, setBlogPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // State for the new blog post form
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newPostTitle, setNewPostTitle] = useState("");
  const [newPostContent, setNewPostContent] = useState("");
  // Author ab logged-in user (admin) ki ID hogi
  // const [newPostAuthor, setNewPostAuthor] = useState(""); // Ab iski zaroorat nahi hai directly user._id use karenge
  const [newPostImageFile, setNewPostImageFile] = useState(null); // File upload ke liye naya state
  const [formLoading, setFormLoading] = useState(false);
  const [formMessage, setFormMessage] = useState(null); // { type: 'success' | 'error', text: '...' }

  // Function to fetch blog posts from the backend
  const fetchBlogPosts = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get(
        "http://localhost:5000/followerApi/blogPosts"
      );

      // Backend (profile.js) se direct array aane ki ummeed hai, { posts: [...] } nahi.
      // Agar backend se empty array ya kuch aur aata hai, to mock data use karein.
      const fetchedData =
        Array.isArray(res.data) && res.data.length > 0
          ? res.data
          : [
              {
                _id: "60c72b1f9f1b2c001c8e4d1a",
                title: "Boosting Your Social Presence: A Comprehensive Guide",
                content:
                  "Learn the best strategies to organically grow your followers, likes, and engagement across various social media platforms. From content creation tips to understanding algorithms, this guide covers it all. This is a longer content to test snippet generation.",
                // `author` field backend se populated object hoga jismein `name` property hogi
                author: { _id: "adminId1", name: "FollowersCart Admin" },
                createdAt: "2025-07-15T10:00:00.000Z",
              },
              {
                _id: "60c72b1f9f1b2c001c8e4d1b",
                title: "The Power of Watch Time: YouTube Algorithm Explained",
                content:
                  "Discover why watch time is crucial for YouTube success and how you can optimize your videos to keep viewers engaged longer. Practical tips for creators. This post dives deep into the metrics that matter most.",
                author: { _id: "adminId2", name: "Usman Ali" },
                createdAt: "2025-07-10T12:30:00.000Z",
              },
              {
                _id: "60c72b1f9f1b2c001c8e4d1c",
                title: "Instagram Engagement Hacks for Small Businesses",
                content:
                  "Unlock the secrets to higher engagement on Instagram. This post shares actionable hacks for small businesses to connect with their audience and drive sales. Learn about hashtags, Reels, and Stories.",
                author: { _id: "adminId3", name: "Guest Author" },
                createdAt: "2025-07-05T15:45:00.000Z",
              },
            ];

      const fetchedAndFormattedPosts = fetchedData.map((post) => ({
        id: post._id,
        title: post.title,
        date: new Date(post.createdAt).toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        }),
        // `post.author.name` ka use karein agar author populated hai, warna default
        author: post.author && post.author.name ? post.author.name : "Admin",
        snippet:
          post.snippet ||
          (post.content
            ? post.content.substring(0, 150) + "..."
            : "No snippet available."),
        link: `/blog/${post._id}`,
      }));
      setBlogPosts(fetchedAndFormattedPosts);
    } catch (err) {
      console.error("Error fetching blog posts:", err);
      setError("Failed to load blog posts. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogPosts();
  }, []); // Run once on component mount

  // Handle new blog post submission
  const handleNewPostSubmit = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    setFormMessage(null);

    // Backend API call ke liye token bhejna zaroori hai agar route protected hai
    const token = localStorage.getItem("token");
    if (!token) {
      setFormMessage({
        type: "error",
        text: "Authentication token not found. Please log in as an admin.",
      });
      setFormLoading(false);
      return;
    }

    // Ensure user is an admin to create a post
    if (!user || user.role !== "admin" || !user._id) {
      setFormMessage({
        type: "error",
        text: "You must be logged in as an admin to create a blog post.",
      });
      setFormLoading(false);
      return;
    }

    try {
      const formData = new FormData();
      formData.append("title", newPostTitle);
      formData.append("content", newPostContent);
      formData.append("authorId", user._id); // Backend expecting authorId (user's _id)
      if (newPostImageFile) {
        formData.append("image", newPostImageFile); // 'image' field name backend ke upload.single('image') se match hona chahiye
      }

      const config = {
        headers: {
          "x-auth-token": token, // Token ko headers mein bhejein
          "Content-Type": "multipart/form-data", // Important for file uploads
        },
      };

      const res = await axios.post(
        "http://localhost:5000/followerApi/blogPosts",
        formData, // FormData object bhejein
        config // config ko pass karein
      );

      setFormMessage({
        type: "success",
        text: res.data.msg || "Blog post created successfully!",
      });

      // Clear form fields
      setNewPostTitle("");
      setNewPostContent("");
      // setNewPostAuthor(""); // Ab iski zaroorat nahi hai
      setNewPostImageFile(null); // Clear selected file
      setShowCreateForm(false); // Hide form after successful submission

      // Refresh the blog posts list
      fetchBlogPosts();
    } catch (err) {
      console.error("Error creating blog post:", err.response?.data || err);
      setFormMessage({
        type: "error",
        text:
          err.response?.data?.error ||
          err.response?.data?.msg ||
          "Failed to create blog post. Please try again.",
      });
    } finally {
      setFormLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8 text-center">
          <div className="flex items-center justify-center mb-4">
            <Rss className="h-12 w-12 text-purple-600" />
            <h1 className="text-4xl font-bold text-gray-900 ml-4">Our Blog</h1>
          </div>
          <p className="text-gray-600 text-lg">
            Stay updated with the latest social media trends, tips, and news
            from FollowersCart.
          </p>
        </div>

        {/* Button to toggle New Blog Post Form - Conditionally Rendered */}
        {/* Sirf admin users ko dikhayega */}
        {user && user.role === "admin" && (
          <div className="mb-8 text-center">
            <button
              onClick={() => setShowCreateForm(!showCreateForm)}
              className="px-6 py-3 bg-purple-600 text-white rounded-lg font-semibold text-lg shadow-md hover:bg-purple-700 transition-colors duration-200 flex items-center justify-center mx-auto"
            >
              {showCreateForm ? (
                <>
                  <XCircle className="h-5 w-5 mr-2" /> Hide Blog Form
                </>
              ) : (
                <>
                  <PlusCircle className="h-5 w-5 mr-2" /> Create New Blog Post
                </>
              )}
            </button>
          </div>
        )}

        {/* New Blog Post Form - Conditionally Rendered */}
        {/* Sirf admin users ko dikhayega aur tab jab showCreateForm true ho */}
        {user && user.role === "admin" && showCreateForm && (
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Create New Blog Post
            </h2>
            {formMessage && (
              <div
                className={`p-3 rounded-lg mb-4 text-white font-medium flex items-center ${
                  formMessage.type === "success" ? "bg-green-500" : "bg-red-500"
                }`}
              >
                {formMessage.type === "success" ? (
                  <CheckCircle className="h-5 w-5 mr-2" />
                ) : (
                  <XCircle className="h-5 w-5 mr-2" />
                )}
                {formMessage.text}
              </div>
            )}
            <form onSubmit={handleNewPostSubmit} className="space-y-6">
              <div>
                <label
                  htmlFor="newPostTitle"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="newPostTitle"
                  value={newPostTitle}
                  onChange={(e) => setNewPostTitle(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-200"
                  placeholder="Enter blog post title"
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="newPostContent"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Content <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="newPostContent"
                  value={newPostContent}
                  onChange={(e) => setNewPostContent(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-200 h-40 resize-y"
                  placeholder="Write your blog post content here..."
                  required
                ></textarea>
              </div>
              {/* Image URL field ko file upload se replace karein */}
              <div>
                <label
                  htmlFor="newPostImageFile"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Upload Image (Optional)
                </label>
                <input
                  type="file"
                  id="newPostImageFile"
                  accept="image/*" // Sirf image files accept karein
                  onChange={(e) => setNewPostImageFile(e.target.files[0])}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-200 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100"
                />
                {newPostImageFile && (
                  <p className="mt-2 text-sm text-gray-500">
                    Selected file: {newPostImageFile.name}
                  </p>
                )}
              </div>
              <button
                type="submit"
                disabled={formLoading}
                className="w-full bg-purple-600 text-white py-3 rounded-lg font-semibold text-lg hover:bg-purple-700 transition-colors duration-200 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {formLoading ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin mr-2" />{" "}
                    Submitting...
                  </>
                ) : (
                  <>
                    <PlusCircle className="h-5 w-5 mr-2" /> Add Blog Post
                  </>
                )}
              </button>
            </form>
          </div>
        )}

        {/* Loading, Error, or Blog Posts Grid */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="h-12 w-12 animate-spin text-purple-600" />
            <span className="ml-4 text-xl text-gray-600">
              Loading blog posts...
            </span>
          </div>
        ) : error ? (
          <div className="text-center text-red-600 py-16 flex flex-col items-center">
            <Info className="h-12 w-12 mb-4" />
            <p className="text-lg">{error}</p>
            <p className="text-md text-gray-500 mt-2">
              Please ensure your backend server is running and the blog posts
              API is accessible.
            </p>
          </div>
        ) : blogPosts.length === 0 ? (
          <div className="text-center text-gray-500 py-16 flex flex-col items-center">
            <Info className="h-12 w-12 mb-4" />
            <p className="text-lg">No blog posts found.</p>
            <p className="text-md mt-2">
              Looks like there are no articles to display yet.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogPosts.map((post) => (
              // Wrap the entire card with Link
              <Link
                to={post.link}
                key={post.id}
                className="block bg-white rounded-xl shadow-md overflow-hidden transform transition-transform duration-300 hover:scale-105 hover:shadow-xl group" // Added group class for hover effects
              >
                <div className="p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-3 leading-tight group-hover:text-purple-700 transition-colors duration-200">
                    {post.title}
                  </h2>
                  <div className="flex items-center text-sm text-gray-500 mb-4">
                    <Calendar className="h-4 w-4 mr-1" />
                    <span>{post.date}</span>
                    <UserIcon className="h-4 w-4 ml-4 mr-1" />
                    <span>{post.author}</span>
                  </div>
                  <p className="text-gray-700 mb-5 text-base">{post.snippet}</p>
                  {/* "Read More" button also uses Link */}
                  <div className="inline-flex items-center text-purple-600 font-medium group-hover:text-purple-800 transition-colors duration-200">
                    Read More{" "}
                    <ArrowRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform duration-200" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Call to action or pagination (placeholder) */}
        {blogPosts.length > 0 && !loading && (
          <div className="mt-12 text-center">
            <button className="px-6 py-3 bg-purple-600 text-white rounded-lg font-semibold text-lg shadow-md hover:bg-purple-700 transition-colors duration-200">
              Load More Posts
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Blog;
