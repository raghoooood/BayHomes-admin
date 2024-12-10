import React, { useState } from 'react';
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import FormControl from "@mui/material/FormControl";
import FormHelperText from "@mui/material/FormHelperText";
import TextField from "@mui/material/TextField";
import TextareaAutosize from "@mui/material/TextareaAutosize";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import CancelIcon from '@mui/icons-material/Cancel';

import CustomButton from "../common/CustomButton";
import { IconButton } from '@mui/material';
import { devInfoFormProps } from 'interfaces/devInfo';

const DevInfoForm = ({
    type,
    register,
    handleSubmit,
    handleImageChange,
    formLoading,
    onFinishHandler,
    devInfoImage,
    handleImageRemove,
}: devInfoFormProps) => {
      return (
        <Box>
          <Typography fontSize={25} fontWeight={700} color="#11142d">
            {type} a Developer
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
              {/* developer name */}
              <FormControl>
                <FormHelperText
                  sx={{
                    fontWeight: 500,
                    margin: "10px 0",
                    fontSize: 16,
                    color: "#11142d",
                  }}
                >
                  Enter developer name
                </FormHelperText>
                <TextField
                  fullWidth
                  required
                  id="outlined-basic"
                  color="info"
                  variant="outlined"
                  {...register("developerName", { required: true })}
                />
              </FormControl>
    
             
    
              {/* Developer Description */}
              <FormControl>
                <FormHelperText
                  sx={{
                    fontWeight: 500,
                    margin: "10px 0",
                    fontSize: 16,
                    color: "#11142d",
                  }}
                >
                  Enter Description about developer
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
 
    
                      {/* developer logo Images */}
                      <Stack direction="column" gap={2}>
      <Stack direction="row" gap={2} position="relative">
        {devInfoImage && (
        <Box position="relative">
        <img
          src={devInfoImage.url}
          alt="devLogo"
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
      Upload Developer logo image
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

export default DevInfoForm;
