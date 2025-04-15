import React from 'react';
import { Container, Typography, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ItemForm from '../components/ItemForm';
import ProtectedRoute from '../components/ProtectedRoute';

const PostItem = () => {
  const navigate = useNavigate();

  const handleSuccess = () => {
    navigate('/');
  };

  return (
    <ProtectedRoute>
      <Container maxWidth="md">
        <Paper
          elevation={3}
          sx={{
            p: 4,
            mt: 4,
            mb: 4,
          }}
        >
          <Typography variant="h4" component="h1" gutterBottom>
            Post New Item
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph>
            Fill out the form below to report a lost or found item. Make sure to provide accurate
            details to help with the recovery process.
          </Typography>
          <ItemForm onSuccess={handleSuccess} />
        </Paper>
      </Container>
    </ProtectedRoute>
  );
};

export default PostItem; 