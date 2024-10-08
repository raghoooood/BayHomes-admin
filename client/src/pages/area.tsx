import { useList, useTable } from "@refinedev/core";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";  // Import the Button component
import { useNavigate } from "react-router-dom";  // Import useNavigate hook

import { AreaCard, CustomButton } from "components";
import Add from "@mui/icons-material/Add";
import { useMemo } from "react";
import { TextField } from "@mui/material";

const Area = () => {
   const { data, isLoading, isError } = useList({ resource: "areas" });
  const navigate = useNavigate();  // Initialize the navigation hook
 
  const allAreas = data?.data ?? [];

 

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error...</div>;

  return (
    <Box position="relative" padding="20px">
      <Typography fontSize={25} fontWeight={700} color="#11142d" mb={3}>
        {!allAreas.length ? "There are no areas" : "All Areas"}
      </Typography>


      {/* Button for navigating to create area page */}
      <Box position="absolute" top="10px" right="20px" zIndex={1000}>
        <CustomButton
          title="Add Area"
          handleClick={() => navigate("/areas/create")}
          backgroundColor="#dc743c"
          color="#fcfcfc"
          icon={<Add />}
        />
      </Box>

    
      <Box
        mt="20px"
        sx={{
          display: "flex",
          flexWrap: "wrap",
          gap: "20px",
          backgroundColor: "#fcfcfc",
        }}
      >
        {allAreas.map((area) => (
          <AreaCard
                key={area._id}
                id={area._id}
                areaName={area.areaName}
                image={area.image} 
         />
        ))}
      </Box>
    </Box>
  );
};

export default Area;
