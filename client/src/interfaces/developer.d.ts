import type { BaseKey } from "@refinedev/core";

export interface FormFieldProp {
  title: string;
  labelName: string;
}

export interface FormValues {
  title: string;
  description: string;
  propertyType: string;
  location: string;
  price: number | undefined;
  locationURL: string;
}

export interface DeveloperCardProps {
  id?: BaseKey | undefined;
  projectName: string;
  images: {
    backgroundImage: string;
  };
  startPrice: number | undefined;
  projectType?: string; // Property type (e.g., Apartment, Villa, etc.)
  rooms: {
    min: number;
    max: number;
  };// Number of rooms in the property
  size?:string;
  description?: string;
  location: {
    location: string;
    mapURl: string;
    aboutMao: string;
  }
  
}

export interface DeveloperFormProps {
  type: string;
  register: any;
  onFinish?: (
    values: FieldValues,
  ) => Promise<void | CreateResponse<BaseRecord> | UpdateResponse<BaseRecord>>;
  formLoading: boolean;
  handleSubmit: FormEventHandler<HTMLFormElement> | undefined;
  handleImageChange: (files: FileList , type: 'outImages' | 'inImages' | 'backgroundImage') => void; // Updated to accept type
  handleImageRemove: (index: number, type: 'outImages' | 'inImages' | 'backgroundImage') => void; // Updated to accept type
  projectImages: {
    outImages: Array<{ name: string; url: string }>;
    inImages: Array<{ name: string; url: string }>;
    backgroundImage: {name: string; url: string};
  };
  onFinishHandler: (data: FieldValues) => Promise<void> | void;
  selectedAminities: string[];
  handleAminityChange: (event: SelectChangeEvent<string[]>) => void;
  handleAminityRemove: (feature: string) => void;
  handleFloorPlanChange: (index: number, field: string, value: File | string) => void;
  handleAddFloorPlan: () => void;
  handleRemoveFloorPlan: (index: number) => void;
  floorPlans: { numOfrooms: number; floorType: string; floorSize: string; floorImage: string }[];
  handleAreaChange:  (event: SelectChangeEvent<string>) => void;
  selectedArea: string;
  handleDeveloperChange:  (event: SelectChangeEvent<string>) => void;
  selectedDeveloper: string;
  setValue: (name: string, value: any, options?: { shouldValidate?: boolean; shouldDirty?: boolean }) => void; // Add setValue here
  handleDescriptionChange: (value: string) => void;
  description?: string;
  handleAboutMapChange: (value: string) => void;
  aboutMap?: string;
  propertyType?: string; 
  purpose?: string;
  


}