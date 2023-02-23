import { createRoom, delay, joinRoom } from "./lib.js";
import { exit } from "process";
import { createInterface } from "readline";
import { commands, gameModes } from "./commands.js";
import { appendFile } from "fs/promises";
import WebSocket from "ws";
import { createWriteStream } from "fs";

const readline = createInterface({
  input: process.stdin,
  output: process.stdout,
});
const ask = (text) => new Promise((res) => readline.question(text, res));

console.log("Welcome to exposed-cli scrape mode version 1.0.0");

let gameMode;
do {
  gameMode = await ask(
    "Which game mode? Available ones are: " + gameModes.join(", ") + "\n"
  );
} while (!gameModes.includes(gameMode));

const stream = createWriteStream("log.txt", { flags: "a" });
const errorStream = createWriteStream("errors.txt", { flags: "a" });

function runOneGame() {
  return /** @type {Promise<void>} */ (
    new Promise(async (res) => {
      const { rid, ws } = await createRoom(gameMode);
      await joinRoom(rid);
      await joinRoom(rid);
      await delay(3);

      let i = 0;

      ws.on("message", (msg) => {
        if (i % 2 == 0) {
          stream.write(`"""${msg}"""\n`);
        } else {
          ws.send(Buffer.from(commands.next_question, "latin1"));
        }
        i++;
        if (i === 20 * 2) {
          res();
          ws.close();
        }
      });

      ws.on("close", () => {
        res();
      });

      ws.send(Buffer.from(commands.start_game, "latin1"));
    })
  );
}

for (let i = 1; true; i++) {
  console.log("Running game " + i);
  try {
    await runOneGame();
  } catch (e) {
    errorStream.write(e);
  }
}

readline.close();
stream.end();
exit();
