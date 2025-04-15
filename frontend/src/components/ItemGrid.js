import React from 'react';
import { Grid, Card, CardContent, CardMedia, Typography, Button, Chip, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';

const ItemGrid = ({ items }) => {
  const navigate = useNavigate();

  return (
    <Grid container spacing={3}>
      {items.map((item) => (
        <Grid item xs={12} sm={6} md={4} key={item.id}>
          <Card
            sx={{
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              cursor: 'pointer',
              '&:hover': {
                boxShadow: 6,
              },
            }}
            onClick={() => navigate(`/item/${item.id}`)}
          >
            <CardMedia
              component="img"
              height="140"
              image={item.imageUrl || '/images/placeholder.jpg'}
              alt={item.title}
            />
            <CardContent sx={{ flexGrow: 1 }}>
              <Typography gutterBottom variant="h6" component="h2">
                {item.title}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                {item.description.length > 100
                  ? `${item.description.substring(0, 100)}...`
                  : item.description}
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
                <Chip
                  label={item.type === 'lost' ? 'Lost' : 'Found'}
                  color={item.type === 'lost' ? 'error' : 'success'}
                  size="small"
                />
                <Chip label={item.category} size="small" />
              </Box>
              <Typography variant="caption" color="text.secondary">
                {format(new Date(item.dateReported), 'MMM d, yyyy')} • {item.location}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default ItemGrid; 