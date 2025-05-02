import React, { useState } from 'react';
import { 
  Container, 
  Box, 
  Typography, 
  Stepper, 
  Step, 
  StepLabel,
  Button,
  Paper,
  Alert
} from '@mui/material';
import Footer from './components/Footer';
import SellerNav from './components/SellerNav';
import axios from 'axios';
import ProductDetailsForm from './components/ProductForms/ProductDetailsForm';
import ProductSpecsForm from './components/ProductForms/ProductSpecsForm';
import ProductMediaForm from './components/ProductForms/ProductMediaForm';
import ProductPricingForm from './components/ProductForms/ProductPricingForm';

const steps = ['Basic Info', 'Specifications', 'Media', 'Pricing'];

const AddProduct = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    quantity_in_stock: '',
    category: 'Electronics',
    width_cm: '',
    height_cm: '',
    depth_cm: '',
    weight_kg: '',
    sku: '',
    barcode: '',
    condition: 'new',
    is_digital: false,
    requires_shipping: true,
    tax_class: 'standard'
  });
  const [images, setImages] = useState([]);
  // const [createProduct, { isLoading, isError, isSuccess }] = useCreateProductMutation();

  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [validationError, setValidationError] = useState('');

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const validateForm = () => {
    const requiredFields = ['name', 'description', 'price', 'quantity_in_stock', 'category'];
    for (const field of requiredFields) {
      if (!formData[field] || formData[field].toString().trim() === '') {
        setValidationError(`Please fill in the ${field} field.`);
        return false;
      }
    }
  
    if (isNaN(parseFloat(formData.price)) || parseFloat(formData.price) <= 0) {
      setValidationError('Please enter a valid price.');
      return false;
    }
  
    if (isNaN(parseInt(formData.quantity_in_stock)) || parseInt(formData.quantity_in_stock) < 0) {
      setValidationError('Please enter a valid quantity in stock.');
      return false;
    }
  
    setValidationError('');
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return; // Stop submission if validation fails
    }

    try {
      setLoading(true);
      setError(false);

      const Data = new FormData();

      Data.append('name', formData.name);
      Data.append('description', formData.description);
      Data.append('price', parseFloat(formData.price));
      Data.append('quantity_in_stock', Number(formData.quantity_in_stock).toFixed(0));
      Data.append('sku', formData.sku);
      Data.append('barcode', formData.barcode);
      Data.append('category', formData.category);
      Data.append('width_cm', formData.width_cm ? parseFloat(formData.width_cm) : '');
      Data.append('height_cm', formData.height_cm ? parseFloat(formData.height_cm) : '');
      Data.append('depth_cm', formData.depth_cm ? parseFloat(formData.depth_cm) : '');
      Data.append('weight_kg', formData.weight_kg ? parseFloat(formData.weight_kg) : '');
      Data.append('condition', formData.condition);
      Data.append('is_digital', formData.is_digital);
      Data.append('requires_shipping', formData.requires_shipping);
      Data.append('tax_class', formData.tax_class);

      // Append images to FormData
      images.forEach((image, index) => {
        Data.append('images', image); // 'images' is the field name multer will look for
      });

      // Send the FormData object via axios
      await axios.post("http://localhost:5000/api/products", Data, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${localStorage.getItem('authToken')}`,
        },
      });

      setLoading(false);
      setSuccess(true);
    } catch (err) {
      console.error('Failed to create product:', err);
      setError(err.message);
      setLoading(false);
    }
  };

  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <ProductDetailsForm
            formData={formData} 
            setFormData={setFormData} 
          />
        );
      case 1:
        return (
          <ProductSpecsForm
            formData={formData} 
            setFormData={setFormData} 
          />
        );
      case 2:
        return (
          <ProductMediaForm 
            images={images} 
            setImages={setImages} 
          />
        );
      case 3:
        return (
          <ProductPricingForm 
            formData={formData} 
            setFormData={setFormData} 
          />
        );
      default:
        return null;
    }
  };

  return (
    <SellerNav>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
          <Typography variant="h4" gutterBottom sx={{ fontWeight: 700 }}>
            Add New Product
          </Typography>
          
          <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>

          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              Failed to create product. Please try again.
            </Alert>
          )}

          {validationError && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {validationError}
            </Alert>
          )}

          {success ? (
            <Box textAlign="center" py={6}>
              <Typography variant="h5" color="success.main" gutterBottom>
                Product Created Successfully!
              </Typography>
              <Button 
                variant="contained" 
                href="/seller/products"
                sx={{ mt: 2 }}
              >
                View Products
              </Button>
            </Box>
          ) : (
            <>
              {renderStepContent(activeStep)}
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
                <Button
                  disabled={activeStep === 0}
                  onClick={handleBack}
                  variant="outlined"
                >
                  Back
                </Button>
                
                {activeStep === steps.length - 1 ? (
                  <Button
                    variant="contained"
                    onClick={handleSubmit}
                    disabled={loading}
                  >
                    {loading ? 'Creating...' : 'Create Product'}
                  </Button>
                ) : (
                  <Button
                    variant="contained"
                    onClick={handleNext}
                  >
                    Next
                  </Button>
                )}
              </Box>
            </>
          )}
        </Paper>
      </Container>
      <Footer />
    </SellerNav>
  );
};

export default AddProduct;