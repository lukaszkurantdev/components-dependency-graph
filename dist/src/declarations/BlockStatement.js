"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.analyzeBlockStatement = void 0;
const Statement_1 = require("./Statement");
const analyzeBlockStatement = (fileNode, componentNode, statement) => {
    if (!statement) {
        return;
    }
    if (process.env.debugLevel === "all") {
        console.log("NODE", statement.type);
    }
    for (const child of statement.body) {
        (0, Statement_1.analyzeStatement)(fileNode, componentNode, child);
    }
};
exports.analyzeBlockStatement = analyzeBlockStatement;
//# sourceMappingURL=BlockStatement.js.map