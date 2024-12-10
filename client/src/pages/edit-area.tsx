import { useEffect, useState } from "react";
import { useGetIdentity, useList, useOne } from "@refinedev/core";
import { useForm } from "@refinedev/react-hook-form";
import type { FieldValues } from "react-hook-form";
import { SelectChangeEvent } from "@mui/material";
import AreaForm from "components/area/AreaForm";
import { useParams } from 'react-router-dom';

const EditArea = () => {
  const { data: user } = useGetIdentity({
    v3LegacyAuthProviderCompatible: true,
  });
  const [areaImage, setAreaImage] = useState<{ name: string; url: string } | null>(null);
  const { id: areaId } = useParams(); 
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);
  const { data: areasData, isLoading: areasLoading } = useOne({
    resource: 'areas',
    id: areaId as string,
  });

  const {
    refineCore: { onFinish, formLoading },
    register,
    handleSubmit,
  } = useForm();

   // Set area and developer data once fetched
   useEffect(() => {
    if (areasData?.data) {
      const area = areasData.data; // Example, selecting the first area
      setAreaImage({ name: area.imageName, url: area.image });
      setSelectedFeatures(area.features || []);
    }
  }, [areasData]);

  if (areasLoading ) {
    return <div>Loading...</div>; // Handle loading state
  }


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
    setSelectedFeatures(value);
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
      type="Edit"
      register={register}
      onFinish={onFinish}
      formLoading={formLoading}
      handleSubmit={handleSubmit}
      handleImageChange={handleImageChange}
      onFinishHandler={onFinishHandler}
      areaImage={areaImage}
      selectedFeatures={selectedFeatures} // pass down the selected features
      handleFeatureChange={handleFeatureChange} // pass down the feature change handler
      handleFeatureRemove={handleFeatureRemove} // pass down the feature remove handler
      handleImageRemove={ handleImageRemove}      // handleImageRemove={handleImageRemove}    
    />
  );
};

export default EditArea;
