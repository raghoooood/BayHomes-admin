import React, { useState } from 'react';
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import FormControl from "@mui/material/FormControl";
import FormHelperText from "@mui/material/FormHelperText";
import TextField from "@mui/material/TextField";
import TextareaAutosize from "@mui/material/TextareaAutosize";
import Stack from "@mui/material/Stack";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Chip from "@mui/material/Chip";
import CancelIcon from '@mui/icons-material/Cancel';

import { DeveloperFormProps } from 'interfaces/developer';
import CustomButton from './CustomButton';
import { useList } from '@refinedev/core';
import "react-quill/dist/quill.snow.css"; // import styles
import ReactQuill from 'react-quill';





const DeveloperForm = ({
  type,
  register,
  handleSubmit,
  handleImageChange,
  formLoading,
  onFinishHandler,
  projectImages,
  selectedAminities, 
  handleAminityChange, 
  handleAminityRemove, 
  handleImageRemove,
  handleFloorPlanChange,
  floorPlans, // Receive floorPlans
  handleAddFloorPlan,
  handleRemoveFloorPlan,
  handleAreaChange,
  selectedArea,
  handleDeveloperChange,
  selectedDeveloper,
  description,
  handleDescriptionChange,
  handleAboutMapChange,
  aboutMap,

}: DeveloperFormProps) => {
  const [availableAminities, setAvailableAminities] = useState([
    "24/7 Maintenance Service", "24/7 Security Service", "Barbecue area",
    "Basketball Court", "Car Parking", "CCTV cameras", "Fire & Fighting Alarm Systems",
    "Fitness Facilities", "Gated community", "Gym", "Gymnasium", "High-Speed Elevators",
    "Jacuzzi", "Kids Pool", "Panoramic City Views", "Panoramic Views of the Sea", "Play area",
    "Playful Children’s Area", "Pool Area", "private pool", "Retail Outlets", "Sauna", 
    "Squash Room", "Steam Room", "Swimming Pool", "Swimming pool for the community",
    "Tennis Court","Luxurious entrance Lobby ", "Vibrant Football Pitch"
      ]);

  const { data: developersData } = useList({ resource: "developers" });
  const { data: areasData } = useList({ resource: "areas" });

const developerNames = developersData?.data ?? [];
const areaNames = areasData?.data ?? [];


const modules = {
  toolbar: [
    [{ 'font': [] }, { 'size': [] }],
    ['bold', 'italic', 'underline', 'strike'],
    [{ 'color': [] }, { 'background': [] }],
    [{ 'list': 'ordered'}, { 'list': 'bullet' }],
    [{ 'align': [] }],
    ['clean'] // Removes formatting
  ],
};
  return (
    <Box marginLeft='60px' >
      <Typography fontSize={25} fontWeight={700} color="#11142d" width="100%" >
        {type} a Project
      </Typography>

      <Box mt={2.5} borderRadius="15px" padding="20px" bgcolor="#fcfcfc" > 
        <form
          style={{
            marginTop: "20px",
            width: "100%",
            display: "flex",
            flexDirection: "column",
            gap: "20px",
               
  
          }}
          onSubmit={handleSubmit(onFinishHandler)}
        >
          {/* Project Title */}
          <FormControl>
            <FormHelperText
              sx={{
                fontWeight: 500,
                margin: "10px 0",
                fontSize: 16,
                color: "#11142d",
              }}
            >
              Enter Off plan project name
            </FormHelperText>
            <TextField
              fullWidth
              required
              id="project-title"
              color="info"
              variant="outlined"
              {...register("projectName")}
            />
          </FormControl>

          {/* Developer Name */}
            <FormControl>
            <FormHelperText
              sx={{
                fontWeight: 500,
                margin: "10px 0",
                fontSize: 16,
                color: "#11142d",
              }}
            >
              Select Developer name
            </FormHelperText>
            <Select
                 
                 variant="outlined"
                 displayEmpty
                 inputProps={{ "aria-label": "Without label" }}
                 value={selectedDeveloper} // Bind the state to the Select component
                 onChange={handleDeveloperChange} // Attach the change handler
                
              > 
                  {developerNames.map((developer) => (
                    <MenuItem key={developer._id} value={developer.developerName}>
                      {developer.developerName}
                    </MenuItem>
                 ))}
              
              
              </Select>
          </FormControl>  

      

          {/* Property Description */}
       <FormControl>
        <FormHelperText
          sx={{
            fontWeight: 500,
            margin: "10px 0",
            fontSize: 16,
            color: "#11142d",
          }}
        >
          Enter Description
        </FormHelperText>
        <ReactQuill
          theme="snow"
          placeholder="Write description"
          style={{
            width: "100%",
            background: "white",
            fontSize: "16px",
            borderRadius: 6,
            padding: 10,
            color: "#11142d",
          }}
          modules={modules} 
          onChange={handleDescriptionChange}          
          value={ description}
        />
      </FormControl>

          {/* Property Type and Price */}
          <Stack direction="row" gap={4}>
            {/* Property Type */}
            <FormControl sx={{ flex: 1 }}>
              <FormHelperText
                sx={{
                  fontWeight: 500,
                  margin: "10px 0",
                  fontSize: 16,
                  color: "#11142d",
                }}
              >
                Select Project Type
              </FormHelperText>
              <Select
                variant="outlined"
                color="info"
                displayEmpty
                required
                inputProps={{ "aria-label": "Without label" }}
                defaultValue="apartment"
                {...register("projectType")}
              >
                <MenuItem value="apartment">Apartment</MenuItem>
                <MenuItem value="villa">Villa</MenuItem>
                <MenuItem value="farmhouse">Farmhouse</MenuItem>
                <MenuItem value="condos">Condos</MenuItem>
                <MenuItem value="townhouse">Townhouse</MenuItem>
                <MenuItem value="duplex">Duplex</MenuItem>
                <MenuItem value="studio">Studio</MenuItem>
                <MenuItem value="chalet">Chalet</MenuItem>
              </Select>
            </FormControl>

            {/* Property Price */}
            <FormControl>
              <FormHelperText
                sx={{
                  fontWeight: 500,
                  margin: "10px 0",
                  fontSize: 16,
                  color: "#11142d",
                }}
              >
                Enter project start price
              </FormHelperText>
              <TextField
                fullWidth
                id="start-price"
                color="info"
                type="number"
                variant="outlined"
                {...register("startPrice")}
              />
            </FormControl>
          </Stack>
    {/* Project location  */}
        <FormControl>
            <FormHelperText
              sx={{
                fontWeight: 500,
                margin: "10px 0",
                fontSize: 16,
                color: "#11142d",
              }}
            >
              Enter project location
            </FormHelperText>
            <TextField
              fullWidth
              id="location"
              color="info"
              variant="outlined"
              {...register("location")}
            />
          </FormControl> 

              {/* Project location url  */}
            <FormControl>
            <FormHelperText
              sx={{
                fontWeight: 500,
                margin: "10px 0",
                fontSize: 16,
                color: "#11142d",
              }}
            >
              Enter location map URL
            </FormHelperText>
            <TextField
              fullWidth
              id="locationURL"
              color="info"
              variant="outlined"
              {...register("mapURL")}
            />
          </FormControl> 

          

                {/* Property Description */}
       <FormControl>
        <FormHelperText
          sx={{
            fontWeight: 500,
            margin: "10px 0",
            fontSize: 16,
            color: "#11142d",
          }}
        >
          About Map
        </FormHelperText>
        <ReactQuill
          theme="snow"
          placeholder="Write description"
          style={{
            width: "100%",
            background: "white",
            fontSize: "16px",
            borderRadius: 6,
            padding: 10,
            color: "#11142d",
          }}
          modules={modules} 
          onChange={handleAboutMapChange}          
          value={aboutMap}
        />
      </FormControl>

          {/* Project Area */}
          <FormControl>
            <FormHelperText
              sx={{
                fontWeight: 500,
                margin: "10px 0",
                fontSize: 16,
                color: "#11142d",
              }}
            >
              Select project Area
            </FormHelperText>
            <Select
                
                 variant="outlined"
                
                 displayEmpty
               
                 inputProps={{ "aria-label": "Without label" }}
                 value={selectedArea} // Bind the state to the Select component
                 onChange={handleAreaChange} // Attach the change handler
                
              > 
                  {areaNames.map((area) => (
                    <MenuItem key={area._id} value={area.areaName}>
                      {area.areaName}
                    </MenuItem>
                 ))}

              </Select>
          </FormControl>

          {/* Project Size */}
          <FormControl>
            <FormHelperText
              sx={{
                fontWeight: 500,
                margin: "10px 0",
                fontSize: 16,
                color: "#11142d",
              }}
            >
              Enter Project Size
            </FormHelperText>
            <TextField
              fullWidth
              id="property-size"
              color="info"
              variant="outlined"
              {...register("size")}
            />
          </FormControl>

           {/* Number of Rooms */}
           <Stack direction="row" gap={4}>
            <FormControl sx={{ flex: 1 }}>
              <FormHelperText
                sx={{
                  fontWeight: 500,
                  margin: "10px 0",
                  fontSize: 16,
                  color: "#11142d",
                }}
              >
                Minimum Number of Rooms
              </FormHelperText>
              <TextField
                fullWidth
                type="number"
                variant="outlined"
                {...register("rooms.min")}
              />
            </FormControl>
            <FormControl sx={{ flex: 1 }}>
              <FormHelperText
                sx={{
                  fontWeight: 500,
                  margin: "10px 0",
                  fontSize: 16,
                  color: "#11142d",
                }}
              >
                Maximum Number of Rooms
              </FormHelperText>
              <TextField
                fullWidth
                type="number"
                variant="outlined"
                {...register("rooms.max")}
              />
            </FormControl>
          </Stack>

          {/* Handover Date */}
          <FormControl>
            <FormHelperText
              sx={{
                fontWeight: 500,
                margin: "10px 0",
                fontSize: 16,
                color: "#11142d",
              }}
            >
              Select Handover Date
            </FormHelperText>
            <TextField
              fullWidth
              type="date"
              InputLabelProps={{ shrink: true }}
              variant="outlined"
              {...register("handoverDate")}
            />
          </FormControl>

          {/* Floor Plans Section */}
            {/* Floor Plans */}
            <Box mt={3}>
  <Typography fontSize={20} fontWeight={700} color="#11142d">
    Floor Plans
  </Typography>
  {floorPlans.map((plan, index) => (
    <Box key={index} mt={2} padding="10px" border="1px solid #ccc" borderRadius="5px">
      <Typography variant="h6">Floor Plan {index + 1}</Typography>
      <Stack direction="row" gap={2} mt={2}>
        <FormControl fullWidth>
          <FormHelperText
            sx={{ fontWeight: 500, margin: "10px 0", fontSize: 16, color: "#11142d" }}
          >
            Number of Bedrooms
          </FormHelperText>
          <TextField
            type="number"
            variant="outlined"
            value={plan.numOfrooms}
            onChange={(e: { target: { value: string | File; }; }) => handleFloorPlanChange(index, 'numOfrooms', e.target.value)}
          
            
          />
        </FormControl>
        <FormControl fullWidth>
          <FormHelperText
            sx={{ fontWeight: 500, margin: "10px 0", fontSize: 16, color: "#11142d" }}
          >
            Property Type
          </FormHelperText>
          <Select
           variant="outlined"
           displayEmpty
           inputProps={{ "aria-label": "Without label" }}
           defaultValue="apartment"
           value={plan.floorType}
           onChange={(e) => handleFloorPlanChange(index, 'floorType', e.target.value)}
          >

               <MenuItem value="apartment">Apartment</MenuItem>
                <MenuItem value="villa">Villa</MenuItem>
                <MenuItem value="farmhouse">Farmhouse</MenuItem>
                <MenuItem value="condos">Condos</MenuItem>
                <MenuItem value="townhouse">Townhouse</MenuItem>
                <MenuItem value="duplex">Duplex</MenuItem>
                <MenuItem value="studio">Studio</MenuItem>
                <MenuItem value="chalet">Chalet</MenuItem>
          </Select>
        </FormControl>
      </Stack>
      <FormControl fullWidth sx={{ mt: 2 }}>
        <FormHelperText
          sx={{ fontWeight: 500, margin: "10px 0", fontSize: 16, color: "#11142d" }}
        >
          Floor Size
        </FormHelperText>
        <TextField
          variant="outlined"
          type='number'
          value={plan.floorSize}
          onChange={(e: { target: { value: string | File; }; }) => handleFloorPlanChange(index, 'floorSize', e.target.value)}
          
        />
      </FormControl>
      <FormControl fullWidth sx={{ mt: 2 }}>
  <FormHelperText
    sx={{ fontWeight: 500, margin: "10px 0", fontSize: 16, color: "#11142d" }}
  >
    Upload Floor Image
  </FormHelperText>
  <input
    type="file"
    accept="image/*"
    onChange={(e) => {
      if (e.target.files) {
        const file = e.target.files[0];

        // Create a new FileReader to read the file as base64
        const reader = new FileReader();
        
        reader.onloadend = () => {
          const base64String = reader.result as string;
          handleFloorPlanChange(index, 'floorImage', base64String);
        };
        
        reader.onerror = (error) => {
          console.error("FileReader error:", error);
        };
        
        // Read the file as a data URL (base64)
        reader.readAsDataURL(file);
      }
    }}
  />
</FormControl>


      {/* Display Floor Image */}
      {plan.floorImage && (
        <Box mt={2} position="relative">
          <img
            src={plan.floorImage}
            alt={`Floor Plan ${index + 1}`}
            width={200}
            height={200}
            style={{ borderRadius: 8, objectFit: "cover" }}
          />
          <IconButton
             sx={{
              position: "absolute",
              top: 0,
              right: 0,
              backgroundColor: "rgba(255, 255, 255, 0.7)",
              borderRadius: "50%",
              padding: "2px",
              color: "#d32f2f",
              '&:hover': {
                backgroundColor: "rgba(255, 255, 255, 1)",
              },
            }}
            color="error"
            onClick={() => handleFloorPlanChange(index, 'floorImage', '')}
          >
            <CancelIcon />
          </IconButton>
        </Box>
      )}
      
      <IconButton sx={{ mt: 2 }} color="error" onClick={() => handleRemoveFloorPlan(index)}>
        <CancelIcon />
          </IconButton>
        </Box>
      ))}
      <Button variant="contained" color="primary" onClick={handleAddFloorPlan} sx={{ mt: 2 }}>
        Add Floor Plan
      </Button>
    </Box>

         

          

          {/* Aminities Section */}
           <FormControl>
            <FormHelperText
              sx={{
                fontWeight: 500,
                margin: "10px 0",
                fontSize: 16,
                color: "#11142d",
              }}
            >
              Select Aminities
            </FormHelperText>
            <Select
              multiple
              variant="outlined"
              value={selectedAminities}
              onChange={handleAminityChange}
              inputProps={{ "aria-label": "Without label" }}
              renderValue={(selected) => (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {selected.map((feature) => (
                    <Chip
                      key={feature}
                      label={feature}
                      onDelete={() => handleAminityRemove(feature)}
                      deleteIcon={<CancelIcon />}
                    />
                  ))}
                </Box>
              )}
            >
              {availableAminities.map((aminity) => (
                <MenuItem key={aminity} value={aminity}>
                  {aminity}
                </MenuItem>
              ))}
              
            </Select>
          </FormControl>

          {/* Display Selected Features as Chips 
          <Stack direction="row" gap={1} flexWrap="wrap">
            {selectedAminities.map((aminity, index) => (
              <Chip
                key={index}
                label={aminity}
                onDelete={() => handleAminityRemove(aminity)}
                color="primary"
                deleteIcon={<CancelIcon />}
              />
            ))}
          </Stack> 

          {/* Scrollable Selected Amenities */}



          

          {/* Display Uploaded InImages */}
          <Stack direction="column" gap={2}>
          <Box
            sx={{
              display: 'flex',
              overflowX: 'auto',
              whiteSpace: 'nowrap',
              gap: 2,
              maxWidth: '50%',  // Ensures the container has a width limit for scroll to work
              '&::-webkit-scrollbar': {
                height: 8,
              },
              '&::-webkit-scrollbar-thumb': {
                backgroundColor: '#888',
                borderRadius: 8,
              },
            }}
          >
                {projectImages.inImages.map((img, index) => (
                  <Stack key={index} direction="column" alignItems="center">
                    <img
                      src={img.url} // Access the url property
                      alt={`Property ${index + 1}`}
                      width={200}
                      height={200}
                      style={{ borderRadius: 8, objectFit: "cover" }}
                    />
                    <IconButton
                      onClick={() => handleImageRemove(index , 'inImages')} // Call remove function
                      sx={{
                        marginTop: 1,
                        color: "#dc743c",
                        fontSize: 20,
                      }}
                    >
                      <CancelIcon />
                    </IconButton>
                  </Stack>
                ))}
              </Box>
            <FormControl>
              <FormHelperText
                sx={{
                  fontWeight: 500,
                  margin: "10px 0",
                  fontSize: 16,
                  color: "#11142d",
                }}
              >
                Upload property inimages
              </FormHelperText>
              <Button
                component="label"
                sx={{
                  width: "fit-content",
                  color: "#dc743c",
                  textTransform: "capitalize",
                  fontSize: 16,
                }}
              >
                Upload *
                <input
                  hidden
                  accept="image/*"
                  type="file"
                  multiple // Allow multiple file uploads
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    handleImageChange(e.target.files! , 'inImages');
                  }}
                />
              </Button>
            </FormControl>
          </Stack>


          {/* Display Uploaded OutImages */}
          <Stack direction="column" gap={2}>
          <Box
  sx={{
    display: 'flex',
    overflowX: 'auto',
    whiteSpace: 'nowrap',
    gap: 2,
    maxWidth: '50%',  // Ensures the container has a width limit for scroll to work
    '&::-webkit-scrollbar': {
      height: 8,
    },
    '&::-webkit-scrollbar-thumb': {
      backgroundColor: '#888',
      borderRadius: 8,
    },
  }}
