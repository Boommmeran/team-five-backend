import * as Cloudinary from 'cloudinary';
import 'dotenv';

const { CLOUD_NAME, API_KEY, API_SECRET } = process.env;

Cloudinary.config({
  cloud_name: CLOUD_NAME,
  api_key: API_KEY,
  api_secret: API_SECRET,
});

export const uploadImage = async (imagePath, public_id, folder) => {
  const options = {
    public_id,
    folder,
  };

  try {
    const result = await Cloudinary.v2.uploader.upload(imagePath, options);
    return result.public_id;
  } catch (error) {
    console.error(error);
  }
};
