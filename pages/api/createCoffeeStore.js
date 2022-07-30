import { table, getMinifiedRecords } from "./airtable";

const createCoffeeStore = async (req, res) => {
  if (req.method === "POST") {
    //find a record
    const { id, name } = req.body;

    try {
      if (id) {
        const findCoffeeStoreRecords = await table
          .select({
            filterByFormula: `id="${id}"`,
          })
          .firstPage();

        if (findCoffeeStoreRecords.length !== 0) {
          res.status(200).json(getMinifiedRecords(findCoffeeStoreRecords));
        } else {
          //create a record
          if (name) {
            const createRecords = await table.create([
              {
                fields: req.body,
              },
            ]);

            res.status(200).json(getMinifiedRecords(createRecords));
          } else {
            res.status(422).json({
              message: "name property is necessary to create a new store",
            });
          }
        }
      } else {
        res.status(422).json({
          message: "id property is necessary to create a new store",
        });
      }
    } catch (err) {
      res
        .status(500)
        .json({ message: "Error creating or finding a store", err });
    }
  }
};

export default createCoffeeStore;
