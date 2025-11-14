import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link as RouterLink } from 'react-router-dom';
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
  IconButton,
  CircularProgress,
  Divider
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  Email,
  Lock,
  Login as LoginIcon
} from '@mui/icons-material';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { Helmet } from 'react-helmet-async';
import { toast } from 'react-toastify';

import { login, reset } from '../../store/slices/authSlice';

const validationSchema = Yup.object({
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required'),
  password: Yup.string()
    .required('Password is required')
});

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const { user, isLoading, isError, isSuccess, message } = useSelector(
    (state) => state.auth
  );

  const from = location.state?.from?.pathname || '/dashboard';

  useEffect(() => {
    if (isError) {
      toast.error(message);
    }

    if (isSuccess || user) {
      navigate(from, { replace: true });
    }

    dispatch(reset());
  }, [user, isError, isSuccess, message, navigate, dispatch, from]);

  const handleSubmit = (values) => {
    dispatch(login(values));
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <>
      <Helmet>
        <title>Login - Span Tower 27</title>
        <meta name="description" content="Login to Span Tower 27 Condominium Management System" />
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
              <LoginIcon sx={{ fontSize: 48, color: 'primary.main', mb: 1 }} />
              <Typography component="h1" variant="h4" sx={{ fontWeight: 700 }}>
                Welcome Back
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Sign in to Span Tower 27 Management System
              </Typography>
            </Box>

            <Formik
              initialValues={{
                email: '',
                password: ''
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

                  <Field
                    as={TextField}
                    margin="normal"
                    required
                    fullWidth
                    name="password"
                    label="Password"
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    autoComplete="current-password"
                    value={values.password}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.password && Boolean(errors.password)}
                    helperText={touched.password && errors.password}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Lock color="action" />
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="toggle password visibility"
                            onClick={togglePasswordVisibility}
                            edge="end"
                          >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
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
                      'Sign In'
                    )}
                  </Button>

                  <Box sx={{ textAlign: 'center' }}>
                    <Link
                      component={RouterLink}
                      to="/forgot-password"
                      variant="body2"
                      sx={{ textDecoration: 'none' }}
                    >
                      Forgot your password?
                    </Link>
                  </Box>
                </Form>
              )}
            </Formik>

            <Divider sx={{ width: '100%', my: 3 }} />

            {/* Demo Credentials */}
            <Box sx={{ width: '100%', textAlign: 'center' }}>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Demo Credentials:
              </Typography>
              <Typography variant="caption" display="block" color="text.secondary">
                Administrator: admin@spantower27.org / AdminPassword123!
              </Typography>
              <Typography variant="caption" display="block" color="text.secondary">
                President: president@spantower27.org / President123!
              </Typography>
            </Box>
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

export default LoginPage;
