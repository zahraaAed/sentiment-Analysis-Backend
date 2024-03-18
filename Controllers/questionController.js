import Question from "../Models/questionModel.js";
import User from "../Models/userModel.js";


// Get all questions - Only accessible to admin

export const getAllQuestions = async (req, res) => {
  try {
     // Correctly populate 'userId' to include 'username' from the User model
     const questions = await Question.find().populate('userId', 'username');
     res.json(questions);
  } catch (error) {
     console.error(error);
     res.status(500).json({ message: "Internal Server Error" });
  }
 };
 
// Add a question
export const addQuestion = async (req, res) => {
  const { question } = req.body;
  const userId = req.cookies.userId;
  try {
    if (question && userId) {
      const userExists = await User.findOne({ _id: userId });
      if (!userExists) {
        return res.status(404).json({ error: "User not found" });
      }
      const newQuestion = await Question.create({ question, userId: userId });
      await User.findByIdAndUpdate(userId, {
        $push: { questions: newQuestion._id },
      });
      res.json(newQuestion);
    } else {
      console.log("Error: Question or userId is missing");
      res.status(400).json({ error: "Question or userId is missing" });
    }
  } catch (error) {
    console.error("Error in adding question:", error.message);
    res
      .status(500)
      .json({ error: "Internal server error", err: error.message });
  }
};

// Add an answer to a question

// Assuming you have a Question model defined somewhere


export const addAnswer = async (req, res) => {
  const { answer } = req.body;
  const { questionId } = req.params;
  const userId = req.cookies.userId;
  console.log("Request body:", req.body);

 
  try {
     if (answer && questionId && userId) {
       const questionExists = await Question.findOne({ _id: questionId });
       if (!questionExists) {
         return res.status(404).json({ error: "Question not found" });
       }
 
       const userExists = await User.findOne({ _id: userId });
       if (!userExists) {
         return res.status(404).json({ error: "User not found" });
       }
 
       // Update the existing question with the new answer
       const updatedQuestion = await Question.findByIdAndUpdate(questionId, {
         answer: answer, // This should update the answer field with the submitted answer text
         answered: true, // Optionally, update the 'answered' field
       }, { new: true }); // Return the updated document
 
       // Send the updated question as the response
       console.log("Updating question with answer:", answer);

       res.json(updatedQuestion);
       console.log("Updated question with answer:", updatedQuestion);
     } else {
       console.log("Error: Answer, questionId, or userId is missing");
       res.status(400).json({ error: "Answer, questionId, or userId is missing" });
     }
  } catch (error) {
     console.error("Error in adding answer:", error.message);
     res.status(500).json({ error: "Internal server error", err: error.message });
  }
 };
 

// Delete a question - Only accessible to admin
export const deleteQuestion = async (req, res) => {
  const { id } = req.params;
  const userId = req.cookies.jwt;
  try {
    const userRole = req.cookies.userrole;
    if (userRole === "admin") {
      const deletedQuestion = await Question.findByIdAndDelete(id);
      if (deletedQuestion) {
        // Remove the deleted question ID from the corresponding user document
        await User.findByIdAndUpdate(deletedQuestion.userId, {
          $pull: { questions: id },
        });
        res.status(200).json({ message: "Question deleted successfully" });
      } else {
        res.status(404).json({ error: "Question not found" });
      }
    } else {
      res.status(403).json({ message: "Unauthorized access" });
    }
  } catch (error) {
    console.error("Error in deleting question:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Get grouped questions - Only accessible to admin
export const getGroupedQuestions = async (req, res) => {
  try {
    const groupedQuestions = await Question.aggregate([
      {
        $group: {
          _id: { userId: "$userId" },
          questions: { $push: "$question" },
          count: { $sum: 1 }, // Optional: Count of questions in the group
        },
      },
    ]);
    res.json(groupedQuestions);
  } catch (error) {
    console.error("Error in retrieving grouped questions:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
