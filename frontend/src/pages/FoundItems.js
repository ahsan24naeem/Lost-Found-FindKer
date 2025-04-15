import React, { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Paper,
  CircularProgress,
} from '@mui/material';
import { useQuery } from 'react-query';
import { itemsApi } from '../services/api';
import ItemGrid from '../components/ItemGrid';

const categories = [
  'All',
  'Electronics',
  'Documents',
  'Clothing',
  'Accessories',
  'Books',
  'Other',
];

const FoundItems = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('All');
  const [location, setLocation] = useState('');

  const { data: items, isLoading } = useQuery(
    ['found-items', { searchTerm, category, location }],
    () => itemsApi.getFoundItems({ searchTerm, category, location }),
    {
      enabled: true,
    }
  );

  return (
    <Container maxWidth="lg">
      <Paper
        elevation={3}
        sx={{
          p: 4,
          mt: 4,
          mb: 4,
        }}
      >
        <Typography variant="h4" component="h1" gutterBottom>
          Found Items
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          Browse through the list of found items. Use the filters below to narrow down your search.
        </Typography>

        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              label="Search by title or description"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <FormControl fullWidth>
              <InputLabel>Category</InputLabel>
              <Select
                value={category}
                label="Category"
                onChange={(e) => setCategory(e.target.value)}
              >
                {categories.map((cat) => (
                  <MenuItem key={cat} value={cat}>
                    {cat}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              label="Location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </Grid>
        </Grid>

        {isLoading ? (
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              height: '200px',
            }}
          >
            <CircularProgress />
          </Box>
        ) : (
          <ItemGrid items={items || []} />
        )}
      </Paper>
    </Container>
  );
};

export default FoundItems; 