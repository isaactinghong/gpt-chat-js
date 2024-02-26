import { LocalImage } from "./local-image";

export interface Message {
  timestamp?: number;
  type?: "text" | "image" | "audio"
  isLoading?: boolean;
  images?: LocalImage[];
}
