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
            PLACEWISE
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
              <Box className="role-card__icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M12 12.5a3.75 3.75 0 1 0-3.75-3.75A3.75 3.75 0 0 0 12 12.5Zm0 1.5c-3.7 0-6.75 2.18-6.75 4.88V20h13.5v-1.12C18.75 16.18 15.7 14 12 14Z" />
                </svg>
              </Box>

              <Typography variant="h5" component="h2" className="role-card__title">
                STUDENT
              </Typography>

              <Box
                className="role-card__arrow-button"
                aria-label="Continue as student"
                onClick={(event) => {
                  event.stopPropagation();
                  navigate(`/login?college=${college || ""}`);
                }}
              >
                →
              </Box>
            </Box>
          </ButtonBase>

          <ButtonBase
            className="role-card role-card--admin"
            onClick={() => navigate(`/admin/login?college=${college || ""}`)}
          >
            <Box className="role-card__content">
              <Box className="role-card__icon role-card__icon--admin" aria-hidden="true">
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M12 2.5 18.5 5v5.8c0 4.6-2.62 8.95-6.5 10.7-3.88-1.75-6.5-6.1-6.5-10.7V5L12 2.5Zm0 4.2 3.8 1.6v3.3c0 3.06-1.72 5.86-3.8 7.04-2.08-1.18-3.8-3.98-3.8-7.04V8.3L12 6.7Zm-1 3.8h2v5h-2v-5Zm1 7.1a1.2 1.2 0 1 0 1.2 1.2 1.2 1.2 0 0 0-1.2-1.2Z" />
                </svg>
              </Box>

              <Typography variant="h5" component="h2" className="role-card__title">
                ADMIN
              </Typography>

              <Box
                className="role-card__arrow-button"
                aria-label="Continue as admin"
                onClick={(event) => {
                  event.stopPropagation();
                  navigate(`/admin/login?college=${college || ""}`);
                }}
              >
                →
              </Box>
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
