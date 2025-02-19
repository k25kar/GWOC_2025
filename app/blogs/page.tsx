'use client';
import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface Blog {
  _id: string;
  title: string;
  content: string;
  author: string;
  createdAt: string;
}

const BlogPage: React.FC = () => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [selectedBlog, setSelectedBlog] = useState<Blog | null>(null);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await axios.get('/api/blogs/blogs');
        setBlogs(response.data);
      } catch (error) {
        console.error('Error fetching blogs:', error);
      }
    };

    fetchBlogs();
  }, []);

  const handleClick = (blog: Blog) => {
    setSelectedBlog(blog);
  };

  const handleCloseModal = () => {
    setSelectedBlog(null);
  };

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-white p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Blogs</h1>

        {/* Responsive Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {blogs.length === 0 ? (
            <p className="text-center text-gray-400">No blogs available</p>
          ) : (
            blogs.map((blog) => (
              <div
                key={blog._id}
                className="bg-[#1a1a1a] p-6 rounded-lg cursor-pointer hover:bg-[#333] transition"
                onClick={() => handleClick(blog)}
              >
                <h2 className="text-xl font-bold text-white">{blog.title}</h2>
                <p className="text-sm text-gray-400">By {blog.author}</p>
                <p className="mt-4 text-gray-300">{blog.content.slice(0, 100)}...</p>
              </div>
            ))
          )}
        </div>

        {/* Modal for Blog Details */}
        {selectedBlog && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
            onClick={handleCloseModal} // Close modal when clicked outside
          >
            <div
              className="bg-[#1a1a1a] p-6 rounded-lg w-full sm:w-3/4 md:w-1/2 lg:w-2/5 xl:w-1/3 max-w-[75vw] max-h-[75vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()} // Prevent the modal from closing if clicked inside
            >
              <h2 className="text-2xl font-bold text-white">{selectedBlog.title}</h2>
              <p className="text-sm text-gray-400 mt-2">By {selectedBlog.author}</p>
              <p className="mt-4 text-gray-300">{selectedBlog.content}</p>
              <button
                className="mt-6 border border-red-500 text-white py-2 px-4 rounded hover:bg-red-700"
                onClick={handleCloseModal}
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BlogPage;
