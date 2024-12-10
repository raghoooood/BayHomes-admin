import { useEffect, useState } from "react";
import { useGetIdentity, useOne } from "@refinedev/core";
import { useForm } from "@refinedev/react-hook-form";

import type { FieldValues } from "react-hook-form";

import DeveloperForm from "components/common/DeveloperForm";
import { SelectChangeEvent } from "@mui/material";
import { useParams } from "react-router-dom";

const EditDeveloper = () => {
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

  const { id: projectId } = useParams();

  const { data: projectData} = useOne({
    resource: 'projects',
    id: projectId as string,
  });
  const {
    refineCore: { onFinish, formLoading },
    register,
    handleSubmit,
    setValue,

  } = useForm();

  useEffect(() => {
    if (projectData?.data) {
      const project = projectData.data;
      const inImages = project.images?.inImages || [];
      const outImages = project.images?.outImages || [];
      const backgroundImage = project.images?.backgroundImage || null;      
      const floorP = project.floorPlans || [];
      setProjectImages({
        inImages: inImages.map((url: any) => ({ url})),
        outImages: outImages.map((url: any) => ({ url})),
        backgroundImage: { name: backgroundImage, url: backgroundImage }
          
      });
      setSelectedArea(project.area?.areaName || '');
      setSelectedDeveloper(project.developer.developerName || '')
      setSelectedAminities(project.aminities || []);
      setDescription(project.description );
      setAboutMap(project.aboutMap );
      setFloorPlans(floorP.map((floor: any) => ({
        numOfrooms: floor.numOfrooms || 0,
        floorType: floor.floorType || '',
        floorSize: floor.floorSize || '',
        floorImage: floor.floorImage || ''
      })));
    }
  }, [projectData, setValue]);

  const handleAddFloorPlan = () => {
    setFloorPlans([...floorPlans, { numOfrooms: 0, floorType: '', floorSize: '', floorImage: '' }]);
  };

  // Function to handle removing a floor plan
  const handleRemoveFloorPlan = (index: number) => {
    const updatedFloorPlans = floorPlans.filter((_, i) => i !== index);
    setFloorPlans(updatedFloorPlans);
  };
  
  function handleFloorPlanChange(index: number, field: string, value: File | string) {
    if (field === 'floorImage' && value instanceof File) {
      const reader = new FileReader();
  
      reader.onloadend = () => {
        try {
          const base64String = reader.result as string; // Cast the result to string
          setFloorPlans(prevPlans => {
            const newPlans = [...prevPlans];
            newPlans[index] = { ...newPlans[index], [field]: base64String }; // Update the floor plan with base64 image
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
        newPlans[index] = { ...newPlans[index], [field]: value }; // Handle other fields
        return newPlans;
      });
    }
  }
  

 

 

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
    console.log("Selected Area:", selectedArea); // Debugging line
    setSelectedArea(selectedArea);
    
  };

  const handleDeveloperChange = (event: SelectChangeEvent<string>) => {
    const selectedDeveloper = event.target.value;
    console.log("Selected Area:", selectedArea); // Debugging line
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
      aminities: selectedAminities, // send selected features array
      floorPlans: floorPlans.map(floor => floor.floorSize),
      areaName: selectedArea,
      developerName: selectedDeveloper,
      description: description,
      aboutMap: aboutMap,
     
    });

    
  };

  return (
    <DeveloperForm
      type="Edit"
      register={register}
      setValue={setValue}
      onFinish={onFinish}
      formLoading={formLoading}
      handleSubmit={handleSubmit}
      handleImageChange={handleImageChange}
      onFinishHandler={onFinishHandler}
      projectImages={projectImages} // pass down the array of images
      selectedAminities={selectedAminities} // pass down the selected features
      handleAminityChange={handleAminityChange} // pass down the feature change handler
      handleAminityRemove={handleAminityRemove} // pass down the feature remove handler
      handleImageRemove={handleImageRemove}
      handleFloorPlanChange={handleFloorPlanChange}
      handleAddFloorPlan={handleAddFloorPlan}
      handleRemoveFloorPlan={handleRemoveFloorPlan}
      floorPlans={floorPlans}
      handleAreaChange={handleAreaChange}
      selectedArea={selectedArea}
      handleDeveloperChange={handleDeveloperChange}
      selectedDeveloper={selectedDeveloper} 
      handleDescriptionChange={handleDescriptionChange }  
      description={description} 
      handleAboutMapChange={handleAboutMapChange}
      aboutMap={aboutMap}     
     />
  );
};

export default EditDeveloper;
