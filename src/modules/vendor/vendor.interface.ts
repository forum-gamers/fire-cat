import type { FileInput } from '../../interfaces/global.interface';

export interface CreateVendorInput {
  name: string;
  description: string;
  image?: FileInput | null;
  background?: FileInput | null;
}

export interface CreateVendorProps {
  name: string;
  description?: string;
  imageUrl?: string;
  imageId?: string;
  backgroundImageUrl?: string;
  backgroundImageId?: string;
  userId: string;
}

export interface UpdateImgProps {
  url: string;
  fileId: string;
}
