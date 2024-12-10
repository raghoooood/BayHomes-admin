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
  id?: BaseKey | undefined; // or BaseKey if you use it as the key
  title: string;
  price: string; // Price is being passed as a string in your example
  backgroundImage: string;
  numOfrooms?: number;
  numOfbathrooms?: number;
  size?: string;
  type?: string; // Property type (e.g., Apartment, Villa, etc.)
  status?: string; // Property status (e.g., available, sold, etc.)
  area: {
    areaName: string;
  };
  location: {
    city: string;
    street: string;
  };
  children?: ReactNode; // Optional children prop if needed
}