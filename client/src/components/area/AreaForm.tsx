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
import Chip from "@mui/material/Chip";
import CancelIcon from '@mui/icons-material/Cancel';

import type { AreaFormProps } from "interfaces/area";
import CustomButton from "../common/CustomButton";
import { IconButton } from '@mui/material';

const AreaForm = ({
    type,
    register,
    handleSubmit,
    handleImageChange,
    formLoading,
    onFinishHandler,
    selectedFeatures,
    handleFeatureChange,
    handleFeatureRemove,
    areaImage,
    handleImageRemove,
}: AreaFormProps) => {
    const [availableFeatures, setAvailableFeatures] = useState([
    "Luxury living", "Big City", "Beach front",
    "Water front", "Metro", "Green", "Family Community",
    "Golf", "Villa Community", "Outdoor Spaces", "Children's Play Area"
      ]);
     
    
   

      return (
        <Box>
          <Typography fontSize={25} fontWeight={700} color="#11142d">
            {type} an Area
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
              {/* Area Title */}
              <FormControl>
                <FormHelperText
                  sx={{
                    fontWeight: 500,
                    margin: "10px 0",
                    fontSize: 16,
                    color: "#11142d",
                  }}
                >
                  Enter Area name
                </FormHelperText>
                <TextField
                  fullWidth
                  required
                  id="outlined-basic"
                  color="info"
                  variant="outlined"
                  {...register("areaName", { required: true })}
                />
              </FormControl>
    
             
    
              {/* Area Description */}
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
                <TextareaAutosize
                  minRows={5}
                  required
                  placeholder="Write description"
                  color="info"
                  style={{
                    width: "100%",
                    background: "transparent",
                    fontSize: "16px",
                    borderColor: "rgba(0,0,0,0.23)",
                    borderRadius: 6,
                    padding: 10,
                    color: "#919191",
                  }}
                  {...register("description", { required: true })}
                />
              </FormControl>
    
              {/* Area Location */}
              <FormControl>
                <FormHelperText
                  sx={{
                    fontWeight: 500,
                    margin: "10px 0",
                    fontSize: 16,
                    color: "#11142d",
                  }}
                >
                  Enter Location
                </FormHelperText>
                <TextField
                  fullWidth
                  required
                  id="outlined-basic"
                  color="info"
                  variant="outlined"
                  {...register("location", { required: true })}
                />
              </FormControl>
    
    
              {/* Area Amenities */}
              <FormControl>
                <FormHelperText
                  sx={{
                    fontWeight: 500,
                    margin: "10px 0",
                    fontSize: 16,
                    color: "#11142d",
                  }}
                >
                  Select Area Amenities
                </FormHelperText>
                <Select
                  variant="outlined"
                  color="info"
                  displayEmpty
                  multiple
                  value={selectedFeatures}
                  onChange={handleFeatureChange}
                  
                  
                >
                  {availableFeatures.map((feature, index) => (
                    <MenuItem key={index} value={feature} >
                      {feature}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
    
              {/* Display selected features */}
              <Box mt={2}>
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
    
                      {/* Area Images */}
                <Stack direction="column" gap={2}>
                  <Stack direction="row" gap={2} position="relative">
                    {areaImage && (
                      <Box position="relative">
                        <img
                          src={areaImage.url}
                          alt="Area"
                          width={200}
                          height={200}
                          style={{ borderRadius: 8, objectFit: "cover" }}
                        />
                        <IconButton
                          onClick={() => handleImageRemove()}
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
      Upload Area image
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
          handleImageChange(e.target.files ? e.target.files[0] : null);
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

export default AreaForm;
