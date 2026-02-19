export type * from "./store";
export type typeDataItem = {
  id: number;
  name: string;
  icon?: string;
};
export type ImageItem = {
  id: string;
  name: string;
  updateTime: number;
  size: number;
  url: string;
  type: string;
  check?: boolean;
  city?: string;
  tags?: string[];
  uploadTime?: number;
  createUser?: string;
  desc?: string;
};
