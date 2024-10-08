import React, { useEffect, useState } from "react";
import { useGetIdentity, useOne } from "@refinedev/core";
import { useForm } from "@refinedev/react-hook-form";

import type { FieldValues } from "react-hook-form";
import DevInfoForm from "components/developer/DevInfoForm";
import { useParams } from "react-router-dom";

const CreateDev = () => {
  const { data: user } = useGetIdentity({
    v3LegacyAuthProviderCompatible: true,
  });

  // State to manage a single property image
  const [devImage, setDevImage] = useState<{ name: string; url: string } | null>(null);

  const {
    refineCore: { onFinish, formLoading },
    register,
    handleSubmit,
    setValue,
  } = useForm();

  

  // Function to handle image file input
  const handleImageChange = (file: File | null) => {
    if (file) {
      const reader = new FileReader();

      reader.onload = () => {
        setDevImage({ name: file.name, url: reader.result as string });
      };

      reader.readAsDataURL(file);
    } else {
        setDevImage(null); // Handle case where no file is selected
    }
  };

  const handleImageRemove = () => {
   
    setDevImage(null); // Clear the developerImage state
  };

  const onFinishHandler = async (data: FieldValues) => {
    if (!devImage) return alert("Please select an image");

    await onFinish({
      ...data,
      image: devImage.url, // Send the single image URL
      email: user.email,

      
    });
  };

  return (
    <DevInfoForm
      type="Create"
      register={register}
      onFinish={onFinish}
      formLoading={formLoading}
      handleSubmit={handleSubmit}
      handleImageChange={handleImageChange}
      onFinishHandler={onFinishHandler}
      devInfoImage={devImage} // Pass down the single image
      handleImageRemove={handleImageRemove }  
    />
  );
};

export default CreateDev;
