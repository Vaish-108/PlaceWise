const igdtuwLogo = "https://www.igdtuw.ac.in/igdtuw-logo.png";
const nsutLogo = "https://nsut.ac.in/sites/default/files/logo_nsut_0_0_0.png";
const dtuLogo = "https://dtu.ac.in/Web/images/ImageLogo.jpg";
const iitDelhiLogo = "https://home.iitd.ac.in/public/storage/news_images/372246_1785139703.png";
const iiitDelhiLogo = "https://iiitd.ac.in/sites/default/files/style3colorsmall.png";

export const COLLEGES = [
  {
    id: "igdtuw",
    name: "IGDTUW",
    logo: igdtuwLogo,
    accent: "#7c3aed",
    accentSoft: "#a78bfa",
  },
  {
    id: "nsut",
    name: "NSUT",
    logo: nsutLogo,
    accent: "#0f766e",
    accentSoft: "#2dd4bf",
  },
  {
    id: "dtu",
    name: "DTU",
    logo: dtuLogo,
    accent: "#c2410c",
    accentSoft: "#fb923c",
  },
  {
    id: "iit-delhi",
    name: "IIT Delhi",
    logo: iitDelhiLogo,
    accent: "#2563eb",
    accentSoft: "#60a5fa",
  },
  {
    id: "iiit-delhi",
    name: "IIIT Delhi",
    logo: iiitDelhiLogo,
    accent: "#991b1b",
    accentSoft: "#f87171",
  },
];

export const getCollegeDisplayName = (collegeId) => {
  const college = COLLEGES.find((entry) => entry.id === collegeId);

  return college?.name || "";
};
