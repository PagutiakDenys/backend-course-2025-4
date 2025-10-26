#!/usr/bin/env node

import { Command } from "commander";
import fs from "fs";
import http from "http";

const program = new Command();

program
  .requiredOption("-i, --input <path>", "шлях до файлу, який даємо для читання")
  .requiredOption("-h, --host <host>", "адреса сервера")
  .requiredOption("-p, --port <port>", "порт сервера")
  .requiredOption("-f, –- furnished <furnished>", "мебльована")
  .requiredOption("-pr, -– price <port>", "ціна");


program.parse(process.argv);

const options = program.opts();

// Перевірка наявності файлу
if (!fs.existsSync(options.input)) {
  console.error("Cannot find input file");
  process.exit(1);
}

// Створюємо простий веб-сервер
const server = http.createServer((req, res) => {
  res.writeHead(200, { "Content-Type": "text/plain" });
  res.end("Server is running\n");
});

server.listen(options.port, options.host, () => {
  console.log(`Server running at http://${options.host}:${options.port}/`);
});
