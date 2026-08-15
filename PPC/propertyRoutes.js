const express = require('express');
const router = express.Router();
const upload = require('./upload'); // Multer setup
const AddModel = require('./AddModel'); // Schema

// Route: Upload photos and videos using rentId
router.post(
  '/upload-media/:rentId',
  upload.fields([{ name: 'photos', maxCount: 10 }, { name: 'videos', maxCount: 5 }]),
  async (req, res) => {
    try {
      const { rentId } = req.params;

      // Find by rentId instead of _id
      const property = await AddModel.findOne({ rentId: Number(rentId) });

      if (!property) {
        return res.status(404).json({ message: 'Property not found with rentId: ' + rentId });
      }

      if (req.files.photos) {
        const photoPaths = req.files.photos.map(file => file.path);
        property.photos.push(...photoPaths);
      }

      if (req.files.videos) {
        const videoPaths = req.files.videos.map(file => file.path);
        property.video.push(...videoPaths);
      }

      await property.save();

      res.status(200).json({
        message: 'Media uploaded successfully',
        photos: property.photos,
        videos: property.video
      });
    } catch (err) {
      console.error('Upload error:', err);
      res.status(500).json({ message: 'Internal server error', error: err.message });
    }
  }
);

module.exports = router;
