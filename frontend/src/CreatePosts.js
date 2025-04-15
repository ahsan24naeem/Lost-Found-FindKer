import React, { useState } from 'react';
import axios from 'axios';

const CreatePost = () => {
  const [postData, setPostData] = useState({
    UserID: 1,  // Replace with actual user ID
    Title: '',
    ItemDescription: '',
    CategoryID: 1, // Example category
    ItemStatus: 'Lost',
    ItemLocation: '',
    ImageURL: ''
  });

  const handleChange = (e) => {
    setPostData({ ...postData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/items/create', postData);
      alert('Item added successfully');
    } catch (error) {
      console.error('Error adding item:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="text" name="Title" placeholder="Title" onChange={handleChange} required />
      <textarea name="ItemDescription" placeholder="Description" onChange={handleChange} required></textarea>
      <input type="text" name="ItemLocation" placeholder="Location" onChange={handleChange} required />
      <button type="submit">Add Item</button>
    </form>
  );
};

export default CreatePost;
