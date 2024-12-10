import { useList } from "@refinedev/core";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";  // Import the Button component
import { useNavigate } from "react-router-dom";  // Import useNavigate hook

import { DevInfoCard, CustomButton } from "components";
import Add from "@mui/icons-material/Add";

const Developer = () => {
  const { data, isLoading, isError } = useList({ resource: "developers" });
  const navigate = useNavigate();  // Initialize the navigation hook

  const allDev = data?.data ?? [];

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error...</div>;

  return (
    <Box position="relative">
      {/* Button for navigating to create developer page */}
      <Box position="absolute" top="10px" right="20px" zIndex={1000}>
        <CustomButton
          title="Add Developer"
          handleClick={() => navigate("/developers/create")}
          backgroundColor="#dc743c"
          color="#fcfcfc"
          icon={<Add />}
        />
      </Box>

      <Typography fontSize={25} fontWeight={700} color="#11142d">
      Developers List
      </Typography>

      <Box
        mt="20px"
        sx={{
          display: "flex",
          flexWrap: "wrap",
          gap: "20px",
          backgroundColor: "#fcfcfc",
        }}
      >
        {allDev.map((devInfo) => (
          <DevInfoCard
                key={devInfo._id}
                id={devInfo._id}
                devName={devInfo.developerName}
                image={devInfo.image} 
         />
        ))}
      </Box>
    </Box>
  );
};

export default Developer;
