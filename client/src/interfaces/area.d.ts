import { SelectChangeEvent } from "@mui/material";
import type { BaseKey } from "@refinedev/core";


export interface AreaFormProps {
    type: string;
    register: any; // Typically a function from react-hook-form, e.g., `register: UseFormRegister<FieldValues>`
    onFinish: (
      values: FieldValues
    ) => Promise<void | CreateResponse<BaseRecord> | UpdateResponse<BaseRecord>>;
    formLoading: boolean;
    handleSubmit: FormEventHandler<HTMLFormElement> | undefined;
    handleImageChange: (file: File | null) => void; // Accepts a single File or null, matching single image upload
    onFinishHandler: (data: FieldValues) => Promise<void> | void;
    areaImage: { name: string; url: string } | null; // Handles only one image or null
    selectedFeatures: string[];
    handleFeatureChange: (event: SelectChangeEvent<string[]>) => void; // Manages selected features
    handleFeatureRemove: (feature: string) => void; // Handles removal of a selected feature
    handleImageRemove: () => void ;
  }
  
  
export interface AreaCardProps {
  id?: BaseKey | undefined;
  areaName: string;
  description?: string;
  aboutArea?: string;
  locationId?: string;
  developer?: string;
  image: string;
}


  

  