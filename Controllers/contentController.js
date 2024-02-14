import Content from "../Models/contentModel.js";

//get All

export const getAllContent = async (req, res) => {
  try {
    const contents = await Content.find();
    res.status(200).json(contents);
  } catch (error) {
    res.status(500).json({ message: "error", error: error.message });
  }
};

export const createContent = async (req, res) => {
  const { aboutusContent, subtitleHeader, ourmissionContent } = req.body;

  // Validate required fields
  if (!aboutusContent || !subtitleHeader || !ourmissionContent) {
    return res.status(400).json({ message: "Please provide all required fields." });
  }

  try {
    let imageHome = null;
    let imageAbout = null;
    let imageAnalysisSection = null;


    console.log("reqfiles012345:",req.files)
    // Handle optional file uploads
    if (req.files) {
      if (req.files["imageHome"]) {
        imageHome = req.files["imageHome"][0].path;
      }
      if (req.files["imageAbout"]) {
        imageAbout = req.files["imageAbout"][0].path;
      }
      if (req.files["imageAnalysisSection"]) {
        imageAnalysisSection = req.files["imageAnalysisSection"][0].path;
      }
    }

    // Create a new content instance
    const newContent = new Content({
      aboutusContent,
      subtitleHeader,
      ourmissionContent,
      imageHome,
      imageAbout,
      imageAnalysisSection,
    });

    // Save the content to the database
    const savedContent = await newContent.save();

    res.status(201).json({
      message: "Content created successfully!",
      content: savedContent,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};


// update a content
export const updateContent = async (req, res) => {
  const { id } = req.params;
  try {
    const { aboutusContent, subtitleHeader, ourmissionContent } = req.body;

    if (!req.files) {
      const updatedContent = await Content.findByIdAndUpdate(
        id,
        updatedFields,
        { new: true }
      );

      return res.status(200).json(updatedContent);
    }

    const existingContent = await Content.findById(req.params.id);

    const updatedFields = {
      aboutusContent: aboutusContent || existingContent.aboutusContent,
      subtitleHeader: subtitleHeader || existingContent.subtitleHeader,
      ourmissionContent: ourmissionContent || existingContent.ourmissionContent,
    };

    if (req.files.imageHome) {
      updatedFields.imageHome = req.files.imageHome[0].path;
    }

    if (req.files.imageAbout) {
      updatedFields.imageAbout = req.files.imageAbout[0].path;
    }
    if (req.files.imageAnalysisSection) {
      updatedFields.imageAnalysisSection =
        req.files.imageAnalysisSection[0].path;
    }
    const updatedContent = await Content.findByIdAndUpdate(
      req.params.id,
      updatedFields,
      { new: true }
    );

    res.status(200).json(updatedContent);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
