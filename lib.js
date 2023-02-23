import { randomBytes } from "crypto";
import WebSocket from "ws";

const wsEndpoint = (g) =>
  `wss://nhytuu.colyseus.dev/${g.room.processId}/${g.room.roomId}?sessionId=${g.sessionId}`;

export const delay = (s) => new Promise((res) => setTimeout(res, s * 1000));

export async function joinRoom(roomId) {
  console.log("Joining room " + roomId);
  await new Promise(async (res) => {
    const URL = "https://nhytuu.colyseus.dev/matchmake/joinById/" + roomId;

    const deviceId = Buffer.from(randomBytes(8)).toString("hex");
    const body = {
      avatar: "70de4a11dd0aeba8",
      username: "user-" + deviceId,
      deviceId,
      deviceType: "android",
    };

    const joinedGame = await fetch(URL, {
      method: "POST",
      body: JSON.stringify(body),
    }).then((res) => res.json());

    const ws = new WebSocket(wsEndpoint(joinedGame));
    ws.on("open", res);
  });
  console.log("Joined room " + roomId);
}

export async function createRoom(gameMode) {
  console.log("Creating room");

  const URL = "https://nhytuu.colyseus.dev/matchmake/create/exposed";
  const deviceId = Buffer.from(randomBytes(8)).toString("hex");

  const body = {
    avatar: "70de4a11dd0aeba8",
    username: "creator-" + deviceId,
    pack: gameMode,
    playedQuestions: [],
    locale: "en",
    gameType: "DUEL",
    deviceId: deviceId,
    deviceType: "android",
  };

  const created_game = await fetch(URL, {
    method: "POST",
    body: JSON.stringify(body),
  }).then((res) => res.json());

  const ws = await initializeCreatorWebsocket(created_game);

  console.log("Created room " + created_game.room.roomId);
  return { rid: created_game.room.roomId, ws };
}

export function initializeCreatorWebsocket(created_game) {
  return new Promise((res) => {
    const ws = new WebSocket(wsEndpoint(created_game));
    ws.on("error", console.error);
    ws.on("open", console.log.bind(console, "open"));
    ws.on("close", console.log.bind(console, "close"));
    // ws.on("ping", console.log.bind(console, "ping"));

    let initialMessage = true;
    ws.on("message", function message(data) {
      console.log(`"""\n%s\n"""`, data);
      if (initialMessage) ws.send(Buffer.from("0A", "hex"));
      initialMessage = false;
      res(ws);
    });
  });
}
