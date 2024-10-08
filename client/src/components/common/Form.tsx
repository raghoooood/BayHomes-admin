import React, { useEffect, useState } from 'react';
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
import { SelectChangeEvent } from '@mui/material/Select';

import type { FormProps } from "interfaces/common";
import CustomButton from "./CustomButton";
import axios from 'axios';
import { BaseRecord, useList } from '@refinedev/core';
import "react-quill/dist/quill.snow.css"; // import styles
import ReactQuill from 'react-quill';


const Form = ({
  type,
  register,
  handleSubmit,
  handleImageChange,
  formLoading,
  onFinishHandler,
  propertyImages,
  barcode,
  handleRemoveBarcode,
  handleBarcodeChange,
  selectedFeatures, // Add this prop
  handleFeatureChange, // Add this prop
  handleFeatureRemove, // Add this prop
  handleImageRemove,
  handleAreaChange,
  selectedArea,
  handleDescriptionChange,
  description,
  propertyType,
  purpose,
  featured,
  furnishingType,
}: FormProps) => {

  const [availableFeatures, setAvailableFeatures] = useState([
"24/7 Maintenance Service", "24/7 Security Service", "Barbecue area",
"Basketball Court", "Car Parking", "CCTV cameras", "Fire & Fighting Alarm Systems",
"Fitness Facilities", "Gated community", "Gym", "Gymnasium", "High-Speed Elevators",
"Jacuzzi", "Kids Pool", "Panoramic City Views", "Panoramic Views of the Sea", "Play area",
"Playful Children’s Area", "Pool Area", "private pool", "Retail Outlets", "Sauna", 
"Squash Room", "Steam Room", "Swimming Pool", "Swimming pool for the community",
"Tennis Court","Luxurious entrance Lobby ", "Vibrant Football Pitch"
  ]);
  const { data } = useList({ resource: "areas" }); 
  const areaNames = data?.data ?? [];


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
    <Box marginLeft='60px'>
      <Typography fontSize={25} fontWeight={700} color="#11142d" >
        {type} a Property
      </Typography>

      <Box mt={2.5} borderRadius="15px" padding="20px" bgcolor="#fcfcfc">
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
          {/* Property Title */}
          <FormControl>
            <FormHelperText
              sx={{
                fontWeight: 500,
                margin: "10px 0",
                fontSize: 16,
                color: "#11142d",
              }}
            >
              Enter property name
            </FormHelperText>
            <TextField
              fullWidth
              required
              id="outlined-basic"
              color="info"
              variant="outlined"
              {...register("title", { required: true })}
            />
          </FormControl>

             {/* Project name  */}
             <FormControl>
            <FormHelperText
              sx={{
                fontWeight: 500,
                margin: "10px 0",
                fontSize: 16,
                color: "#11142d",
              }}
            >
              Enter Project name
            </FormHelperText>
            <TextField
              fullWidth
              required
              id="outlined-basic"
              color="info"
              variant="outlined"
              {...register("projectName", { required: true })}
            />
          </FormControl>

          {/* Property Permit No */}
          <FormControl>
            <FormHelperText
              sx={{
                fontWeight: 500,
                margin: "10px 0",
                fontSize: 16,
                color: "#11142d",
              }}
            >
              Enter Property Permit No
            </FormHelperText>
            <TextField
              fullWidth
              required
              id="outlined-basic"
              color="info"
              variant="outlined"
              {...register("permitNo", { required: true })}
            />
          </FormControl>

           {/* Permit no image*/}
           <Stack direction="column" gap={2}>
  <Stack direction="row" gap={2} position="relative">
    {barcode &&(
      <Box position="relative">
        <img
          src={barcode.url}
          alt="Permit No"
          width={200}
          height={200}
          style={{ borderRadius: 8, objectFit: "cover" }}
        />
        {handleRemoveBarcode && (
          <IconButton
            onClick={() => handleRemoveBarcode()}
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
        )}
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
      Upload Permit No Barcode
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
          if (handleBarcodeChange) {
            handleBarcodeChange(e.target.files ? e.target.files[0] : null);
          }
          
  }}
/>

    </Button>
  </FormControl>
</Stack>


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
          value={description }  
          
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
                Select Property Type
              </FormHelperText>
              <Select
                variant="outlined"
                color="info"
                displayEmpty
                required
                inputProps={{ "aria-label": "Without label" }}
                value={propertyType}
            
                {...register("propertyType", { required: true })}
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
                Enter property Price
              </FormHelperText>
              <TextField
                fullWidth
                required
                id="outlined-basic"
                color="info"
                type="number"
                variant="outlined"
                {...register("price", { required: true })}
              />
            </FormControl>
          </Stack>

          {/* Purpose and classification */}
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
                Enter Property Purpose
              </FormHelperText>
              <Select
                fullWidth
                rvariant="outlined"
                color="info"
                displayEmpty
                required
                inputProps={{ "aria-label": "Without label" }}
                value={purpose}
                {...register("purpose", { required: true })}
              > 
                <MenuItem value="sale">Sale</MenuItem>
                <MenuItem value="rent">Rent</MenuItem>
                <MenuItem value="buy">Buy</MenuItem>
              </Select>
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
                Enter Property Classification
              </FormHelperText>
              <Select
                fullWidth
                rvariant="outlined"
                color="info"
                displayEmpty
                required
                inputProps={{ "aria-label": "Without label" }}
                defaultValue="residential"
                {...register("classification", { required: true })}
              >
                <MenuItem value="residential">Residential </MenuItem>
                <MenuItem value="commercial">Commercial</MenuItem>
                <MenuItem value="off plan">Off Plan</MenuItem> 
              </Select>
            </FormControl>
          </Stack>

            {/* furnishing  and fetured */}
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
                Enter Property Furnishing Type
              </FormHelperText>
              <Select
                fullWidth
                rvariant="outlined"
                color="info"
                displayEmpty
                required
                inputProps={{ "aria-label": "Without label" }}
                value={furnishingType}
                {...register("furnishingType", { required: true })}
              > 
                <MenuItem value="furnished">Furnished</MenuItem>
                <MenuItem value="unfurnished">Unfurnished</MenuItem>
              </Select>
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
                Enter Property Featured
              </FormHelperText>
              <Select
                fullWidth
                rvariant="outlined"
                color="info"
                displayEmpty
                required
                inputProps={{ "aria-label": "Without label" }}
                // value={featured}
                {...register("featured")}
              >
                <MenuItem value="true">Featured </MenuItem>
                <MenuItem value="false">Unfeatured</MenuItem>
              </Select>
            </FormControl>
          </Stack>

  {/* location details */}
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
                Enter city
              </FormHelperText>
              <TextField
              fullWidth
              required
              id="outlined-basic"
              color="info"
              variant="outlined"
              {...register("location.city", { required: true })}
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
                Enter street
              </FormHelperText>
              <TextField
              fullWidth
              id="outlined-basic"
              color="info"
              variant="outlined"
              {...register("location.street")}
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
                Enter loaction map URL
              </FormHelperText>
              <TextField
              fullWidth
              required
              id="outlined-basic"
              color="info"
              variant="outlined"
              {...register("location.URL", { required: true })}
            />
            </FormControl>
          </Stack>

          {/* Property Size */}
          <FormControl>
            <FormHelperText
              sx={{
                fontWeight: 500,
                margin: "10px 0",
                fontSize: 16,
                color: "#11142d",
              }}
            >
              Enter Property Size
            </FormHelperText>
            <TextField
              fullWidth
              required
              id="outlined-basic"
              color="info"
              variant="outlined"
              {...register("size", { required: false })}
            />
          </FormControl>

          {/* Number of Rooms and Bathrooms */}
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
                Enter Number of Rooms
              </FormHelperText>
              <TextField
                fullWidth
                required
                id="outlined-basic"
                color="info"
                type="number"
                variant="outlined"
                {...register("numOfrooms", { required: true })}
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
                Enter Number of Bathrooms
              </FormHelperText>
              <TextField
                fullWidth
                required
                id="outlined-basic"
                color="info"
                type="number"
                variant="outlined"
                {...register("numOfbathrooms", { required: true })}
              />
            </FormControl>
          </Stack>

            {/* Number of Rooms and Bathrooms */}
            <Stack direction="row" gap={4}>
            <FormControl>
            <FormHelperText
                sx={{
                  fontWeight: 500,
                  margin: "10px 0",
                  fontSize: 16,
                  color: "#11142d",
                }}
              >
               Select Area Name
              </FormHelperText>
        <Select
         labelId="area-select-label"
         value={selectedArea}
         onChange={handleAreaChange}
         displayEmpty
         inputProps={{ 'aria-label': 'Without label' }}
        >
          {areaNames.map((area) => (
            <MenuItem key={area._id} value={area.areaName}>
              {area.areaName}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
          </Stack>


          {/* Property Features */}
          <FormControl>
          <Select
                multiple
                variant="outlined"
                value={selectedFeatures}
                onChange={handleFeatureChange}
                renderValue={(selected) => (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {selected.map((feature) => (
                      <Chip
                        key={feature}
                        label={feature}
                        onDelete={() => handleFeatureRemove(feature)}
                        deleteIcon={<CancelIcon />}
                      />
                    ))}
                  </Box>
                )}
              >
                {availableFeatures.map((feature) => (
                  <MenuItem key={feature} value={feature}>
                    {feature}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

          {/* Display selected features */}
          <Box mt={2} >
            <Typography fontSize={16} fontWeight={500} color="#11142d">
              Selected Features
            </Typography>
            <Stack direction="row" spacing={1} mt={1}>
              {selectedFeatures?.map((feature, index) => (
                <Chip
                  key={index}
                  label={feature}
                  onDelete={() => handleFeatureRemove(feature)} 
                  deleteIcon={<CancelIcon />}
                />
              ))}
            </Stack>
          </Box>

          {/* Property Images */}
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
  }} >
            {propertyImages.propImages.map((img, index) => (
           <Stack key={index} direction="column" alignItems="center">
            <img
              src={img.url} 
              alt={`Property ${index + 1}`}
              width={200}
              height={200}
              style={{ borderRadius: 8, objectFit: "cover" }}
            />
            <IconButton
              onClick={() => handleImageRemove(index , 'propImages')} 
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
                Upload property images
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
                    handleImageChange(e.target.files! , 'propImages');
                  }}
                />
              </Button>
            </FormControl>
          </Stack>

          <Stack direction="column" gap={2}>
                  <Stack direction="row" gap={2} position="relative">
                    {propertyImages.backgroundImage && (
                      <Box position="relative">
                        <img
                          src={propertyImages.backgroundImage.url}
                          alt="backgroundImage"
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
                            handleImageChange(e.target.files! ,'backgroundImage' );
                          }}
                        />
                      </Button>
                    </FormControl>
                </Stack>

          

          <CustomButton
            type="submit"
            title={formLoading ? "Submitting..." : "Submit"}
            backgroundColor="#dc743c"
            color="#fcfcfc"
          />
        </form>
      </Box>
    </Box>
  );
};  

export default Form;
