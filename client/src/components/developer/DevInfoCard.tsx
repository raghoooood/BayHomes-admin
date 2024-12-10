import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { Link } from "react-router-dom";

import type { devInfoCardProps } from "interfaces/devInfo";


const DevInfoCard = ({ id, devName, image }: devInfoCardProps) => {
  return (
    <Box
      component={Link}
      to={`/developers/show/${id}`}
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "16px",
        padding: "16px",
        textDecoration: "none",
        backgroundColor: "#fff",
        borderRadius: "10px",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
        transition: "box-shadow 0.3s ease",
        "&:hover": {
          boxShadow: "0 8px 16px rgba(0, 0, 0, 0.2)",
        },
      }}
    >
      {/* Image Section */}
      <img
        src={image}
        alt={devName}
        width="100%"
        style={{
          height: "200px",
          borderRadius: "8px",
          objectFit: "cover",
        }}
      />

      {/* Developer Name Section */}
      <Typography fontSize={18} fontWeight={600} color="#11142d">
        {devName}
      </Typography>
    </Box>
  );
};

export default DevInfoCard;
