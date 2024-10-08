import React, { useState } from "react";
import { useGetIdentity } from "@refinedev/core";
import { useForm } from "@refinedev/react-hook-form";

import type { FieldValues } from "react-hook-form";
import AreaForm from "components/area/AreaForm";
import { SelectChangeEvent } from "@mui/material";

const CreateArea = () => {
  const { data: user } = useGetIdentity({
    v3LegacyAuthProviderCompatible: true,
  });

  // State to manage a single property image
  const [areaImage, setAreaImage] = useState<{ name: string; url: string } | null>(null);

  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);

  const {
    refineCore: { onFinish, formLoading },
    register,
    handleSubmit,
  } = useForm();

  // Function to handle image file input
  const handleImageChange = (file: File | null) => {
    if (file) {
      const reader = new FileReader();

      reader.onload = () => {
        setAreaImage({ name: file.name, url: reader.result as string });
      };

      reader.readAsDataURL(file);
    } else {
      setAreaImage(null); // Handle case where no file is selected
    }
  };

  const handleImageRemove = () => {
   
    setAreaImage(null); // Clear the areaImage state
  };

  const handleFeatureChange = (event: SelectChangeEvent<string[]>) => {
    const value = event.target.value as string[];
    const newSelection = value.filter(feature => !selectedFeatures.includes(feature));
    setSelectedFeatures(prevSelected => [...prevSelected, ...newSelection]);
  };

  const handleFeatureRemove = (feature: string) => {
    setSelectedFeatures(prevSelected => prevSelected.filter(f => f !== feature));
  };

  const onFinishHandler = async (data: FieldValues) => {
    if (!areaImage) return alert("Please select an image");

    await onFinish({
      ...data,
      image: areaImage.url, // Send the single image URL
      features: selectedFeatures, // Send selected features array
      email: user.email,
    });
  };

  return (
    <AreaForm
      type="Create"
      register={register}
      onFinish={onFinish}
      formLoading={formLoading}
      handleSubmit={handleSubmit}
      handleImageChange={handleImageChange}
      onFinishHandler={onFinishHandler}
      areaImage={areaImage} // Pass down the single image
      selectedFeatures={selectedFeatures} // Pass down the selected features
      handleFeatureChange={handleFeatureChange} // Pass down the feature change handler
      handleFeatureRemove={handleFeatureRemove} // Pass down the feature remove handler
      handleImageRemove={handleImageRemove }  
    />
  );
};

export default CreateArea;
