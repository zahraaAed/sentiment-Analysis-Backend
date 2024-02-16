import Feedback from "../Models/feedbackModel.js";
import User from "../Models/userModel.js";

// Get all feedback - Only accessible to admin
export const getAllFeedback = async (req, res) => {
  try {
  
   
      const feedbacks = await Feedback.find();
      res.json(feedbacks);
    
      res.status(403).json({ message: "Unauthorized access" });
    
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Add a feedback
export const addFeedback = async (req, res) => {
  const { message } = req.body;
  const userId = req.cookies.userId;
  try {
    if (message && userId) {
      const userExists = await User.findOne({ _id: userId });
      if (!userExists) {
        return res.status(404).json({ error: "User not found" });
      }
      const feedback = await Feedback.create({ message, userId: userId });
      await User.findByIdAndUpdate(userId, {
        $push: { feedbacks: feedback._id },
      });
      res.json(feedback);
    } else {
      console.log("Error: Message or userId is missing");
      res.status(400).json({ error: "Message or userId is missing" });
    }
  } catch (error) {
    console.error("Error in adding feedback:", error);
    res.status(500).json({ error: "Internal server error" , err:error.message});
  }
};

// Delete a feedback - Only accessible to admin
export const deleteFeedback = async (req, res) => {
  const { id } = req.params;
  const userId = req.cookies.jwt;
  try {
    const userRole = req.cookies.userrole;
    if (userRole === 'admin') {
      const deletedFeedback = await Feedback.findByIdAndDelete(id);
      if (deletedFeedback) {
        // Remove the deleted feedback ID from the corresponding user document
        await User.findByIdAndUpdate(deletedFeedback.userId, {
          $pull: { feedbacks: id },
        });
        res.status(200).json({ message: "Feedback deleted successfully" });
      } else {
        res.status(404).json({ error: "Feedback not found" });
      }
    } else {
      res.status(403).json({ message: "Unauthorized access" });
    }
  } catch (error) {
    console.error("Error in deleting feedback:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Get grouped feedbacks - Only accessible to admin
export const getGroupedFeedbacks = async (req, res) => {
 
  try {
  
      const groupedFeedbacks = await Feedback.aggregate([
        {
          $group: {
            _id: { userId: "$userId"},
            messages: { $push: "$message" },
            count: { $sum: 1 } // Optional: Count of  feedbacks messages in the group
          }
        }
      ]);
      res.json(groupedFeedbacks);
 
      res.status(403).json({ message: "Unauthorized access" });
    
  } catch (error) {
    console.error("Error in retrieving grouped feedbacks messages:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
