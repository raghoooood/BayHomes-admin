import Place from "@mui/icons-material/Place";
import BedIcon from "@mui/icons-material/Bed";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile"; // Use an icon that fits size
import { Link } from "react-router-dom";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import Stack from "@mui/material/Stack";

import type { DeveloperCardProps } from "interfaces/developer";

const DeveloperCard = ({
  id,
  projectName,
  location,
  images,
  startPrice,
  projectType,
  rooms,
  size,
}: DeveloperCardProps) => {
  return (
    <Card
      component={Link}
      to={`/projects/show/${id}`}
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
        image={images.backgroundImage}
        alt="Project image"
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
            {projectName}
          </Typography>
        </Stack>
      </CardContent>
    </Card>
  );
};

export default DeveloperCard;
