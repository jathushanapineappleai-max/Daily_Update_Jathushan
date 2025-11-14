import React, { useState, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Container,
  Paper,
  Box,
  TextField,
  Button,
  Typography,
  Alert,
  Link,
  InputAdornment,
  CircularProgress
} from '@mui/material';
import {
  Email,
  LockReset
} from '@mui/icons-material';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { Helmet } from 'react-helmet-async';
import { toast } from 'react-toastify';

import { forgotPassword, reset } from '../../store/slices/authSlice';

const validationSchema = Yup.object({
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required')
});

const ForgotPasswordPage = () => {
  const [emailSent, setEmailSent] = useState(false);
  const dispatch = useDispatch();

  const { isLoading, isError, isSuccess, message } = useSelector(
    (state) => state.auth
  );

  useEffect(() => {
    if (isError) {
      toast.error(message);
    }

    if (isSuccess) {
      setEmailSent(true);
      toast.success('Password reset instructions sent to your email');
    }

    dispatch(reset());
  }, [isError, isSuccess, message, dispatch]);

  const handleSubmit = (values) => {
    dispatch(forgotPassword(values.email));
  };

  if (emailSent) {
    return (
      <>
        <Helmet>
          <title>Password Reset Sent - Span Tower 27</title>
        </Helmet>

        <Container component="main" maxWidth="sm">
          <Box
            sx={{
              marginTop: 8,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              minHeight: '80vh'
            }}
          >
            <Paper
              elevation={3}
              sx={{
                padding: 4,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                width: '100%',
                borderRadius: 2
              }}
            >
              <LockReset sx={{ fontSize: 48, color: 'success.main', mb: 2 }} />
              <Typography component="h1" variant="h4" sx={{ fontWeight: 700, mb: 2 }}>
                Check Your Email
              </Typography>
              <Typography variant="body1" color="text.secondary" textAlign="center" sx={{ mb: 3 }}>
                We've sent password reset instructions to your email address.
                Please check your inbox and follow the link to reset your password.
              </Typography>

              <Alert severity="info" sx={{ width: '100%', mb: 3 }}>
                If you don't see the email in your inbox, please check your spam folder.
              </Alert>

              <Box sx={{ display: 'flex', gap: 2, width: '100%' }}>
                <Button
                  component={RouterLink}
                  to="/login"
                  variant="contained"
                  fullWidth
                >
                  Back to Login
                </Button>
                <Button
                  variant="outlined"
                  fullWidth
                  onClick={() => setEmailSent(false)}
                >
                  Try Again
                </Button>
              </Box>
            </Paper>
          </Box>
        </Container>
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>Forgot Password - Span Tower 27</title>
        <meta name="description" content="Reset your password for Span Tower 27 Condominium Management System" />
      </Helmet>

      <Container component="main" maxWidth="sm">
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            minHeight: '80vh'
          }}
        >
          <Paper
            elevation={3}
            sx={{
              padding: 4,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              width: '100%',
              borderRadius: 2
            }}
          >
            {/* Logo and Title */}
            <Box sx={{ mb: 3, textAlign: 'center' }}>
              <LockReset sx={{ fontSize: 48, color: 'primary.main', mb: 1 }} />
              <Typography component="h1" variant="h4" sx={{ fontWeight: 700 }}>
                Forgot Password?
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Enter your email address and we'll send you instructions to reset your password
              </Typography>
            </Box>

            <Formik
              initialValues={{
                email: ''
              }}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
            >
              {({ errors, touched, values, handleChange, handleBlur }) => (
                <Form style={{ width: '100%' }}>
                  <Field
                    as={TextField}
                    margin="normal"
                    required
                    fullWidth
                    id="email"
                    label="Email Address"
                    name="email"
                    autoComplete="email"
                    autoFocus
                    value={values.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.email && Boolean(errors.email)}
                    helperText={touched.email && errors.email}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Email color="action" />
                        </InputAdornment>
                      ),
                    }}
                  />

                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    disabled={isLoading}
                    sx={{ mt: 3, mb: 2, py: 1.5 }}
                  >
                    {isLoading ? (
                      <CircularProgress size={24} color="inherit" />
                    ) : (
                      'Send Reset Instructions'
                    )}
                  </Button>

                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="body2" color="text.secondary">
                      Remember your password?{' '}
                      <Link
                        component={RouterLink}
                        to="/login"
                        variant="body2"
                        sx={{ textDecoration: 'none' }}
                      >
                        Sign in here
                      </Link>
                    </Typography>
                  </Box>
                </Form>
              )}
            </Formik>
          </Paper>

          {/* Back to Home */}
          <Box sx={{ mt: 2 }}>
            <Link
              component={RouterLink}
              to="/"
              variant="body2"
              sx={{ textDecoration: 'none' }}
            >
              ← Back to Home
            </Link>
          </Box>
        </Box>
      </Container>
    </>
  );
};

export default ForgotPasswordPage;
