import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Modal from "@mui/material/Modal";
import Grid from "@mui/material/Grid";
import { JSXElementConstructor, ReactElement, ReactNode, ReactPortal, useState } from "react";
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

const DeveloperDetails = () => {
  const navigate = useNavigate();

  const { query: queryResult } = useShow();
  const { mutate } = useDelete();
  const { id } = useParams<{ id: string }>();
  const { data, isLoading, isError } = queryResult;
  const { data: user } = useGetIdentity({ v3LegacyAuthProviderCompatible: true });
  const projectDetails = data?.data ?? {};
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [additionalImages, setAdditionalImages] = useState<string[]>([]);

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Something went wrong!</div>;

  const isCurrentUser = user?.email === projectDetails.creator?.email;

  const handleDeleteProject = () => {
    if (window.confirm("Are you sure you want to delete this project?")) {
      mutate(
        { resource: "projects", id: id as string },
        {
          onSuccess: () => navigate("/projects"),
        }
      );
    }
  };

  const handleOpenModal = () => {
    const allImages = projectDetails.images || [];
    const moreImages = allImages.slice(4);
    setAdditionalImages(moreImages);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => setIsModalOpen(false);

  const renderImages = (images: string[]) => {
    if (!images || images.length === 0) return null;
    const mainImage = images[0];
    const smallImages = images.slice(1, 4);

    return (
      <Box>
        <img
          src={mainImage}
          alt="project_main_img"
          style={{
            width: "100%",
            height: "auto",
            borderRadius: "10px",
            objectFit: "cover",
          }}
        />
        <Stack direction="row" spacing={2} mt={2} alignItems="center">
          {smallImages.map((img, index) => (
            <img
              key={index}
              src={img}
              alt={`project_img_${index}`}
              style={{
                width: "30%",
                height: "auto",
                borderRadius: "10px",
                objectFit: "cover",
              }}
            />
          ))}
         
        </Stack>
      </Box>
    );
  };

  return (
    <Box
      borderRadius="15px"
      padding="20px"
      bgcolor="#FCFCFC"
      width="fit-content"
    >
      <Typography fontSize={25} fontWeight={700} color="#11142D">
        project Details
      </Typography>

      <Box mt="20px" display="flex" flexDirection={{ xs: "column", lg: "row" }} gap={4}>
        <Box flex={1} maxWidth={764}>
          {renderImages(projectDetails.images.inImages || [])}

          <Stack mt="15px" spacing={3}>
            <Stack direction="row" alignItems="center" justifyContent="space-between">
              {projectDetails.price ? (
                <><Typography fontSize={16} fontWeight={600} color="#dc743c">
                  starting price
                </Typography><Typography fontSize={18} fontWeight={700} color="#dc743c">
                    AED {projectDetails.price}
                  </Typography></>
             
              ) : null}

             
              {projectDetails.images && projectDetails.images.length > 4 && (
                <CustomButton
                  title="More Images"
                  backgroundColor="#475BE8"
                  color="#FCFCFC"
                  handleClick={handleOpenModal}
                />
              )}
            </Stack>
            <Grid item xs={12} sm={6}>
                <Typography fontSize={16} fontWeight={600} color="#11142D">
                  Project Name
                </Typography>
                <Typography fontSize={18} fontWeight={700} color="#dc743c">
                  {projectDetails.projectName}
                </Typography>
              </Grid> 
              <Grid item xs={12} sm={6}>
                <Typography fontSize={16} fontWeight={600} color="#11142D">
                  Developer Name 
                </Typography>
                <Typography fontSize={18} fontWeight={700} color="#dc743c">
                  {projectDetails.developer.developerName}
                </Typography>

              </Grid> 

              <Grid item xs={12} sm={6}>
                {projectDetails.size ? (
                  <>
                    <Typography fontSize={16} fontWeight={600} color="#11142D">
                  Area/Size
                </Typography>
                <Typography fontSize={18} fontWeight={700} color="#dc743c">
                  {projectDetails.size} sqft
                </Typography>
                  </>

                ): null}
                </Grid>

               
                  <Grid item xs={12} sm={6}>
                  <Typography fontSize={16} fontWeight={600} color="#11142D">
                    Project Amenities
                  </Typography>

                  {projectDetails.aminities?.map((amenity: string, index: number) => (
                    <Typography key={index} fontSize={18} fontWeight={700} color="#dc743c">
                      {index + 1} / {amenity}
                    </Typography>
                  ))}
                </Grid>

                <Grid item xs={12} sm={6}>
                <Typography fontSize={16} fontWeight={600} color="#11142D">
                     Rooms Range
                </Typography>
                <Typography fontSize={18} fontWeight={700} color="#dc743c">
                  {projectDetails.rooms.min} to {projectDetails.rooms.max}
                </Typography>
                </Grid>
            

        

            <Stack mt="25px" spacing="10px">
              <Typography fontSize={18} color="#11142D">
                Description
              </Typography>
              <Typography fontSize={14} color="#808191" dangerouslySetInnerHTML={{ __html: projectDetails.description }}>
                
              </Typography>
            </Stack>

{/* Floor Plans Section */}
{projectDetails.floorPlans && projectDetails.floorPlans.length > 0 && (
  <Box mt="20px">
    <Typography fontSize={18} fontWeight={600} color="#11142D" mb={1}>
      Floor Plans
    </Typography>
    {projectDetails.floorPlans.map(
      (
        floorPlan: {
          _id: string;
          floorType: string;
          floorSize: string;
          numOfrooms: number;
          floorImage: string;
        },
        index: number
      ) => {
        // Log each floorPlan to check its structure
        console.log("floorPlan:", floorPlan);

        // Check if floorPlan is defined
        if (!floorPlan) {
          return null; // Skip rendering this item if it's undefined or null
        }

        return (
          <Box key={floorPlan._id || index} mb={3}>
            <Typography fontSize={16} fontWeight={600} color="#11142D">
              Floor Type: {floorPlan.floorType}
            </Typography>
            <Typography fontSize={14} color="#11142D">
              Size: {floorPlan.floorSize} sqft
            </Typography>
            <Typography fontSize={14} color="#11142D">
              Number of Rooms: {floorPlan.numOfrooms}
            </Typography>
            {floorPlan.floorImage && (
              <img
                src={floorPlan.floorImage}
                alt={`Floor ${floorPlan.floorType} Plan`}
                style={{
                  width: "100%",
                  height: "auto",
                  borderRadius: "10px",
                  objectFit: "cover",
                  marginTop: "10px",
                }}
              />
            )}
          </Box>
        );
      }
    )}
  </Box>
)}



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
                src={projectDetails.creator.avatar }
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
                  {projectDetails.creator?.name}
                </Typography>
              </Box>
              <Typography mt={1} fontSize={16} fontWeight={600} color="#11142D">
                {projectDetails.creator?.allProjects.length}{" "}
                {projectDetails.creator?.allProjects.length === 1 ? "Project" : "Projects"}
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
                
                    navigate(`/projects/edit/${projectDetails._id}`);
                  
                }}
              />
              <CustomButton
                title={ "Delete"}
                backgroundColor={ "#d42e2e"}
                color="#FCFCFC"
                fullWidth
                icon={ <Delete />}
                handleClick={() => {
                   handleDeleteProject();
                }}
              />
            </Stack>
          </Stack>
          
        </Box>
      </Box>

      <Modal open={isModalOpen} onClose={handleCloseModal}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            bgcolor: "background.paper",
            borderRadius: 2,
            boxShadow: 24,
            p: 4,
            width: "90%",
            maxHeight: "80%",
            overflowY: "auto",
          }}
        >
          <Typography fontSize={20} fontWeight={600} color="#11142D" mb={2}>
            Additional Images
          </Typography>
          <Stack direction="row" spacing={2} flexWrap="wrap">
            {additionalImages.map((img, index) => (
              <img
                key={index}
                src={img}
                alt={`additional_img_${index}`}
                style={{
                  width: "30%",
                  height: "auto",
                  borderRadius: "10px",
                  objectFit: "cover",
                  marginBottom: "10px",
                }}
              />
            ))}
          </Stack>
        </Box>
      </Modal>
    </Box>
  );
};

export default DeveloperDetails;
