export const idlFactory = ({ IDL }) => {
  const Error = IDL.Variant({
    DecodeError: IDL.Null,
    NotAllowed: IDL.Null,
    NotFound: IDL.Null,
    NotAuthorized: IDL.Null,
    InvalidData: IDL.Null,
    AlreadyExists: IDL.Null,
    CanisterCreateError: IDL.Null,
    CanisterFull: IDL.Null,
  });
  const Result = IDL.Variant({ ok: IDL.Null, err: Error });
  const LeagueId = IDL.Nat16;
  const SeasonId = IDL.Nat16;
  const GameweekNumber = IDL.Nat8;
  const GameweekFiltersDTO = IDL.Record({
    seasonId: SeasonId,
    gameweek: GameweekNumber,
  });
  const PlayerId = IDL.Nat16;
  const PlayerStatus = IDL.Variant({
    OnLoan: IDL.Null,
    Active: IDL.Null,
    FreeAgent: IDL.Null,
    Retired: IDL.Null,
  });
  const ClubId = IDL.Nat16;
  const InjuryHistory = IDL.Record({
    description: IDL.Text,
    injuryStartDate: IDL.Int,
    expectedEndDate: IDL.Int,
  });
  const FixtureId = IDL.Nat32;
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
  const PlayerEventData = IDL.Record({
    fixtureId: FixtureId,
    clubId: ClubId,
    playerId: IDL.Nat16,
    eventStartMinute: IDL.Nat8,
    eventEndMinute: IDL.Nat8,
    eventType: PlayerEventType,
  });
  const PlayerGameweekDTO = IDL.Record({
    fixtureId: FixtureId,
    events: IDL.Vec(PlayerEventData),
    number: IDL.Nat8,
    points: IDL.Int16,
  });
  const CountryId = IDL.Nat16;
  const ValueHistory = IDL.Record({
    oldValue: IDL.Nat16,
    changedOn: IDL.Int,
    newValue: IDL.Nat16,
  });
  const PlayerPosition = IDL.Variant({
    Goalkeeper: IDL.Null,
    Midfielder: IDL.Null,
    Forward: IDL.Null,
    Defender: IDL.Null,
  });
  const PlayerDetailDTO = IDL.Record({
    id: PlayerId,
    status: PlayerStatus,
    clubId: ClubId,
    parentClubId: ClubId,
    valueQuarterMillions: IDL.Nat16,
    dateOfBirth: IDL.Int,
    injuryHistory: IDL.Vec(InjuryHistory),
    seasonId: SeasonId,
    gameweeks: IDL.Vec(PlayerGameweekDTO),
    nationality: CountryId,
    retirementDate: IDL.Int,
    valueHistory: IDL.Vec(ValueHistory),
    latestInjuryEndDate: IDL.Int,
    shirtNumber: IDL.Nat8,
    position: PlayerPosition,
    lastName: IDL.Text,
    firstName: IDL.Text,
  });
  const Result_2 = IDL.Variant({ ok: PlayerDetailDTO, err: Error });
  const PrincipalId = IDL.Text;
  const ProfileDTO = IDL.Record({
    username: IDL.Text,
    withdrawalAddress: IDL.Text,
    profilePictureExtension: IDL.Text,
    joinedDate: IDL.Int,
    termsAcceptedDate: IDL.Int,
    profilePicture: IDL.Opt(IDL.Vec(IDL.Nat8)),
    principalId: PrincipalId,
  });
  const Result_1 = IDL.Variant({ ok: ProfileDTO, err: Error });
  const PauseAccountDTO = IDL.Record({
    pauseDays: IDL.Nat,
    principalId: PrincipalId,
  });
  const UpdateProfilePictureDTO = IDL.Record({
    profilePictureExtension: IDL.Text,
    profilePicture: IDL.Vec(IDL.Nat8),
    principalId: PrincipalId,
  });
  const UpdateUsernameDTO = IDL.Record({
    username: IDL.Text,
    principalId: PrincipalId,
  });
  const UpdateWithdrawalAddressDTO = IDL.Record({
    withdrawalAddress: IDL.Text,
    principalId: PrincipalId,
  });
  return IDL.Service({
    agreeTerms: IDL.Func([], [Result], []),
    getPlayerDetailsForGameweek: IDL.Func(
      [LeagueId, GameweekFiltersDTO],
      [Result_2],
      ["composite_query"],
    ),
    getProfile: IDL.Func([], [Result_1], []),
    pauseAccount: IDL.Func([PauseAccountDTO], [Result], []),
    updateProfilePicture: IDL.Func([UpdateProfilePictureDTO], [Result], []),
    updateUsername: IDL.Func([UpdateUsernameDTO], [Result], []),
    updateWithdrawalAddress: IDL.Func(
      [UpdateWithdrawalAddressDTO],
      [Result],
      [],
    ),
  });
};
export const init = ({ IDL }) => {
  return [];
};
