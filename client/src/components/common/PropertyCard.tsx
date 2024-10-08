import Place from "@mui/icons-material/Place";
import BedIcon from "@mui/icons-material/Bed";
import BathtubIcon from "@mui/icons-material/Bathtub";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile"; // Use an icon that fits size
import { Link } from "react-router-dom";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import Stack from "@mui/material/Stack";

import type { PropertyCardProps } from "interfaces/property";


const PropertyCard = ({
  id,
  title,
  price,
  backgroundImage,
  numOfrooms,
  numOfbathrooms,
  size,
  type,
  area,
  location,
}: PropertyCardProps) => {

  console.log(area.areaName);
  return (
    <Card
      component={Link}
      to={`/properties/show/${id}`}
      sx={{
        maxWidth: 330,
        padding: 2,
        borderRadius: 2,
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
        transition: "box-shadow 0.3s ease",
        "&:hover": {
          boxShadow: "0 12px 24px rgba(0, 0, 0, 0.2)",
        },
        cursor: "pointer",
      }}
      elevation={0}
    >
      <CardMedia
        component="img"
        height={210}
        image={backgroundImage}
        alt="Property image"
        sx={{ borderRadius: 2 }}
      />
      <CardContent
        sx={{
          display: "flex",
          flexDirection: "column",
          padding: 2,
        }}
      >
        <Stack spacing={1}>
          <Typography variant="h6" fontWeight={500} color="text.primary">
            {title}
          </Typography>
          <Typography variant="h6" fontWeight={500} color="text.primary">
            {type}
          </Typography>
          <Box mb={1}>
            <Typography fontSize={16} fontWeight={600} color="#00796b">
              AED {price}
            </Typography>
          </Box>
          <Stack direction="row" spacing={1} alignItems="center">
            <Place sx={{ fontSize: 18, color: "text.secondary" }} />
            <Typography fontSize={14} color="text.secondary">
             {location.city} , {area.areaName} , {location.street}
            </Typography>
          </Stack>
          <Stack direction="row" spacing={2} alignItems="center">
            <Stack direction="row" spacing={0.5} alignItems="center">
              <BedIcon sx={{ fontSize: 16, color: "text.secondary" }} />
              <Typography fontSize={14} color="text.secondary">
                {numOfrooms}
              </Typography>
            </Stack>
            <Stack direction="row" spacing={0.5} alignItems="center">
              <BathtubIcon sx={{ fontSize: 16, color: "text.secondary" }} />
              <Typography fontSize={14} color="text.secondary">
                {numOfbathrooms}
              </Typography>
            </Stack>
            <Stack direction="row" spacing={0.5} alignItems="center">
              <InsertDriveFileIcon sx={{ fontSize: 16, color: "text.secondary" }} />
              <Typography fontSize={14} color="text.secondary">
                {size} sqft
              </Typography>
            </Stack>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
};

export default PropertyCard;
