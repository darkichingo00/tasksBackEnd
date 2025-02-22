"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const winston_1 = require("winston");
const logger = (0, winston_1.createLogger)({
    level: "info",
    format: winston_1.format.combine(winston_1.format.timestamp(), winston_1.format.json()),
    transports: [
        new winston_1.transports.Console(), // Logs en la consola
        new winston_1.transports.File({ filename: "logs/api.log" }) // Logs en un archivo
    ]
});
exports.default = logger;
