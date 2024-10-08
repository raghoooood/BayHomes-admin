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
}

export interface PropertyCardProps {
  id?: BaseKey | undefined;
  title: string;
  location: {
    city: string;
    street: string;
  };
  area: {
    areaName: string;
  };
  price: string;
  backgroundImage: string;
  type?: string; // Property type (e.g., Apartment, Villa, etc.)
  numOfrooms?: number; // Number of rooms in the property
  status?: string; // Status of the property (e.g., available, sold, etc.)
  numOfbathrooms?:number;
  size?:string;
}