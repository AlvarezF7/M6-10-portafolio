//servicios para manejar fs
const { promises: fs } = require("fs");

const leerJson = async (file) => {
  const data = await fs.readFile(file, "utf-8");
  return JSON.parse(data);
};

const escribirJson = async (file, data) => {
  await fs.writeFile(file, JSON.stringify(data, null, 2), "utf-8");
};

module.exports = {leerJson, escribirJson};