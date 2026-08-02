import { Box, ButtonBase, Container, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import igdtuwLogo from "../../assets/colleges/igdtuw-transparent.png";
import nsutLogo from "../../assets/colleges/nsut-transparent.png";
import dtuLogo from "../../assets/colleges/dtu-transparent.png";
import iitDelhiLogo from "../../assets/colleges/iit-delhi-transparent.png";
import iiitDelhiLogo from "../../assets/colleges/iiit-delhi-transparent.png";
import { COLLEGES } from "../../utils/collegeUtils";
import "./CollegeSelection.css";

function CollegeSelection() {
  const navigate = useNavigate();

  const collegeLogoMap = {
    igdtuw: igdtuwLogo,
    nsut: nsutLogo,
    dtu: dtuLogo,
    "iit-delhi": iitDelhiLogo,
    "iiit-delhi": iiitDelhiLogo,
  };

  const handleSelectCollege = (collegeId) => {
    localStorage.setItem("selectedCollege", collegeId);
    navigate(`/role-selection?college=${collegeId}`);
  };

  return (
    <Box className="college-selection-page">
      <Container maxWidth="lg" className="college-selection-container">
        <Box className="college-selection-brand">
          <Typography variant="overline" className="college-selection-brand__eyebrow">
            PLACEWISE
          </Typography>
          <Typography variant="h3" component="h1" className="college-selection-title">
            Select Your College
          </Typography>
          <Typography variant="body1" className="college-selection-subtitle">
            Choose your college to access your personalized placement ecosystem.
          </Typography>
        </Box>

        <Box className="college-selection-grid" role="list">
          {COLLEGES.map((college) => (
            <ButtonBase
              key={college.id}
              component="button"
              className="college-choice-card"
              focusRipple
              aria-label={`Select ${college.name}`}
              onClick={() => handleSelectCollege(college.id)}
              role="listitem"
            >
              <Box
                className="college-choice-logo"
                sx={{ background: `linear-gradient(135deg, ${college.accent} 0%, ${college.accentSoft} 100%)` }}
                aria-hidden="true"
              >
                <img
                  src={collegeLogoMap[college.id] || college.logo}
                  alt={`${college.name} official logo`}
                  className="college-choice-logo-image"
                />
              </Box>

              <Typography variant="h6" component="span" className="college-choice-name">
                {college.name}
              </Typography>
            </ButtonBase>
          ))}
        </Box>
      </Container>
    </Box>
  );
}

export default CollegeSelection;
