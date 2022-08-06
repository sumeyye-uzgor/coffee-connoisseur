import { findRecordByFilter, getMinifiedRecord, table } from "./airtable";

const upvoteCoffeeStore = async (req, res) => {
  if (req.method === "PUT") {
    const { id } = req.body;
    try {
      if (id) {
        const records = await findRecordByFilter(id);
        const record = records[0];
        if (record) {
          const updatedRecord = await table.update(record.recordId, {
            voting: parseInt(record.voting) + 1,
          });
          if (updatedRecord) {
            res.status(200).json(getMinifiedRecord(updatedRecord));
          } else {
            res.status(500).json({
              message: "can not updated store, please try again later",
            });
          }
        } else {
          res.status(404).json({
            message: "record can not be found inside database",
          });
        }
      } else {
        res.status(422).json({
          message: "id property is necessary to update the store",
        });
      }
    } catch (err) {
      res
        .status(500)
        .json({ message: "Error updating or finding a store", err });
    }
  }
};

export default upvoteCoffeeStore;
