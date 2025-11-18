const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadImages = async (files) => {
  const uploaded = [];

  for (const file of files) {
    const result = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload(
        file,
        { folder: "tasks" },
        (error, response) => {
          if (error) reject(error);
          else resolve(response);
        }
      );
    });

    uploaded.push({
      url: result.secure_url,
      publicId: result.public_id,
    });
  }

  return uploaded;
};

const deleteImages = async (publicIds) => {
  for (const publicId of publicIds) {
    await cloudinary.uploader.destroy(publicId);
  }
};

module.exports = { uploadImages, deleteImages };
