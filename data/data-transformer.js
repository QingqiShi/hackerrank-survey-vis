const fs = require("fs");
const path = require("path");
const parse = require("csv-parse/lib/sync");
const { countries: countriesList } = require("countries-list");

const dataFilePath = path.join(
  __dirname,
  "HackerRank-Developer-Survey-2018-Values.csv"
);
const dataFile = fs.readFileSync(dataFilePath);
const data = parse(dataFile, { skip_empty_lines: true });

const codes = Object.keys(countriesList);
function getCode(country) {
  if (country === "Russian Federation") {
    country = "Russia";
  } else if (country === "Slovak Republic") {
    country = "Slovakia";
  } else if (country === "Czechia") {
    country = "Czech Republic";
  } else if (country === "Republic of Lithuania") {
    country = "Lithuania";
  } else if (country === "Syrian Arab Republic") {
    country = "Syria";
  } else if (country === "Republic of Moldova") {
    country = "Moldova";
  } else if (country === "Cote D'Ivoire") {
    country = "Ivory Coast";
  }

  return codes.find(code => countriesList[code].name.match(country));
}

const counts = [];
const countries = {};
data.forEach((row, i) => {
  if (i === 0) return;

  if (row[3]) {
    const code = getCode(row[3]);

    if (code) {
      counts.push({ country: code, date: new Date(row[2]).getTime() });
      countries[code] = row[3];
    }
  }
});

const sortedCounts = counts.sort((a, b) => a.date - b.date);

fs.writeFileSync(
  path.join(__dirname, "../public/data.json"),
  JSON.stringify({ counts: sortedCounts, countries })
);
console.log("output at:", path.join(__dirname, "../public/data.json"));
