export class Message {
  type;
  payload;
}

export class MovePayload {
  MatchId;
  Move;
}

export class BoardPayload {
  Board;
  History;
  Turn;
}
