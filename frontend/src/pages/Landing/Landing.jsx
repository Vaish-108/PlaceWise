import React from "react";
import { Box, ButtonBase, Container, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import "./Landing.css";

function Landing() {
  const navigate = useNavigate();

  return (
    <Box className="landing-page">
      <Container maxWidth="lg" className="landing-container">
        <Box className="landing-brand">
          <Typography variant="overline" className="landing-brand__eyebrow">
            PlaceWise
          </Typography>
          <Typography variant="h3" component="h1" className="landing-title">
            Select Your College
          </Typography>
          <Typography variant="body1" className="landing-subtitle">
            Choose your college to access the placement portal and continue your
            journey with PlaceWise.
          </Typography>
        </Box>

        <Box className="landing-grid">
          <ButtonBase
            component="div"
            className="college-card"
            focusRipple
            aria-label="Select IGDTUW"
            onClick={() => navigate("/role-selection?college=igdtuw")}
          >
            <Box className="college-card__logo" aria-hidden="true">
              <Typography variant="h5" component="span" className="college-card__logo-text">
                IG
              </Typography>
            </Box>

            <Box className="college-card__content">
              <Typography variant="h5" component="h2" className="college-card__name">
                IGDTUW
              </Typography>
              <Typography variant="body2" className="college-card__subtitle">
                Indira Gandhi Delhi Technical University for Women
              </Typography>
              <Typography variant="caption" className="college-card__tag">
                Placement Portal
              </Typography>
            </Box>
          </ButtonBase>
        </Box>
      </Container>
    </Box>
  );
}

export default Landing;
