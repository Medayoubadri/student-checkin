import fs from "fs";
import path from "path";

const testData = [
  { name: "John Doe", age: "25", gender: "Male", phoneNumber: "123-456-7890" },
  {
    name: "Jane Smith",
    age: "30",
    gender: "Female",
    phoneNumber: "987-654-3210",
  },
  {
    name: "John  Doe ",
    age: "25",
    gender: "male",
    phoneNumber: "(123) 456-7890",
  }, // Duplicate with extra spaces and different formatting
  {
    name: "Alice Johnson",
    age: "twenty-eight",
    gender: "Female",
    phoneNumber: "555-1234",
  }, // Age as text
  {
    name: "Bob Wilson",
    age: "40",
    gender: "Male",
    phoneNumber: "invalid-phone",
  }, // Invalid phone number
  {
    name: "Jane smith",
    age: "31",
    gender: "female",
    phoneNumber: "9876543210",
  }, // Duplicate with slight variations
  { name: "Charlie Brown", age: "-5", gender: "Male", phoneNumber: "" }, // Negative age
  {
    name: "David Miller",
    age: "35",
    gender: "Other",
    phoneNumber: "111-222-3333",
  },
  {
    name: "Eva Green",
    age: "29",
    gender: "Female",
    phoneNumber: "444-555-6666",
  },
  {
    name: "Frank White",
    age: "50",
    gender: "Male",
    phoneNumber: "777-888-9999",
  },
];

const csvContent = [
  "name,age,gender,phoneNumber",
  ...testData.map(
    (record) =>
      `"${record.name}","${record.age}","${record.gender}","${record.phoneNumber}"`
  ),
].join("\n");

const outputPath = path.join(__dirname, "testImport.csv");
fs.writeFileSync(outputPath, csvContent);

console.log(`Test CSV file generated at: ${outputPath}`);
