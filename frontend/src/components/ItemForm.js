import React from 'react';
import { useFormik } from 'formik';
import * as yup from 'yup';
import {
  Box,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Typography,
} from '@mui/material';
import { useDropzone } from 'react-dropzone';
import { itemsApi } from '../services/api';
import { toast } from 'react-toastify';

const validationSchema = yup.object({
  title: yup.string().required('Title is required'),
  description: yup.string().required('Description is required'),
  category: yup.string().required('Category is required'),
  location: yup.string().required('Location is required'),
  type: yup.string().required('Type is required'),
  privateDetails: yup.string().when('type', {
    is: 'lost',
    then: (schema) => schema.required('Private details are required for lost items'),
  }),
});

const categories = [
  'Electronics',
  'Documents',
  'Clothing',
  'Accessories',
  'Books',
  'Other',
];

const ItemForm = ({ onSuccess }) => {
  const formik = useFormik({
    initialValues: {
      title: '',
      description: '',
      category: '',
      location: '',
      type: 'lost',
      privateDetails: '',
      image: null,
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      try {
        const formData = new FormData();
        Object.keys(values).forEach((key) => {
          if (values[key] !== null) {
            formData.append(key, values[key]);
          }
        });

        await itemsApi.createItem(formData);
        toast.success('Item posted successfully!');
        onSuccess?.();
      } catch (error) {
        toast.error(error.response?.data?.message || 'Failed to post item');
      }
    },
  });

  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png'],
    },
    maxFiles: 1,
    onDrop: (acceptedFiles) => {
      formik.setFieldValue('image', acceptedFiles[0]);
    },
  });

  return (
    <Box component="form" onSubmit={formik.handleSubmit} sx={{ mt: 3 }}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <TextField
            fullWidth
            id="title"
            name="title"
            label="Title"
            value={formik.values.title}
            onChange={formik.handleChange}
            error={formik.touched.title && Boolean(formik.errors.title)}
            helperText={formik.touched.title && formik.errors.title}
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            fullWidth
            id="description"
            name="description"
            label="Description"
            multiline
            rows={4}
            value={formik.values.description}
            onChange={formik.handleChange}
            error={formik.touched.description && Boolean(formik.errors.description)}
            helperText={formik.touched.description && formik.errors.description}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <FormControl fullWidth>
            <InputLabel id="category-label">Category</InputLabel>
            <Select
              labelId="category-label"
              id="category"
              name="category"
              value={formik.values.category}
              onChange={formik.handleChange}
              error={formik.touched.category && Boolean(formik.errors.category)}
            >
              {categories.map((category) => (
                <MenuItem key={category} value={category}>
                  {category}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={6}>
          <FormControl fullWidth>
            <InputLabel id="type-label">Type</InputLabel>
            <Select
              labelId="type-label"
              id="type"
              name="type"
              value={formik.values.type}
              onChange={formik.handleChange}
              error={formik.touched.type && Boolean(formik.errors.type)}
            >
              <MenuItem value="lost">Lost</MenuItem>
              <MenuItem value="found">Found</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12}>
          <TextField
            fullWidth
            id="location"
            name="location"
            label="Location"
            value={formik.values.location}
            onChange={formik.handleChange}
            error={formik.touched.location && Boolean(formik.errors.location)}
            helperText={formik.touched.location && formik.errors.location}
          />
        </Grid>

        {formik.values.type === 'lost' && (
          <Grid item xs={12}>
            <TextField
              fullWidth
              id="privateDetails"
              name="privateDetails"
              label="Private Details (for verification)"
              value={formik.values.privateDetails}
              onChange={formik.handleChange}
              error={formik.touched.privateDetails && Boolean(formik.errors.privateDetails)}
              helperText={formik.touched.privateDetails && formik.errors.privateDetails}
            />
          </Grid>
        )}

        <Grid item xs={12}>
          <Box
            {...getRootProps()}
            sx={{
              border: '2px dashed',
              borderColor: 'primary.main',
              borderRadius: 2,
              p: 3,
              textAlign: 'center',
              cursor: 'pointer',
            }}
          >
            <input {...getInputProps()} />
            <Typography>
              {formik.values.image
                ? formik.values.image.name
                : 'Drag and drop an image here, or click to select'}
            </Typography>
          </Box>
        </Grid>

        <Grid item xs={12}>
          <Button
            color="primary"
            variant="contained"
            fullWidth
            type="submit"
            disabled={formik.isSubmitting}
          >
            Post Item
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ItemForm; 