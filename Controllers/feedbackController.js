import Feedback from '../Models/feedbackModel.js'; // Adjust the path according to your project structure
import User from '../Models/userModel.js'; // Adjust the path according to your project structure
export const getAllFeedback = async (req, res) => {
  const { subject } = req.query;
  try {
     let feedbacks;
     if (subject === 'question') {
       // Fetch only questions and populate the user details
       feedbacks = await Feedback.find({ subject: 'question' }).populate('userId', 'username');
     } else if (subject === 'feedback') {
       // Fetch only feedbacks and populate the user details
       feedbacks = await Feedback.find({ subject: 'feedback' }).populate('userId', 'username');
     } else {
       // Fetch all feedbacks if no subject is specified and populate the user details
       feedbacks = await Feedback.find().populate('userId', 'username');
     }
     res.json(feedbacks);
  } catch (error) {
     console.error("Error fetching feedbacks:", error.message);
     res.status(500).json({ error: "Internal server error", err: error.message });
  }
 };
 

// // Add a feedback
// export const addFeedback = async (req, res) => {
//   const { message, subject, answer } = req.body;
//   const userId = req.cookies.userId;
//   try {
//      if (message && subject && userId) {
//        const userExists = await User.findOne({ _id: userId });
//        if (!userExists) {
//          return res.status(404).json({ error: "User not found" });
//        }
//        const feedback = await Feedback.create({ message, subject, answer, userId: userId });
//        await User.findByIdAndUpdate(userId, {
//          $push: { feedbacks: feedback._id },
//        });
//        res.json(feedback);
//      } else {
//        console.log("Error: Message, Subject, or userId is missing");
//        res.status(400).json({ error: "Message, Subject, or userId is missing" });
//      }
//   } catch (error) {
//      console.error("Error in adding feedback:", error);
//      res.status(500).json({ error: "Internal server error", err: error.message });
//   }
//  };
export const addFeedback = async (req, res) => {
  const { message, subject, answer } = req.body;
  const userId = req.cookies.userId;
  try {
    if (message && subject && userId) {
      const userExists = await User.findOne({ _id: userId });
      if (!userExists) {
        return res.status(404).json({ error: "User not found" });
      }

      // Ensure the subject provided is either 'question' or 'feedback'
      if (!['question', 'feedback'].includes(subject)) {
        return res.status(400).json({ error: "Invalid subject" });
      }

      const feedback = await Feedback.create({ message, subject, answer, userId });
      await User.findByIdAndUpdate(userId, {
        $push: { feedbacks: feedback._id },
      });
      res.json(feedback);
    } else {
      console.log("Error: Message, Subject, or userId is missing");
      res.status(400).json({ error: "Message, Subject, or userId is missing" });
    }
  } catch (error) {
    console.error("Error in adding feedback:", error);
    res.status(500).json({ error: "Internal server error", err: error.message });
  }
};

// Delete a feedback - Only accessible to admin
// export const deleteFeedback = async (req, res) => {
//   const { id } = req.params;
//   const userId = req.cookies.jwt;
//   try {
//     const userRole = req.cookies.userrole;
//     if (userRole === 'admin') {
//       const deletedFeedback = await Feedback.findByIdAndDelete(id);
//       if (deletedFeedback) {
//         // Remove the deleted feedback ID from the corresponding user document
//         await User.findByIdAndUpdate(deletedFeedback.userId, {
//           $pull: { feedbacks: id },
//         });
//         res.status(200).json({ message: "Feedback deleted successfully" });
//       } else {
//         res.status(404).json({ error: "Feedback not found" });
//       }
//     } else {
//       res.status(403).json({ message: "Unauthorized access" });
//     }
//   } catch (error) {
//     console.error("Error in deleting feedback:", error);
//     res.status(500).json({ error: "Internal server error" });
//   }
// };
export const deleteFeedback = async (req, res) => {
  const { id } = req.params;
  const userId = req.cookies.jwt;
  try {
     const userRole = req.cookies.userrole;
     if (userRole === 'admin') {
       // First, find the feedback to check its subject
       const feedback = await Feedback.findById(id);
       if (!feedback) {
         return res.status(404).json({ error: "Feedback not found" });
       }
 
       // Check the subject of the feedback
       const { subject } = feedback;
       if (subject === 'question' || subject === 'feedback') {
         // If the subject matches, proceed with deletion
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
         // If the subject does not match, return an error
         res.status(400).json({ error: "Invalid feedback subject" });
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
            subjects: { $push: "$subject" },
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

 