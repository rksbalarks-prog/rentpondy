const express = require('express');
const multer = require('multer');
const xlsx = require('xlsx');
const fs = require('fs');
const AddModel = require('./AddModel');

const router = express.Router();

// Multer configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  },
});
const upload = multer({ storage });

router.post(
  '/update-rent-property-upload',
  upload.fields([
    { name: 'video', maxCount: 1 },
    { name: 'photos', maxCount: 15 },
    { name: 'excelFile', maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      if (req.fileValidationError) {
        return res.status(400).json({ message: req.fileValidationError });
      }

      if (req.files['video'] && req.files['video'][0].size > 50 * 1024 * 1024) {
        return res.status(400).json({ message: 'Video file size exceeds 50MB.' });
      }

      if (req.files['excelFile']) {
        const excelPath = req.files['excelFile'][0].path;
        const workbook = xlsx.readFile(excelPath);
        const sheetName = workbook.SheetNames[0];
        const sheetData = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName], { header: 1 });

        const headers = sheetData[0];
        const rows = sheetData.slice(1); // Skip header row

        const allowedFields = [
          'rentId', 'phoneNumber', 'rentType', 'rentalAmount', 'rentalPropertyAddress', 'state', 'city', 'district', 'area',
          'streetName', 'doorNumber', 'nagar', 'ownerName', 'email', 'alternatePhone', 'countryCode',
          'alternateCountryCode', 'propertyMode', 'propertyType', 'bankLoan', 'negotiation', 'ownership',
          'bedrooms', 'kitchen', 'kitchenType', 'balconies', 'floorNo', 'areaUnit', 'propertyApproved',
          'propertyAge', 'postedBy', 'facing', 'furnished', 'lift',
          'attachedBathrooms', 'western', 'numberOfFloors', 'carParking', 'bestTimeToCall', 'totalArea',
          'length', 'breadth', 'description', 'pinCode', 'locationCoordinates',
          'availableDate', 'familyMembers', 'foodHabit', 'jobType', 'petAllowed',
          'securityDeposit',
        ];

        for (const row of rows) {
          const fieldsToUpdate = {};

          headers.forEach((header, index) => {
            const key = header?.toString().trim();
            const value = row[index];
            if (key && allowedFields.includes(key)) {
              fieldsToUpdate[key] = typeof value === 'number' ? value.toString() : String(value).trim();
            }
          });

          const { rentId } = fieldsToUpdate;
          if (!rentId) continue;

          let property = await AddModel.findOne({ rentId });
          if (!property) {
            property = new AddModel({ rentId });
          }

          Object.keys(fieldsToUpdate).forEach((key) => {
            if (key !== 'rentId') {
              property[key] = fieldsToUpdate[key];
            }
          });

          if (req.files['video']) {
            property.video = req.files['video'][0].path;
          }
          if (req.files['photos']) {
            property.photos = req.files['photos'].map((file) => file.path);
          }

          // Required fields to check completeness (optional logic, you can update or remove)
          const requiredFields = [
            'phoneNumber', 'rentalAmount', 'rentalPropertyAddress', 'state', 'city', 'district',
            'area', 'streetName', 'doorNumber', 'nagar', 'ownerName', 'email', 'propertyMode',
            'propertyType', 'ownership', 'bedrooms', 'kitchen', 'floorNo', 'areaUnit',
            'propertyApproved', 'propertyAge', 'postedBy', 'facing', 'furnished', 'carParking',
            'totalArea', 'length', 'breadth',
          ];
          const isComplete = requiredFields.every((field) => property[field]);
          property.status = isComplete ? 'complete' : 'incomplete';

          await property.save();
        }

        fs.unlinkSync(excelPath); // Delete the file after processing
      }

      res.status(200).json({ message: 'All properties updated successfully!' });
    } catch (error) {
      res.status(500).json({ message: 'Error updating properties.', error: error.message });
    }
  }
);

module.exports = router;
