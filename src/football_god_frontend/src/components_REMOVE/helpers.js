export const getGameweekStatus = (status) => {
  switch (status) {
    case 0:
      return "Unopened";
    case 1:
      return "Open";
    case 2:
      return "Closed";
    case 3:
      return "Finalised";
    default:
      return "Unknown";
  }
};

export const getFixtureStatus = (status) => {
  switch (status) {
    case 0:
      return "Unplayed";
    case 1:
      return "Active";
    case 2:
      return "Finished";
    default:
      return "Unknown";
  }
};

export const getTeamNameById = (teamsData, teamId) => {
  const team = teamsData.find((team) => team.id === teamId);
  return team ? team.name : "";
};

export const toHexString = (byteArray) => {
  return Array.from(byteArray, function (byte) {
    return ("0" + (byte & 0xff).toString(16)).slice(-2);
  })
    .join("")
    .toUpperCase();
};
