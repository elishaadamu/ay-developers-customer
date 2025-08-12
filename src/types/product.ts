import type { ComponentType } from "react";

export interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  images: string;
  userId: string;
  createdDate: string;
  salesCount: number;
  __v: number;
  // Frontend-specific properties
  category?: string;
  status?: "Active" | "Coming Soon" | "Maintenance";
  rating?: number;
  reviews?: number;
  features?: string[];
  icon?: ComponentType<any>;
}
