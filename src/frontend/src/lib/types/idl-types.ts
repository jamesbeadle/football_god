import { IDL } from "@dfinity/candid";

const LeagueId = IDL.Nat16;
const SeasonId = IDL.Nat16;
const FixtureId = IDL.Nat32;
const ClubId = IDL.Nat16;
const PlayerId = IDL.Nat16;
const GameweekNumber = IDL.Nat8;

const PlayerEventType = IDL.Variant({
  PenaltyMissed: IDL.Null,
  Goal: IDL.Null,
  GoalConceded: IDL.Null,
  Appearance: IDL.Null,
  PenaltySaved: IDL.Null,
  RedCard: IDL.Null,
  KeeperSave: IDL.Null,
  CleanSheet: IDL.Null,
  YellowCard: IDL.Null,
  GoalAssisted: IDL.Null,
  OwnGoal: IDL.Null,
  HighestScoringPlayer: IDL.Null,
});

const FixtureStatusType = IDL.Variant({
  Unplayed: IDL.Null,
  Finalised: IDL.Null,
  Active: IDL.Null,
  Complete: IDL.Null,
});

const PlayerEventData = IDL.Record({
  fixtureId: FixtureId,
  clubId: ClubId,
  playerId: IDL.Nat16,
  eventStartMinute: IDL.Nat8,
  eventEndMinute: IDL.Nat8,
  eventType: PlayerEventType,
});

const Fixture = IDL.Record({
  id: IDL.Nat32,
  status: FixtureStatusType,
  highestScoringPlayerId: IDL.Nat16,
  seasonId: SeasonId,
  awayClubId: ClubId,
  events: IDL.Vec(PlayerEventData),
  homeClubId: ClubId,
  kickOff: IDL.Int,
  homeGoals: IDL.Nat8,
  gameweek: GameweekNumber,
  awayGoals: IDL.Nat8,
});

const ShirtType = IDL.Variant({ Filled: IDL.Null, Striped: IDL.Null });
const Gender = IDL.Variant({ Male: IDL.Null, Female: IDL.Null });
const CountryId = IDL.Nat16;
const PlayerPosition = IDL.Variant({
  Goalkeeper: IDL.Null,
  Midfielder: IDL.Null,
  Forward: IDL.Null,
  Defender: IDL.Null,
});

export const AddInitialFixturesDTO_Idl = IDL.Record({
  seasonId: SeasonId,
  seasonFixtures: IDL.Vec(Fixture),
  leagueId: LeagueId,
});

export const CreateClubDTO_Idl = IDL.Record({
  secondaryColourHex: IDL.Text,
  name: IDL.Text,
  friendlyName: IDL.Text,
  thirdColourHex: IDL.Text,
  abbreviatedName: IDL.Text,
  shirtType: ShirtType,
  primaryColourHex: IDL.Text,
  leagueId: LeagueId,
});

export const CreateLeagueDTO_Idl = IDL.Record({
  logo: IDL.Opt(IDL.Vec(IDL.Nat8)),
  name: IDL.Text,
  teamCount: IDL.Nat8,
  relatedGender: Gender,
  countryId: CountryId,
  abbreviation: IDL.Text,
  governingBody: IDL.Text,
  formed: IDL.Int,
});

export const CreatePlayerDTO_Idl = IDL.Record({
  clubId: ClubId,
  valueQuarterMillions: IDL.Nat16,
  dateOfBirth: IDL.Int,
  nationality: CountryId,
  shirtNumber: IDL.Nat8,
  position: PlayerPosition,
  lastName: IDL.Text,
  leagueId: LeagueId,
  firstName: IDL.Text,
});

export const LoanPlayerDTO_Idl = IDL.Record({
  loanEndDate: IDL.Int,
  playerId: ClubId,
  loanClubId: ClubId,
  newValueQuarterMillions: IDL.Nat16,
  loanLeagueId: LeagueId,
  leagueId: LeagueId,
});

