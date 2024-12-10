import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Grid from "@mui/material/Grid";
import { useState } from "react";
import { useDelete, useGetIdentity, useShow } from "@refinedev/core";
import { useParams, useNavigate } from "react-router-dom";
import ChatBubble from "@mui/icons-material/ChatBubble";
import Delete from "@mui/icons-material/Delete";
import Edit from "@mui/icons-material/Edit";
import Phone from "@mui/icons-material/Phone";
import Place from "@mui/icons-material/Place";

import { CustomButton } from "components";

// Function to check if an image URL is valid
function checkImage(url: string) {
  const img = new Image();
  img.src = url;
  return img.width > 0 && img.height > 0;
}

const AreaDetails = () => {
  const navigate = useNavigate();
  const { data: user } = useGetIdentity({ v3LegacyAuthProviderCompatible: true });
  const { query: queryResult } = useShow();
  const { mutate } = useDelete();
  const { id } = useParams<{ id: string }>();
  const { data, isLoading, isError } = queryResult;
  const areaDetails = data?.data ?? {};


  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Something went wrong!</div>;

  const isCurrentUser = user?.email === areaDetails.creator?.email;

  const handleDeleteArea = () => {
    if (window.confirm("Are you sure you want to delete this area?")) {
      mutate(
        { resource: "areas", id: id as string },
        {
          onSuccess: () => navigate("/areas"),
        }
      );
    }
  };

 
  return (
    <Box
      borderRadius="15px"
      padding="20px"
      bgcolor="#FCFCFC"
      width="fit-content"
    >
      <Typography fontSize={25} fontWeight={700} color="#11142D">
        Area Details
      </Typography>

      <Box mt="20px" display="flex" flexDirection={{ xs: "column", lg: "row" }} gap={4}>
        <Box flex={1} maxWidth={764}>
        <img
          src={areaDetails.image}
          alt="area_main_img"
          style={{
            width: "100%",
            height: "auto",
            borderRadius: "10px",
            objectFit: "cover",
          }}
        />

          <Stack mt="15px" spacing={3}>
            <Typography fontSize={18} fontWeight={700} color="#11142D">
                  {areaDetails.areaName}
                </Typography>

          

            <Stack mt="25px" spacing="10px">
              <Typography fontSize={18} color="#11142D">
                Description
              </Typography>
              <Typography fontSize={14} color="#808191">
                {areaDetails.description}
              </Typography>
            </Stack>
          </Stack>

          <Grid item xs={12} >
                <Typography fontSize={16} fontWeight={600} color="#11142D">
                  Property Features
                </Typography>
                {areaDetails.features?.map((feature: string, index: number) => (
                    <Typography key={index} fontSize={18} fontWeight={700} color="#dc743c">
                      {index + 1} / {feature}
                    </Typography>
                  ))}
              </Grid>
        </Box>

        <Box width="100%" flex={1} maxWidth={326} display="flex" flexDirection="column" gap="20px">
          <Stack
            width="100%"
            p={2}
            direction="column"
            justifyContent="center"
            alignItems="center"
            border="1px solid #E4E4E4"
            borderRadius={2}
          >
            <Stack mt={2} justifyContent="center" alignItems="center" textAlign="center">
              <img
                src={areaDetails.creator.avatar }
                alt="avatar"
                width={90}
                height={90}
                style={{
                  borderRadius: "100%",
                  objectFit: "cover",
                }}
              />

              <Box mt="15px">
                <Typography fontSize={18} fontWeight={600} color="#11142D">
                  {areaDetails.creator?.name}
                </Typography>
              </Box>
              <Typography mt={1} fontSize={16} fontWeight={600} color="#11142D">
                {areaDetails.creator?.allAreas.length} {''}
                {areaDetails.creator?.allAreas.length === 1 ? 'Area' : 'Areas' }
              </Typography>
            </Stack>

            <Stack width="100%" mt="25px" direction="row" flexWrap="wrap" gap={2}>
              <CustomButton
                title={ "Edit"}
                backgroundColor="#475BE8"
                color="#FCFCFC"
                fullWidth
                icon={ <Edit />}
                handleClick={() => {
                
                    navigate(`/areas/edit/${areaDetails._id}`);
                  
                }}
              />
              <CustomButton
                title={ "Delete"}
                backgroundColor={ "#d42e2e"}
                color="#FCFCFC"
                fullWidth
                icon={ <Delete />}
                handleClick={() => {
                   handleDeleteArea();
                }}
              />
            </Stack>
          </Stack>
          
        </Box>
      </Box>

   
    </Box>
  );
};

export default AreaDetails;
