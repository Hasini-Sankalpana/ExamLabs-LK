import userModel from "../models/userModel.js";
import Item from "../models/itemModel.js";

export const getStatistics = async (req, res) => {
  try {
    const totalUsers = await userModel.countDocuments();
    const totalMCQs = await Item.countDocuments({ option: "mcq" });
    const totalEssayExams = await Item.countDocuments({ option: "essay" });
    const totalPDFs = await Item.countDocuments({ option: "pdf" });
    const totalMarkingSchemes = await Item.countDocuments({ option: "markingScheme" });

    res.status(200).json({
      success: true,
      data: {
        totalUsers,
        totalMCQs,
        totalEssayExams,
        totalPDFs,
        totalMarkingSchemes,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
