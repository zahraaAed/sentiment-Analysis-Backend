
import Feedback from "../Models/feedbackModel.js";
import User from "../Models/userModel.js";
//get all feedback
export const getAllFeedback= async (req, res) => {
    try {
        const feedbacks = await Feedback.find();
        res.json(feedbacks);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message : 'Internal Server Error' });
    }
};

//add a feedback
export const addFeedback = async (req, res) => {
    const { message, userId } = req.body;
    try {
        if (message && userId) { 
            const feedback = await Feedback.create({ message, userId }); 
            res.json(feedback);
        } else {
            console.log("Error: Message or userId is missing"); 
            res.status(400).json({ error: "Message or userId is missing" }); 
        }
    } catch (error) {
        console.error("Error in adding feedback:", error); 
        res.status(500).json({ error: "Internal server error" }); 
    }
};

//delete a feedback

export const deleteFeedback = async (req, res) => {
    const { id } = req.params;
    try {
        const deletedFeedback = await Feedback.findByIdAndDelete(id); 
        if (deletedFeedback) {
          // Remove the deleted feedback ID from the corresponding user document
          await User.findByIdAndUpdate(deletedFeedback.userId, { $pull: { feedbacks: id } });
            res.status(200).json({ message: "Feedback deleted successfully" });
        } else {
            res.status(404).json({ error: "Feedback not found" });
        }
    } catch (error) {
        console.error("Error in deleting feedback:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};