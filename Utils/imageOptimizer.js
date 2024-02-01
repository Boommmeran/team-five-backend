import sharp from 'sharp';

export const optimizeImage = async options => {
  const { input, output, width = 512, height = 512, quality = 90 } = options;
  await sharp(input).resize(width, height).webp({ quality }).toFile(output);
};
