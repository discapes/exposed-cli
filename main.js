import { createRoom, joinRoom } from "./lib.js";
import { exit } from "process";
import { createInterface } from "readline";
import { commands, gameModes } from "./commands.js";
import WebSocket from "ws";

const readline = createInterface({
  input: process.stdin,
  output: process.stdout,
});
const ask = (text) => new Promise((res) => readline.question(text, res));

console.log("Welcome to exposed-cli version 1.0.0\n");

let gameMode;
do {
  gameMode = await ask(
    "Which game mode? Available ones are: " + gameModes.join(", ") + "\n"
  );
} while (!gameModes.includes(gameMode));

const { rid, ws } = await createRoom(gameMode);
await joinRoom(rid);
await joinRoom(rid);
ws.send(Buffer.from(commands.start_game, "latin1"));

while (ws.readyState === WebSocket.OPEN) {
  const cmd = await ask(
    `Which command? Available commands are ${Object.keys(commands).join(
      ", "
    )}.\n`
  );
  if (!Object.keys(commands).includes(cmd)) {
    console.log(`Unknown command.`);
  } else {
    console.log(`Running ${cmd}`);
    ws.send(Buffer.from(commands[cmd], "latin1"));
  }
}
readline.close();
exit();
