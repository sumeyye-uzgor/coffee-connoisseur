import Airtable from "airtable";

const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(
  process.env.AIRTABLE_BASE_KEY
);
const table = base("coffee-stores");

const createCoffeeStore = (req, res) => {
  // res.status(200).json({ message: "Hi There" });
  if (req.method === "POST") {
    res.status(200).json({ message: "Hi there!" });
  } else {
    res
      .status(400)
      .json({ message: "Only POST requests valid for this endpoint" });
  }
};

export default createCoffeeStore;
