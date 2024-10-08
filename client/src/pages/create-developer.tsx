import { useEffect, useState } from "react";
import { useGetIdentity } from "@refinedev/core";
import { useForm } from "@refinedev/react-hook-form";

import type { FieldValues } from "react-hook-form";

import DeveloperForm from "components/common/DeveloperForm";
import { SelectChangeEvent } from "@mui/material";

const CreateDeveloper = () => {
  const { data: user } = useGetIdentity({
    v3LegacyAuthProviderCompatible: true,
  });

  // State to manage separate arrays for outImages and inImages
  const [projectImages, setProjectImages] = useState({
    outImages: [] as { name: string; url: string }[],
    inImages: [] as { name: string; url: string }[],
    backgroundImage: {name: '' , url: ''},
  });

  const [selectedAminities, setSelectedAminities] = useState<string[]>([]);
  const [floorPlans, setFloorPlans] = useState([
    {
      numOfrooms: 0,
      floorType: '',
      floorSize: '',
      floorImage:  ''
    }
  ]);

  const [selectedArea, setSelectedArea] = useState<string>('');
  const [selectedDeveloper, setSelectedDeveloper] = useState<string>('');
  const [description, setDescription] = useState<string>("");
  const [aboutMap, setAboutMap] = useState<string>("");

  const handleAddFloorPlan = () => {
    setFloorPlans([...floorPlans, { numOfrooms: 0, floorType: '', floorSize: '', floorImage: '' }]);
  };

  const handleRemoveFloorPlan = (index: number) => {
    const updatedFloorPlans = floorPlans.filter((_, i) => i !== index);
    setFloorPlans(updatedFloorPlans);
  };
  
  const handleFloorPlanChange = (index: number, field: string, value: File | string) => {
    if (field === 'floorImage' && value instanceof File) {
      const reader = new FileReader();
  
      reader.onloadend = () => {
        try {
          const base64String = reader.result as string;
          setFloorPlans(prevPlans => {
            const newPlans = [...prevPlans];
            newPlans[index] = { ...newPlans[index], [field]: base64String };
            return newPlans;
          });
        } catch (error) {
          console.error("Error reading file:", error);
        }
      };
  
      reader.onerror = (error) => {
        console.error("FileReader error:", error);
      };
  
      reader.readAsDataURL(value);
    } else {
      setFloorPlans(prevPlans => {
        const newPlans = [...prevPlans];
        newPlans[index] = { ...newPlans[index], [field]: value };
        return newPlans;
      });
    }
  };
  

  const {
    refineCore: { onFinish, formLoading },
    register,
    handleSubmit,
    setValue,
  } = useForm();

  const handleImageChange = (files: FileList, type: 'outImages' | 'inImages' | 'backgroundImage') => {
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
        setProjectImages(prevImages => ({
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
        setProjectImages(prevImages => ({
          ...prevImages,
          [type]: [...(prevImages[type] as { name: string; url: string }[]), ...newImages], // Explicitly cast to array
        }))
      );
    }
  };
  
  const handleImageRemove = (index: number, type: 'outImages' | 'inImages' | 'backgroundImage') => {
    if (type === 'backgroundImage') {
      setProjectImages(prevImages => ({
        ...prevImages,
        backgroundImage: { name: '', url: '' }, // Clear the background image
      }));
    } else {
      setProjectImages(prevImages => ({
        ...prevImages,
        [type]: prevImages[type].filter((_, i) => i !== index), // Remove from the correct image type array
      }));
    }
  };

  const handleAminityChange = (event: SelectChangeEvent<string[]>) => {
    const value = event.target.value as string[];
    const newSelection = value.filter(feature => !selectedAminities.includes(feature));
    setSelectedAminities(prevSelected => [...prevSelected, ...newSelection]);
  };

  const handleAminityRemove = (feature: string) => {
    setSelectedAminities(prevSelected => prevSelected.filter(f => f !== feature));
  };

  const handleAreaChange = (event: SelectChangeEvent<string>) => {
    const selectedArea = event.target.value;
    setSelectedArea(selectedArea);
  };

  const handleDeveloperChange = (event: SelectChangeEvent<string>) => {
    const selectedDeveloper = event.target.value;
    setSelectedDeveloper(selectedDeveloper);
  };

  const handleDescriptionChange = (value: string) => {
    setDescription(value);
  };

  const handleAboutMapChange = (value: string) => {
    setAboutMap(value);
  };

  const onFinishHandler = async (data: FieldValues) => {
    if (projectImages.outImages.length === 0 && projectImages.inImages.length === 0 && !projectImages.backgroundImage.url) {
      return alert("Please select at least one image");
    }
    await onFinish({
      ...data,
      outImages: projectImages.outImages.map(image => image.url), // send outImages URLs
      inImages: projectImages.inImages.map(image => image.url), // send inImages URLs
      backgroundImage: projectImages.backgroundImage.url,
      aminities: selectedAminities, 
       floorPlans: floorPlans,
      areaName: selectedArea,
      developerName: selectedDeveloper,
      description: description,
      aboutMap: aboutMap,
      email: user.email,
    });
  };

  return (
    <DeveloperForm
      type="Create"
      register={register}
      setValue={setValue} // Pass setValue to Form
      onFinish={onFinish}
      formLoading={formLoading}
      handleSubmit={handleSubmit}
      handleImageChange={handleImageChange}
      onFinishHandler={onFinishHandler}
      projectImages={projectImages} // pass down the array of images
      selectedAminities={selectedAminities} // pass down the selected features
      handleAminityChange={handleAminityChange} // pass down the feature change handler
      handleAminityRemove={handleAminityRemove} // pass down the feature remove handler
      handleImageRemove={handleImageRemove} // pass down the image remove handler
      handleFloorPlanChange={handleFloorPlanChange} // pass down the floor plan change handler
      handleAddFloorPlan={handleAddFloorPlan} // pass down the function to add floor plans
      handleRemoveFloorPlan={handleRemoveFloorPlan} // pass down the function to remove floor plans
      floorPlans={floorPlans} // pass down the floor plans
      handleAreaChange={handleAreaChange} // pass down the area change handler
      selectedArea={selectedArea} // pass down the selected area
      handleDeveloperChange={handleDeveloperChange} // pass down the developer change handler
      selectedDeveloper={selectedDeveloper} // pass down the selected developer
      handleDescriptionChange={handleDescriptionChange} // pass down the description change handler
      description={description}
      handleAboutMapChange={handleAboutMapChange}
      aboutMap={aboutMap}
    />
  );
};

export default CreateDeveloper;
