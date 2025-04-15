import React, { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
  Tab,
  Tabs,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Grid,
} from '@mui/material';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { adminApi } from '../services/api';
import { toast } from 'react-toastify';
import ProtectedRoute from '../components/ProtectedRoute';

const AdminPanel = () => {
  const [tabValue, setTabValue] = useState(0);
  const [selectedDispute, setSelectedDispute] = useState(null);
  const [resolution, setResolution] = useState('');
  const queryClient = useQueryClient();

  const { data: flaggedItems, isLoading: itemsLoading } = useQuery(
    'flagged-items',
    adminApi.getFlaggedItems
  );

  const { data: statistics, isLoading: statsLoading } = useQuery(
    'statistics',
    adminApi.getStatistics
  );

  const resolveDisputeMutation = useMutation(
    (data) => adminApi.resolveDispute(selectedDispute.id, data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('flagged-items');
        setSelectedDispute(null);
        setResolution('');
        toast.success('Dispute resolved successfully');
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || 'Failed to resolve dispute');
      },
    }
  );

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleResolveDispute = () => {
    resolveDisputeMutation.mutate({ resolution });
  };

  return (
    <ProtectedRoute requireAdmin>
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
            Admin Panel
          </Typography>

          <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 4 }}>
            <Tabs value={tabValue} onChange={handleTabChange}>
              <Tab label="Flagged Items" />
              <Tab label="Statistics" />
            </Tabs>
          </Box>

          {tabValue === 0 && (
            <Box>
              {itemsLoading ? (
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
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Item Title</TableCell>
                        <TableCell>Category</TableCell>
                        <TableCell>Reason</TableCell>
                        <TableCell>Reported By</TableCell>
                        <TableCell>Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {flaggedItems?.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell>{item.title}</TableCell>
                          <TableCell>{item.category}</TableCell>
                          <TableCell>{item.flagReason}</TableCell>
                          <TableCell>{item.reportedBy.name}</TableCell>
                          <TableCell>
                            <Button
                              variant="contained"
                              color="primary"
                              onClick={() => setSelectedDispute(item)}
                            >
                              Resolve
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </Box>
          )}

          {tabValue === 1 && (
            <Box>
              {statsLoading ? (
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
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6} md={3}>
                    <Paper sx={{ p: 2, textAlign: 'center' }}>
                      <Typography variant="h6">Total Users</Typography>
                      <Typography variant="h4">{statistics?.totalUsers}</Typography>
                    </Paper>
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <Paper sx={{ p: 2, textAlign: 'center' }}>
                      <Typography variant="h6">Total Items</Typography>
                      <Typography variant="h4">{statistics?.totalItems}</Typography>
                    </Paper>
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <Paper sx={{ p: 2, textAlign: 'center' }}>
                      <Typography variant="h6">Resolved Claims</Typography>
                      <Typography variant="h4">{statistics?.resolvedClaims}</Typography>
                    </Paper>
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <Paper sx={{ p: 2, textAlign: 'center' }}>
                      <Typography variant="h6">Pending Disputes</Typography>
                      <Typography variant="h4">{statistics?.pendingDisputes}</Typography>
                    </Paper>
                  </Grid>
                </Grid>
              )}
            </Box>
          )}
        </Paper>

        <Dialog
          open={!!selectedDispute}
          onClose={() => setSelectedDispute(null)}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>Resolve Dispute</DialogTitle>
          <DialogContent>
            <Box sx={{ mt: 2 }}>
              <Typography variant="h6" gutterBottom>
                Item Details
              </Typography>
              <Typography>
                <strong>Title:</strong> {selectedDispute?.title}
              </Typography>
              <Typography>
                <strong>Category:</strong> {selectedDispute?.category}
              </Typography>
              <Typography>
                <strong>Flag Reason:</strong> {selectedDispute?.flagReason}
              </Typography>

              <TextField
                fullWidth
                multiline
                rows={4}
                label="Resolution"
                value={resolution}
                onChange={(e) => setResolution(e.target.value)}
                sx={{ mt: 2 }}
              />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setSelectedDispute(null)}>Cancel</Button>
            <Button
              onClick={handleResolveDispute}
              variant="contained"
              disabled={!resolution || resolveDisputeMutation.isLoading}
            >
              {resolveDisputeMutation.isLoading ? 'Resolving...' : 'Resolve'}
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </ProtectedRoute>
  );
};

export default AdminPanel; 