import React from 'react';
import {
  Container,
  Typography,
  Box,
  TextField,
  Button,
  Paper,
  Grid,
  CircularProgress,
  Tab,
  Tabs,
} from '@mui/material';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { useAuth } from '../context/AuthContext';
import { useQuery } from 'react-query';
import { itemsApi } from '../services/api';
import ItemGrid from '../components/ItemGrid';

const validationSchema = yup.object({
  name: yup
    .string()
    .min(2, 'Name should be of minimum 2 characters length')
    .required('Name is required'),
  email: yup
    .string()
    .email('Enter a valid email')
    .required('Email is required'),
});

const Profile = () => {
  const { user, updateProfile } = useAuth();
  const [tabValue, setTabValue] = React.useState(0);

  const formik = useFormik({
    initialValues: {
      name: user?.name || '',
      email: user?.email || '',
    },
    validationSchema: validationSchema,
    enableReinitialize: true,
    onSubmit: async (values) => {
      await updateProfile(values);
    },
  });

  const { data: userItems, isLoading: itemsLoading } = useQuery(
    ['user-items', user?.id],
    () => itemsApi.getUserItems(),
    {
      enabled: !!user,
    }
  );

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  if (!user) {
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
          Profile
        </Typography>

        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 4 }}>
          <Tabs value={tabValue} onChange={handleTabChange}>
            <Tab label="Personal Information" />
            <Tab label="My Posts" />
          </Tabs>
        </Box>

        {tabValue === 0 && (
          <Box component="form" onSubmit={formik.handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  id="name"
                  name="name"
                  label="Full Name"
                  value={formik.values.name}
                  onChange={formik.handleChange}
                  error={formik.touched.name && Boolean(formik.errors.name)}
                  helperText={formik.touched.name && formik.errors.name}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  id="email"
                  name="email"
                  label="Email Address"
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  error={formik.touched.email && Boolean(formik.errors.email)}
                  helperText={formik.touched.email && formik.errors.email}
                />
              </Grid>
              <Grid item xs={12}>
                <Button
                  color="primary"
                  variant="contained"
                  type="submit"
                  disabled={formik.isSubmitting}
                >
                  Update Profile
                </Button>
              </Grid>
            </Grid>
          </Box>
        )}

        {tabValue === 1 && (
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
              <ItemGrid items={userItems || []} />
            )}
          </Box>
        )}
      </Paper>
    </Container>
  );
};

export default Profile; 