import { useEffect, useState } from "react";
import { useGetIdentity, useList, useOne } from "@refinedev/core";
import { useForm } from "@refinedev/react-hook-form";
import type { FieldValues } from "react-hook-form";
import DevInfoForm from "components/developer/DevInfoForm";
import { useParams } from "react-router-dom";

const EditDev = () => {
  const { data: user } = useGetIdentity({
    v3LegacyAuthProviderCompatible: true,
  });
  const [devImage, setDevImage]  = useState<{ name: string; url: string } | null>(null);

  const { id: developerId } = useParams();

  const { data: developerData} = useOne({
    resource: 'developers',
    id: developerId as string,
  });

  const {
    refineCore: { onFinish, formLoading },
    register,
    handleSubmit,
    setValue,
  } = useForm();
  useEffect(() => {
    if (developerData?.data) {
      const developer = developerData.data;
           
     
      setDevImage({ name: developer.name, url: developer.image });
    }
  }, [developerData]);

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
   
    setDevImage(null); // Clear the devImage state
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
      type="Edit"
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

export default EditDev;
