import { table, getMinifiedRecords } from "./airtable";

const getCoffeeStoreById = async (req, res) => {
  try {
    const { id } = req.query;
    if (id) {
      const findCoffeeStoreRecords = await table
        .select({
          filterByFormula: `id="${id}"`,
        })
        .firstPage();

      if (findCoffeeStoreRecords.length !== 0) {
        res.status(200).json(getMinifiedRecords(findCoffeeStoreRecords));
      } else {
        res.status(404).json({
          message: "id couldnt be found",
        });
      }
    } else {
      res.status(422).json({
        message: "id property is necessary to fetch a store",
      });
    }
  } catch (error) {
    console.error("There is an error", error);
    res.status(500).json({ message: "Oh no! Something went wrong!", error });
  }
};

export default getCoffeeStoreById;
