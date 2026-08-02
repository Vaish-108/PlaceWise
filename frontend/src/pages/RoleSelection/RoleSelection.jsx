import React from "react";
import { Box, ButtonBase, Container, Typography } from "@mui/material";
import { useNavigate, useSearchParams } from "react-router-dom";
import { getCollegeDisplayName } from "../../utils/collegeUtils";
import "./RoleSelection.css";

function RoleSelection() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const college = searchParams.get("college") || localStorage.getItem("selectedCollege") || "";
  const collegeLabel = college ? getCollegeDisplayName(college) : "your college";

  return (
    <Box className="role-selection-page">
      <Container maxWidth="lg" className="role-selection-container">
        <Box className="role-selection-brand">
          <Typography variant="overline" className="role-selection-brand__eyebrow">
            PlaceWise
          </Typography>
          <Typography variant="h3" component="h1" className="role-selection-title">
            How would you like to continue?
          </Typography>
          <Typography variant="body1" className="role-selection-subtitle">
            You’re continuing with <strong>{collegeLabel}</strong> for your placement journey.
          </Typography>
        </Box>

        <Box className="role-selection-grid">
          <ButtonBase
            className="role-card role-card--student"
            onClick={() => navigate(`/login?college=${college || ""}`)}
          >
            <Box className="role-card__content">
              <Typography variant="h5" component="h2" className="role-card__title">
                STUDENT
              </Typography>
              <Typography variant="body2" className="role-card__text">
                Access your student placement portal
              </Typography>
            </Box>
          </ButtonBase>

          <ButtonBase
            className="role-card role-card--admin"
            onClick={() => navigate(`/admin/login?college=${college || ""}`)}
          >
            <Box className="role-card__content">
              <Typography variant="h5" component="h2" className="role-card__title">
                ADMIN
              </Typography>
              <Typography variant="body2" className="role-card__text">
                Manage your college placement activities
              </Typography>
            </Box>
          </ButtonBase>
        </Box>

        <Box className="role-selection-actions">
          <ButtonBase className="back-link" onClick={() => navigate("/")}>
            ← Back to college selection
          </ButtonBase>
        </Box>
      </Container>
    </Box>
  );
}

export default RoleSelection;
