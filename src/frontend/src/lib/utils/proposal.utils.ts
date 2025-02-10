import type {
  CountryId,
  GameweekNumber,
  Gender,
  PlayerEventData,
} from "../../../../declarations/data_canister/data_canister.did";

export function buildRevaluePlayerUpText(
  playerName: string,
  oldValue: string,
  newValue: string,
) {
  return {
    title: `Revalue ${playerName} up - £${oldValue} -> £${newValue}`,
    summary:
      `Revalue ${playerName} up - £${oldValue} -> £${newValue}\n\n` +
      `Description: Revalue ${playerName} up by £0.25m from £${oldValue} to £${newValue}.`,
  };
}

export function buildRevaluePlayerDownText(
  playerName: string,
  oldValue: string,
  newValue: string,
) {
  return {
    title: `Revalue ${playerName} down - £${oldValue} -> £${newValue}`,
    summary:
      `Revalue ${playerName} down - £${oldValue} -> £${newValue}\n\n` +
      `Description: Revalue ${playerName} down by £0.25m from £${oldValue} to £${newValue}.`,
  };
}

export function buildCreatePlayerText(
  fullName: string,
  position: string,
  clubName: string,
  leagueName: string,
  value: string,
  dateOfBirth: string,
  nationalityName: string,
) {
  return {
    title: `Add ${fullName} to ${clubName}`,
    summary:
      `Add ${fullName} (${position}) to ${clubName} valued at £${value}m.\n\n` +
      `Description: Add ${fullName} (${position}) to ${clubName} (${leagueName}) valued at £${value}m.\n\n` +
      `Full Player Details:\n` +
      `League: ${leagueName}\n` +
      `Club: ${clubName}\n` +
      `Position: ${position}\n` +
      `Name: ${fullName}\n` +
      `Value: £${value}m\nDOB: ${dateOfBirth}\nNationality: ${nationalityName}`,
  };
}

export function buildLoanPlayerText(
  playerName: string,
  currentClubName: string,
  loanClubName: string,
  loanEndDateString: string,
  value: string,
) {
  return {
    title: `Loan ${playerName} from ${currentClubName} to ${loanClubName}`,
    summary:
      `Loan ${playerName} from ${currentClubName} to ${loanClubName} until ${loanEndDateString}.\n\n` +
      `Description: Loan ${playerName} from ${currentClubName} to ${loanClubName} until ${loanEndDateString}.\n` +
      `New Value: £${value}m.`,
  };
}

export function buildRetirePlayerText(
  playerName: string,
  position: string,
  clubName: string,
  retirementDateString: string,
) {
  return {
    title: `Retire ${playerName}`,
    summary:
      `Retire ${playerName} (${position}) at ${clubName} as of ${retirementDateString}.\n\n` +
      `Description: ${playerName} (${position}) at ${clubName} as of ${retirementDateString}.`,
  };
}

export function buildTransferPlayerText(
  playerName: string,
  currentClubName: string,
  currentLeagueName: string,
  transferClubName: string,
  transferLeagueName: string,
  newValue: string,
) {
  return {
    title: `Transfer ${playerName} from ${currentClubName} to ${transferClubName}`,
    summary:
      `Transfer ${playerName} from ${currentClubName} (${currentLeagueName}) ` +
      `to ${transferClubName} (${transferLeagueName}).\n\n` +
      `Description: Transfer ${playerName} from ${currentClubName} (${currentLeagueName}) ` +
      `to ${transferClubName} (${transferLeagueName}) with a value of £${newValue}m.`,
  };
}

