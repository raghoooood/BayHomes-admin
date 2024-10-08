import { useEffect, useState } from "react";
import { useGetIdentity } from "@refinedev/core";
import { useForm } from "@refinedev/react-hook-form";

import type { FieldValues } from "react-hook-form";

import Form from "components/common/Form";
import { SelectChangeEvent } from "@mui/material";
import { features } from "process";

const CreateProperty = () => {
  const { data: user } = useGetIdentity({
    v3LegacyAuthProviderCompatible: true,
  });

  // State to manage multiple property images
  const [propertyImages, setPropertyImages] = useState({
    propImages: [] as { name: string; url: string }[],
    backgroundImage: {name: '' , url: ''},
  });
  const [barcodeImage, setBarcodeImage] = useState<{ name: string; url: string } | null>(null);

  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);
  const [selectedArea, setSelectedArea] = useState<string>('');
  const [description, setDescription] = useState<string >(""); 
  const existdes = "";
  const {
    refineCore: { onFinish, formLoading },
    register,
    handleSubmit,
    setValue,
  } = useForm();

  useEffect(() => {
    if(existdes) {
      setDescription(description)
    }
  }, [existdes]) 

  
   const handleImageChange = (files: FileList, type: 'propImages' | 'backgroundImage') => {
    const fileArray = Array.from(files);
    
    const reader = (readFile: File) =>
      new Promise<string>((resolve, reject) => {
        const fileReader = new FileReader();
        fileReader.onload = () => resolve(fileReader.result as string);
        fileReader.readAsDataURL(readFile);
      });

      if (type === 'backgroundImage' && fileArray.length > 0) {
        // Handle single background image (since it's an object, not an array)
        reader(fileArray[0]).then(result => {
          setPropertyImages(prevImages => ({
            ...prevImages,
            backgroundImage: { name: fileArray[0].name, url: result }, // Set background image
          }));
        });
      } else {
        // Handle multiple inImages or outImages (these are arrays)
        const imagePromises = fileArray.map(file =>
          reader(file).then(result => ({ name: file.name, url: result }))
        );
    
        Promise.all(imagePromises).then(newImages =>
          setPropertyImages(prevImages => ({
            ...prevImages,
            [type]: [...(prevImages[type] as { name: string; url: string }[]), ...newImages], // Explicitly cast to array
          }))
        );
      }
    };
    const handleImageRemove = (index: number, type: 'propImages' | 'backgroundImage') => {
      if (type === 'backgroundImage') {
        setPropertyImages(prevImages => ({
          ...prevImages,
          backgroundImage: { name: '', url: '' }, // Clear the background image
        }));
      } else {
        setPropertyImages(prevImages => ({
          ...prevImages,
          [type]: prevImages[type].filter((_, i) => i !== index), // Remove from the correct image type array
        }));
      }
    };
  

  const handleFeatureChange = (event: SelectChangeEvent<string[]>) => {
    const value = event.target.value as string[];
    const newSelection = value.filter(feature => !selectedFeatures.includes(feature));
    setSelectedFeatures(prevSelected => [...prevSelected, ...newSelection]);
   
  };

  const handleAreaChange = (event: SelectChangeEvent<string>) => {
    const selectedArea = event.target.value;
    console.log("Selected Area:", selectedArea); // Debugging line
    setSelectedArea(selectedArea);
    
  };
  

  const handleFeatureRemove = (feature: string) => {
    setSelectedFeatures(prevSelected => prevSelected.filter(f => f !== feature));
  };
  
  const handleDescriptionChange = (value: string) => {
   setDescription(value);
  };

   // Function to handle image file input
   const handleBarcodeChange = (file: File | null) => {
    if (file) {
      const reader = new FileReader();

      reader.onload = () => {
        setBarcodeImage({ name: file.name, url: reader.result as string });
      };

      reader.readAsDataURL(file);
    } else {
      setBarcodeImage(null); // Handle case where no file is selected
    }
  };

  const handleRemoveBarcode = () => {
   
    setBarcodeImage(null); // Clear the areaImage state
  };

  const onFinishHandler = async (data: FieldValues) => {
    if (propertyImages.propImages.length === 0 && !propertyImages.backgroundImage.url) {
      return alert("Please select at least one image");
    }
  
      await onFinish({
        ...data,
        propImages: propertyImages.propImages.map(image => image.url), // send inImages URLs
        backgroundImage: propertyImages.backgroundImage.url,
        features: selectedFeatures,
        email: user.email,
        areaName: selectedArea,
        description: description,
        barcode: barcodeImage?.url,
      });
    } 
  
  

  return (
    <Form
      type="Create"
      register={register}
      onFinish={onFinish}
      formLoading={formLoading}
      handleSubmit={handleSubmit}
      handleImageChange={handleImageChange}
      onFinishHandler={onFinishHandler}
      propertyImages={propertyImages} // pass down the array of images
      selectedFeatures={selectedFeatures} // pass down the selected features
      handleFeatureChange={handleFeatureChange} // pass down the feature change handler
      handleFeatureRemove={handleFeatureRemove} // pass down the feature remove handler
      handleImageRemove={handleImageRemove}
      handleAreaChange={handleAreaChange}
      selectedArea={selectedArea}
      barcode={barcodeImage}
      handleDescriptionChange={handleDescriptionChange} 
      handleBarcodeChange={handleBarcodeChange } 
      handleRemoveBarcode={handleRemoveBarcode }
      description={description}
      />
  );
};

export default CreateProperty;
