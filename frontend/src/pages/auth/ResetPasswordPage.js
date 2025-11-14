import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link as RouterLink } from 'react-router-dom';
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
  CircularProgress
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  Lock,
  LockReset
} from '@mui/icons-material';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { Helmet } from 'react-helmet-async';
import { toast } from 'react-toastify';

import { resetPassword, reset } from '../../store/slices/authSlice';

const validationSchema = Yup.object({
  password: Yup.string()
    .min(8, 'Password must be at least 8 characters')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
      'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
    )
    .required('Password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password'), null], 'Passwords must match')
    .required('Please confirm your password')
});

const ResetPasswordPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();
  const { token } = useParams();
  const dispatch = useDispatch();

  const { isLoading, isError, isSuccess, message } = useSelector(
    (state) => state.auth
  );

  useEffect(() => {
    if (isError) {
      toast.error(message);
    }

    if (isSuccess) {
      toast.success('Password reset successfully! You can now login with your new password.');
      navigate('/login');
    }

    dispatch(reset());
  }, [isError, isSuccess, message, navigate, dispatch]);

  const handleSubmit = (values) => {
    dispatch(resetPassword({ token, password: values.password }));
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  if (!token) {
    return (
      <Container maxWidth="sm">
        <Box sx={{ mt: 8, textAlign: 'center' }}>
          <Alert severity="error" sx={{ mb: 2 }}>
            Invalid or missing reset token. Please request a new password reset.
          </Alert>
          <Link component={RouterLink} to="/forgot-password" variant="body2">
            Request Password Reset
          </Link>
        </Box>
      </Container>
    );
  }

  return (
    <>
      <Helmet>
        <title>Reset Password - Span Tower 27</title>
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
                Reset Password
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Enter your new password below
              </Typography>
            </Box>

            <Formik
              initialValues={{
                password: '',
                confirmPassword: ''
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
                    name="password"
                    label="New Password"
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    autoComplete="new-password"
                    autoFocus
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

                  <Field
                    as={TextField}
                    margin="normal"
                    required
                    fullWidth
                    name="confirmPassword"
                    label="Confirm New Password"
                    type={showConfirmPassword ? 'text' : 'password'}
                    id="confirmPassword"
                    autoComplete="new-password"
                    value={values.confirmPassword}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.confirmPassword && Boolean(errors.confirmPassword)}
                    helperText={touched.confirmPassword && errors.confirmPassword}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Lock color="action" />
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="toggle confirm password visibility"
                            onClick={toggleConfirmPasswordVisibility}
                            edge="end"
                          >
                            {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
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
                      'Reset Password'
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

            {/* Password Requirements */}
            <Box sx={{ mt: 3, width: '100%' }}>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Password Requirements:
              </Typography>
              <Typography variant="caption" display="block" color="text.secondary">
                • At least 8 characters long
              </Typography>
              <Typography variant="caption" display="block" color="text.secondary">
                • Contains uppercase and lowercase letters
              </Typography>
              <Typography variant="caption" display="block" color="text.secondary">
                • Contains at least one number
              </Typography>
              <Typography variant="caption" display="block" color="text.secondary">
                • Contains at least one special character (@$!%*?&)
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

export default ResetPasswordPage;
