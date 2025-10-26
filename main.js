#!/usr/bin/env node

import { Command } from "commander";
import fs from "fs";
import http from "http";

const program = new Command();

program
  .requiredOption("-i, --input <path>", "шлях до файлу, який даємо для читання")
  .requiredOption("-h, --host <host>", "адреса сервера")
  .requiredOption("-p, --port <port>", "порт сервера")
  .option("-r, --price <price>", "максимальна ціна") // <- змінив з -p на -r
  .option("-f, --furnished <furnished>", "фільтр за мебльованістю");



program.parse(process.argv);
const options = program.opts();

// Перевірка файлу
if (!fs.existsSync(options.input)) {
  console.error("Cannot find input file");
  process.exit(1);
}

// Читаємо JSON
const housesData = JSON.parse(fs.readFileSync(options.input, "utf-8"));

// Створюємо сервер
const server = http.createServer((req, res) => {
  const query = url.parse(req.url, true).query;

  let filteredHouses = housesData;

  if (query.furnished === "true") {
    filteredHouses = filteredHouses.filter(
      h => h.furnishingstatus === "furnished"
    );
  }

  if (query.max_price) {
    const maxPrice = Number(query.max_price);
    filteredHouses = filteredHouses.filter(h => h.price < maxPrice);
  }

  // Формуємо XML
  let xml = "<houses>\n";
  for (const h of filteredHouses) {
    xml += "  <house>\n";
    xml += `    <price>${h.price}</price>\n`;
    xml += `    <area>${h.area}</area>\n`;
    xml += `    <furnishingstatus>${h.furnishingstatus}</furnishingstatus>\n`;
    xml += "  </house>\n";
  }
  xml += "</houses>";

  res.writeHead(200, { "Content-Type": "application/xml" });
  res.end(xml);
});

server.listen(options.port, options.host, () => {
  console.log(`Server running at http://${options.host}:${options.port}/`);
});