const STARTGAME_BYTES = "0DA7 4F6E 5374 6172 74";
const STARTGAME = "\r§OnStart";

const NEXTQUESTION_BYTES = "0DAC 4E65 7874 5175 6573 7469 6F6E";
const NEXTQUESTION = "\r¬NextQuestion";

const VOTE_FIRST_BYTES =
  "0DA4 566F 7465 81A4 766F 7465 AB66 6972 7374 506C 6179 6572";
const VOTE_FIRST = "\r¤Vote¤vote«firstPlayer";

const VOTE_SECOND_BYTES =
  "0DA4 566F 7465 81A4 766F 7465 AC73 6563 6F6E 6450 6C61 7965 72";
const VOTE_SECOND = "\r¤Vote¤vote¬secondPlayer";

const CLOSE_BYTES = "0C";
const CLOSE = "\f";

//LATIN1!!
export const commands = {
  close: "\f",
  vote_first: "\r¤Vote¤vote«firstPlayer",
  vote_second: "\r¤Vote¤vote¬secondPlayer",
  next_question: "\r¬NextQuestion",
  start_game: "\r§OnStart",
};

export const gameModes = ["GET_STARTED", "SPICY", "FOR_PARTY", "CHEEKY"];