>
                {projectImages.outImages.map((img, index) => (
                  <Stack key={index} direction="column" alignItems="center">
                    <img
                      src={img.url} // Access the url property
                      alt={`Property ${index + 1}`}
                      width={200}
                      height={200}
                      style={{ borderRadius: 8, objectFit: "cover" }}
                    />
                    <IconButton
                      onClick={() => handleImageRemove(index , 'outImages')} // Call remove function
                      sx={{
                        marginTop: 1,
                        color: "#dc743c",
                        fontSize: 20,
                      }}
                    >
                      <CancelIcon />
                    </IconButton>
                  </Stack>
                ))}
              </Box>
            <FormControl>
              <FormHelperText
                sx={{
                  fontWeight: 500,
                  margin: "10px 0",
                  fontSize: 16,
                  color: "#11142d",
                }}
              >
                Upload property outimages
              </FormHelperText>
              <Button
                component="label"
                sx={{
                  width: "fit-content",
                  color: "#dc743c",
                  textTransform: "capitalize",
                  fontSize: 16,
                }}
              >
                Upload *
                <input
                  hidden
                  accept="image/*"
                  type="file"
                  multiple // Allow multiple file uploads
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    handleImageChange(e.target.files! , 'outImages');
                  }}
                />
              </Button>
            </FormControl>
          </Stack>

          <Stack direction="column" gap={2}>
                  <Stack direction="row" gap={2} position="relative">
                    {projectImages.backgroundImage && (
                      <Box position="relative">
                        <img
                          src={projectImages.backgroundImage.url}
                          alt="Area"
                          width={200}
                          height={200}
                          style={{ borderRadius: 8, objectFit: "cover" }}
                        />
                        <IconButton
                          onClick={() => handleImageRemove(0 , 'backgroundImage')}
                          sx={{
                            position: "absolute",
                            top: 0,
                            right: 0,
                            backgroundColor: "rgba(255, 255, 255, 0.7)",
                            borderRadius: "50%",
                            padding: "2px",
                            color: "#d32f2f",
                            '&:hover': {
                              backgroundColor: "rgba(255, 255, 255, 1)",
                            },
                          }}
                        >
                          <CancelIcon />
                        </IconButton>
                      </Box>
                    )}
                  </Stack>
                    <FormControl>
                      <FormHelperText
                        sx={{
                          fontWeight: 500,
                          margin: "10px 0",
                          fontSize: 16,
                          color: "#11142d",
                        }}
                      >
                        Upload Background image
                      </FormHelperText>
                      <Button
                        component="label"
                        sx={{
                          width: "fit-content",
                          color: "#dc743c",
                          textTransform: "capitalize",
                          fontSize: 16,
                        }}
                      >
                        Upload *
                        <input
                          hidden
                          accept="image/*"
                          type="file"
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                            handleImageChange( e.target.files! ,'backgroundImage' );
                          }}
                        />
                      </Button>
                    </FormControl>
                </Stack>

          {/* Submit Button */}
          <CustomButton
            type="submit"
            title={formLoading ? "Submitting..." : "Submit"}
            backgroundColor="#475be8"
            color="#fcfcfc"
          />
        </form>
      </Box>
    </Box>
  );
};

export default DeveloperForm;
