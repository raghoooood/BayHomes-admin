import { useState } from "react";
import Email from "@mui/icons-material/Email";
import Phone from "@mui/icons-material/Phone";
import Place from "@mui/icons-material/Place";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";

import type { AreaProps, DeveloperProps, ProfileProps, ProjectProps, PropertyProps } from "interfaces/common";
import PropertyCard from "./PropertyCard";
import DeveloperCard from "./DeveloperCard";
import DevInfoCard from "components/developer/DevInfoCard";
import AreaCard from "components/area/AreaCard";

// Helper function to check if an image URL is valid
function checkImage(url: string) {
  const img = new Image();
  img.src = url;
  return img.width !== 0 && img.height !== 0;
}

const Profile = ({ type, name, avatar, email, properties, projects , developers, areas}: ProfileProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editableName, setEditableName] = useState(name);
  const [editableEmail, setEditableEmail] = useState(email);
  const [editableAddress, setEditableAddress] = useState("Dynamic Address"); // replace with actual data
  const [editablePhone, setEditablePhone] = useState("Dynamic Phone"); // replace with actual data

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  const handleSave = () => {
    // Logic to save the updated profile data goes here (e.g., make an API call)
    setIsEditing(false);
  };

  return (
    <Box>
      <Typography fontSize={25} fontWeight={700} color="#11142D">
        {type} Profile
      </Typography>

      <Box mt="20px" borderRadius="15px" padding="20px" bgcolor="#FCFCFC">
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            gap: 2.5,
          }}
        >
          <img
            src="https://images.unsplash.com/photo-1618005198919-d3d4b5a92ead?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1374&q=80"
            width={340}
            height={320}
            alt="abstract"
            className="my_profile-bg"
          />
          <Box
            flex={1}
            sx={{
              marginTop: { md: "58px" },
              marginLeft: { xs: "20px", md: "0px" },
            }}
          >
            <Box
              flex={1}
              display="flex"
              flexDirection={{ xs: "column", md: "row" }}
              gap="20px"
            >
              <img
                src={
                  checkImage(avatar)
                    ? avatar
                    : "https://upload.wikimedia.org/wikipedia/commons/thumb/5/59/User-avatar.svg/2048px-User-avatar.svg.png"
                }
                width={78}
                height={78}
                alt="user_profile"
                className="my_profile_user-img"
              />

              <Box
                flex={1}
                display="flex"
                flexDirection="column"
                justifyContent="space-between"
                gap="30px"
              >
                <Stack direction="column">
                  {isEditing ? (
                    <TextField
                      label="Name"
                      variant="outlined"
                      value={editableName}
                      onChange={(e) => setEditableName(e.target.value)}
                    />
                  ) : (
                    <Typography fontSize={22} fontWeight={600} color="#11142D">
                      {editableName}
                    </Typography>
                  )}
                  <Typography fontSize={16} color="#808191">
                    Realestate Agent
                  </Typography>
                </Stack>

                <Stack direction="column" gap="30px">
                  <Stack gap="15px">
                    <Typography fontSize={14} fontWeight={500} color="#808191">
                      Address
                    </Typography>
                    <Box
                      display="flex"
                      flexDirection="row"
                      alignItems="center"
                      gap="10px"
                    >
                      <Place sx={{ color: "#11142D" }} />
                      {isEditing ? (
                        <TextField
                          label="Address"
                          variant="outlined"
                          value={editableAddress}
                          onChange={(e) => setEditableAddress(e.target.value)}
                        />
                      ) : (
                        <Typography fontSize={14} color="#11142D">
                          {editableAddress}
                        </Typography>
                      )}
                    </Box>
                  </Stack>

                  <Stack direction="row" flexWrap="wrap" gap="20px" pb={4}>
                    <Stack flex={1} gap="15px">
                      <Typography
                        fontSize={14}
                        fontWeight={500}
                        color="#808191"
                      >
                        Phone Number
                      </Typography>
                      <Box
                        display="flex"
                        flexDirection="row"
                        alignItems="center"
                        gap="10px"
                      >
                        <Phone sx={{ color: "#11142D" }} />
                        {isEditing ? (
                          <TextField
                            label="Phone"
                            variant="outlined"
                            value={editablePhone}
                            onChange={(e) => setEditablePhone(e.target.value)}
                          />
                        ) : (
                          <Typography fontSize={14} color="#11142D" noWrap>
                            {editablePhone}
                          </Typography>
                        )}
                      </Box>
                    </Stack>

                    <Stack flex={1} gap="15px">
                      <Typography
                        fontSize={14}
                        fontWeight={500}
                        color="#808191"
                      >
                        Email
                      </Typography>
                      <Box
                        display="flex"
                        flexDirection="row"
                        alignItems="center"
                        gap="10px"
                      >
                        <Email sx={{ color: "#11142D" }} />
                        {isEditing ? (
                          <TextField
                            label="Email"
                            variant="outlined"
                            value={editableEmail}
                            onChange={(e) => setEditableEmail(e.target.value)}
                          />
                        ) : (
                          <Typography fontSize={14} color="#11142D">
                            {editableEmail}
                          </Typography>
                        )}
                      </Box>
                    </Stack>
                  </Stack>
                </Stack>

                {/* Buttons to toggle edit mode and save changes */}
                <Stack direction="row" gap="10px" mt={2}>
                  <Button
                    variant="contained"
                    sx={{
                      backgroundColor: "#dc743c",
                      "&:hover": {
                        backgroundColor: "#b35f32",
                      },
                    }}
                    onClick={isEditing ? handleSave : handleEditToggle}
                  >
                    {isEditing ? "Save" : "Edit"}
                  </Button>
                  {isEditing && (
                    <Button
                      variant="outlined"
                      color="secondary"
                      onClick={handleEditToggle}
                    >
                      Cancel
                    </Button>
                  )}
                </Stack>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>

      {properties.length > 0 && (
        <Box mt={2.5} borderRadius="15px" padding="20px" bgcolor="#FCFCFC">
          <Typography fontSize={18} fontWeight={600} color="#11142D">
            {type} Properties
          </Typography>

          <Box
            mt={2.5}
            sx={{
              display: "flex",
              flexWrap: "wrap",
              gap: 2.5,
            }}
          >
            {properties?.map((property: PropertyProps) => (
              <PropertyCard
                key={property._id}
                id={property._id}
                title={property.title}
                location={property.location}
                price={property.price}
                backgroundImage={property.images.backgroundImage}
                area={property.area}
                numOfbathrooms={property.numOfbathrooms}
                numOfrooms={property.numOfrooms}
                size={property.size}
              />
            ))}
          </Box>
        </Box>
      )}


