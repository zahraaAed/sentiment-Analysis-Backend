import TextSubmission from "../Models/textSubmissionModel.js";
import User from "../Models/userModel.js";
import Sentiment from "sentiment";
const sentiment = new Sentiment();

//get all TextSubmissions
export const getAllTextSubmissions = async (req, res) => {
    try {
      const TextSubmissions = await TextSubmission.find();
      res.json(TextSubmissions);
    } catch (error) {
      console.error(error);
      res.status(500).json({ TextSubmission: "Internal Server Error" });
    }
  };



// Get grouped TextSubmissions
export const getGroupedTextSubmissions = async (req, res) => {
  try {
    const groupedTextSubmissions = await TextSubmission.aggregate([
      {
        $group: {
          _id: { userId: "$userId" },
          TextSubmissions: { 
            $push: {
              text: "$text",
              sentiment_label: "$sentiment_label",
              sentiment_score: "$sentiment_score",
              URL: "$URL"
            }
          },
          count: { $sum: 1 } // Count of TextSubmissions in the group
        }
      }
    ]);
    
    res.json(groupedTextSubmissions);
  } catch (error) {
    console.error("Error in retrieving grouped TextSubmissions:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

  //add TextSubmission
//   const urlRegex = /^https:\/\/www\.instagram\.com\/p\/[a-zA-Z0-9_-]+\/\?[^ "]+$/
// export const addTextSubmission = async (req, res) => {
//   const { text, URL } = req.body;
//   const userId = req.cookies.userId;
//   try {
//     if (text && URL && userId && urlRegex.test(URL)) {
//       const userExists = await User.exists({ _id: userId });
//       if (!userExists) {
//         return res.status(404).json({ error: "User not found" });
//       }
      
      // Perform sentiment analysis on the text
      // const result = sentiment.analyze(text);
      // const sentimentScore = result.score;
      // const sentimentLabel = result.comparative >  0 ? 'positive' : result.comparative <  0 ? 'negative' : 'neutral';

      // Create a new TextSubmission with the sentiment analysis results
      // const textSubmission = await TextSubmission.create({
      //   text,
      //   sentiment_label: sentimentLabel,
      //   sentiment_score: sentimentScore,
      //   URL,
      //   userId
      // });

      // Update the user's TextSubmissions list
//       await User.findByIdAndUpdate(userId, {
//         $push: { TextSubmissions: textSubmission._id },
//       });

//       res.json(textSubmission);
//     } else {
//       console.log("Error: some contents are missing or URL format is incorrect");
//       res.status(400).json({ error: "some contents are missing or URL format is incorrect" });
//     }
//   } catch (error) {
//     console.error("Error in adding TextSubmission:", error);
//     res.status(500).json({ error: "Internal server error" });
//   }
// };

      //check for delete and update and if they will be stored in front and how
      const urlRegex = /^https:\/\/www\.instagram\.com\/p\/[a-zA-Z0-9_-]+\/\?[^ "]+$/
      export const addTextSubmission = async (req, res) => {
        const { text, URL } = req.body;
        const userId = req.cookies.userId;
        try {
          // Check if either text or URL is provided
          if ((text || URL) && userId) {
            const userExists = await User.exists({ _id: userId });
            if (!userExists) {
              return res.status(404).json({ error: "User not found" });
            }
            
            // If URL is provided, validate the format
            if (URL && !urlRegex.test(URL)) {
              return res.status(400).json({ error: "URL format is incorrect" });
            }
            
            // Perform sentiment analysis on the text
            const result = sentiment.analyze(text);
            const sentimentScore = result.score;
            const sentimentLabel = result.comparative >  0 ? 'positive' : result.comparative <  0 ? 'negative' : 'neutral';
      
            // Create a new TextSubmission with the sentiment analysis results
            const textSubmission = await TextSubmission.create({
              text,
              sentiment_label: sentimentLabel,
              sentiment_score: sentimentScore,
              URL,
              userId
            });
      
            // Update the user's TextSubmissions list
            await User.findByIdAndUpdate(userId, {
              $push: { TextSubmissions: textSubmission._id },
            });
      
            res.json(textSubmission);
          } else {
            console.log("Error: either text or URL should be provided");
            res.status(400).json({ error: "Either text or URL should be provided" });
          }
        } catch (error) {
          console.error("Error in adding TextSubmission:", error);
          res.status(500).json({ error: "Internal server error" });
        }
      };
      