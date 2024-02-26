import { LocalImage } from "./local-image";

export interface Message {
  timestamp?: number;
  type?: "text" | "image" | "audio"
  isLoading?: boolean;
  images?: LocalImage[];
  // size: "1024x1024" | "1792x1024" | "1024x1792",
  imageSize?: "1024x1024" | "1792x1024" | "1024x1792"; // for type === "image" and dall-e-3
}