{projects.length > 0 && (
        <Box mt={2.5} borderRadius="15px" padding="20px" bgcolor="#FCFCFC">
          <Typography fontSize={18} fontWeight={600} color="#11142D">
            {type} Projects
          </Typography>

          <Box
            mt={2.5}
            sx={{
              display: "flex",
              flexWrap: "wrap",
              gap: 2.5,
            }}
          >
            {projects?.map((project: ProjectProps) => (
              <DeveloperCard
              key={project.id}
              id={project.id}
              projectName={project?.projectName}
              description={project.description}
              startPrice={project.startPrice}
              images={project.images}
              size={project.size} 
              location={project.location} 
              rooms={project.rooms}         
             />
            ))}
          </Box>
        </Box>
      )}

{developers.length > 0 && (
        <Box mt={2.5} borderRadius="15px" padding="20px" bgcolor="#FCFCFC">
          <Typography fontSize={18} fontWeight={600} color="#11142D">
            {type} Developers
          </Typography>

          <Box
            mt={2.5}
            sx={{
              display: "flex",
              flexWrap: "wrap",
              gap: 2.5,
            }}
          >
            {developers?.map((developer: DeveloperProps) => (
              <DevInfoCard
              key={developer._id}
              id={developer._id}
              devName={developer.devName}
              image={developer.image}
             />
            ))}
          </Box>
        </Box>
      )}

{areas.length > 0 && (
        <Box mt={2.5} borderRadius="15px" padding="20px" bgcolor="#FCFCFC">
          <Typography fontSize={18} fontWeight={600} color="#11142D">
            {type} Areas
          </Typography>

          <Box
            mt={2.5}
            sx={{
              display: "flex",
              flexWrap: "wrap",
              gap: 2.5,
            }}
          >
            {areas?.map((area: AreaProps) => (
              <AreaCard
              key={area.id}
              id={area.id}
              areaName={area?.areaName}
              image={area.image}
             />
            ))}
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default Profile;
