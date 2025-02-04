import { IDL } from "@dfinity/candid";

export const RevaluePlayerUpDTO_Idl = IDL.Record({
  leagueId: IDL.Nat16,
  playerId: IDL.Nat16,
});

export const RevaluePlayerDownDTO_Idl = IDL.Record({
  leagueId: IDL.Nat16,
  playerId: IDL.Nat16,
});

export const LoanPlayerDTO_Idl = IDL.Record({
  leagueId: IDL.Nat16,
  playerId: IDL.Nat16,
  loanLeagueId: IDL.Nat16,
  loanClubId: IDL.Nat16,
  loanEndDate: IDL.Int,
  newValueQuarterMillions: IDL.Nat16,
});

export const TransferPlayerDTO_Idl = IDL.Record({
  leagueId: IDL.Nat16,
  clubId: IDL.Nat16,
  playerId: IDL.Nat16,
  newLeagueId: IDL.Nat16,
  newClubId: IDL.Nat16,
  newShirtNumber: IDL.Nat8,
  newValueQuarterMillions: IDL.Nat16,
});

export const RecallPlayerDTO_Idl = IDL.Record({
  leagueId: IDL.Nat16,
  playerId: IDL.Nat16,
});

export const CreatePlayerDTO_Idl = IDL.Record({
  leagueId: IDL.Nat16,
  clubId: IDL.Nat16,
  position: IDL.Nat8,
  firstName: IDL.Text,
  lastName: IDL.Text,
  shirtNumber: IDL.Nat8,
  valueQuarterMillions: IDL.Nat16,
  dateOfBirth: IDL.Int,
  nationality: IDL.Nat16,
});

export const UpdatePlayerDTO_Idl = IDL.Record({
  leagueId: IDL.Nat16,
  playerId: IDL.Nat16,
  position: IDL.Nat8,
  firstName: IDL.Text,
  lastName: IDL.Text,
  shirtNumber: IDL.Nat8,
  dateOfBirth: IDL.Int,
  nationality: IDL.Nat16,
});

export const SetPlayerInjuryDTO_Idl = IDL.Record({
  leagueId: IDL.Nat16,
  playerId: IDL.Nat16,
  description: IDL.Text,
  expectedEndDate: IDL.Int,
});

export const RetirePlayerDTO_Idl = IDL.Record({
  leagueId: IDL.Nat16,
  playerId: IDL.Nat16,
  retirementDate: IDL.Int,
});

export const UnretirePlayerDTO_Idl = IDL.Record({
  leagueId: IDL.Nat16,
  playerId: IDL.Nat16,
});

export const PromoteClubDTO_Idl = IDL.Record({
  leagueId: IDL.Nat16,
  clubId: IDL.Nat16,
  toLeagueId: IDL.Nat16,
});

export const UpdateClubDTO_Idl = IDL.Record({
  leagueId: IDL.Nat16,
  clubId: IDL.Nat16,
  name: IDL.Text,
  friendlyName: IDL.Text,
  primaryColourHex: IDL.Text,
  secondaryColourHex: IDL.Text,
  thirdColourHex: IDL.Text,
  abbreviatedName: IDL.Text,
  shirtType: IDL.Nat8,
});

export const CreateClubDTO_Idl = IDL.Record({
  leagueId: IDL.Nat16,
  name: IDL.Text,
  friendlyName: IDL.Text,
  primaryColourHex: IDL.Text,
  secondaryColourHex: IDL.Text,
  thirdColourHex: IDL.Text,
  abbreviatedName: IDL.Text,
  shirtType: IDL.Nat8,
});

const CountryId = IDL.Nat16;
const Gender = IDL.Variant({ Male: IDL.Null, Female: IDL.Null });
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

// Fixtures (Submit / Add / Move / Postpone, etc.)
/** Example child type for fixture data. */
export const PlayerEventData_Idl = IDL.Record({
  // e.g. playerId: IDL.Nat16,
  // goals: IDL.Nat8,
  // ...
});
export const SubmitFixtureDataDTO_Idl = IDL.Record({
  leagueId: IDL.Nat16,
  seasonId: IDL.Nat16,
  fixtureId: IDL.Nat16,
  gameweek: IDL.Nat16,
  playerEventData: IDL.Vec(PlayerEventData_Idl),
});

export const FixtureDTO_Idl = IDL.Record({
  // e.g.:
  // id: IDL.Nat16,
  // homeClubId: IDL.Nat16,
  // awayClubId: IDL.Nat16,
  // kickoffTime: IDL.Int,
  // ...
});

export const AddInitialFixturesDTO_Idl = IDL.Record({
  leagueId: IDL.Nat16,
  seasonId: IDL.Nat16,
  seasonFixtures: IDL.Vec(FixtureDTO_Idl),
});

export const MoveFixtureDTO_Idl = IDL.Record({
  leagueId: IDL.Nat16,
  seasonId: IDL.Nat16,
  fixtureId: IDL.Nat16,
  updatedFixtureGameweek: IDL.Nat16,
  updatedFixtureDate: IDL.Int,
});

export const PostponeFixtureDTO_Idl = IDL.Record({
  leagueId: IDL.Nat16,
  seasonId: IDL.Nat16,
  fixtureId: IDL.Nat16,
});
