import React from 'react';
import { useParams } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  Box,
  Grid,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
  CircularProgress,
} from '@mui/material';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { itemsApi } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { format } from 'date-fns';

const ItemDetails = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [claimDialogOpen, setClaimDialogOpen] = React.useState(false);
  const [verificationDetails, setVerificationDetails] = React.useState('');

  const { data: item, isLoading } = useQuery(['item', id], () =>
    itemsApi.getItemDetails(id)
  );

  const claimMutation = useMutation(
    (details) => itemsApi.claimItem(id, details),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['item', id]);
        setClaimDialogOpen(false);
        toast.success('Claim submitted successfully!');
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || 'Failed to submit claim');
      },
    }
  );

  if (isLoading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (!item) {
    return (
      <Container>
        <Typography variant="h5" color="error">
          Item not found
        </Typography>
      </Container>
    );
  }

  const handleClaim = () => {
    claimMutation.mutate({ verificationDetails });
  };

  return (
    <Container maxWidth="md">
      <Paper
        elevation={3}
        sx={{
          p: 4,
          mt: 4,
          mb: 4,
        }}
      >
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Box
              component="img"
              src={item.imageUrl || '/images/placeholder.jpg'}
              alt={item.title}
              sx={{
                width: '100%',
                height: 'auto',
                borderRadius: 2,
              }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="h4" component="h1" gutterBottom>
              {item.title}
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
              <Chip
                label={item.type === 'lost' ? 'Lost' : 'Found'}
                color={item.type === 'lost' ? 'error' : 'success'}
              />
              <Chip label={item.category} />
            </Box>
            <Typography variant="body1" paragraph>
              {item.description}
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              Location: {item.location}
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              Date Reported: {format(new Date(item.dateReported), 'MMM d, yyyy')}
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              Posted by: {item.postedBy.name}
            </Typography>

            {item.type === 'found' && user && (
              <Box sx={{ mt: 3 }}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => setClaimDialogOpen(true)}
                  disabled={item.claimed}
                >
                  {item.claimed ? 'Already Claimed' : 'Claim This Item'}
                </Button>
              </Box>
            )}
          </Grid>
        </Grid>
      </Paper>

      <Dialog open={claimDialogOpen} onClose={() => setClaimDialogOpen(false)}>
        <DialogTitle>Claim Item</DialogTitle>
        <DialogContent>
          <Typography variant="body1" paragraph>
            Please provide details to verify that this item belongs to you:
          </Typography>
          <TextField
            autoFocus
            margin="dense"
            label="Verification Details"
            fullWidth
            multiline
            rows={4}
            value={verificationDetails}
            onChange={(e) => setVerificationDetails(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setClaimDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={handleClaim}
            variant="contained"
            disabled={!verificationDetails || claimMutation.isLoading}
          >
            {claimMutation.isLoading ? 'Submitting...' : 'Submit Claim'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default ItemDetails; 