



const express = require("express");
const router = express.Router();
const TextModel = require("../TextEdider/TextModel"); // ✅ verify this path

// helper: escape regex special chars
function escapeRegExp(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

// helper: decode + normalize input type
function normalizeType(raw) {
  let t = String(raw || "").trim();
  try {
    t = decodeURIComponent(t); // safe if client encoded
  } catch (e) {
    // ignore decode errors
  }
  // normalize common HTML entity &amp; -> &
  t = t.replace(/&amp;/gi, "&");
  // collapse multiple whitespaces to single space
  t = t.replace(/\s+/g, " ");
  return t;
}

// Save new or update existing text (POST)
router.post("/save-text", async (req, res) => {
  try {
    let { type, content } = req.body;
    if (!type || !content)
      return res.status(400).json({ error: "Type and content are required." });

    type = normalizeType(type);
    content = String(content).replace(/\r/g, "");

    // find case-insensitive match
    const existing = await TextModel.findOne({
      type: { $regex: `^${escapeRegExp(type)}$`, $options: "i" },
    });

    if (existing) {
      existing.content = content;
      existing.updatedAt = new Date();
      await existing.save();
      return res
        .status(200)
        .json({ message: "Text updated successfully!", data: existing });
    } else {
      const newText = new TextModel({ type, content });
      await newText.save();
      return res
        .status(201)
        .json({ message: "Text saved successfully!", data: newText });
    }
  } catch (error) {
    return res
      .status(500)
      .json({ error: "Internal Server Error", details: error.message });
  }
});

// Get text by path parameter OR query parameter (safe in Express 4 & 5)
router.get("/get-text/:type", async (req, res) => {
  try {
    const rawType = req.params.type || req.query.type;
    if (!rawType)
      return res.status(400).json({ error: "Type parameter is required." });

    const type = normalizeType(rawType);

    const textData = await TextModel.findOne({
      type: { $regex: `^${escapeRegExp(type)}$`, $options: "i" },
    });

    if (!textData) return res.status(404).json({ message: "Text not found." });

    return res.status(200).json(textData);
  } catch (error) {
    return res
      .status(500)
      .json({ error: "Internal Server Error", details: error.message });
  }
});


// Update text by type (PUT)
router.put("/update-text/:type", async (req, res) => {
  try {
    const rawType = req.params.type;
    let { content } = req.body;
    if (!rawType)
      return res.status(400).json({ error: "Type parameter is required." });
    if (!content)
      return res.status(400).json({ error: "Content is required." });

    const type = normalizeType(rawType);
    content = String(content).replace(/\r/g, "");

    const existing = await TextModel.findOne({
      type: { $regex: `^${escapeRegExp(type)}$`, $options: "i" },
    });

    if (!existing)
      return res
        .status(404)
        .json({ message: "Text not found for the given type." });

    existing.content = content;
    existing.updatedAt = new Date();
    await existing.save();

    return res
      .status(200)
      .json({ message: "Text updated successfully!", data: existing });
  } catch (error) {
    return res
      .status(500)
      .json({ error: "Internal Server Error", details: error.message });
  }
});

// Delete a single text by type
router.delete("/delete-text/:type", async (req, res) => {
  try {
    const rawType = req.params.type;
    if (!rawType)
      return res.status(400).json({ error: "Type parameter is required." });

    const type = normalizeType(rawType);

    const existing = await TextModel.findOne({
      type: { $regex: `^${escapeRegExp(type)}$`, $options: "i" },
    });

    if (!existing)
      return res
        .status(404)
        .json({ message: "Text not found for the given type." });

    await TextModel.findByIdAndDelete(existing._id);
    return res.status(200).json({ message: "Text deleted successfully!" });
  } catch (error) {
    return res
      .status(500)
      .json({ error: "Internal Server Error", details: error.message });
  }
});

// Get all texts
router.get("/get-all-texts", async (req, res) => {
  try {
    const allTexts = await TextModel.find({});
    return res.status(200).json(allTexts);
  } catch (error) {
    return res
      .status(500)
      .json({ error: "Internal Server Error", details: error.message });
  }
});


// ✅ NEW API: Delete ALL text entries in the database
router.delete("/delete-all-texts", async (req, res) => {
  try {
    const result = await TextModel.deleteMany({});
    return res.status(200).json({
      message: "All text entries deleted successfully!",
      deletedCount: result.deletedCount,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ error: "Internal Server Error", details: error.message });
  }
});

module.exports = router;















// const express = require("express");
// const router = express.Router();
// const TextModel = require("../TextEdider/TextModel");

// // Save new or update existing text
// router.post("/save-text", async (req, res) => {
//   try {
//     let { type, content } = req.body;
//     if (!type || !content) return res.status(400).json({ error: "Type and content are required." });

//     content = String(content).replace(/\r/g, "");

//     const existingText = await TextModel.findOne({ type });

//     if (existingText) {
//       existingText.content = content;
//       existingText.updatedAt = new Date();
//       await existingText.save();
//       return res.status(200).json({ message: "Text updated successfully!" });
//     } else {
//       const newText = new TextModel({ type, content });
//       await newText.save();
//       return res.status(201).json({ message: "Text saved successfully!" });
//     }
//   } catch (error) {
//     return res.status(500).json({ error: "Internal Server Error", details: error.message });
//   }
// });

// // Get text by type
// router.get("/get-text/:type", async (req, res) => {
//   try {
//     const { type } = req.params;
//     const textData = await TextModel.findOne({ type });
//     if (!textData) return res.status(404).json({ message: "Text not found." });
//     return res.status(200).json(textData);
//   } catch (error) {
//     return res.status(500).json({ error: "Internal Server Error", details: error.message });
//   }
// });

// // Update text by type
// router.put("/update-text/:type", async (req, res) => {
//   try {
//     const { type } = req.params;
//     let { content } = req.body;
//     if (!content) return res.status(400).json({ error: "Content is required." });

//     content = String(content).replace(/\r/g, "");

//     const updatedText = await TextModel.findOneAndUpdate(
//       { type },
//       { content, updatedAt: new Date() },
//       { new: true }
//     );

//     if (!updatedText) return res.status(404).json({ message: "Text not found for the given type." });

//     return res.status(200).json({ message: "Text updated successfully!", data: updatedText });
//   } catch (error) {
//     return res.status(500).json({ error: "Internal Server Error", details: error.message });
//   }
// });

// // Delete text
// router.delete("/delete-text/:type", async (req, res) => {
//   try {
//     const { type } = req.params;
//     const deletedText = await TextModel.findOneAndDelete({ type });
//     if (!deletedText) return res.status(404).json({ message: "Text not found for the given type." });
//     return res.status(200).json({ message: "Text deleted successfully!" });
//   } catch (error) {
//     return res.status(500).json({ error: "Internal Server Error", details: error.message });
//   }
// });

// // Get all texts
// router.get("/get-all-texts", async (req, res) => {
//   try {
//     const allTexts = await TextModel.find({});
//     if (allTexts.length === 0) return res.status(404).json({ message: "No text entries found." });
//     return res.status(200).json(allTexts);
//   } catch (error) {
//     return res.status(500).json({ error: "Internal Server Error", details: error.message });
//   }
// });

// module.exports = router;
