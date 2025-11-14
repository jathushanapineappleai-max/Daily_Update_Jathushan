import React from "react";
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  CardMedia,
  AppBar,
  Toolbar,
  useTheme,
} from "@mui/material";
import {
  Login as LoginIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  LocationOn as LocationIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";

const HomePage = () => {
  const theme = useTheme();
  const navigate = useNavigate();

  const contactInfo = [
    {
      role: "President",
      name: "Mr. Rajesh Kumar",
      phone: "+94 77 123 4567",
      email: "president@spantower27.org",
    },
    {
      role: "Secretary",
      name: "Mrs. Priya Fernando",
      phone: "+94 77 234 5678",
      email: "secretary@spantower27.org",
    },
    {
      role: "Treasurer",
      name: "Mr. Sunil Perera",
      phone: "+94 77 345 6789",
      email: "treasurer@spantower27.org",
    },
  ];

  const projectDetails = {
    floors: "Basement + Ground + 8",
    totalUnits: 88,
    unitTypes: "2 & 3 Bedroom",
    sqFtRange: "935 - 1,450",
    completion: "April 5, 2023",
    developer: "Sansiy Engineering (Pvt) Ltd",
  };

  const amenities = [
    "Spacious roof terrace for private functions",
    "Modern elevator system",
    "Security system with CCTV surveillance",
    "24/7 security personnel",
    "Backup power generator",
    "Water storage and pumping system",
    "Landscaped common areas",
    "Visitor parking facilities",
  ];

  return (
    <>
      <Helmet>
        <title>Span Tower 27 - Condominium Management System</title>
        <meta
          name="description"
          content="Welcome to Span Tower 27 Condominium Management System. Secure, role-based platform for residents and administration."
        />
      </Helmet>

      {/* Header */}
      <AppBar
        position="static"
        elevation={0}
        sx={{ backgroundColor: "transparent", color: "inherit" }}
      >
        <Toolbar>
          <Typography
            variant="h6"
            component="div"
            sx={{
              flexGrow: 1,
              color: theme.palette.primary.main,
              fontWeight: 700,
            }}
          >
            Span Tower 27
          </Typography>
          <Button
            variant="contained"
            startIcon={<LoginIcon />}
            onClick={() => navigate("/login")}
            sx={{ ml: 2 }}
          >
            Login
          </Button>
        </Toolbar>
      </AppBar>

      {/* Hero Section */}
      <Box
        sx={{
          background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
          color: "white",
          py: { xs: 8, md: 12 },
          position: "relative",
          overflow: "hidden",
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <Typography
                variant="h2"
                component="h1"
                gutterBottom
                sx={{
                  fontWeight: 700,
                  fontSize: { xs: "2.5rem", md: "3.5rem" },
                  lineHeight: 1.2,
                }}
              >
                Welcome to Span Tower 27
              </Typography>
              <Typography
                variant="h5"
                component="h2"
                gutterBottom
                sx={{
                  fontWeight: 400,
                  opacity: 0.9,
                  mb: 4,
                }}
              >
                Modern Condominium Management System
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  fontSize: "1.1rem",
                  lineHeight: 1.6,
                  mb: 4,
                  opacity: 0.9,
                }}
              >
                Experience seamless community living with our comprehensive
                management platform. From financial transparency to maintenance
                tracking, we've got everything covered.
              </Typography>
              <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
                <Button
                  variant="contained"
                  size="large"
                  onClick={() => navigate("/login")}
                  sx={{
                    backgroundColor: "white",
                    color: theme.palette.primary.main,
                    "&:hover": {
                      backgroundColor: "rgba(255, 255, 255, 0.9)",
                    },
                  }}
                >
                  Access Portal
                </Button>
                <Button
                  variant="outlined"
                  size="large"
                  sx={{
                    borderColor: "white",
                    color: "white",
                    "&:hover": {
                      borderColor: "white",
                      backgroundColor: "rgba(255, 255, 255, 0.1)",
                    },
                  }}
                >
                  Learn More
                </Button>
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Card
                  sx={{
                    maxWidth: 400,
                    borderRadius: 4,
                    boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
                  }}
                >
                  <CardMedia
                    component="img"
                    height="300"
                    image="/SpanTower27.jpg"
                    alt="Span Tower 27 Building"
                    sx={{ objectFit: "cover" }}
                  />
                </Card>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Project Details Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Typography
          variant="h3"
          component="h2"
          textAlign="center"
          gutterBottom
          sx={{ fontWeight: 700, mb: 6 }}
        >
          Project Overview
        </Typography>
        <Grid container spacing={4}>
          <Grid item xs={6} md={2}>
            <Card sx={{ textAlign: "center", p: 3, height: "100%" }}>
              <Typography
                variant="h4"
                sx={{ fontWeight: 700, color: theme.palette.primary.main }}
              >
                {projectDetails.floors}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Floors
              </Typography>
            </Card>
          </Grid>
          <Grid item xs={6} md={2}>
            <Card sx={{ textAlign: "center", p: 3, height: "100%" }}>
              <Typography
                variant="h4"
                sx={{ fontWeight: 700, color: theme.palette.primary.main }}
              >
                {projectDetails.totalUnits}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Total Units
              </Typography>
            </Card>
          </Grid>
          <Grid item xs={6} md={2}>
            <Card sx={{ textAlign: "center", p: 3, height: "100%" }}>
              <Typography
                variant="h4"
                sx={{ fontWeight: 700, color: theme.palette.primary.main }}
              >
                {projectDetails.unitTypes}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Unit Types
              </Typography>
            </Card>
          </Grid>
          <Grid item xs={6} md={2}>
            <Card sx={{ textAlign: "center", p: 3, height: "100%" }}>
              <Typography
                variant="h4"
                sx={{ fontWeight: 700, color: theme.palette.primary.main }}
              >
                {projectDetails.sqFtRange}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Sq.Ft Range
              </Typography>
            </Card>
          </Grid>
          <Grid item xs={6} md={2}>
            <Card sx={{ textAlign: "center", p: 3, height: "100%" }}>
              <Typography
                variant="h4"
                sx={{ fontWeight: 700, color: theme.palette.primary.main }}
              >
                2023
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Completed
              </Typography>
            </Card>
          </Grid>
          <Grid item xs={6} md={2}>
            <Card sx={{ textAlign: "center", p: 3, height: "100%" }}>
              <Typography
                variant="h4"
                sx={{ fontWeight: 700, color: theme.palette.primary.main }}
              >
                A+
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Rating
              </Typography>
            </Card>
          </Grid>
        </Grid>
      </Container>

      {/* About Section */}
      <Box sx={{ backgroundColor: theme.palette.grey[50], py: 8 }}>
        <Container maxWidth="lg">
          <Grid container spacing={6} alignItems="center">
            <Grid item xs={12} md={6}>
              <Typography
                variant="h3"
                component="h2"
                gutterBottom
                sx={{ fontWeight: 700 }}
                color="primary"
              >
                About Span Tower 27
              </Typography>
              <Typography
                variant="body1"
                paragraph
                sx={{ fontSize: "1.1rem", lineHeight: 1.7 }}
                color="black"
              >
                Located at No. 77, Angulana Station Road, Moratuwa, Span Tower
                27 represents modern luxury living with 88 elegantly designed
                apartments across Basement + Ground Floor + 8 floors.
              </Typography>
              <Typography
                variant="body1"
                paragraph
                sx={{ fontSize: "1.1rem", lineHeight: 1.7 }}
                color="black"
              >
                Developed by Sansiy Engineering (Pvt) Ltd, a subsidiary of Span
                Engineering (Pvt) Ltd, this project features 2 and 3 bedroom
                units with spacious living areas, modern amenities, and a great
                view of nature, greenery, and partial sea view.
              </Typography>
              <Typography
                variant="body1"
                paragraph
                sx={{ fontSize: "1.1rem", lineHeight: 1.7 }}
                color="black"
              >
                Strategically located just 10 minutes from Galle Road with easy
                access to universities, colleges, Ratmalana Airport, and
                supermarkets. The project was completed on April 5, 2023.
              </Typography>
              <Box sx={{ display: "flex", alignItems: "center", mt: 3 }}>
                <LocationIcon
                  sx={{ color: theme.palette.primary.main, mr: 1 }}
                />
                <Typography variant="body1">
                  No. 77, Angulana Station Road, Moratuwa
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Card sx={{ borderRadius: 4 }}>
                <CardMedia
                  component="img"
                  height="400"
                  image="/LivingRoom1.jpg"
                  alt="Span Tower 27 Interior"
                  sx={{ objectFit: "cover" }}
                />
              </Card>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Amenities Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Typography
          variant="h3"
          component="h2"
          textAlign="center"
          gutterBottom
          sx={{ fontWeight: 700, mb: 6 }}
        >
          Premium Amenities
        </Typography>
        <Grid container spacing={3}>
          {amenities.map((amenity, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Box sx={{ display: "flex", alignItems: "center", p: 2 }}>
                <Box
                  sx={{
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    backgroundColor: theme.palette.primary.main,
                    mr: 2,
                    flexShrink: 0,
                  }}
                />
                <Typography variant="body1">{amenity}</Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Vision & Mission Section */}
      <Box
        sx={{
          backgroundColor: theme.palette.primary.main,
          color: "white",
          py: 8,
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={6}>
            <Grid item xs={12} md={6}>
              <Typography
                variant="h4"
                component="h2"
                gutterBottom
                sx={{ fontWeight: 700 }}
              >
                Our Vision
              </Typography>
              <Typography
                variant="body1"
                sx={{ fontSize: "1.1rem", lineHeight: 1.7 }}
              >
                To create a harmonious and sustainable living environment where
                residents enjoy modern amenities, transparent governance, and a
                strong sense of community. We strive to be a model condominium
                that sets the standard for quality living and professional
                management in Sri Lanka.
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography
                variant="h4"
                component="h2"
                gutterBottom
                sx={{ fontWeight: 700 }}
              >
                Our Mission
              </Typography>
              <Typography
                variant="body1"
                sx={{ fontSize: "1.1rem", lineHeight: 1.7 }}
              >
                To provide exceptional residential services through innovative
                technology, transparent financial management, efficient
                maintenance systems, and open communication channels. We are
                committed to enhancing the quality of life for all residents
                while maintaining the highest standards of security and comfort.
              </Typography>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Contact Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Typography
          variant="h3"
          component="h2"
          textAlign="center"
          gutterBottom
          sx={{ fontWeight: 700, mb: 6 }}
        >
          Contact Our Management Team
        </Typography>
        <Grid container spacing={4}>
          {contactInfo.map((contact, index) => (
            <Grid item xs={12} md={4} key={index}>
              <Card
                sx={{
                  textAlign: "center",
                  p: 3,
                  height: "100%",
                  transition: "transform 0.3s ease-in-out",
                  "&:hover": {
                    transform: "translateY(-4px)",
                    boxShadow: "0 8px 16px rgba(0,0,0,0.1)",
                  },
                }}
              >
                <CardContent>
                  <Typography
                    variant="h6"
                    component="h3"
                    gutterBottom
                    sx={{ fontWeight: 600, color: theme.palette.primary.main }}
                  >
                    {contact.role}
                  </Typography>
                  <Typography
                    variant="h6"
                    gutterBottom
                    sx={{ fontWeight: 500 }}
                  >
                    {contact.name}
                  </Typography>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      mb: 1,
                    }}
                  >
                    <PhoneIcon
                      sx={{
                        fontSize: 18,
                        mr: 1,
                        color: theme.palette.text.secondary,
                      }}
                    />
                    <Typography variant="body2" color="text.secondary">
                      {contact.phone}
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <EmailIcon
                      sx={{
                        fontSize: 18,
                        mr: 1,
                        color: theme.palette.text.secondary,
                      }}
                    />
                    <Typography variant="body2" color="text.secondary">
                      {contact.email}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Footer */}
      <Box
        sx={{
          backgroundColor: theme.palette.grey[900],
          color: "white",
          py: 4,
          textAlign: "center",
        }}
      >
        <Container maxWidth="lg">
          <Typography variant="body2" sx={{ opacity: 0.8 }}>
            © 2024 Span Tower 27. All rights reserved. Developed by Span
            Engineering (Pvt) Ltd.
          </Typography>
        </Container>
      </Box>
    </>
  );
};

export default HomePage;
