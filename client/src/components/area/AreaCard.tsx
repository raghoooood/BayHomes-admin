import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { Link } from "react-router-dom";

import type { AreaCardProps } from "interfaces/area";

// Function to check if an image URL is valid
function checkImage(url: string) {
  const img = new Image();
  img.src = url;
  return img.width !== 0 && img.height !== 0;
}

const AreaCard = ({ id, areaName, image }: AreaCardProps) => {
  return (
    <Box
      component={Link}
      to={`/areas/show/${id}`}
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
        alt={areaName}
        width="100%"
        style={{
          height: "200px",
          borderRadius: "8px",
          objectFit: "cover",
        }}
      />

      {/* Area Name Section */}
      <Typography fontSize={18} fontWeight={600} color="#11142d">
        {areaName}
      </Typography>
    </Box>
  );
};

export default AreaCard;
