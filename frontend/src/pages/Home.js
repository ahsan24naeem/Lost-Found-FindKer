import React from 'react';
import { Box, Typography, Button, Grid, Card, CardContent } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();

  return (
    <Box>
      {/* Hero Section */}
      <Box
        sx={{
          bgcolor: 'primary.main',
          color: 'white',
          py: 8,
          textAlign: 'center',
          mb: 4,
        }}
      >
        <Typography variant="h2" component="h1" gutterBottom>
          Lost & Found Portal
        </Typography>
        <Typography variant="h5" gutterBottom>
          Helping you reunite with your lost belongings
        </Typography>
        <Box sx={{ mt: 4 }}>
          <Button
            variant="contained"
            color="secondary"
            size="large"
            sx={{ mr: 2 }}
            onClick={() => navigate('/post-item')}
          >
            Report Lost Item
          </Button>
          <Button
            variant="outlined"
            color="inherit"
            size="large"
            onClick={() => navigate('/post-item')}
          >
            Report Found Item
          </Button>
        </Box>
      </Box>

      {/* Features Section */}
      <Grid container spacing={4} sx={{ mb: 4 }}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography gutterBottom variant="h5" component="h2">
                Search Items
              </Typography>
              <Typography>
                Browse through our database of lost and found items. Filter by category, location, or date.
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography gutterBottom variant="h5" component="h2">
                Secure Claims
              </Typography>
              <Typography>
                Our verification system ensures that items are returned to their rightful owners.
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography gutterBottom variant="h5" component="h2">
                Community Support
              </Typography>
              <Typography>
                Join our community to help others find their lost belongings and get help finding yours.
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Recent Posts Section */}
      <Typography variant="h4" component="h2" gutterBottom>
        Recent Posts
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6">Lost Wallet</Typography>
              <Typography color="text.secondary">Found near Central Park</Typography>
              <Typography variant="body2">Posted 2 days ago</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6">Found Keys</Typography>
              <Typography color="text.secondary">Found at Main Street</Typography>
              <Typography variant="body2">Posted 1 day ago</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6">Lost Phone</Typography>
              <Typography color="text.secondary">Last seen at Coffee Shop</Typography>
              <Typography variant="body2">Posted 3 hours ago</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Home; 