export function buildUpdatePlayerText(
  fullName: string,
  position: string,
  clubName: string,
  leagueName: string,
  dateOfBirth: string,
  nationalityName: string,
) {
  return {
    title: `Update ${fullName} (${clubName})`,
    summary:
      `Update ${fullName} (${position}) - ${clubName}.\n\n` +
      `Description: Update ${fullName} (${position}) - ${clubName} (${leagueName}).\n\n` +
      `Full Player Details:\n` +
      `League: ${leagueName}\n` +
      `Club: ${clubName}\n` +
      `Position: ${position}\n` +
      `Name: ${fullName}\n` +
      `DOB: ${dateOfBirth}\nNationality: ${nationalityName}`,
  };
}

export function buildUnretirePlayerText(
  playerName: string,
  clubName: string,
  leagueName: string,
) {
  return {
    title: `Unretire ${playerName} back into ${clubName}`,
    summary:
      `Unretire ${playerName} back into ${clubName} (${leagueName})\n\n` +
      `Description: Unretire ${playerName} back into ${clubName} (${leagueName}).`,
  };
}

export function buildSetPlayerInjuryText(
  playerName: string,
  injuryName: string,
  endDateString: string,
) {
  return {
    title: `Set ${playerName} ${injuryName} injury until ${endDateString}`,
    summary:
      `Set ${playerName} ${injuryName} injury until ${endDateString}\n\n` +
      `Description: Set ${playerName} ${injuryName} injury until ${endDateString}.`,
  };
}

export function buildRecallPlayerText(
  playerName: string,
  recallClubName: string,
  parentClubName: string,
  recallLeagueName: string,
  parentLeagueName: string,
) {
  return {
    title: `Recall ${playerName} from ${recallClubName} to ${parentClubName}`,
    summary:
      `Recall ${playerName} from ${recallClubName} to ${parentClubName}\n\n` +
      `Description: Recall ${playerName} from ${recallClubName} (${recallLeagueName}) ` +
      `to ${parentClubName} (${parentLeagueName}).`,
  };
}

export function buildAddInitialFixturesText(
  seasonName: string,
  leagueName: string,
  fixtureCount: number,
) {
  return {
    title: `Add initial ${seasonName} fixtures for ${leagueName}`,
    summary:
      `Add initial ${seasonName} fixtures for ${leagueName}\n\n` +
      `Description: Add ${fixtureCount} initial fixtures for the ${seasonName} ${leagueName} season.`,
  };
}

export function buildPostponeFixtureText(clubsVs: string, gameweek: number) {
  return {
    title: `Postpone ${clubsVs} (GW${gameweek})`,
    summary:
      `Postpone ${clubsVs} (GW${gameweek})\n\n` +
      `Description: Postpone ${clubsVs} (GW${gameweek}).`,
  };
}

export function buildSubmitFixtureDataText(
  clubsVs: string,
  gameweek: number,
  kickOff: string,
  score: string,
  fixtureId: number,
  seasonName: string,
) {
  return {
    title: `Add Fixture Data for ${clubsVs} (GW${gameweek})`,
    summary:
      `Add Fixture Data for ${clubsVs} (GW${gameweek})\n\n` +
      `Description: Add Fixture Data for ${clubsVs} (GW${gameweek}).\n\n` +
      `Season: ${seasonName}\n` +
      `Fixture: ${clubsVs}\n` +
      `Kick Off: ${kickOff}\n` +
      `Match Detail: footballgod.xyz/fixtures?id=${fixtureId}`,
  };
}

export function buildMoveFixtureText(
  clubsVs: string,
  fromGameweek: number,
  toGameweek: number,
  leagueName: string,
) {
  return {
    title: `Move Fixture ${clubsVs} from GW${fromGameweek} to GW${toGameweek}`,
    summary:
      `Move Fixture ${clubsVs} from GW${fromGameweek} to GW${toGameweek}\n\n` +
      `Description: Move Fixture ${clubsVs} (${leagueName}) from GW${fromGameweek} to GW${toGameweek}.`,
  };
}