export const MoveFixtureDTO_Idl = IDL.Record({
  fixtureId: FixtureId,
  updatedFixtureGameweek: GameweekNumber,
  updatedFixtureDate: IDL.Int,
  seasonId: SeasonId,
  leagueId: LeagueId,
});

export const SubmitFixtureDataDTO_Idl = IDL.Record({
  fixtureId: FixtureId,
  seasonId: SeasonId,
  gameweek: GameweekNumber,
  playerEventData: IDL.Vec(PlayerEventData),
  leagueId: LeagueId,
});

export const PromoteClubDTO_Idl = IDL.Record({
  clubId: ClubId,
  toLeagueId: LeagueId,
  leagueId: LeagueId,
});

export const RelegateClubDTO_Idl = IDL.Record({
  clubId: ClubId,
  relegatedToLeagueId: LeagueId,
  leagueId: LeagueId,
});

export const UpdateClubDTO_Idl = IDL.Record({
  clubId: ClubId,
  secondaryColourHex: IDL.Text,
  name: IDL.Text,
  friendlyName: IDL.Text,
  thirdColourHex: IDL.Text,
  abbreviatedName: IDL.Text,
  shirtType: ShirtType,
  primaryColourHex: IDL.Text,
  leagueId: LeagueId,
});

export const PostponeFixtureDTO_Idl = IDL.Record({
  fixtureId: FixtureId,
  seasonId: SeasonId,
  leagueId: LeagueId,
});

export const RecallPlayerDTO_Idl = IDL.Record({
  playerId: ClubId,
  newValueQuarterMillions: IDL.Nat16,
  leagueId: LeagueId,
});

export const RescheduleFixtureDTO_Idl = IDL.Record({
  fixtureId: FixtureId,
  updatedFixtureGameweek: GameweekNumber,
  updatedFixtureDate: IDL.Int,
  seasonId: SeasonId,
  leagueId: LeagueId,
});

export const RetirePlayerDTO_Idl = IDL.Record({
  playerId: ClubId,
  retirementDate: IDL.Int,
  leagueId: LeagueId,
});

export const RevaluePlayerDownDTO_Idl = IDL.Record({
  playerId: PlayerId,
  leagueId: LeagueId,
});

export const RevaluePlayerUpDTO_Idl = IDL.Record({
  playerId: PlayerId,
  leagueId: LeagueId,
});

export const SetFreeAgentDTO_Idl = IDL.Record({
  playerId: ClubId,
  newValueQuarterMillions: IDL.Nat16,
  leagueId: LeagueId,
});

export const SetPlayerInjuryDTO_Idl = IDL.Record({
  playerId: ClubId,
  description: IDL.Text,
  leagueId: LeagueId,
  expectedEndDate: IDL.Int,
});

export const TransferPlayerDTO_Idl = IDL.Record({
  clubId: ClubId,
  newLeagueId: LeagueId,
  playerId: ClubId,
  newShirtNumber: IDL.Nat8,
  newValueQuarterMillions: IDL.Nat16,
  newClubId: ClubId,
  leagueId: LeagueId,
});

export const UnretirePlayerDTO_Idl = IDL.Record({
  playerId: ClubId,
  newValueQuarterMillions: IDL.Nat16,
  leagueId: LeagueId,
});

export const UpdateLeagueDTO_Idl = IDL.Record({
  logo: IDL.Vec(IDL.Nat8),
  name: IDL.Text,
  teamCount: IDL.Nat8,
  relatedGender: Gender,
  countryId: CountryId,
  abbreviation: IDL.Text,
  governingBody: IDL.Text,
  leagueId: LeagueId,
  formed: IDL.Int,
});

export const UpdatePlayerDTO_Idl = IDL.Record({
  dateOfBirth: IDL.Int,
  playerId: ClubId,
  nationality: CountryId,
  shirtNumber: IDL.Nat8,
  position: PlayerPosition,
  lastName: IDL.Text,
  leagueId: LeagueId,
  firstName: IDL.Text,
});
