import type {
  SelectionDetail,
  ScoreDetail,
  CorrectResultDetail,
  BothTeamsToScoreDetail,
  HalfTimeFullTimeResultDetail,
  BothTeamsToScoreAndWinnerDetail,
  PlayerDTO,
  ClubDTO,
} from "../../../../declarations/data_canister/data_canister.did";

function lookupPlayer(
  playerId: number,
  players: Record<number, PlayerDTO>,
): string {
  const p = players[playerId];
  if (!p) return `Player ${playerId}`;
  return `${p.firstName} ${p.lastName}`;
}

function lookupClub(clubId: number, clubs: Record<number, ClubDTO>): string {
  const c = clubs[clubId];
  if (!c) return `Club ${clubId}`;
  return c.name;
}

function lookupClubByPlayerOrId(
  detail: { clubId?: number; playerId?: number },
  players: Record<number, PlayerDTO>,
  clubs: Record<number, ClubDTO>,
): string {
  let clubId = detail.clubId;
  if (!clubId && detail.playerId != null) {
    const p = players[detail.playerId];
    if (p?.clubId != null) {
      clubId = p.clubId;
    }
  }
  if (clubId == null) {
    return "Unknown Club";
  }
  return lookupClub(clubId, clubs);
}

export function buildBetUiDescription(
  detail: SelectionDetail,
  clubs: Record<number, ClubDTO>,
  players: Record<number, PlayerDTO>,
): string {
  if ("MissPenalty" in detail) {
    const d = detail.MissPenalty;
    return `Missed Penalty by ${lookupPlayer(d.playerId, players)} (${lookupClubByPlayerOrId(d, players, clubs)})`;
  } else if ("LastAssist" in detail) {
    const d = detail.LastAssist;
    return `Last Assist: ${lookupPlayer(d.playerId, players)} (${lookupClubByPlayerOrId(d, players, clubs)})`;
  } else if ("PenaltyMissed" in detail) {
    const d = detail.PenaltyMissed;
    return `Penalty Missed: ${lookupClubByPlayerOrId(d, players, clubs)}`;
  } else if ("FirstAssist" in detail) {
    const d = detail.FirstAssist;
    return `First Assist: ${lookupPlayer(d.playerId, players)} (${lookupClubByPlayerOrId(d, players, clubs)})`;
  } else if ("AnytimeGoalscorer" in detail) {
    const d = detail.AnytimeGoalscorer;
    return `Anytime Goalscorer: ${lookupPlayer(d.playerId, players)} (${lookupClubByPlayerOrId(d, players, clubs)})`;
  } else if ("CorrectResult" in detail) {
    const d = detail.CorrectResult as CorrectResultDetail;
    const key = Object.keys(d.matchResult)[0];
    if (key === "HomeWin") return `Correct Full-Time Result: Home Win`;
    if (key === "AwayWin") return `Correct Full-Time Result: Away Win`;
    return `Correct Full-Time Result: Draw`;
  } else if ("HalfTimeScore" in detail) {
    const d = detail.HalfTimeScore as ScoreDetail;
    return `Half-Time Score: ${d.homeGoals}-${d.awayGoals}`;
  } else if ("BothTeamsToScore" in detail) {
    const d = detail.BothTeamsToScore as BothTeamsToScoreDetail;
    return d.bothTeamsToScore
      ? "Both Teams to Score: Yes"
      : "Both Teams to Score: No";
  } else if ("HalfTimeFullTimeResult" in detail) {
    const d = detail.HalfTimeFullTimeResult as HalfTimeFullTimeResultDetail;
    console.log(d);
    let ht = Object.keys(d.halfTimeResult)[0];
    let ft = Object.keys(d.fullTimeResult)[0];
    if (ht === "HomeWin") ht = "Home Win";
    if (ht === "AwayWin") ht = "Away Win";
    if (ft === "HomeWin") ft = "Home Win";
    if (ft === "AwayWin") ft = "Away Win";
    return `Half-Time/Full-Time: ${ht} → ${ft}`;
  } else if ("LastGoalscorer" in detail) {
    const d = detail.LastGoalscorer;
    return `Last Goalscorer: ${lookupPlayer(d.playerId, players)} (${lookupClubByPlayerOrId(d, players, clubs)})`;
  } else if ("RedCard" in detail) {
    const d = detail.RedCard;
    return `Red Card: ${lookupPlayer(d.playerId, players)} (${lookupClubByPlayerOrId(d, players, clubs)})`;
  } else if ("ScoreHatrick" in detail) {
    const d = detail.ScoreHatrick;
    return `Hat-trick: ${lookupPlayer(d.playerId, players)} (${lookupClubByPlayerOrId(d, players, clubs)})`;
  } else if ("CorrectScore" in detail) {
    const d = detail.CorrectScore as ScoreDetail;
    return `Full-Time Score: ${d.homeGoals}-${d.awayGoals}`;
  } else if ("AnytimeAssist" in detail) {
    const d = detail.AnytimeAssist;
    return `Anytime Assist: ${lookupPlayer(d.playerId, players)} (${lookupClubByPlayerOrId(d, players, clubs)})`;
  } else if ("YellowCard" in detail) {
    const d = detail.YellowCard;
    return `Yellow Card: ${lookupPlayer(d.playerId, players)} (${lookupClubByPlayerOrId(d, players, clubs)})`;
  } else if ("BothTeamsToScoreAndWinner" in detail) {
    const d =
      detail.BothTeamsToScoreAndWinner as BothTeamsToScoreAndWinnerDetail;
    let resultKey = Object.keys(d.matchResult)[0];
    if (resultKey === "HomeWin") resultKey = "Home Win";
    if (resultKey === "AwayWin") resultKey = "Away Win";
    const yesNo = d.bothTeamsToScore ? "Yes" : "No";

    return `Result + BTTS: ${resultKey} & BTTS ${yesNo}`;
  } else if ("FirstGoalscorer" in detail) {
    const d = detail.FirstGoalscorer;
    return `First Goalscorer: ${lookupPlayer(d.playerId, players)} (${lookupClubByPlayerOrId(d, players, clubs)})`;
  } else if ("ScoreBrace" in detail) {
    const d = detail.ScoreBrace;
    return `Brace: ${lookupPlayer(d.playerId, players)} (${lookupClubByPlayerOrId(d, players, clubs)})`;
  }

  return "Unknown Bet Type";
}