export function buildCreateClubText(
  clubName: string,
  leagueName: string,
  friendlyName: string,
  primaryHex: string,
  secondaryHex: string,
  thirdHex: string,
  abbreviation: string,
  shirtType: string,
) {
  return {
    title: `Create new ${clubName} within ${leagueName}`,
    summary:
      `Create new ${clubName} within ${leagueName}\n\n` +
      `Description: Create new ${clubName} within ${leagueName}\n\n` +
      `Club Details\n` +
      `League: ${leagueName}\n` +
      `Club Name: ${clubName}\n` +
      `Friendly Name: ${friendlyName}\n` +
      `Primary Colour Hex Code: ${primaryHex}\n` +
      `Secondary Colour Hex Code: ${secondaryHex}\n` +
      `Third Colour Hex Code: ${thirdHex}\n` +
      `Abbreviated Name: ${abbreviation}\n` +
      `Shirt Type: ${shirtType}`,
  };
}

export function buildUpdateClubText(
  clubName: string,
  leagueName: string,
  friendlyName: string,
  primaryHex: string,
  secondaryHex: string,
  thirdHex: string,
  abbreviation: string,
  shirtType: string,
) {
  return {
    title: `Update ${clubName} club details`,
    summary:
      `Update ${clubName} (${leagueName}) club details\n\n` +
      `Description: Update ${clubName} (${leagueName}) club details\n\n` +
      `Club Details\n` +
      `League: ${leagueName}\n` +
      `Club Name: ${clubName}\n` +
      `Friendly Name: ${friendlyName}\n` +
      `Primary Colour Hex Code: ${primaryHex}\n` +
      `Secondary Colour Hex Code: ${secondaryHex}\n` +
      `Third Colour Hex Code: ${thirdHex}\n` +
      `Abbreviated Name: ${abbreviation}\n` +
      `Shirt Type: ${shirtType}`,
  };
}

export function buildPromoteClubText(
  clubName: string,
  fromLeagueName: string,
  toLeagueName: string,
) {
  return {
    title: `Promote ${clubName} from ${fromLeagueName} to ${toLeagueName}`,
    summary:
      `Promote ${clubName} from ${fromLeagueName} to ${toLeagueName}\n\n` +
      `Description: Promote ${clubName} from ${fromLeagueName} to ${toLeagueName}`,
  };
}

export function buildCreateLeagueText(
  name: string,
  abbreviation: string,
  teamCount: number,
  relatedGender: string,
  governingBody: string,
  formed: string,
  countryName: string,
) {
  return {
    title: `Create new league ${name}`,
    summary:
      `Description: Create new league ${name}\n\n` +
      `League Details\n` +
      `Name: ${name}\n` +
      `Abbreviation: ${abbreviation}\n` +
      `Team Count: ${teamCount}\n` +
      `Gender: ${relatedGender}\n` +
      `Governing Body: ${governingBody}\n` +
      `Formed: ${formed}\n` +
      `Country: ${countryName}`,
  };
}

export function buildUpdateLeagueText(
  name: string,
  abbreviation: string,
  teamCount: number,
  relatedGender: string,
  governingBody: string,
  formed: string,
  countryName: string,
) {
  return {
    title: `Update league: ${name}`,
    summary:
      `Description: Update League: ${name}\n\n` +
      `League Details\n` +
      `Name: ${name}\n` +
      `Abbreviation: ${abbreviation}\n` +
      `Team Count: ${teamCount}\n` +
      `Gender: ${relatedGender}\n` +
      `Governing Body: ${governingBody}\n` +
      `Formed: ${formed}\n` +
      `Country: ${countryName}`,
  };
}

export function buildRescheduleFixtureText(
  vsString: string,
  gameweek: GameweekNumber,
  fixtureDate: string,
) {
  return {
    title: `Reschedule ${vsString}`,
    summary:
      `Reschedule ${vsString}` +
      `Details\n` +
      `New Gameweek: ${gameweek}\n` +
      `New Fixture Date: ${fixtureDate}\n`,
  };
}
