const express = require("express");
const cors = require("cors");
const XLSX = require("xlsx");
const fs = require("fs");

const app = express();
app.use(cors());
app.use(express.json());

app.post("/save-booking", (req, res) => {
  const file = "bookings.xlsx";
  let data = [];

  if (fs.existsSync(file)) {
    const wb = XLSX.readFile(file);
    const ws = wb.Sheets[wb.SheetNames[0]];
    data = XLSX.utils.sheet_to_json(ws);
  }

  data.push(req.body);

  const newWB = XLSX.utils.book_new();
  const newWS = XLSX.utils.json_to_sheet(data);
  XLSX.utils.book_append_sheet(newWB, newWS, "Bookings");
  XLSX.writeFile(newWB, file);

  res.json({ status: "saved" });
});

app.listen(3000, () => console.log("Server running on http://localhost:3000"));
