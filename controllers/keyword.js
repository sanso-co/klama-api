import Keyword from "../models/keyword.js";

// create a new keyword
// export const createKeyword = async (req, res) => {
//   const keyword = req.body;
//   const newKeyword = new Keyword(keyword);
//   try {
//     await newKeyword.save();
//     res.status(201).json(newKeyword);
//   } catch (error) {
//     res.status(409).json({ message: error.message });
//   }
// };

export const createKeyword = async (req, res) => {
  const keyword = req.body;

  try {
    const existingKeyword = await Keyword.findOne({ id: keyword.id });

    if (existingKeyword) {
      return res.status(400).json("Keyword already exists");
    }

    const newKeyword = await Keyword.create(keyword);

    res.status(200).json(newKeyword);
  } catch (error) {}
};

// get all keywords
export const getAllKeywords = async (req, res) => {
  try {
    let keywords = Keyword.find();
    const result = await keywords;
    res.status(200).json({ results: result });
  } catch (error) {
    res.status(500).json(error);
  }
};
