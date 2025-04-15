import React, { useEffect, useState } from 'react';
import axios from 'axios';

const RecentPosts = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5000/api/recent-posts')
      .then(response => setPosts(response.data))
      .catch(error => console.error('Error fetching items:', error));
  }, []);

  return (
    <div className="max-w-3xl mx-auto p-6 bg-gradient-to-br from-blue-50 to-blue-100 shadow-lg rounded-2xl">
      <h2 className="text-3xl font-bold text-center text-blue-700 mb-6">
        🛑 Recent Lost & Found Items 🔍
      </h2>
      <ul className="space-y-6">
        {posts.map((post) => (
          <li key={post.ItemID} className="p-5 bg-white rounded-xl shadow-md border-l-4 border-blue-500 transition hover:scale-105 hover:shadow-lg">
            <h3 className="text-xl font-semibold text-blue-700">{post.Title}</h3>
            <p className="text-gray-600">{post.ItemDescription}</p>
            <small className="text-gray-500 flex items-center mt-2">
              📍 <span className="ml-1 text-blue-600 font-medium">{post.ItemLocation}</span> 
              <span className="mx-2 text-gray-400">|</span> 
              📅 <span className="ml-1 text-blue-600">{new Date(post.DateReported).toLocaleDateString()}</span>
            </small>
          </li>
        ))}
      </ul>
    </div>
  );
  
  
};

export default RecentPosts;
