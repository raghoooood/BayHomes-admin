import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import { useState } from "react";
import { useDelete, useGetIdentity, useShow } from "@refinedev/core";
import { useParams, useNavigate } from "react-router-dom";
import ChatBubble from "@mui/icons-material/ChatBubble";
import Delete from "@mui/icons-material/Delete";
import Edit from "@mui/icons-material/Edit";
import Phone from "@mui/icons-material/Phone";

import { CustomButton } from "components";

// Function to check if an image URL is valid
function checkImage(url: string) {
  const img = new Image();
  img.src = url;
  return img.width > 0 && img.height > 0;
}

const DevDetails = () => {
  const navigate = useNavigate();
  const { query: queryResult } = useShow();
  const { mutate } = useDelete();
  const { id } = useParams<{ id: string }>();
  const { data, isLoading, isError } = queryResult;
  const devDetails = data?.data ?? {};
  const { data: user } = useGetIdentity({ v3LegacyAuthProviderCompatible: true });


  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Something went wrong!</div>;


  const handleDeleteDev = () => {
    if (window.confirm("Are you sure you want to delete this developer?")) {
      mutate(
        { resource: "developers", id: id as string },
        {
          onSuccess: () => navigate("/developers"),
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
        Developer Details
      </Typography>

      <Box mt="20px" display="flex" flexDirection={{ xs: "column", lg: "row" }} gap={4}>
        <Box flex={1} maxWidth={764}>
        <img
          src={devDetails.image}
          alt="dev_main_img"
          style={{
            width: "100%",
            height: "auto",
            borderRadius: "10px",
            objectFit: "cover",
          }}
        />

          <Stack mt="15px" spacing={3}>
            <Typography fontSize={18} fontWeight={700} color="#11142D">
                  {devDetails.developerName}
                </Typography>

          

            <Stack mt="25px" spacing="10px">
              <Typography fontSize={18} color="#11142D">
                Description
              </Typography>
              <Typography fontSize={14} color="#808191">
                {devDetails.description}
              </Typography>
            </Stack>
          </Stack>
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
                src={devDetails.creator.avatar }
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
                  {devDetails.creator?.name}
                </Typography>
              </Box>
              <Typography mt={1} fontSize={16} fontWeight={600} color="#11142D">
                {devDetails.creator?.allDevelopers.length} {''}
                {devDetails.creator?.allDevelopers.length === 1 ? 'Developer' : 'Dvelopers'}
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
                
                    navigate(`/developers/edit/${devDetails._id}`);
                  
                }}
              />
              <CustomButton
                title={ "Delete"}
                backgroundColor={ "#d42e2e"}
                color="#FCFCFC"
                fullWidth
                icon={ <Delete />}
                handleClick={() => {
                   handleDeleteDev();
                }}
              />
            </Stack>
          </Stack>
          
        </Box>
      </Box>

   
    </Box>
  );
};

export default DevDetails;
