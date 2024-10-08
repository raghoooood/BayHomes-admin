import { SelectChangeEvent } from "@mui/material";
import type { BaseKey } from "@refinedev/core";


export interface devInfoFormProps {
    type: string;
    register: any; // Typically a function from react-hook-form, e.g., `register: UseFormRegister<FieldValues>`
    onFinish: (
      values: FieldValues
    ) => Promise<void | CreateResponse<BaseRecord> | UpdateResponse<BaseRecord>>;
    formLoading: boolean;
    handleSubmit: FormEventHandler<HTMLFormElement> | undefined;
    handleImageChange: (file: File | null) => void; // Accepts a single File or null, matching single image upload
    onFinishHandler: (data: FieldValues) => Promise<void> | void;
    devInfoImage: { name: string; url: string } | null; // Handles only one image or null
    handleImageRemove: () => void ;
  }
  
  
export interface devInfoCardProps {
  id?: BaseKey | undefined;
  devName: string;
  devDescription?: string;
  image: string;
}


  

  