const Ordiscan = require("ordiscan").Ordiscan;
const fs = require("fs");
const path = require("path");

require("dotenv").config();

const ordiscan = new Ordiscan(process.env.ORDISCAN_KEY_1);
const output_path = process.env.ORDISCAN_OUTPUT_PATH;

async function getRunesActivity(address) {
  let runesActivity = await ordiscan.address.getRunesActivity({
    address: address,
  });
  //   let runesActivity = { name: "Alice", age: 25, city: "Rome" };
  console.log("GOT Activity", runesActivity);

  fs.writeFileSync(
    path.resolve(output_path, `${address}_rune_activity.json`),
    JSON.stringify(runesActivity, null, 2)
  );
}

const testAddr1 =
  "bc1pr8vjq0fk89f5sw3r4n9scrasvw7kaud9akhzw57c3ygycsjspvvseyjcma";
getRunesActivity(testAddr1).then(() => {
  console.log("Done");
});
