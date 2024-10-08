export interface CustomButtonProps {
  type?: string;
  title: string;
  backgroundColor: string;
  color: string;
  fullWidth?: boolean;
  icon?: ReactNode;
  disabled?: boolean;
  handleClick?: () => void;
}

export interface ProfileProps {
  type: string;
  name: string;
  avatar: string;
  email: string;
  properties: Array | undefined;
  projects: Array | undefined;
  developers: Array | undefined;
  areas: Array | undefined;
 
}

export interface PropertyProps {
  [x: string]: number;
  type: string;
  _id: string;
  title: string;
  premitNoImage: { name: string; url: string } | null;
  description: string;
  price: string;
  images: {
    backgroundImage: string;
  };
    creator: string;
  location: {
    city: string;
    street: string;
  };
  area: {
    areaName: string;
  };
  numOfrooms?: number; // Number of rooms in the property
  status?: string; // Status of the property (e.g., available, sold, etc.)
  numOfbathrooms?:number;
  size?:string;
}

export interface ProjectProps {
  [x: string]: number;
  type?: string;
  _id?: string;
  premitNoImage?: { name: string; url: string } | null;
  projectName: string;
  images: {
    backgroundImage: string;
  };
  startPrice?: number | undefined;
  projectType?: string; // Property type (e.g., Apartment, Villa, etc.)
  rooms: {
    min: number;
    max: number;
  };// Number of rooms in the property
  size?:string;
  description?: string;
  location : {
    location: string;
    mapURl: string;
    aboutMao: string;
  };
 
}

export interface DeveloperProps {
  [x: string]: number;
  type: string;
  _id: string;
  premitNoImage?: { name: string; url: string } | null;
  devName: string;
  devDescription?: string;
  image: string;
}

export interface AreaProps {
  [x: string]: number;
  type: string;
  _id: string;
  premitNoImage?: { name: string; url: string } | null;
  areaName: string;
  description?: string;
  aboutArea?: string;
  locationId?: string;
  developer?: string;
  image: string;
}


export interface FormProps {
  type: string;
  register: any;

  onFinish: (
    values: FieldValues,
  ) => Promise<void | CreateResponse<BaseRecord> | UpdateResponse<BaseRecord>>;
  formLoading: boolean;
  handleSubmit: FormEventHandler<HTMLFormElement> | undefined;
  handleImageChange: (files: FileList, type: 'propImages' | 'backgroundImage') => void; // This accepts FileList
  handleBarcodeChange: (file: File | null) => void; // Optional handler

  onFinishHandler: (data: FieldValues) => Promise<void> | void;
  propertyImages: {
    propImages: Array<{ name: string; url: string }>; // Handles multiple images
    backgroundImage: {name: string; url: string};
  }; 
  barcode: { name: string; url: string } | null;
  handleRemoveBarcode: () => void;

  selectedFeatures: string[];
  handleFeatureChange: (event: SelectChangeEvent<string[]>) => void;
  handleFeatureRemove: (feature: string) => void;
  handleImageRemove: (index: number , type: 'propImages' | 'backgroundImage') => void;
  handleAreaChange:  (event: SelectChangeEvent<string>) => void;
  selectedArea: string;
  handleDescriptionChange: (value: string) => void;
  description?: string;
  propertyType?: string; 
  purpose?: string;
  featured?: string;
  furnishingType?: string;
}

