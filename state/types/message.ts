import { LocalImage } from "./local-image";

export interface Message {
  timestamp?: number;
  isLoading?: boolean;
  images?: LocalImage[];
}
