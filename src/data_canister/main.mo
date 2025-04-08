/* ----- Mops Packages ----- */

import Array "mo:base/Array";
import Blob "mo:base/Blob";
import Bool "mo:base/Bool";
import Buffer "mo:base/Buffer";
import Char "mo:base/Char";
import Int "mo:base/Int";
import Iter "mo:base/Iter";
import List "mo:base/List";
import Nat8 "mo:base/Nat8";
import Nat16 "mo:base/Nat16";
import Option "mo:base/Option";
import Order "mo:base/Order";
import Principal "mo:base/Principal";
import Result "mo:base/Result";
import Text "mo:base/Text";
import Time "mo:base/Time";
import Timer "mo:base/Timer";
import TrieMap "mo:base/TrieMap";
import Nat "mo:base/Nat";

/* ----- WWL Mops Packages ----- */

import SHA224 "mo:waterway-mops/SHA224";
import Countries "mo:waterway-mops/def/Countries";
import Ids "mo:waterway-mops/Ids";
import Enums "mo:waterway-mops/Enums";

import BaseTypes "mo:waterway-mops/BaseTypes";
import CanisterIds "mo:waterway-mops/CanisterIds";
import BaseUtilities "mo:waterway-mops/BaseUtilities";
import FootballTypes "mo:waterway-mops/football/FootballTypes";
import FootballIds "mo:waterway-mops/football/FootballIds";
import FootballDefinitions "mo:waterway-mops/football/FootballDefinitions";
import FootballEnums "mo:waterway-mops/football/FootballEnums";
import BaseDefinitions "mo:waterway-mops/BaseDefinitions";
import BaseQueries "mo:waterway-mops/queries/BaseQueries";

/* ----- Queries ----- */
import PlayerQueries "queries/player_queries";
import FixtureQueries "queries/fixture_queries";
import ClubQueries "queries/club_queries";
import LeagueQueries "queries/league_queries";
import SeasonQueries "queries/season_queries";

/* ----- Commands ----- */

import PlayerCommands "commands/player_commands";
import LeagueCommands "commands/league_commands";
import FixtureCommands "commands/fixture_commands";
import ClubCommands "commands/club_commands";

import Environment "environment";
import Utilities "utilities/utilities";
import AppQueries "queries/app_queries";
import SummaryTypes "summary_types";
import NotificationManager "managers/notification_manager";
import MopsPlayerNotificationCommands "mops_notification_commands/mops_player_notification_commands";

actor Self {

  /* ----- Stable Canister Variables ----- */

  private stable var leagues : [FootballTypes.League] = [];
  private stable var leagueStatuses : [FootballTypes.LeagueStatus] = [];
  private stable var leagueSeasons : [(FootballIds.LeagueId, [FootballTypes.Season])] = [];
  private stable var leagueClubs : [(FootballIds.LeagueId, [FootballTypes.Club])] = [];
  private stable var leaguePlayers : [(FootballIds.LeagueId, [FootballTypes.Player])] = [];
  private stable var freeAgents : [FootballTypes.Player] = [];
  private stable var retiredLeaguePlayers : [(FootballIds.LeagueId, [FootballTypes.Player])] = [];
  private stable var nextLeagueId : FootballIds.LeagueId = 0;
  private stable var nextClubId : FootballIds.ClubId = 0;
  private stable var nextPlayerId : FootballIds.PlayerId = 0;
  private stable var leagueDataHashes : [(FootballIds.LeagueId, [BaseTypes.DataHash])] = [];
  private stable var leagueTables : [FootballTypes.LeagueTable] = [];
  private stable var leagueClubsRequiringData : [(FootballIds.LeagueId, [FootballIds.ClubId])] = [];

  private stable var clubSummaries: [SummaryTypes.ClubSummary] = [];

  /* ----- Canister Variables Recreacted in PostUpgrade ----- */

  private var pickTeamRollOverTimerIds : [Nat] = [];
  private var activateFixtureTimerIds : [Nat] = [];
  private var completeFixtureTimerIds : [Nat] = [];
  private var transferWindowStartTimerIds : [Nat] = [];
  private var transferWindowEndTimerIds : [Nat] = [];
  private var loanExpiredTimerIds : [Nat] = [];
  private var injuryExpiredTimerIds : [Nat] = [];

  /* ----- Managers ----- */

  private let notificationManager = NotificationManager.NotificationManager();

  /* ----- General App Queries ----- */

  public shared query ({ caller }) func getDataHashes(dto : AppQueries.GetDataHashes) : async Result.Result<AppQueries.DataHashes, Enums.Error> {
    assert not Principal.isAnonymous(caller);

    let leagueDataHashesResult = Array.find<(FootballIds.LeagueId, [BaseTypes.DataHash])>(
      leagueDataHashes,
      func(entry : (FootballIds.LeagueId, [BaseTypes.DataHash])) : Bool {
        entry.0 == dto.leagueId;
      },
    );
    switch (leagueDataHashesResult) {
      case (?foundHashes) {
        return #ok({ dataHashes = foundHashes.1 });
      };
      case (null) {};
    };
    return #err(#NotFound);
  };

  public shared query ({ caller }) func getCountries(_ : BaseQueries.GetCountries) : async Result.Result<BaseQueries.Countries, Enums.Error> {
    assert not Principal.isAnonymous(caller);
    return #ok({ countries = Countries.countries });
  };

  /* ----- League Queries ------ */

  public shared query ({ caller }) func getLeagues(_ : LeagueQueries.GetLeagues) : async Result.Result<LeagueQueries.Leagues, Enums.Error> {
    assert not Principal.isAnonymous(caller);
    return #ok({ leagues });
  };

  public shared query ({ caller }) func getBettableLeagues(_ : LeagueQueries.GetBettableLeagues) : async Result.Result<LeagueQueries.BettableLeagues, Enums.Error> {
    assert not Principal.isAnonymous(caller);

    let upToDateLeaguesBuffer = Buffer.fromArray<LeagueQueries.League>([]);

    for (league in Iter.fromArray(leagues)) {
      let leagueClubsRequiringDataResult = Array.find(
        leagueClubsRequiringData,
        func(entry : (FootballIds.LeagueId, [FootballIds.ClubId])) : Bool {
          entry.0 == league.id;
        },
      );

      switch (leagueClubsRequiringDataResult) {
        case (?leagueClubsRequiringDataEntry) {
          let foundLeagueClubs = Array.find<(FootballIds.LeagueId, [FootballTypes.Club])>(
            leagueClubs,
            func(entry : (FootballIds.LeagueId, [FootballTypes.Club])) : Bool {
              entry.0 == league.id;
            },
          );

          switch (foundLeagueClubs) {
            case (?leagueClubsResult) {

              if (Array.size(leagueClubsRequiringDataEntry.1) < Array.size(leagueClubsResult.1)) {
                upToDateLeaguesBuffer.add(league);
              }

            };
            case (null) {};
          };
        };
        case (null) {};
      };
    };

    return #ok({ leagues = Buffer.toArray(upToDateLeaguesBuffer) });
  };

  public shared query ({ caller }) func getLeagueStatus(dto : LeagueQueries.GetLeagueStatus) : async Result.Result<LeagueQueries.LeagueStatus, Enums.Error> {
    assert not Principal.isAnonymous(caller);
    let status = Array.find<FootballTypes.LeagueStatus>(
      leagueStatuses,
      func(entry : FootballTypes.LeagueStatus) : Bool {
        entry.leagueId == dto.leagueId;
      },
    );
    switch (status) {
      case (?foundStatus) {
        return #ok(foundStatus);
      };
      case (null) {
        return #err(#NotFound);
      };
    };
  };

  public shared query ({ caller }) func getLeagueTable(dto : LeagueQueries.GetLeagueTable) : async Result.Result<LeagueQueries.LeagueTable, Enums.Error> {
    assert not Principal.isAnonymous(caller);
    let leagueTable = Array.find(
      leagueTables,
      func(entry : FootballTypes.LeagueTable) : Bool {
        entry.leagueId == dto.leagueId and entry.seasonId == dto.seasonId;
      },
    );
    switch (leagueTable) {
      case (?table) {
        return #ok(table);
      };
      case (null) {
        return #err(#NotFound);
      };
    };
  };

  /* ----- League Commands ------ */

  public shared ({ caller }) func validateCreateLeague(dto : LeagueCommands.CreateLeague) : async BaseTypes.RustResult {
    assert Principal.toText(caller) == CanisterIds.ICFC_SNS_GOVERNANCE_CANISTER_ID;
    assert countryExists(dto.countryId);
    switch (dto.logo) {
      case (?foundLogo) {
        assert logoSizeValid(foundLogo);
      };
      case (null) {};
    };
    if (Text.size(dto.name) > 100) {
      return #Err("Error: Name greater than 100 characters.");
    };

    if (Text.size(dto.abbreviation) > 10) {
      return #Err("Error: Abbreviated Name greater than 10 characters.");
    };

    if (Text.size(dto.governingBody) > 50) {
      return #Err("Error: Governing body greater than 10 characters.");
    };

    if (dto.formed > Time.now()) {
      return #Err("Error: Formed date in the future.");
    };

    if (dto.teamCount < 4) {
      return #Err("A league must be more than 4 teams.");
    };

    return #Ok("Valid");
  };

  public shared ({ caller }) func validateUpdateLeague(dto : LeagueCommands.UpdateLeague) : async BaseTypes.RustResult {
    assert Principal.toText(caller) == CanisterIds.ICFC_SNS_GOVERNANCE_CANISTER_ID;
    assert leagueExists(dto.leagueId);
    assert countryExists(dto.countryId);
    assert logoSizeValid(dto.logo);

    if (Text.size(dto.name) > 100) {
      return #Err("Error: Name greater than 100 characters.");
    };

    if (Text.size(dto.abbreviation) > 10) {
      return #Err("Error: Abbreviated Name greater than 10 characters.");
    };

    if (Text.size(dto.governingBody) > 50) {
      return #Err("Error: Governing body greater than 10 characters.");
    };

    if (dto.formed > Time.now()) {
      return #Err("Error: Formed date in the future.");
    };

    if (dto.teamCount < 4) {
      return #Err("A league must be more than 4 teams.");
    };

    return #Ok("Valid");
  };

  /* ----- Season Queries ----- */

  /* ----- Player Queries ----- */

  public shared ({ caller }) func getPlayers(dto : PlayerQueries.GetPlayers) : async Result.Result<PlayerQueries.Players, Enums.Error> {
    assert callerAllowed(caller);
    return getPrivatePlayers(dto : PlayerQueries.GetPlayers);
  };

  /* ----- Player Commands ----- */

  public shared query ({ caller }) func getLoanedPlayers(dto : PlayerQueries.GetLoanedPlayers) : async Result.Result<PlayerQueries.LoanedPlayers, Enums.Error> {
    assert not Principal.isAnonymous(caller);

    let filteredLeaguePlayers = Array.find<(FootballIds.LeagueId, [FootballTypes.Player])>(
      leaguePlayers,
      func(currentLeaguePlayers : (FootballIds.LeagueId, [FootballTypes.Player])) : Bool {
        currentLeaguePlayers.0 == dto.leagueId;
      },
    );

    switch (filteredLeaguePlayers) {
      case (?foundLeaguePlayers) {

        let loanedClubPlayers = Array.filter<FootballTypes.Player>(
          foundLeaguePlayers.1,
          func(player : FootballTypes.Player) : Bool {
            player.parentClubId > 0;
          },
        );

        return #ok({
          players = Array.map<FootballTypes.Player, PlayerQueries.Player>(
            loanedClubPlayers,
            func(player : FootballTypes.Player) {

              return {
                clubId = player.clubId;
                dateOfBirth = player.dateOfBirth;
                firstName = player.firstName;
                id = player.id;
                lastName = player.lastName;
                nationality = player.nationality;
                position = player.position;
                shirtNumber = player.shirtNumber;
                status = player.status;
                totalPoints = 0;
                valueQuarterMillions = player.valueQuarterMillions;
                currentLoanEndDate = player.currentLoanEndDate;
                parentClubId = player.parentClubId;
                parentLeagueId = player.parentLeagueId;
                leagueId = player.leagueId;
              };
            },
          );
        });
      };
      case (null) {
        return #err(#NotFound);
      };
    };
  };

  public shared query ({ caller }) func getRetiredPlayers(dto : PlayerQueries.GetRetiredPlayers) : async Result.Result<PlayerQueries.RetiredPlayers, Enums.Error> {
    assert not Principal.isAnonymous(caller);

    let filteredLeaguePlayers = Array.find<(FootballIds.LeagueId, [FootballTypes.Player])>(
      retiredLeaguePlayers,
      func(currentLeaguePlayers : (FootballIds.LeagueId, [FootballTypes.Player])) : Bool {
        currentLeaguePlayers.0 == dto.leagueId;
      },
    );

    switch (filteredLeaguePlayers) {
      case (?foundLeaguePlayers) {

        let clubPlayers = Array.filter<FootballTypes.Player>(
          foundLeaguePlayers.1,
          func(player : FootballTypes.Player) : Bool {
            player.clubId == dto.clubId;
          },
        );

        return #ok({
          players = Array.map<FootballTypes.Player, PlayerQueries.Player>(
            clubPlayers,
            func(player : FootballTypes.Player) {

              return {
                clubId = player.clubId;
                dateOfBirth = player.dateOfBirth;
                firstName = player.firstName;
                id = player.id;
                lastName = player.lastName;
                nationality = player.nationality;
                position = player.position;
                shirtNumber = player.shirtNumber;
                status = player.status;
                totalPoints = 0;
                valueQuarterMillions = player.valueQuarterMillions;
                leagueId = player.leagueId;
                parentLeagueId = player.parentLeagueId;
                parentClubId = player.parentClubId;
                currentLoanEndDate = player.currentLoanEndDate;
              };

            },
          );
        });
      };
      case (null) {
        return #err(#NotFound);
      };
    };
  };

  public shared query ({ caller }) func getPlayerDetails(dto : PlayerQueries.GetPlayerDetails) : async Result.Result<PlayerQueries.PlayerDetails, Enums.Error> {
    assert not Principal.isAnonymous(caller);
    assert Principal.toText(caller) == CanisterIds.OPENFPL_BACKEND_CANISTER_ID;

    var clubId : FootballIds.ClubId = 0;
    var position : FootballEnums.PlayerPosition = #Goalkeeper;
    var firstName = "";
    var lastName = "";
    var shirtNumber : Nat8 = 0;
    var valueQuarterMillions : Nat16 = 0;
    var dateOfBirth : Int = 0;
    var nationality : Ids.CountryId = 0;
    var valueHistory : [FootballTypes.ValueHistory] = [];
    var status : FootballEnums.PlayerStatus = #Active;
    var parentClubId : FootballIds.ClubId = 0;
    var latestInjuryEndDate : Int = 0;
    var injuryHistory : [FootballTypes.InjuryHistory] = [];
    var retirementDate : Int = 0;

    let gameweeksBuffer = Buffer.fromArray<PlayerQueries.PlayerGameweek>([]);

    let filteredLeaguePlayers = Array.find<(FootballIds.LeagueId, [FootballTypes.Player])>(
      leaguePlayers,
      func(leagueWithPlayers : (FootballIds.LeagueId, [FootballTypes.Player])) : Bool {
        leagueWithPlayers.0 == dto.leagueId;
      },
    );

    switch (filteredLeaguePlayers) {
      case (?foundLeaguePlayers) {

        let foundPlayer = Array.find<FootballTypes.Player>(
          foundLeaguePlayers.1,
          func(player : FootballTypes.Player) : Bool {
            player.id == dto.playerId;
          },
        );

        switch (foundPlayer) {
          case (null) {};
          case (?player) {
            clubId := player.clubId;
            position := player.position;
            firstName := player.firstName;
            lastName := player.lastName;
            shirtNumber := player.shirtNumber;
            valueQuarterMillions := player.valueQuarterMillions;
            dateOfBirth := player.dateOfBirth;
            nationality := player.nationality;
            valueHistory := List.toArray<FootballTypes.ValueHistory>(player.valueHistory);
            status := player.status;
            parentClubId := player.parentClubId;
            latestInjuryEndDate := player.latestInjuryEndDate;
            injuryHistory := List.toArray<FootballTypes.InjuryHistory>(player.injuryHistory);
            retirementDate := player.retirementDate;

            let currentSeason = List.find<FootballTypes.PlayerSeason>(player.seasons, func(ps : FootballTypes.PlayerSeason) : Bool { ps.id == dto.seasonId });
            switch (currentSeason) {
              case (null) {};
              case (?season) {
                for (gw in Iter.fromList(season.gameweeks)) {

                  var fixtureId : FootballIds.FixtureId = 0;
                  let events = List.toArray<FootballTypes.PlayerEventData>(gw.events);
                  if (Array.size(events) > 0) {
                    fixtureId := events[0].fixtureId;
                  };

                  let gameweekDTO : PlayerQueries.PlayerGameweek = {
                    number = gw.number;
                    events = List.toArray<FootballTypes.PlayerEventData>(gw.events);
                    points = gw.points;
                    fixtureId = fixtureId;
                  };

                  gameweeksBuffer.add(gameweekDTO);
                };
              };
            };

          };
        };

        return #ok({
          player = {
            id = dto.playerId;
            clubId = clubId;
            position = position;
            firstName = firstName;
            lastName = lastName;
            shirtNumber = shirtNumber;
            valueQuarterMillions = valueQuarterMillions;
            dateOfBirth = dateOfBirth;
            nationality = nationality;
            seasonId = dto.seasonId;
            valueHistory = valueHistory;
            status = status;
            parentClubId = parentClubId;
            latestInjuryEndDate = latestInjuryEndDate;
            injuryHistory = injuryHistory;
            retirementDate = retirementDate;
            gameweeks = Buffer.toArray<PlayerQueries.PlayerGameweek>(gameweeksBuffer);
          };
        });

      };
      case (null) {
        return #err(#NotFound);
      };
    };
  };

  public shared query ({ caller }) func getPlayerDetailsForGameweek(dto : PlayerQueries.GetPlayerDetailsForGameweek) : async Result.Result<PlayerQueries.PlayerDetailsForGameweek, Enums.Error> {
    assert not Principal.isAnonymous(caller);

    var playerDetailsBuffer = Buffer.fromArray<PlayerQueries.PlayerPoints>([]);

    let filteredLeaguePlayers = Array.find<(FootballIds.LeagueId, [FootballTypes.Player])>(
      leaguePlayers,
      func(leagueWithPlayers : (FootballIds.LeagueId, [FootballTypes.Player])) : Bool {
        leagueWithPlayers.0 == dto.leagueId;
      },
    );

    switch (filteredLeaguePlayers) {
      case (?players) {
        label playerDetailsLoop for (player in Iter.fromArray(players.1)) {
          var points : Int16 = 0;
          var events : List.List<FootballTypes.PlayerEventData> = List.nil();

          for (season in Iter.fromList(player.seasons)) {
            if (season.id == dto.seasonId) {
              for (gw in Iter.fromList(season.gameweeks)) {
                if (gw.number == dto.gameweek) {
                  points := gw.points;
                  events := List.filter<FootballTypes.PlayerEventData>(
                    gw.events,
                    func(event : FootballTypes.PlayerEventData) : Bool {
                      return event.playerId == player.id;
                    },
                  );
                };
              };
            };
          };

          let playerGameweek : PlayerQueries.PlayerPoints = {
            id = player.id;
            points = points;
            clubId = player.clubId;
            position = player.position;
            events = List.toArray(events);
            gameweek = dto.gameweek;
          };
          playerDetailsBuffer.add(playerGameweek);
        };

        return #ok({ playerPoints = Buffer.toArray(playerDetailsBuffer) });
      };
      case (null) {
        return #err(#NotFound);
      };
    };
  };

  public shared query ({ caller }) func getPlayersMap(dto : PlayerQueries.GetPlayersMap) : async Result.Result<PlayerQueries.PlayersMap, Enums.Error> {
    assert not Principal.isAnonymous(caller);

    var playersMap : TrieMap.TrieMap<Nat16, PlayerQueries.PlayerScore> = TrieMap.TrieMap<Nat16, PlayerQueries.PlayerScore>(BaseUtilities.eqNat16, BaseUtilities.hashNat16);

    let filteredLeaguePlayers = Array.find<(FootballIds.LeagueId, [FootballTypes.Player])>(
      leaguePlayers,
      func(leagueWithPlayers : (FootballIds.LeagueId, [FootballTypes.Player])) : Bool {
        leagueWithPlayers.0 == dto.leagueId;
      },
    );

    switch (filteredLeaguePlayers) {
      case (?players) {
        label playerMapLoop for (player in Iter.fromArray(players.1)) {
          if (player.status == #OnLoan) {
            continue playerMapLoop;
          };

          var points : Int16 = 0;
          var events : List.List<FootballTypes.PlayerEventData> = List.nil();
          var goalsScored : Int16 = 0;
          var goalsConceded : Int16 = 0;
          var saves : Int16 = 0;
          var assists : Int16 = 0;
          var dateOfBirth : Int = player.dateOfBirth;

          for (season in Iter.fromList(player.seasons)) {
            if (season.id == dto.seasonId) {
              for (gw in Iter.fromList(season.gameweeks)) {

                if (gw.number == dto.gameweek) {
                  points := gw.points;
                  events := gw.events;

                  for (event in Iter.fromList(gw.events)) {
                    switch (event.eventType) {
                      case (#Goal) { goalsScored += 1 };
                      case (#GoalAssisted) { assists += 1 };
                      case (#GoalConceded) { goalsConceded += 1 };
                      case (#KeeperSave) { saves += 1 };
                      case _ {};
                    };
                  };
                };
              };
            };
          };

          let scoreDTO : PlayerQueries.PlayerScore = {
            id = player.id;
            points = points;
            events = List.toArray(events);
            clubId = player.clubId;
            position = player.position;
            goalsScored = goalsScored;
            goalsConceded = goalsConceded;
            saves = saves;
            assists = assists;
            dateOfBirth = dateOfBirth;
            nationality = player.nationality;
          };
          playersMap.put(player.id, scoreDTO);
        };
        return #ok({ playersMap = Iter.toArray(playersMap.entries()) });
      };
      case (null) {
        return #err(#NotFound);
      };
    };
  };

  /* ----- Fixture Queries ----- */

  public shared ({ caller }) func getFixtures(dto : FixtureQueries.GetFixtures) : async Result.Result<FixtureQueries.Fixtures, Enums.Error> {
    assert callerAllowed(caller);
    let filteredLeagueSeasons = Array.find<(FootballIds.LeagueId, [FootballTypes.Season])>(
      leagueSeasons,
      func(leagueSeason : (FootballIds.LeagueId, [FootballTypes.Season])) : Bool {
        leagueSeason.0 == dto.leagueId;
      },
    );

    switch (filteredLeagueSeasons) {
      case (?foundLeagueSeasons) {

        let filteredSeason = Array.find<FootballTypes.Season>(
          foundLeagueSeasons.1,
          func(leagueSeason : FootballTypes.Season) : Bool {
            leagueSeason.id == dto.seasonId;
          },
        );

        switch (filteredSeason) {
          case (?foundSeason) {
            return #ok({
              leagueId = dto.leagueId;
              seasonId = dto.seasonId;
              fixtures = List.toArray(
                List.map<FootballTypes.Fixture, FixtureQueries.Fixture>(
                  foundSeason.fixtures,
                  func(fixture : FootballTypes.Fixture) {
                    return {
                      awayClubId = fixture.awayClubId;
                      awayGoals = fixture.awayGoals;
                      events = List.toArray(fixture.events);
                      gameweek = fixture.gameweek;
                      highestScoringPlayerId = fixture.highestScoringPlayerId;
                      homeClubId = fixture.homeClubId;
                      homeGoals = fixture.homeGoals;
                      id = fixture.id;
                      kickOff = fixture.kickOff;
                      seasonId = fixture.seasonId;
                      status = fixture.status;
                    };
                  },
                )
              );
            });
          };
          case (null) {
            return #err(#NotFound);
          };
        };
      };
      case (null) {
        return #err(#NotFound);
      };
    };

  };

  public shared ({ caller }) func getBettableFixtures(dto : FixtureQueries.GetBettableFixtures) : async Result.Result<FixtureQueries.BettableFixtures, Enums.Error> {
    assert not Principal.isAnonymous(caller);

    let filteredLeagueSeasons = Array.find<(FootballIds.LeagueId, [FootballTypes.Season])>(
      leagueSeasons,
      func(leagueSeason : (FootballIds.LeagueId, [FootballTypes.Season])) : Bool {
        leagueSeason.0 == dto.leagueId;
      },
    );

    switch (filteredLeagueSeasons) {
      case (?foundLeagueSeasons) {

        let status = Array.find<FootballTypes.LeagueStatus>(
          leagueStatuses,
          func(entry : FootballTypes.LeagueStatus) : Bool {
            entry.leagueId == dto.leagueId;
          },
        );
        switch (status) {
          case (?foundStatus) {

            let filteredSeason = Array.find<FootballTypes.Season>(
              foundLeagueSeasons.1,
              func(leagueSeason : FootballTypes.Season) : Bool {
                leagueSeason.id == foundStatus.activeSeasonId;
              },
            );

            switch (filteredSeason) {
              case (?foundSeason) {
                let foundIncompleteLeagueClubIds = Array.find<(FootballIds.LeagueId, [FootballIds.ClubId])>(
                  leagueClubsRequiringData,
                  func(entry : (FootballIds.LeagueId, [FootballIds.ClubId])) {
                    entry.0 == dto.leagueId;
                  },
                );

                switch (foundIncompleteLeagueClubIds) {
                  case (?foundClubIds) {

                    let fixturesWithoutIncompleteClubs = List.filter<FootballTypes.Fixture>(
                      foundSeason.fixtures,
                      func(fixtureEntry : FootballTypes.Fixture) {
                        return fixtureEntry.status != #Finalised and not Option.isSome(
                          Array.find<FootballIds.ClubId>(
                            foundClubIds.1,
                            func(incompleteClubId : FootballIds.ClubId) : Bool {
                              fixtureEntry.homeClubId == incompleteClubId or fixtureEntry.awayClubId == incompleteClubId;
                            },
                          )
                        );
                      },
                    );

                    return #ok({
                      leagueId = dto.leagueId;
                      seasonId = foundStatus.activeSeasonId;
                      fixtures = List.toArray<FixtureQueries.Fixture>(
                        List.map<FootballTypes.Fixture, FixtureQueries.Fixture>(
                          fixturesWithoutIncompleteClubs,
                          func(fixtureEntry : FootballTypes.Fixture) {
                            return {
                              awayClubId = fixtureEntry.awayClubId;
                              awayGoals = fixtureEntry.awayGoals;
                              events = List.toArray(fixtureEntry.events);
                              gameweek = fixtureEntry.gameweek;
                              highestScoringPlayerId = fixtureEntry.highestScoringPlayerId;
                              homeClubId = fixtureEntry.homeClubId;
                              homeGoals = fixtureEntry.homeGoals;
                              id = fixtureEntry.id;
                              kickOff = fixtureEntry.kickOff;
                              seasonId = fixtureEntry.seasonId;
                              status = fixtureEntry.status;
                            };
                          },
                        )
                      );
                    });
                  };
                  case (null) {};
                };
              };
              case (null) {};
            };
          };
          case (null) {
            return #err(#NotFound);
          };
        };
      };
      case (null) {};
    };
    return #err(#NotFound);
  };

  public shared query ({ caller }) func getPostponedFixtures(dto : FixtureQueries.GetPostponedFixtures) : async Result.Result<FixtureQueries.PostponedFixtures, Enums.Error> {
    assert not Principal.isAnonymous(caller);
    assert Principal.toText(caller) == CanisterIds.OPENFPL_BACKEND_CANISTER_ID;

    let filteredLeagueSeasons = Array.find<(FootballIds.LeagueId, [FootballTypes.Season])>(
      leagueSeasons,
      func(currentLeagueSeason : (FootballIds.LeagueId, [FootballTypes.Season])) : Bool {
        currentLeagueSeason.0 == dto.leagueId;
      },
    );

    switch (filteredLeagueSeasons) {
      case (?foundLeagueSeasons) {

        let status = Array.find<FootballTypes.LeagueStatus>(
          leagueStatuses,
          func(entry : FootballTypes.LeagueStatus) : Bool {
            entry.leagueId == dto.leagueId;
          },
        );
        switch (status) {
          case (?foundStatus) {

            let filteredSeason = Array.find<FootballTypes.Season>(
              foundLeagueSeasons.1,
              func(leagueSeason : FootballTypes.Season) : Bool {
                leagueSeason.id == foundStatus.activeSeasonId;
              },
            );

            switch (filteredSeason) {
              case (?foundSeason) {
                return #ok({

                  leagueId = dto.leagueId;
                  seasonId = foundStatus.activeSeasonId;
                  fixtures = List.toArray<FixtureQueries.Fixture>(
                    List.map<FootballTypes.Fixture, FixtureQueries.Fixture>(
                      foundSeason.postponedFixtures,
                      func(fixture : FootballTypes.Fixture) {
                        return {
                          awayClubId = fixture.awayClubId;
                          awayGoals = fixture.awayGoals;
                          events = List.toArray(fixture.events);
                          gameweek = fixture.gameweek;
                          highestScoringPlayerId = fixture.highestScoringPlayerId;
                          homeClubId = fixture.homeClubId;
                          homeGoals = fixture.homeGoals;
                          id = fixture.id;
                          kickOff = fixture.kickOff;
                          seasonId = fixture.seasonId;
                          status = fixture.status;
                        };
                      },
                    )
                  );
                });
              };
              case (null) {
                return #err(#NotFound);
              };
            };

          };
          case (null) {
            return #err(#NotFound);
          };
        };
      };
      case (null) {
        return #err(#NotFound);
      };
    };
  };

  /* ----- Clubs Queries ----- */

  public shared ({ caller }) func getClubs(dto : ClubQueries.GetClubs) : async Result.Result<ClubQueries.Clubs, Enums.Error> {
    assert callerAllowed(caller);
    return getPrivateClubs(dto);
  };

  public shared ({ caller }) func getClubValueLeaderboard(dto: ClubQueries.GetClubValueLeaderboard) : async Result.Result<ClubQueries.ClubValueLeaderboard, Enums.Error> {
    assert not Principal.isAnonymous(caller);
    
    return #ok({ clubs = clubSummaries });
  };

  //Private getters

  private func callerAllowed(caller : Principal) : Bool {
    let foundCaller = Array.find<Ids.PrincipalId>(
      Environment.APPROVED_CANISTERS,
      func(canisterId : Ids.CanisterId) : Bool {
        Principal.toText(caller) == canisterId;
      },
    );
    return Option.isSome(foundCaller);
  };

  private func getPrivatePlayers(dto : PlayerQueries.GetPlayers) : Result.Result<PlayerQueries.Players, Enums.Error> {
    let filteredLeaguePlayers = Array.find<(FootballIds.LeagueId, [FootballTypes.Player])>(
      leaguePlayers,
      func(currentLeaguePlayers : (FootballIds.LeagueId, [FootballTypes.Player])) : Bool {
        currentLeaguePlayers.0 == dto.leagueId;
      },
    );

    switch (filteredLeaguePlayers) {
      case (?foundLeaguePlayers) {
        return #ok({
          players = Array.map<FootballTypes.Player, PlayerQueries.Player>(
            foundLeaguePlayers.1,
            func(player : FootballTypes.Player) {

              return {
                clubId = player.clubId;
                dateOfBirth = player.dateOfBirth;
                firstName = player.firstName;
                id = player.id;
                lastName = player.lastName;
                nationality = player.nationality;
                position = player.position;
                shirtNumber = player.shirtNumber;
                status = player.status;
                valueQuarterMillions = player.valueQuarterMillions;
                leagueId = player.leagueId;
                parentLeagueId = player.parentLeagueId;
                parentClubId = player.parentClubId;
                currentLoanEndDate = player.currentLoanEndDate;
              };

            },
          );
        });
      };
      case (null) {
        return #err(#NotFound);
      };
    };
  };

  private func getPrivateClubs(dto : ClubQueries.GetClubs) : Result.Result<ClubQueries.Clubs, Enums.Error> {

    let filteredLeagueClubs = Array.find<(FootballIds.LeagueId, [FootballTypes.Club])>(
      leagueClubs,
      func(leagueClubs : (FootballIds.LeagueId, [FootballTypes.Club])) : Bool {
        leagueClubs.0 == dto.leagueId;
      },
    );

    switch (filteredLeagueClubs) {
      case (?foundLeagueClubs) {
        let sortedArray = Array.sort<FootballTypes.Club>(
          foundLeagueClubs.1,
          func(a : FootballTypes.Club, b : FootballTypes.Club) : Order.Order {
            if (a.friendlyName < b.friendlyName) { return #less };
            if (a.friendlyName == b.friendlyName) { return #equal };
            return #greater;
          },
        );
        return #ok({ leagueId = dto.leagueId; clubs = sortedArray });

      };
      case (null) {
        return #err(#NotFound);
      };
    };
  };

  public shared query ({ caller }) func getSeasons(dto : SeasonQueries.GetSeasons) : async Result.Result<SeasonQueries.Seasons, Enums.Error> {
    assert not Principal.isAnonymous(caller);

    let filteredLeagueSeasons = Array.find<(FootballIds.LeagueId, [FootballTypes.Season])>(
      leagueSeasons,
      func(leagueSeason : (FootballIds.LeagueId, [FootballTypes.Season])) : Bool {
        leagueSeason.0 == dto.leagueId;
      },
    );

    switch (filteredLeagueSeasons) {
      case (?foundLeagueSeasons) {
        let sortedArray = Array.sort<FootballTypes.Season>(
          foundLeagueSeasons.1,
          func(a : FootballTypes.Season, b : FootballTypes.Season) : Order.Order {
            if (a.id > b.id) { return #greater };
            if (a.id == b.id) { return #equal };
            return #less;
          },
        );
        return #ok({ seasons = sortedArray });

      };
      case (null) {
        return #err(#NotFound);
      };
    };
  };

  /* Governance Validation Functions */

  /* Player */

  private func isValidValueChange(player : FootballTypes.Player) : Bool {
    let currentTimestamp = Time.now();
    let oneYearAgo = currentTimestamp - (365 * 24 * 60 * 60);

    let relevantHistory = List.filter<FootballTypes.ValueHistory>(player.valueHistory, func(entry) = entry.changedOn >= oneYearAgo);

    switch (List.last(relevantHistory)) {
      case (null) {
        return true;
      };
      case (?lastEntry) {
        let oldVal = lastEntry.oldValue;
        let newVal = lastEntry.newValue;

        let decreaseLimit = oldVal / 2;
        let increaseLimit = oldVal * 4;

        return (newVal >= decreaseLimit) and (newVal <= increaseLimit);
      };
    };
  };

  public shared ({ caller }) func validateRevaluePlayerUp(dto : PlayerCommands.RevaluePlayerUp) : async BaseTypes.RustResult {
    assert Principal.toText(caller) == CanisterIds.ICFC_SNS_GOVERNANCE_CANISTER_ID;
    assert leagueExists(dto.leagueId);
    switch (checkPlayerExists(dto.leagueId, dto.playerId)) {
      case (?player) {
        if (isValidValueChange(player)) {
          return #Ok("Valid");
        } else {
          return #Err("Invalid value change: New value exceeeds the allowed limit");
        };
      };
      case (null) {
        return #Err("Player not found");
      };
    };
  };

  public shared ({ caller }) func validateRevaluePlayerDown(dto : PlayerCommands.RevaluePlayerDown) : async BaseTypes.RustResult {
    assert Principal.toText(caller) == CanisterIds.ICFC_SNS_GOVERNANCE_CANISTER_ID;
    assert leagueExists(dto.leagueId);
    switch (checkPlayerExists(dto.leagueId, dto.playerId)) {
      case (?player) {
        if (isValidValueChange(player)) {
          return #Ok("Valid");
        } else {
          return #Err("Invalid value change: New value exceeeds the allowed limit");
        };
      };
      case (null) {
        return #Err("Player not found");
      };
    };
  };

  public shared ({ caller }) func validateLoanPlayer(dto : PlayerCommands.LoanPlayer) : async BaseTypes.RustResult {
    assert Principal.toText(caller) == CanisterIds.ICFC_SNS_GOVERNANCE_CANISTER_ID;
    assert leagueExists(dto.leagueId);
    assert leagueExists(dto.loanLeagueId);
    assert clubExists(dto.loanLeagueId, dto.loanClubId);
    assert Option.isSome(checkPlayerExists(dto.leagueId, dto.playerId));
    assert dto.loanEndDate > Time.now();
    return #Ok("Valid");
  };

  public shared ({ caller }) func validateTransferPlayer(dto : PlayerCommands.TransferPlayer) : async BaseTypes.RustResult {
    assert Principal.toText(caller) == CanisterIds.ICFC_SNS_GOVERNANCE_CANISTER_ID;
    assert leagueExists(dto.leagueId);
    assert leagueExists(dto.newLeagueId);
    assert clubExists(dto.leagueId, dto.clubId);
    assert clubExists(dto.newLeagueId, dto.newClubId);
    assert Option.isSome(checkPlayerExists(dto.leagueId, dto.playerId));
    return #Ok("Valid");
  };

  public shared ({ caller }) func validateSetFreeAgent(dto : PlayerCommands.SetFreeAgent) : async BaseTypes.RustResult {
    assert Principal.toText(caller) == CanisterIds.ICFC_SNS_GOVERNANCE_CANISTER_ID;
    assert leagueExists(dto.leagueId);
    assert Option.isSome(checkPlayerExists(dto.leagueId, dto.playerId));
    return #Ok("Valid");
  };

  public shared ({ caller }) func validateRecallPlayer(dto : PlayerCommands.RecallPlayer) : async BaseTypes.RustResult {
    assert Principal.toText(caller) == CanisterIds.ICFC_SNS_GOVERNANCE_CANISTER_ID;
    assert leagueExists(dto.leagueId);
    assert Option.isSome(checkPlayerExists(dto.leagueId, dto.playerId));
    return #Ok("Valid");
  };

  public shared ({ caller }) func validateCreatePlayer(dto : PlayerCommands.CreatePlayer) : async BaseTypes.RustResult {
    assert Principal.toText(caller) == CanisterIds.ICFC_SNS_GOVERNANCE_CANISTER_ID;
    assert leagueExists(dto.leagueId);
    assert clubExists(dto.leagueId, dto.clubId);
    assert countryExists(dto.nationality);

    //TODO: Check if player already added

    if (Text.size(dto.firstName) > 50) {
      return #Err("Invalid Data");
    };

    if (Text.size(dto.lastName) > 50) {
      return #Err("Invalid Data");
    };

    if (Utilities.calculateAgeFromUnix(dto.dateOfBirth) < 16) {
      return #Err("Invalid Data");
    };

    return #Ok("Valid");
  };

  public shared ({ caller }) func validateUpdatePlayer(dto : PlayerCommands.UpdatePlayer) : async BaseTypes.RustResult {
    assert Principal.toText(caller) == CanisterIds.ICFC_SNS_GOVERNANCE_CANISTER_ID;
    assert leagueExists(dto.leagueId);
    assert Option.isSome(checkPlayerExists(dto.leagueId, dto.playerId));

    if (Text.size(dto.firstName) > 50) {
      return #Err("Invalid Data");
    };

    if (Text.size(dto.lastName) > 50) {
      return #Err("Invalid Data");
    };

    let playerCountry = Array.find<BaseTypes.Country>(Countries.countries, func(country : BaseTypes.Country) : Bool { return country.id == dto.nationality });
    switch (playerCountry) {
      case (null) {
        return #Err("Invalid Data");
      };
      case (?_) {};
    };

    if (Utilities.calculateAgeFromUnix(dto.dateOfBirth) < 16) {
      return #Err("Invalid Data");
    };
    return #Ok("Valid");
  };

  public shared ({ caller }) func validateSetPlayerInjury(dto : PlayerCommands.SetPlayerInjury) : async BaseTypes.RustResult {
    assert Principal.toText(caller) == CanisterIds.ICFC_SNS_GOVERNANCE_CANISTER_ID;
    assert leagueExists(dto.leagueId);
    assert Option.isSome(checkPlayerExists(dto.leagueId, dto.playerId));
    return #Ok("Valid");
  };

  public shared ({ caller }) func validateRetirePlayer(dto : PlayerCommands.RetirePlayer) : async BaseTypes.RustResult {
    assert Principal.toText(caller) == CanisterIds.ICFC_SNS_GOVERNANCE_CANISTER_ID;
    assert leagueExists(dto.leagueId);
    assert Option.isSome(checkPlayerExists(dto.leagueId, dto.playerId));
    return #Ok("Valid");
  };

  public shared ({ caller }) func validateUnretirePlayer(dto : PlayerCommands.UnretirePlayer) : async BaseTypes.RustResult {
    assert Principal.toText(caller) == CanisterIds.ICFC_SNS_GOVERNANCE_CANISTER_ID;
    assert leagueExists(dto.leagueId);
    assert Option.isSome(checkPlayerExists(dto.leagueId, dto.playerId));
    return #Ok("Valid");
  };

  /* League */

  public shared ({ caller }) func validateAddInitialFixtures(dto : FixtureCommands.AddInitialFixtures) : async BaseTypes.RustResult {
    assert Principal.toText(caller) == CanisterIds.ICFC_SNS_GOVERNANCE_CANISTER_ID;
    assert not seasonActive(dto.leagueId);

    let maybeLeague = Array.find<FootballTypes.League>(
      leagues,
      func(leagueEntry) { leagueEntry.id == dto.leagueId },
    );
    switch (maybeLeague) {
      case null { return #Err("League Not Found") };
      case (?league) {
        let maybeStatus = Array.find<FootballTypes.LeagueStatus>(
          leagueStatuses,
          func(statusEntry) { statusEntry.leagueId == dto.leagueId },
        );
        switch (maybeStatus) {
          case null { return #Err("League Status Not Found") };
          case (?leagueStatus) {
            let teamCountN : Nat = Nat8.toNat(league.teamCount);
            let totalGWsN : Nat = Nat8.toNat(leagueStatus.totalGameweeks);

            let expectedFixtureCount = (teamCountN * totalGWsN) / 2;
            if (Array.size(dto.seasonFixtures) != expectedFixtureCount) {
              return #Err("Incorrect Fixture Count");
            };

            for (fixture in Iter.fromArray(dto.seasonFixtures)) {
              if (
                not clubExists(dto.leagueId, fixture.homeClubId) or
                not clubExists(dto.leagueId, fixture.awayClubId)
              ) {
                return #Err(
                  "One or more fixtures refer to clubs not in this league."
                );
              };
            };

            let matchesPerGameweek = teamCountN / 2;
            let countsBuf = Buffer.Buffer<Nat>(totalGWsN);
            var i = 0;
            while (i < totalGWsN) {
              countsBuf.add(0);
              i += 1;
            };

            for (fixture in Iter.fromArray(dto.seasonFixtures)) {
              let gwN = Nat8.toNat(fixture.gameweek);
              if (gwN < 1 or gwN > totalGWsN) {
                return #Err("Fixture has invalid gameweek number.");
              };
              let index = gwN - 1;
              let oldCount = countsBuf.get(index);
              countsBuf.put(index, oldCount + 1);
            };

            var j = 0;
            while (j < totalGWsN) {
              let gwCount = countsBuf.get(j);
              if (gwCount != matchesPerGameweek) {
                return #Err("Fixtures are not evenly distributed across gameweeks.");
              };
              j += 1;
            };

            let occupied = Buffer.Buffer<(FootballIds.ClubId, Int)>(0);
            for (fixture in Iter.fromArray(dto.seasonFixtures)) {
              let homePair = (fixture.homeClubId, fixture.kickOff);
              let awayPair = (fixture.awayClubId, fixture.kickOff);

              if (
                Array.find<(FootballIds.ClubId, Int)>(
                  Buffer.toArray(occupied),
                  func(x) { x.0 == homePair.0 and x.1 == homePair.1 },
                ) != null
              ) {
                return #Err("Home club has multiple fixtures at the same time.");
              };
              if (
                Array.find<(FootballIds.ClubId, Int)>(
                  Buffer.toArray(occupied),
                  func(x) { x.0 == awayPair.0 and x.1 == awayPair.1 },
                ) != null
              ) {
                return #Err("Away club has multiple fixtures at the same time.");
              };

              occupied.add(homePair);
              occupied.add(awayPair);
            };

            return #Ok("Valid");
          };
        };
      };
    };
  };

  public shared ({ caller }) func validateMoveFixture(dto : FixtureCommands.MoveFixture) : async BaseTypes.RustResult {
    assert Principal.toText(caller) == CanisterIds.ICFC_SNS_GOVERNANCE_CANISTER_ID;
    assert leagueExists(dto.leagueId);
    assert seasonExists(dto.leagueId, dto.seasonId);
    assert fixtureExists(dto.leagueId, dto.seasonId, dto.fixtureId);

    if (dto.updatedFixtureDate <= Time.now()) {
      return #Err("Updated fixture date cannot be in the past.");
    };

    let leagueStatus = Array.find<FootballTypes.LeagueStatus>(
      leagueStatuses,
      func(statusEntry : FootballTypes.LeagueStatus) : Bool {
        return statusEntry.leagueId == dto.leagueId;
      },
    );

    switch (leagueStatus) {
      case (?foundLeagueStatus) {

        if (dto.updatedFixtureGameweek < foundLeagueStatus.unplayedGameweek) {
          return #Err("Fixture must be moved into upcoming gameweek.");
        };

        return #Ok("Valid");

      };
      case (null) {
        return #Err("Could not find league status.");
      };
    };
  };

  public shared ({ caller }) func validatePostponeFixture(dto : FixtureCommands.PostponeFixture) : async BaseTypes.RustResult {
    assert Principal.toText(caller) == CanisterIds.ICFC_SNS_GOVERNANCE_CANISTER_ID;
    assert leagueExists(dto.leagueId);
    assert fixtureExists(dto.leagueId, dto.seasonId, dto.fixtureId);
    return #Ok("Valid");
  };

  public shared ({ caller }) func validateRescheduleFixture(dto : FixtureCommands.RescheduleFixture) : async BaseTypes.RustResult {
    assert Principal.toText(caller) == CanisterIds.ICFC_SNS_GOVERNANCE_CANISTER_ID;
    assert leagueExists(dto.leagueId);
    assert postponedFixtureExists(dto.leagueId, dto.seasonId, dto.fixtureId);
    return #Ok("Valid");
  };

  public shared ({ caller }) func validateSubmitFixtureData(dto : FixtureCommands.SubmitFixtureData) : async BaseTypes.RustResult {
    assert Principal.toText(caller) == CanisterIds.ICFC_SNS_GOVERNANCE_CANISTER_ID;
    assert leagueExists(dto.leagueId);
    assert fixtureExists(dto.leagueId, dto.seasonId, dto.fixtureId);
    assert validatePlayerEvents(dto.playerEventData);
    return #Ok("Valid");
  };

  /* Club */

  public shared ({ caller }) func validateCreateClub(dto : ClubCommands.CreateClub) : async BaseTypes.RustResult {
    assert Principal.toText(caller) == CanisterIds.ICFC_SNS_GOVERNANCE_CANISTER_ID;
    assert leagueExists(dto.leagueId);
    if (Text.size(dto.name) > 100) {
      return #Err("Error: Name greater than 100 characters.");
    };

    if (Text.size(dto.friendlyName) > 50) {
      return #Err("Error: Name greater than 50 characters.");
    };

    if (Text.size(dto.primaryColourHex) != 7) {
      return #Err("Error: Primary Hex Colour must equal 7 characters including the hash prefix.");
    };

    if (Text.size(dto.secondaryColourHex) != 7) {
      return #Err("Error: Secondary Hex Colour must equal 7 characters including the hash prefix.");
    };

    if (Text.size(dto.thirdColourHex) != 7) {
      return #Err("Error: Third Hex Colour must equal 7 characters including the hash prefix.");
    };

    if (Text.size(dto.abbreviatedName) != 3) {
      return #Err("Error: Abbreviated name must equal 3 characters.");
    };

    return #Ok("Valid");
  };

  public shared ({ caller }) func validateUpdateClub(dto : ClubCommands.UpdateClub) : async BaseTypes.RustResult {
    assert Principal.toText(caller) == CanisterIds.ICFC_SNS_GOVERNANCE_CANISTER_ID;
    assert leagueExists(dto.leagueId);
    assert clubExists(dto.leagueId, dto.clubId);

    if (Text.size(dto.name) > 100) {
      return #Err("Error: Name greater than 100 characters.");
    };

    if (Text.size(dto.friendlyName) > 50) {
      return #Err("Error: Name greater than 50 characters.");
    };

    if (Text.size(dto.primaryColourHex) != 7) {
      return #Err("Error: Primary Hex Colour must equal 7 characters including the hash prefix.");
    };

    if (Text.size(dto.secondaryColourHex) != 7) {
      return #Err("Error: Secondary Hex Colour must equal 7 characters including the hash prefix.");
    };

    if (Text.size(dto.thirdColourHex) != 7) {
      return #Err("Error: Third Hex Colour must equal 7 characters including the hash prefix.");
    };

    if (Text.size(dto.secondaryColourHex) != 3) {
      return #Err("Error: Abbreviated name must equal 3 characters.");
    };

    return #Ok("Valid");
  };

  public shared ({ caller }) func validatePromoteClub(dto : ClubCommands.PromoteClub) : async BaseTypes.RustResult {
    assert Principal.toText(caller) == CanisterIds.ICFC_SNS_GOVERNANCE_CANISTER_ID;
    assert leagueExists(dto.leagueId);
    assert leagueExists(dto.toLeagueId);
    assert clubExists(dto.leagueId, dto.clubId);
    assert not seasonActive(dto.leagueId);
    assert not seasonActive(dto.toLeagueId);
    return #Ok("Valid");
  };

  public shared ({ caller }) func validateRelegateClub(dto : ClubCommands.RelegateClub) : async BaseTypes.RustResult {
    assert Principal.toText(caller) == CanisterIds.ICFC_SNS_GOVERNANCE_CANISTER_ID;
    assert leagueExists(dto.leagueId);
    assert leagueExists(dto.relegatedToLeagueId);
    assert clubExists(dto.leagueId, dto.clubId);
    return #Ok("Valid");
  };

  /* Governance Execution Functions */

  /* Player */

  public shared ({ caller }) func revaluePlayerUp(dto : PlayerCommands.RevaluePlayerUp) : async () {
    assert Principal.toText(caller) == CanisterIds.ICFC_SNS_GOVERNANCE_CANISTER_ID;

    let updatedLeaguePlayersBuffer = Buffer.fromArray<(FootballIds.LeagueId, [FootballTypes.Player])>([]);

    for (league in Iter.fromArray(leaguePlayers)) {
      if (league.0 == dto.leagueId) {

        let filteredLeaguePlayers = Array.find<(FootballIds.LeagueId, [FootballTypes.Player])>(
          leaguePlayers,
          func(leagueWithPlayers : (FootballIds.LeagueId, [FootballTypes.Player])) : Bool {
            leagueWithPlayers.0 == dto.leagueId;
          },
        );

        switch (filteredLeaguePlayers) {
          case (?foundLeaguePlayers) {

            var updatedPlayers = Array.map<FootballTypes.Player, FootballTypes.Player>(
              foundLeaguePlayers.1,
              func(p : FootballTypes.Player) : FootballTypes.Player {
                if (p.id == dto.playerId) {
                  var newValue = p.valueQuarterMillions;
                  newValue += 1;

                  let historyEntry : FootballTypes.ValueHistory = {
                    changedOn = Time.now();
                    oldValue = p.valueQuarterMillions;
                    newValue = newValue;
                  };

                  let updatedPlayer : FootballTypes.Player = {
                    id = p.id;
                    leagueId = p.leagueId;
                    clubId = p.clubId;
                    position = p.position;
                    firstName = p.firstName;
                    lastName = p.lastName;
                    shirtNumber = p.shirtNumber;
                    valueQuarterMillions = newValue;
                    dateOfBirth = p.dateOfBirth;
                    nationality = p.nationality;
                    seasons = p.seasons;
                    valueHistory = List.append<FootballTypes.ValueHistory>(p.valueHistory, List.make(historyEntry));
                    status = p.status;
                    parentLeagueId = p.parentLeagueId;
                    parentClubId = p.parentClubId;
                    currentLoanEndDate = p.currentLoanEndDate;
                    latestInjuryEndDate = p.latestInjuryEndDate;
                    injuryHistory = p.injuryHistory;
                    retirementDate = p.retirementDate;
                    transferHistory = p.transferHistory;
                    gender = p.gender;
                  };

                  return updatedPlayer;
                };
                return p;
              },
            );

            updatedLeaguePlayersBuffer.add((dto.leagueId, updatedPlayers));
          };
          case (null) {

          };
        };
      } else {
        updatedLeaguePlayersBuffer.add(league);
      };
    };

    leaguePlayers := Buffer.toArray(updatedLeaguePlayersBuffer);
    let _ = await updateDataHash(dto.leagueId, "players");
    let _ = await notificationManager.distributeNotification(#RevaluePlayerUp, #RevaluePlayerUp { });
  };

  public shared ({ caller }) func revaluePlayerDown(dto : PlayerCommands.RevaluePlayerDown) : async () {
    assert Principal.toText(caller) == CanisterIds.ICFC_SNS_GOVERNANCE_CANISTER_ID;

    let updatedLeaguePlayersBuffer = Buffer.fromArray<(FootballIds.LeagueId, [FootballTypes.Player])>([]);

    for (league in Iter.fromArray(leaguePlayers)) {
      if (league.0 == dto.leagueId) {

        let filteredLeaguePlayers = Array.find<(FootballIds.LeagueId, [FootballTypes.Player])>(
          leaguePlayers,
          func(leagueWithPlayers : (FootballIds.LeagueId, [FootballTypes.Player])) : Bool {
            leagueWithPlayers.0 == dto.leagueId;
          },
        );

        switch (filteredLeaguePlayers) {
          case (?foundLeaguePlayers) {

            var updatedPlayers = Array.map<FootballTypes.Player, FootballTypes.Player>(
              foundLeaguePlayers.1,
              func(p : FootballTypes.Player) : FootballTypes.Player {
                if (p.id == dto.playerId) {
                  var newValue = p.valueQuarterMillions;
                  if (newValue >= 1) {
                    newValue -= 1;
                  };

                  let historyEntry : FootballTypes.ValueHistory = {
                    changedOn = Time.now();
                    oldValue = p.valueQuarterMillions;
                    newValue = newValue;
                  };

                  let updatedPlayer : FootballTypes.Player = {
                    id = p.id;
                    leagueId = p.leagueId;
                    clubId = p.clubId;
                    position = p.position;
                    firstName = p.firstName;
                    lastName = p.lastName;
                    shirtNumber = p.shirtNumber;
                    valueQuarterMillions = newValue;
                    dateOfBirth = p.dateOfBirth;
                    nationality = p.nationality;
                    seasons = p.seasons;
                    valueHistory = List.append<FootballTypes.ValueHistory>(p.valueHistory, List.make(historyEntry));
                    status = p.status;
                    parentLeagueId = p.parentLeagueId;
                    parentClubId = p.parentClubId;
                    currentLoanEndDate = p.currentLoanEndDate;
                    latestInjuryEndDate = p.latestInjuryEndDate;
                    injuryHistory = p.injuryHistory;
                    retirementDate = p.retirementDate;
                    transferHistory = p.transferHistory;
                    gender = p.gender;
                  };

                  return updatedPlayer;
                };
                return p;
              },
            );

            updatedLeaguePlayersBuffer.add((dto.leagueId, updatedPlayers));
          };
          case (null) {

          };
        };
      } else {
        updatedLeaguePlayersBuffer.add(league);
      };
    };

    leaguePlayers := Buffer.toArray(updatedLeaguePlayersBuffer);
    let _ = await updateDataHash(dto.leagueId, "players");
    let _ = await notificationManager.distributeNotification(#RevaluePlayerDown, #RevaluePlayerDown { });
  };

  public shared ({ caller }) func loanPlayer(dto : PlayerCommands.LoanPlayer) : async () {
    assert Principal.toText(caller) == CanisterIds.ICFC_SNS_GOVERNANCE_CANISTER_ID;

    if (dto.leagueId == dto.loanLeagueId) {
      leaguePlayers := Array.map<(FootballIds.LeagueId, [FootballTypes.Player]), (FootballIds.LeagueId, [FootballTypes.Player])>(
        leaguePlayers,
        func(entry : (FootballIds.LeagueId, [FootballTypes.Player])) {
          if (entry.0 == dto.leagueId) {
            return (
              entry.0,
              Array.map<FootballTypes.Player, FootballTypes.Player>(
                entry.1,
                func(player : FootballTypes.Player) {
                  if (player.id == dto.playerId) {

                    let newTransferHistoryEntry : FootballTypes.TransferHistory = {
                      transferDate = Time.now();
                      fromLeagueId = dto.leagueId;
                      fromClub = player.clubId;
                      toLeagueId = dto.loanLeagueId;
                      toClub = dto.loanClubId;
                      loanEndDate = dto.loanEndDate;
                    };

                    return {
                      leagueId = player.leagueId;
                      clubId = dto.loanClubId;
                      currentLoanEndDate = dto.loanEndDate;
                      dateOfBirth = player.dateOfBirth;
                      firstName = player.firstName;
                      gender = player.gender;
                      id = player.id;
                      injuryHistory = player.injuryHistory;
                      lastName = player.lastName;
                      latestInjuryEndDate = player.latestInjuryEndDate;
                      nationality = player.nationality;
                      parentLeagueId = dto.leagueId;
                      parentClubId = player.clubId;
                      position = player.position;
                      retirementDate = player.retirementDate;
                      seasons = player.seasons;
                      shirtNumber = player.shirtNumber;
                      status = player.status;
                      transferHistory = List.append<FootballTypes.TransferHistory>(player.transferHistory, List.fromArray([newTransferHistoryEntry]));
                      valueHistory = player.valueHistory;
                      valueQuarterMillions = dto.newValueQuarterMillions;
                    };
                  } else {
                    return player;
                  };
                },
              ),
            );
          } else { return entry };
        },
      );

      let _ = await updateDataHash(dto.leagueId, "players");
      let _ = await notificationManager.distributeNotification(#LoanPlayer, #LoanPlayer {});
    } else {

      let currentLeaguePlayersSet = Array.find<(FootballIds.LeagueId, [FootballTypes.Player])>(
        leaguePlayers,
        func(playersSet : (FootballIds.LeagueId, [FootballTypes.Player])) : Bool {
          playersSet.0 == dto.leagueId;
        },
      );
      switch (currentLeaguePlayersSet) {
        case (?playerSet) {
          let loanPlayer = Array.find<FootballTypes.Player>(
            playerSet.1,
            func(player : FootballTypes.Player) : Bool {
              return player.id == dto.playerId;
            },
          );

          switch (loanPlayer) {
            case (?player) {

              leaguePlayers := Array.map<(FootballIds.LeagueId, [FootballTypes.Player]), (FootballIds.LeagueId, [FootballTypes.Player])>(
                leaguePlayers,
                func(entry : (FootballIds.LeagueId, [FootballTypes.Player])) {
                  if (entry.0 == dto.leagueId) {
                    return (
                      entry.0,
                      Array.filter<FootballTypes.Player>(
                        entry.1,
                        func(foundPlayer : FootballTypes.Player) {
                          foundPlayer.id != dto.playerId;
                        },
                      ),
                    );
                  } else if (entry.0 == dto.loanLeagueId) {

                    let newTransferHistoryEntry : FootballTypes.TransferHistory = {
                      transferDate = Time.now();
                      fromLeagueId = dto.leagueId;
                      fromClub = player.clubId;
                      toLeagueId = dto.loanLeagueId;
                      toClub = dto.loanClubId;
                      loanEndDate = dto.loanEndDate;
                    };

                    let updatedPlayersBuffer = Buffer.fromArray<FootballTypes.Player>(entry.1);

                    updatedPlayersBuffer.add({
                      leagueId = dto.loanLeagueId;
                      clubId = dto.loanClubId;
                      currentLoanEndDate = dto.loanEndDate;
                      dateOfBirth = player.dateOfBirth;
                      firstName = player.firstName;
                      gender = player.gender;
                      id = player.id;
                      injuryHistory = player.injuryHistory;
                      lastName = player.lastName;
                      latestInjuryEndDate = player.latestInjuryEndDate;
                      nationality = player.nationality;
                      parentClubId = player.clubId;
                      parentLeagueId = player.leagueId;
                      position = player.position;
                      retirementDate = player.retirementDate;
                      seasons = player.seasons;
                      shirtNumber = player.shirtNumber;
                      status = player.status;
                      transferHistory = List.append<FootballTypes.TransferHistory>(player.transferHistory, List.fromArray([newTransferHistoryEntry]));
                      valueHistory = player.valueHistory;
                      valueQuarterMillions = dto.newValueQuarterMillions;
                    });
                    return (entry.0, Buffer.toArray(updatedPlayersBuffer));
                  } else { return entry };
                },
              );

              let loanTimerDuration = #nanoseconds(Int.abs((dto.loanEndDate - Time.now())));
              let _ = setTimer(loanTimerDuration, "loanExpired");

              let _ = await updateDataHash(dto.leagueId, "players");
              let _ = await updateDataHash(dto.loanLeagueId, "players");
              
              let _ = await notificationManager.distributeNotification(#LoanPlayer, #LoanPlayer { });

            };
            case (null) {};
          };
        };
        case (null) {};
      };
    };
  };

  public shared ({ caller }) func transferPlayer(dto : PlayerCommands.TransferPlayer) : async () {
    assert Principal.toText(caller) == CanisterIds.ICFC_SNS_GOVERNANCE_CANISTER_ID;

    if (dto.newClubId == 0 and dto.newLeagueId == 0) {
      movePlayerToFreeAgents(dto.leagueId, dto.playerId, dto.newValueQuarterMillions);
      let _ = await updateDataHash(dto.leagueId, "players");
      return;
    };

    if (dto.newLeagueId == dto.leagueId) {
      movePlayerWithinLeague(dto.leagueId, dto.newClubId, dto.playerId, dto.newShirtNumber, dto.newValueQuarterMillions);
      let _ = await updateDataHash(dto.leagueId, "players");
      return;
    };

    movePlayerToLeague(dto.leagueId, dto.newLeagueId, dto.newClubId, dto.playerId, dto.newShirtNumber);
    let _ = await updateDataHash(dto.leagueId, "players");
    let _ = await notificationManager.distributeNotification(#TransferPlayer, #TransferPlayer {  });
  };

  public shared ({ caller }) func setFreeAgent(dto : PlayerCommands.SetFreeAgent) : async () {
    assert Principal.toText(caller) == CanisterIds.ICFC_SNS_GOVERNANCE_CANISTER_ID;

    movePlayerToFreeAgents(dto.leagueId, dto.playerId, dto.newValueQuarterMillions);
    let _ = await updateDataHash(dto.leagueId, "players");
    let _ = await notificationManager.distributeNotification(#SetFreeAgent, #SetFreeAgent {  });

  };

  public shared ({ caller }) func recallPlayer(dto : PlayerCommands.RecallPlayer) : async () {
    assert Principal.toText(caller) == CanisterIds.ICFC_SNS_GOVERNANCE_CANISTER_ID;

    let fromPlayerLeagueResult = Array.find(
      leaguePlayers,
      func(entry : (FootballIds.LeagueId, [FootballTypes.Player])) : Bool {
        entry.0 == dto.leagueId;
      },
    );

    switch (fromPlayerLeagueResult) {
      case (?foundLeaguePlayers) {
        let foundPlayer = Array.find<FootballTypes.Player>(
          foundLeaguePlayers.1,
          func(entry : FootballTypes.Player) : Bool {
            entry.id == dto.playerId;
          },
        );
        switch (foundPlayer) {
          case (?player) {
            leaguePlayers := Array.map<(FootballIds.LeagueId, [FootballTypes.Player]), (FootballIds.LeagueId, [FootballTypes.Player])>(
              leaguePlayers,
              func(entry : (FootballIds.LeagueId, [FootballTypes.Player])) {
                if (entry.0 == dto.leagueId and dto.leagueId == player.parentLeagueId) {
                  return (
                    entry.0,
                    Array.map<FootballTypes.Player, FootballTypes.Player>(
                      entry.1,
                      func(playerEntry : FootballTypes.Player) {
                        if (playerEntry.id == player.id) {
                          return {
                            clubId = playerEntry.parentClubId;
                            currentLoanEndDate = 0;
                            dateOfBirth = playerEntry.dateOfBirth;
                            firstName = playerEntry.firstName;
                            gender = playerEntry.gender;
                            id = playerEntry.id;
                            injuryHistory = playerEntry.injuryHistory;
                            lastName = playerEntry.lastName;
                            latestInjuryEndDate = playerEntry.latestInjuryEndDate;
                            leagueId = playerEntry.leagueId;
                            nationality = playerEntry.nationality;
                            parentClubId = 0;
                            parentLeagueId = 0;
                            position = playerEntry.position;
                            retirementDate = playerEntry.retirementDate;
                            seasons = playerEntry.seasons;
                            shirtNumber = playerEntry.shirtNumber;
                            status = playerEntry.status;
                            transferHistory = playerEntry.transferHistory;
                            valueHistory = playerEntry.valueHistory;
                            valueQuarterMillions = playerEntry.valueQuarterMillions;
                          };
                        } else {
                          return playerEntry;
                        };
                      },
                    ),
                  );
                } else if (entry.0 == dto.leagueId) {
                  return (
                    entry.0,
                    Array.filter<FootballTypes.Player>(
                      entry.1,
                      func(playerEntry : FootballTypes.Player) {
                        playerEntry.id != player.id;
                      },
                    ),
                  );
                } else if (entry.0 == player.parentLeagueId) {
                  let playerBuffer = Buffer.fromArray<FootballTypes.Player>(entry.1);
                  playerBuffer.add({
                    clubId = player.parentClubId;
                    currentLoanEndDate = 0;
                    dateOfBirth = player.dateOfBirth;
                    firstName = player.firstName;
                    gender = player.gender;
                    id = player.id;
                    injuryHistory = player.injuryHistory;
                    lastName = player.lastName;
                    latestInjuryEndDate = player.latestInjuryEndDate;
                    leagueId = player.parentLeagueId;
                    nationality = player.nationality;
                    parentClubId = 0;
                    parentLeagueId = 0;
                    position = player.position;
                    retirementDate = player.retirementDate;
                    seasons = player.seasons;
                    shirtNumber = player.shirtNumber;
                    status = #Active;
                    transferHistory = player.transferHistory;
                    valueHistory = player.valueHistory;
                    valueQuarterMillions = player.valueQuarterMillions;
                  });
                  return (entry.0, Buffer.toArray(playerBuffer));
                } else {
                  return entry;
                };
              },
            );

            let _ = await notificationManager.distributeNotification(#RecallPlayer, #RecallPlayer {  });
          };
          case (null) {};
        };
      };
      case (null) {};
    };
  };

  public shared ({ caller }) func createPlayer(dto : PlayerCommands.CreatePlayer) : async () {
    assert Principal.toText(caller) == CanisterIds.ICFC_SNS_GOVERNANCE_CANISTER_ID;

    let foundLeague = Array.find<FootballTypes.League>(
      leagues,
      func(league : FootballTypes.League) : Bool {
        league.id == dto.leagueId;
      },
    );

    switch (foundLeague) {
      case (?league) {

        let newPlayer : FootballTypes.Player = {
          id = nextPlayerId;
          leagueId = dto.leagueId;
          clubId = dto.clubId;
          position = dto.position;
          firstName = dto.firstName;
          lastName = dto.lastName;
          shirtNumber = dto.shirtNumber;
          valueQuarterMillions = dto.valueQuarterMillions;
          dateOfBirth = dto.dateOfBirth;
          nationality = dto.nationality;
          seasons = List.nil<FootballTypes.PlayerSeason>();
          valueHistory = List.nil<FootballTypes.ValueHistory>();
          status = #Active;
          parentLeagueId = 0;
          parentClubId = 0;
          currentLoanEndDate = 0;
          latestInjuryEndDate = 0;
          injuryHistory = List.nil<FootballTypes.InjuryHistory>();
          retirementDate = 0;
          transferHistory = List.nil<FootballTypes.TransferHistory>();
          gender = league.relatedGender;
        };

        leaguePlayers := Array.map<(FootballIds.LeagueId, [FootballTypes.Player]), (FootballIds.LeagueId, [FootballTypes.Player])>(
          leaguePlayers,
          func(leaguePlayersEntry : (FootballIds.LeagueId, [FootballTypes.Player])) {
            if (leaguePlayersEntry.0 == dto.leagueId) {
              let updatedPlayersBuffer = Buffer.fromArray<FootballTypes.Player>(leaguePlayersEntry.1);
              updatedPlayersBuffer.add(newPlayer);
              return (leaguePlayersEntry.0, Buffer.toArray(updatedPlayersBuffer));
            } else {
              return leaguePlayersEntry;
            };
          },
        );

        nextPlayerId += 1;
        let _ = await updateDataHash(dto.leagueId, "players");
        let _ = await notificationManager.distributeNotification(#CreatePlayer, #CreatePlayer {  });

      };
      case (null) {};
    };
  };

  public shared ({ caller }) func updatePlayer(dto : PlayerCommands.UpdatePlayer) : async () {
    assert Principal.toText(caller) == CanisterIds.ICFC_SNS_GOVERNANCE_CANISTER_ID;

    var positionUpdated = false;

    leaguePlayers := Array.map<(FootballIds.LeagueId, [FootballTypes.Player]), (FootballIds.LeagueId, [FootballTypes.Player])>(
      leaguePlayers,
      func(leaguePlayersEntry : (FootballIds.LeagueId, [FootballTypes.Player])) {
        if (leaguePlayersEntry.0 == dto.leagueId) {

          let existingPlayer = Array.find<FootballTypes.Player>(
            leaguePlayersEntry.1,
            func(player : FootballTypes.Player) : Bool {
              player.id == dto.playerId;
            },
          );

          let updatedPlayersBuffer = Buffer.fromArray<FootballTypes.Player>(
            Array.filter<FootballTypes.Player>(
              leaguePlayersEntry.1,
              func(player : FootballTypes.Player) : Bool {
                player.id != dto.playerId;
              },
            )
          );

          switch (existingPlayer) {
            case (?currentPlayer) {
              if (currentPlayer.position != dto.position) {
                positionUpdated := true;
              };
              let updatedPlayer : FootballTypes.Player = {
                id = currentPlayer.id;
                leagueId = currentPlayer.leagueId;
                clubId = currentPlayer.clubId;
                position = dto.position;
                firstName = dto.firstName;
                lastName = dto.lastName;
                shirtNumber = dto.shirtNumber;
                valueQuarterMillions = currentPlayer.valueQuarterMillions;
                dateOfBirth = dto.dateOfBirth;
                nationality = dto.nationality;
                seasons = currentPlayer.seasons;
                valueHistory = currentPlayer.valueHistory;
                status = currentPlayer.status;
                parentLeagueId = currentPlayer.parentLeagueId;
                parentClubId = currentPlayer.parentClubId;
                currentLoanEndDate = currentPlayer.currentLoanEndDate;
                latestInjuryEndDate = currentPlayer.latestInjuryEndDate;
                injuryHistory = currentPlayer.injuryHistory;
                retirementDate = currentPlayer.retirementDate;
                transferHistory = currentPlayer.transferHistory;
                gender = currentPlayer.gender;
              };
              updatedPlayersBuffer.add(updatedPlayer);

            };
            case (null) {

            };
          };

          return (leaguePlayersEntry.0, Buffer.toArray(updatedPlayersBuffer));
        } else {
          return leaguePlayersEntry;
        };
      },
    );

    if (positionUpdated) {
      let _ = await notificationManager.distributeNotification(#ChangePlayerPosition, #ChangePlayerPosition {  });
    };

    let _ = await updateDataHash(dto.leagueId, "players");
  };

  public shared ({ caller }) func setPlayerInjury(dto : PlayerCommands.SetPlayerInjury) : async () {
    assert Principal.toText(caller) == CanisterIds.ICFC_SNS_GOVERNANCE_CANISTER_ID;

    leaguePlayers := Array.map<(FootballIds.LeagueId, [FootballTypes.Player]), (FootballIds.LeagueId, [FootballTypes.Player])>(
      leaguePlayers,
      func(leaguePlayersEntry : (FootballIds.LeagueId, [FootballTypes.Player])) {
        if (leaguePlayersEntry.0 == dto.leagueId) {

          let existingPlayer = Array.find<FootballTypes.Player>(
            leaguePlayersEntry.1,
            func(player : FootballTypes.Player) : Bool {
              player.id == dto.playerId;
            },
          );

          let updatedPlayersBuffer = Buffer.fromArray<FootballTypes.Player>(
            Array.filter<FootballTypes.Player>(
              leaguePlayersEntry.1,
              func(player : FootballTypes.Player) : Bool {
                player.id != dto.playerId;
              },
            )
          );

          switch (existingPlayer) {
            case (?currentPlayer) {

              let injuryHistoryEntry : FootballTypes.InjuryHistory = {
                description = dto.description;
                injuryStartDate = Time.now();
                expectedEndDate = dto.expectedEndDate;
              };

              let updatedPlayer : FootballTypes.Player = {
                id = currentPlayer.id;
                leagueId = currentPlayer.leagueId;
                clubId = currentPlayer.clubId;
                position = currentPlayer.position;
                firstName = currentPlayer.firstName;
                lastName = currentPlayer.lastName;
                shirtNumber = currentPlayer.shirtNumber;
                valueQuarterMillions = currentPlayer.valueQuarterMillions;
                dateOfBirth = currentPlayer.dateOfBirth;
                nationality = currentPlayer.nationality;
                seasons = currentPlayer.seasons;
                valueHistory = currentPlayer.valueHistory;
                status = currentPlayer.status;
                parentLeagueId = currentPlayer.parentLeagueId;
                parentClubId = currentPlayer.parentClubId;
                currentLoanEndDate = currentPlayer.currentLoanEndDate;
                latestInjuryEndDate = currentPlayer.latestInjuryEndDate;
                injuryHistory = List.append<FootballTypes.InjuryHistory>(currentPlayer.injuryHistory, List.fromArray([injuryHistoryEntry]));
                retirementDate = currentPlayer.retirementDate;
                transferHistory = currentPlayer.transferHistory;
                gender = currentPlayer.gender;
              };
              updatedPlayersBuffer.add(updatedPlayer);

            };
            case (null) {

            };
          };

          return (leaguePlayersEntry.0, Buffer.toArray(updatedPlayersBuffer));

        } else {
          return leaguePlayersEntry;
        };
      },
    );

    let playerInjuryDuration = #nanoseconds(Int.abs((dto.expectedEndDate - Time.now())));
    let _ = await setTimer(playerInjuryDuration, "injuryExpired");
    let _ = await updateDataHash(dto.leagueId, "players");
    let _ = await notificationManager.distributeNotification(#InjuryUpdated, #InjuryUpdated {  });
  };

  public shared ({ caller }) func retirePlayer(dto : PlayerCommands.RetirePlayer) : async () {
    assert Principal.toText(caller) == CanisterIds.ICFC_SNS_GOVERNANCE_CANISTER_ID;

    leaguePlayers := Array.map<(FootballIds.LeagueId, [FootballTypes.Player]), (FootballIds.LeagueId, [FootballTypes.Player])>(
      leaguePlayers,
      func(leaguePlayersEntry : (FootballIds.LeagueId, [FootballTypes.Player])) {
        if (leaguePlayersEntry.0 == dto.leagueId) {

          let retiredLeague = Array.find<(FootballIds.LeagueId, [FootballTypes.Player])>(
            retiredLeaguePlayers,
            func(entry : (FootballIds.LeagueId, [FootballTypes.Player])) : Bool {
              entry.0 == dto.leagueId;
            },
          );

          if (Option.isNull(retiredLeague)) {
            let retiredLeaguesBuffer = Buffer.fromArray<(FootballIds.LeagueId, [FootballTypes.Player])>(retiredLeaguePlayers);
            retiredLeaguesBuffer.add(dto.leagueId, []);
            retiredLeaguePlayers := Buffer.toArray(retiredLeaguesBuffer);
          };

          retiredLeaguePlayers := Array.map<(FootballIds.LeagueId, [FootballTypes.Player]), (FootballIds.LeagueId, [FootballTypes.Player])>(
            retiredLeaguePlayers,
            func(retiredPlayersEntry : (FootballIds.LeagueId, [FootballTypes.Player])) {
              return retiredPlayersEntry;
            },
          );

          return (
            leaguePlayersEntry.0,
            Array.filter<FootballTypes.Player>(
              leaguePlayersEntry.1,
              func(player : FootballTypes.Player) {
                player.id != dto.playerId;
              },
            ),
          );
        } else {
          return leaguePlayersEntry;
        };
      },
    );
    let _ = await updateDataHash(dto.leagueId, "players");
    let _ = await notificationManager.distributeNotification(#RetirePlayer, #RetirePlayer {  });
  };

  public shared ({ caller }) func unretirePlayer(dto : PlayerCommands.UnretirePlayer) : async () {
    assert Principal.toText(caller) == CanisterIds.ICFC_SNS_GOVERNANCE_CANISTER_ID;

    let leagueRetiredPlayers = Array.find<(FootballIds.LeagueId, [FootballTypes.Player])>(
      retiredLeaguePlayers,
      func(entry : (FootballIds.LeagueId, [FootballTypes.Player])) : Bool {
        entry.0 == dto.leagueId;
      },
    );

    switch (leagueRetiredPlayers) {
      case (?foundPlayers) {

        let playerResult = Array.find<FootballTypes.Player>(
          foundPlayers.1,
          func(player : FootballTypes.Player) : Bool {
            player.id == dto.playerId;
          },
        );

        switch (playerResult) {
          case (?foundPlayer) {

            retiredLeaguePlayers := Array.map<(FootballIds.LeagueId, [FootballTypes.Player]), (FootballIds.LeagueId, [FootballTypes.Player])>(
              retiredLeaguePlayers,
              func(leaguePlayersEntry : (FootballIds.LeagueId, [FootballTypes.Player])) {
                if (leaguePlayersEntry.0 == foundPlayer.leagueId) {

                  return (
                    leaguePlayersEntry.0,
                    Array.filter<FootballTypes.Player>(
                      leaguePlayersEntry.1,
                      func(player : FootballTypes.Player) {
                        player.id == dto.playerId;
                      },
                    ),
                  );
                } else {
                  return leaguePlayersEntry;
                };
              },
            );

            leaguePlayers := Array.map<(FootballIds.LeagueId, [FootballTypes.Player]), (FootballIds.LeagueId, [FootballTypes.Player])>(
              leaguePlayers,
              func(leaguePlayersEntry : (FootballIds.LeagueId, [FootballTypes.Player])) {
                if (leaguePlayersEntry.0 == foundPlayer.leagueId) {
                  let leaguePlayersBuffer = Buffer.fromArray<FootballTypes.Player>(leaguePlayersEntry.1);
                  leaguePlayersBuffer.add({
                    clubId = foundPlayer.clubId;
                    currentLoanEndDate = 0;
                    dateOfBirth = foundPlayer.dateOfBirth;
                    firstName = foundPlayer.firstName;
                    gender = foundPlayer.gender;
                    id = foundPlayer.id;
                    injuryHistory = foundPlayer.injuryHistory;
                    lastName = foundPlayer.lastName;
                    latestInjuryEndDate = foundPlayer.latestInjuryEndDate;
                    leagueId = foundPlayer.leagueId;
                    nationality = foundPlayer.nationality;
                    parentClubId = 0;
                    parentLeagueId = 0;
                    position = foundPlayer.position;
                    retirementDate = 0;
                    seasons = foundPlayer.seasons;
                    shirtNumber = foundPlayer.shirtNumber;
                    status = foundPlayer.status;
                    transferHistory = foundPlayer.transferHistory;
                    valueHistory = foundPlayer.valueHistory;
                    valueQuarterMillions = dto.newValueQuarterMillions;
                  });
                  return (leaguePlayersEntry.0, Buffer.toArray(leaguePlayersBuffer));
                } else {
                  return leaguePlayersEntry;
                };
              },
            );

            let _ = await updateDataHash(dto.leagueId, "players");
    let _ = await notificationManager.distributeNotification(#UnretirePlayer, #UnretirePlayer {  });
          };
          case (null) {

          };
        };
      };
      case (null) {};
    };
  };

  /* League */

  public shared ({ caller }) func createLeague(dto : LeagueCommands.CreateLeague) : async () {
    assert Principal.toText(caller) == CanisterIds.ICFC_SNS_GOVERNANCE_CANISTER_ID;

    var logo : Blob = Blob.fromArray([]);

    switch (dto.logo) {
      case (?foundLogo) {
        if (Array.size(Blob.toArray(foundLogo)) > 0) {
          logo := foundLogo;
        };
      };
      case (null) {};
    };

    let leaguesBuffer = Buffer.fromArray<FootballTypes.League>(leagues);
    leaguesBuffer.add({
      abbreviation = dto.abbreviation;
      countryId = dto.countryId;
      formed = dto.formed;
      governingBody = dto.governingBody;
      id = nextLeagueId;
      logo = logo;
      name = dto.name;
      teamCount = dto.teamCount;
      relatedGender = dto.relatedGender;
    });

    leagues := Buffer.toArray(leaguesBuffer);

    let leagueSeasonsBuffer = Buffer.fromArray<(FootballIds.LeagueId, [FootballTypes.Season])>(leagueSeasons);
    let leaguesClubsBuffer = Buffer.fromArray<(FootballIds.LeagueId, [FootballTypes.Club])>(leagueClubs);
    let leaguePlayersBuffer = Buffer.fromArray<(FootballIds.LeagueId, [FootballTypes.Player])>(leaguePlayers);

    leagueSeasonsBuffer.add((nextLeagueId, []));
    leaguesClubsBuffer.add((nextLeagueId, []));
    leaguePlayersBuffer.add((nextLeagueId, []));

    leagueSeasons := Buffer.toArray(leagueSeasonsBuffer);
    leagueClubs := Buffer.toArray(leaguesClubsBuffer);
    leaguePlayers := Buffer.toArray(leaguePlayersBuffer);

    nextLeagueId += 1;
    let _ = await notificationManager.distributeNotification(#CreateLeague, #CreateLeague {  });
  };

  public shared ({ caller }) func updateLeague(dto : LeagueCommands.UpdateLeague) : async () {
    assert Principal.toText(caller) == CanisterIds.ICFC_SNS_GOVERNANCE_CANISTER_ID;

    let league = Array.find<FootballTypes.League>(
      leagues,
      func(currentLeague : FootballTypes.League) : Bool {
        currentLeague.id == dto.leagueId;
      },
    );

    switch (league) {
      case (?_) {
        leagues := Array.map<FootballTypes.League, FootballTypes.League>(
          leagues,
          func(currentLeague : FootballTypes.League) {
            if (currentLeague.id == dto.leagueId) {
              return {
                abbreviation = dto.abbreviation;
                countryId = dto.countryId;
                formed = dto.formed;
                governingBody = dto.governingBody;
                id = currentLeague.id;
                logo = dto.logo;
                name = dto.name;
                relatedGender = dto.relatedGender;
                teamCount = dto.teamCount;
              };
            } else {
              return currentLeague;
            };
          },
        );
      };
      case (null) {};
    };
    let _ = await notificationManager.distributeNotification(#UpdateLeague, #UpdateLeague {  });
  };

  public shared ({ caller }) func addInitialFixtures(dto : FixtureCommands.AddInitialFixtures) : async () {
    assert Principal.toText(caller) == CanisterIds.ICFC_SNS_GOVERNANCE_CANISTER_ID;

    leagueSeasons := Array.map<(FootballIds.LeagueId, [FootballTypes.Season]), (FootballIds.LeagueId, [FootballTypes.Season])>(
      leagueSeasons,
      func(leagueSeasonEntry : (FootballIds.LeagueId, [FootballTypes.Season])) {
        if (leagueSeasonEntry.0 == dto.leagueId) {
          return (
            leagueSeasonEntry.0,
            Array.map<FootballTypes.Season, FootballTypes.Season>(
              leagueSeasonEntry.1,
              func(seasonEntry : FootballTypes.Season) {
                if (seasonEntry.id == dto.seasonId) {
                  return {
                    fixtures = List.fromArray(
                      Array.map<FixtureCommands.InitialFixture, FootballTypes.Fixture>(
                        dto.seasonFixtures,
                        func(fixtureEntry : FixtureCommands.InitialFixture) {
                          return {
                            awayClubId = fixtureEntry.awayClubId;
                            awayGoals = 0;
                            events = List.nil();
                            gameweek = fixtureEntry.gameweek;
                            highestScoringPlayerId = 0;
                            homeClubId = fixtureEntry.homeClubId;
                            homeGoals = 0;
                            id = 0; // TODO: Need to write the league id logic for incrementing this
                            kickOff = fixtureEntry.kickOff;
                            seasonId = seasonEntry.id;
                            status = #Unplayed;

                          };
                        },
                      )
                    );
                    id = seasonEntry.id;
                    name = seasonEntry.name;
                    postponedFixtures = List.nil();
                    year = seasonEntry.year;

                  };
                } else {
                  return seasonEntry;
                };
              },
            ),
          );
        } else {
          return leagueSeasonEntry;
        };
      },
    );
    let _ = await updateDataHash(dto.leagueId, "fixtures");
    await createFixtureTimers();
    let _ = await notificationManager.distributeNotification(#AddInitialFixtures, #AddInitialFixtures {  });
  };

  public shared ({ caller }) func moveFixture(dto : FixtureCommands.MoveFixture) : async () {
    assert Principal.toText(caller) == CanisterIds.ICFC_SNS_GOVERNANCE_CANISTER_ID;

    leagueSeasons := Array.map<(FootballIds.LeagueId, [FootballTypes.Season]), (FootballIds.LeagueId, [FootballTypes.Season])>(
      leagueSeasons,
      func(leagueSeasonEntry : (FootballIds.LeagueId, [FootballTypes.Season])) {
        if (leagueSeasonEntry.0 == dto.leagueId) {
          return (
            leagueSeasonEntry.0,
            Array.map<FootballTypes.Season, FootballTypes.Season>(
              leagueSeasonEntry.1,
              func(season : FootballTypes.Season) {
                if (season.id == dto.seasonId) {
                  return {
                    fixtures = List.map<FootballTypes.Fixture, FootballTypes.Fixture>(
                      season.fixtures,
                      func(fixture : FootballTypes.Fixture) {
                        if (fixture.id == dto.fixtureId) {
                          return {
                            awayClubId = fixture.awayClubId;
                            awayGoals = fixture.awayGoals;
                            events = fixture.events;
                            gameweek = dto.updatedFixtureGameweek;
                            highestScoringPlayerId = fixture.highestScoringPlayerId;
                            homeClubId = fixture.homeClubId;
                            homeGoals = fixture.homeGoals;
                            id = fixture.id;
                            kickOff = dto.updatedFixtureDate;
                            seasonId = fixture.seasonId;
                            status = fixture.status;
                          };
                        } else {
                          return fixture;
                        };
                      },
                    );
                    id = season.id;
                    name = season.name;
                    postponedFixtures = season.postponedFixtures;
                    year = season.year;
                  };
                } else {
                  return season;
                };
              },
            ),
          );
        } else { return leagueSeasonEntry };
      },
    );
    await createFixtureTimers();
    let _ = await updateDataHash(dto.leagueId, "fixtures");
  };

  public shared ({ caller }) func postponeFixture(dto : FixtureCommands.PostponeFixture) : async () {
    assert Principal.toText(caller) == CanisterIds.ICFC_SNS_GOVERNANCE_CANISTER_ID;

    leagueSeasons := Array.map<(FootballIds.LeagueId, [FootballTypes.Season]), (FootballIds.LeagueId, [FootballTypes.Season])>(
      leagueSeasons,
      func(leagueSeasonEntry : (FootballIds.LeagueId, [FootballTypes.Season])) {
        if (leagueSeasonEntry.0 == dto.leagueId) {
          return (
            leagueSeasonEntry.0,
            Array.map<FootballTypes.Season, FootballTypes.Season>(
              leagueSeasonEntry.1,
              func(season : FootballTypes.Season) {
                if (season.id == dto.seasonId) {
                  let foundFixture = List.find<FootballTypes.Fixture>(
                    season.fixtures,
                    func(fixture : FootballTypes.Fixture) : Bool {
                      fixture.id == dto.fixtureId;
                    },
                  );
                  switch (foundFixture) {
                    case (?fixture) {
                      return {

                        fixtures = List.filter<FootballTypes.Fixture>(
                          season.fixtures,
                          func(fixture : FootballTypes.Fixture) {
                            fixture.id != dto.fixtureId;
                          },
                        );
                        id = season.id;
                        name = season.name;
                        postponedFixtures = List.append<FootballTypes.Fixture>(season.postponedFixtures, List.make<FootballTypes.Fixture>({ awayClubId = fixture.awayClubId; awayGoals = fixture.awayGoals; events = fixture.events; gameweek = fixture.gameweek; highestScoringPlayerId = fixture.highestScoringPlayerId; homeClubId = fixture.homeClubId; homeGoals = fixture.homeGoals; id = fixture.id; kickOff = fixture.kickOff; seasonId = fixture.seasonId; status = fixture.status }));
                        year = season.year;
                      };
                    };
                    case (null) {
                      return season;
                    };
                  };
                } else {
                  return season;
                };
              },
            ),
          );
        } else { return leagueSeasonEntry };
      },
    );
    await createFixtureTimers();
    let _ = await updateDataHash(dto.leagueId, "fixtures");
  };

  public shared ({ caller }) func rescheduleFixture(dto : FixtureCommands.RescheduleFixture) : async () {
    assert Principal.toText(caller) == CanisterIds.ICFC_SNS_GOVERNANCE_CANISTER_ID;

    leagueSeasons := Array.map<(FootballIds.LeagueId, [FootballTypes.Season]), (FootballIds.LeagueId, [FootballTypes.Season])>(
      leagueSeasons,
      func(leagueSeasonEntry : (FootballIds.LeagueId, [FootballTypes.Season])) {
        if (leagueSeasonEntry.0 == dto.leagueId) {
          return (
            leagueSeasonEntry.0,
            Array.map<FootballTypes.Season, FootballTypes.Season>(
              leagueSeasonEntry.1,
              func(season : FootballTypes.Season) {
                if (season.id == dto.seasonId) {
                  let foundFixture = List.find<FootballTypes.Fixture>(
                    season.postponedFixtures,
                    func(fixture : FootballTypes.Fixture) : Bool {
                      fixture.id == dto.fixtureId;
                    },
                  );
                  switch (foundFixture) {
                    case (?fixture) {
                      return {
                        fixtures = List.append<FootballTypes.Fixture>(season.fixtures, List.make<FootballTypes.Fixture>({ awayClubId = fixture.awayClubId; awayGoals = fixture.awayGoals; events = fixture.events; gameweek = dto.updatedFixtureGameweek; highestScoringPlayerId = fixture.highestScoringPlayerId; homeClubId = fixture.homeClubId; homeGoals = fixture.homeGoals; id = fixture.id; kickOff = dto.updatedFixtureDate; seasonId = fixture.seasonId; status = fixture.status }));
                        id = season.id;
                        name = season.name;
                        postponedFixtures = List.filter<FootballTypes.Fixture>(
                          season.postponedFixtures,
                          func(fixture : FootballTypes.Fixture) {
                            fixture.id != dto.fixtureId;
                          },
                        );
                        year = season.year;
                      };
                    };
                    case (null) {
                      return season;
                    };
                  };
                } else {
                  return season;
                };
              },
            ),
          );
        } else { return leagueSeasonEntry };
      },
    );
    await createFixtureTimers();
    let _ = await updateDataHash(dto.leagueId, "fixtures");
  };

  public shared ({ caller }) func submitFixtureData(dto : FixtureCommands.SubmitFixtureData) : async () {
    assert Principal.toText(caller) == CanisterIds.ICFC_SNS_GOVERNANCE_CANISTER_ID;

    let leaguePlayerArray = Array.find<(FootballIds.LeagueId, [FootballTypes.Player])>(
      leaguePlayers,
      func(leaguePlayersArray : (FootballIds.LeagueId, [FootballTypes.Player])) : Bool {
        return leaguePlayersArray.0 == dto.leagueId;
      },
    );
    switch (leaguePlayerArray) {
      case (?foundArray) {
        let players = foundArray.1;
        let populatedPlayerEvents = await populatePlayerEventData(dto, players);
        switch (populatedPlayerEvents) {
          case (null) {};
          case (?events) {
            addEventsToFixture(dto.leagueId, events, dto.seasonId, dto.fixtureId);
            addEventsToPlayers(dto.leagueId, events, dto.seasonId, dto.gameweek, dto.fixtureId);
            var highestScoringPlayerId : Nat16 = 0;
            let highestScoringPlayerEvent = Array.find<FootballTypes.PlayerEventData>(
              events,
              func(event : FootballTypes.PlayerEventData) : Bool {
                event.eventType == #HighestScoringPlayer;
              },
            );
            switch (highestScoringPlayerEvent) {
              case (?foundEvent) {
                highestScoringPlayerId := foundEvent.playerId;
              };
              case (null) {

              };
            };
            await finaliseFixture(dto.leagueId, dto.seasonId, dto.gameweek, dto.fixtureId, highestScoringPlayerId);
            populateClubSummaries();
            await checkSeasonComplete(dto.leagueId, dto.seasonId);
            let _ = await updateDataHash(dto.leagueId, "fixtures");
            let _ = await updateDataHash(dto.leagueId, "players");
            let _ = await updateDataHash(dto.leagueId, "player_events");
            let _ = await notificationManager.distributeNotification(#FinaliseFixture, #FinaliseFixture {  });
          };
        };
      };
      case (null) {};
    };
  };

  /* Club */

  public shared ({ caller }) func createClub(dto : ClubCommands.CreateClub) : async () {
    assert Principal.toText(caller) == CanisterIds.ICFC_SNS_GOVERNANCE_CANISTER_ID;

    let leagueResult = Array.find<FootballTypes.League>(
      leagues,
      func(league : FootballTypes.League) : Bool {
        league.id == dto.leagueId;
      },
    );

    switch (leagueResult) {
      case (?_) {
        leagueClubs := Array.map<(FootballIds.LeagueId, [FootballTypes.Club]), (FootballIds.LeagueId, [FootballTypes.Club])>(
          leagueClubs,
          func(leagueEntry : (FootballIds.LeagueId, [FootballTypes.Club])) {
            if (leagueEntry.0 == dto.leagueId) {
              let updatedClubsBuffer = Buffer.fromArray<FootballTypes.Club>(leagueEntry.1);
              updatedClubsBuffer.add({
                abbreviatedName = dto.abbreviatedName;
                friendlyName = dto.friendlyName;
                id = nextClubId;
                name = dto.name;
                primaryColourHex = dto.primaryColourHex;
                secondaryColourHex = dto.secondaryColourHex;
                shirtType = dto.shirtType;
                thirdColourHex = dto.thirdColourHex;
              });
              nextClubId += 1;
              addRequireStatusToClub(leagueEntry.0, nextClubId);
              return (leagueEntry.0, Buffer.toArray(updatedClubsBuffer));
            } else {
              return leagueEntry;
            };
          },
        );
      };
      case (null) {};
    };
    let _ = await updateDataHash(dto.leagueId, "clubs");
  };

  public shared ({ caller }) func updateClub(dto : ClubCommands.UpdateClub) : async () {
    assert Principal.toText(caller) == CanisterIds.ICFC_SNS_GOVERNANCE_CANISTER_ID;

    let leagueResult = Array.find<FootballTypes.League>(
      leagues,
      func(league : FootballTypes.League) : Bool {
        league.id == dto.leagueId;
      },
    );

    switch (leagueResult) {
      case (?_) {
        leagueClubs := Array.map<(FootballIds.LeagueId, [FootballTypes.Club]), (FootballIds.LeagueId, [FootballTypes.Club])>(
          leagueClubs,
          func(leagueEntry : (FootballIds.LeagueId, [FootballTypes.Club])) {
            if (leagueEntry.0 == dto.leagueId) {
              let updatedClubsBuffer = Buffer.fromArray<FootballTypes.Club>(
                Array.filter<FootballTypes.Club>(
                  leagueEntry.1,
                  func(club : FootballTypes.Club) {
                    club.id != dto.clubId;
                  },
                )
              );
              updatedClubsBuffer.add({
                abbreviatedName = dto.abbreviatedName;
                friendlyName = dto.friendlyName;
                id = nextClubId;
                name = dto.name;
                primaryColourHex = dto.primaryColourHex;
                secondaryColourHex = dto.secondaryColourHex;
                shirtType = dto.shirtType;
                thirdColourHex = dto.thirdColourHex;
              });
              return (leagueEntry.0, Buffer.toArray(updatedClubsBuffer));
            } else {
              return leagueEntry;
            };
          },
        );
      };
      case (null) {};
    };
    let _ = await updateDataHash(dto.leagueId, "clubs");
  };

  /* Private Functions */

  private func finaliseFixture(leagueId : FootballIds.LeagueId, seasonId : FootballIds.SeasonId, gameweek : FootballDefinitions.GameweekNumber, fixtureId : FootballIds.FixtureId, highestScoringPlayerId : FootballIds.PlayerId) : async () {
    leagueSeasons := Array.map<(FootballIds.LeagueId, [FootballTypes.Season]), (FootballIds.LeagueId, [FootballTypes.Season])>(
      leagueSeasons,
      func(leagueSeasonsEntry : (FootballIds.LeagueId, [FootballTypes.Season])) {
        if (leagueSeasonsEntry.0 == leagueId) {
          return (
            leagueSeasonsEntry.0,
            Array.map<FootballTypes.Season, FootballTypes.Season>(
              leagueSeasonsEntry.1,
              func(season : FootballTypes.Season) {
                if (season.id == seasonId) {

                  let updatedFixtures = List.map<FootballTypes.Fixture, FootballTypes.Fixture>(
                    season.fixtures,
                    func(fixture : FootballTypes.Fixture) : FootballTypes.Fixture {
                      if (fixture.id == fixtureId) {
                        return {
                          id = fixture.id;
                          seasonId = fixture.seasonId;
                          gameweek = fixture.gameweek;
                          kickOff = fixture.kickOff;
                          homeClubId = fixture.homeClubId;
                          awayClubId = fixture.awayClubId;
                          homeGoals = fixture.homeGoals;
                          awayGoals = fixture.awayGoals;
                          status = #Finalised;
                          events = fixture.events;
                          highestScoringPlayerId = highestScoringPlayerId;
                        };
                      } else { return fixture };
                    },
                  );

                  return {
                    id = season.id;
                    name = season.name;
                    year = season.year;
                    fixtures = updatedFixtures;
                    postponedFixtures = season.postponedFixtures;
                  };
                } else {
                  return season;
                };
              },
            ),
          );
        } else { return leagueSeasonsEntry };
      },
    );

    checkRequiredStatus(leagueId);
  };

  private func checkSeasonComplete(leagueId : FootballIds.LeagueId, seasonId : FootballIds.SeasonId) : async () {
    let currentLeagueSeasons = Array.find<(FootballIds.LeagueId, [FootballTypes.Season])>(
      leagueSeasons,
      func(entry : (FootballIds.LeagueId, [FootballTypes.Season])) : Bool {
        entry.0 == leagueId;
      },
    );

    switch (currentLeagueSeasons) {
      case (?foundSeasons) {
        let seasonResult = Array.find<FootballTypes.Season>(
          foundSeasons.1,
          func(entry : FootballTypes.Season) : Bool {
            entry.id == seasonId;
          },
        );

        switch (seasonResult) {
          case (?season) {
            let finalisedFixtures = List.filter<FootballTypes.Fixture>(
              season.fixtures,
              func(fixture : FootballTypes.Fixture) {
                fixture.status == #Finalised;
              },
            );
            if (List.size(finalisedFixtures) == List.size(season.fixtures)) {
              await endSeason(leagueId, seasonId);
            let _ = await notificationManager.distributeNotification(#CompleteSeason, #CompleteSeason {  });
            };
          };
          case (null) {};
        };
      };
      case (null) {};
    };
  };

  private func endSeason(leagueId : FootballIds.LeagueId, seasonId : FootballIds.SeasonId) : async () {

    let currentLeagueSeasons = Array.find<(FootballIds.LeagueId, [FootballTypes.Season])>(
      leagueSeasons,
      func(entry : (FootballIds.LeagueId, [FootballTypes.Season])) : Bool {
        entry.0 == leagueId;
      },
    );

    switch (currentLeagueSeasons) {
      case (?foundSeasons) {
        let currentSeason = Array.find<FootballTypes.Season>(
          foundSeasons.1,
          func(seasonEntry : FootballTypes.Season) : Bool {
            seasonEntry.id == seasonId;
          },
        );

        switch (currentSeason) {
          case (?season) {

            var nextYear = season.year + 1;
            let nextYearText = Nat16.toText(nextYear);
            var newSeasonName = nextYearText # "/";

            var counter : Int = Text.size(nextYearText);

            for (c in Text.toIter(nextYearText)) {
              if (counter <= 2) {
                newSeasonName := newSeasonName # Char.toText(c);
              };
              counter -= 1;
            };

            let newSeason : FootballTypes.Season = {
              fixtures = List.nil();
              id = seasonId + 1;
              name = newSeasonName;
              postponedFixtures = List.nil();
              year = nextYear;
            };

            leagueSeasons := Array.map<(FootballIds.LeagueId, [FootballTypes.Season]), (FootballIds.LeagueId, [FootballTypes.Season])>(
              leagueSeasons,
              func(entry : (FootballIds.LeagueId, [FootballTypes.Season])) {
                if (entry.0 == leagueId) {
                  let seasonsBuffer = Buffer.fromArray<FootballTypes.Season>(entry.1);
                  seasonsBuffer.add(newSeason);
                  return (entry.0, Buffer.toArray(seasonsBuffer));
                } else {
                  return entry;
                };
              },
            );

            leagueStatuses := Array.map<FootballTypes.LeagueStatus, FootballTypes.LeagueStatus>(
              leagueStatuses,
              func(entry : FootballTypes.LeagueStatus) {
                if (entry.leagueId == leagueId) {
                  return {
                    activeGameweek = 0;
                    activeMonth = 0;
                    activeSeasonId = newSeason.id;
                    completedGameweek = 0;
                    leagueId = entry.leagueId;
                    seasonActive = false;
                    totalGameweeks = entry.totalGameweeks;
                    transferWindowActive = true;
                    transferWindowEndDay = entry.transferWindowEndDay;
                    transferWindowEndMonth = entry.transferWindowEndMonth;
                    transferWindowStartDay = entry.transferWindowStartDay;
                    transferWindowStartMonth = entry.transferWindowStartMonth;
                    unplayedGameweek = 1;
                  };
                } else { return entry };
              },
            );

            await createTransferWindowStartTimers();
            await createTransferWindowEndTimers();

          };
          case (null) {};
        };
      };
      case (null) {};
    };
  };

  private func populatePlayerEventData(submitFixtureDataDTO : FixtureCommands.SubmitFixtureData, allPlayers : [FootballTypes.Player]) : async ?[FootballTypes.PlayerEventData] {

    let allPlayerEventsBuffer = Buffer.fromArray<FootballTypes.PlayerEventData>(submitFixtureDataDTO.playerEventData);

    let homeTeamPlayerIdsBuffer = Buffer.fromArray<Nat16>([]);
    let awayTeamPlayerIdsBuffer = Buffer.fromArray<Nat16>([]);

    let leagueSeasonEntry = Array.find<(FootballIds.LeagueId, [FootballTypes.Season])>(
      leagueSeasons,
      func(leagueSeasonEntry : (FootballIds.LeagueId, [FootballTypes.Season])) : Bool {
        leagueSeasonEntry.0 == submitFixtureDataDTO.leagueId;
      },
    );

    switch (leagueSeasonEntry) {
      case (null) {
        return null;
      };
      case (?foundLeagueSeasonEntry) {
        let currentSeason = Array.find<FootballTypes.Season>(
          foundLeagueSeasonEntry.1,
          func(season : FootballTypes.Season) : Bool {
            return season.id == submitFixtureDataDTO.seasonId;
          },
        );

        switch (currentSeason) {
          case (null) { return null };
          case (?foundSeason) {
            let fixture = List.find<FootballTypes.Fixture>(
              foundSeason.fixtures,
              func(f : FootballTypes.Fixture) : Bool {
                return f.id == submitFixtureDataDTO.fixtureId;
              },
            );
            switch (fixture) {
              case (null) { return null };
              case (?foundFixture) {

                for (event in Iter.fromArray(submitFixtureDataDTO.playerEventData)) {
                  if (event.clubId == foundFixture.homeClubId) {
                    homeTeamPlayerIdsBuffer.add(event.playerId);
                  } else if (event.clubId == foundFixture.awayClubId) {
                    awayTeamPlayerIdsBuffer.add(event.playerId);
                  };
                };

                let homeTeamDefensivePlayerIdsBuffer = Buffer.fromArray<Nat16>([]);
                let awayTeamDefensivePlayerIdsBuffer = Buffer.fromArray<Nat16>([]);

                for (playerId in Iter.fromArray<Nat16>(Buffer.toArray(homeTeamPlayerIdsBuffer))) {
                  let player = Array.find<PlayerQueries.Player>(allPlayers, func(p : PlayerQueries.Player) : Bool { return p.id == playerId });
                  switch (player) {
                    case (null) {};
                    case (?actualPlayer) {
                      if (actualPlayer.position == #Goalkeeper or actualPlayer.position == #Defender) {
                        if (
                          Array.find<Nat16>(
                            Buffer.toArray(homeTeamDefensivePlayerIdsBuffer),
                            func(x : Nat16) : Bool { return x == playerId },
                          ) == null
                        ) {
                          homeTeamDefensivePlayerIdsBuffer.add(playerId);
                        };
                      };
                    };
                  };
                };

                for (playerId in Iter.fromArray<Nat16>(Buffer.toArray(awayTeamPlayerIdsBuffer))) {
                  let player = Array.find<PlayerQueries.Player>(allPlayers, func(p : PlayerQueries.Player) : Bool { return p.id == playerId });
                  switch (player) {
                    case (null) {};
                    case (?actualPlayer) {
                      if (actualPlayer.position == #Goalkeeper or actualPlayer.position == #Defender) {
                        if (
                          Array.find<Nat16>(
                            Buffer.toArray(awayTeamDefensivePlayerIdsBuffer),
                            func(x : Nat16) : Bool { return x == playerId },
                          ) == null
                        ) {
                          awayTeamDefensivePlayerIdsBuffer.add(playerId);
                        };
                      };
                    };
                  };
                };

                let homeTeamGoals = Array.filter<FootballTypes.PlayerEventData>(
                  submitFixtureDataDTO.playerEventData,
                  func(event : FootballTypes.PlayerEventData) : Bool {
                    return event.clubId == foundFixture.homeClubId and event.eventType == #Goal;
                  },
                );

                let awayTeamGoals = Array.filter<FootballTypes.PlayerEventData>(
                  submitFixtureDataDTO.playerEventData,
                  func(event : FootballTypes.PlayerEventData) : Bool {
                    return event.clubId == foundFixture.awayClubId and event.eventType == #Goal;
                  },
                );

                let homeTeamOwnGoals = Array.filter<FootballTypes.PlayerEventData>(
                  submitFixtureDataDTO.playerEventData,
                  func(event : FootballTypes.PlayerEventData) : Bool {
                    return event.clubId == foundFixture.homeClubId and event.eventType == #OwnGoal;
                  },
                );

                let awayTeamOwnGoals = Array.filter<FootballTypes.PlayerEventData>(
                  submitFixtureDataDTO.playerEventData,
                  func(event : FootballTypes.PlayerEventData) : Bool {
                    return event.clubId == foundFixture.awayClubId and event.eventType == #OwnGoal;
                  },
                );

                let totalHomeScored = Array.size(homeTeamGoals) + Array.size(awayTeamOwnGoals);
                let totalAwayScored = Array.size(awayTeamGoals) + Array.size(homeTeamOwnGoals);

                if (totalHomeScored == 0) {
                  for (playerId in Iter.fromArray(Buffer.toArray(awayTeamDefensivePlayerIdsBuffer))) {
                    let player = Array.find<PlayerQueries.Player>(allPlayers, func(p : PlayerQueries.Player) : Bool { return p.id == playerId });
                    switch (player) {
                      case (null) {};
                      case (?actualPlayer) {
                        let cleanSheetEvent : FootballTypes.PlayerEventData = {
                          fixtureId = submitFixtureDataDTO.fixtureId;
                          playerId = playerId;
                          eventType = #CleanSheet;
                          eventStartMinute = 90;
                          eventEndMinute = 90;
                          clubId = actualPlayer.clubId;
                          position = actualPlayer.position;
                        };
                        allPlayerEventsBuffer.add(cleanSheetEvent);
                      };
                    };
                  };
                } else {
                  for (goal in Iter.fromArray(homeTeamGoals)) {
                    for (playerId in Iter.fromArray(Buffer.toArray(awayTeamDefensivePlayerIdsBuffer))) {
                      let player = Array.find<PlayerQueries.Player>(allPlayers, func(p : PlayerQueries.Player) : Bool { return p.id == playerId });
                      switch (player) {
                        case (null) {};
                        case (?actualPlayer) {
                          let concededEvent : FootballTypes.PlayerEventData = {
                            fixtureId = submitFixtureDataDTO.fixtureId;
                            playerId = actualPlayer.id;
                            eventType = #GoalConceded;
                            eventStartMinute = goal.eventStartMinute;
                            eventEndMinute = goal.eventStartMinute;
                            clubId = actualPlayer.clubId;
                            position = actualPlayer.position;
                          };
                          allPlayerEventsBuffer.add(concededEvent);
                        };
                      };
                    };
                  };
                };

                if (totalAwayScored == 0) {
                  for (playerId in Iter.fromArray(Buffer.toArray(homeTeamDefensivePlayerIdsBuffer))) {
                    let player = Array.find<PlayerQueries.Player>(allPlayers, func(p : PlayerQueries.Player) : Bool { return p.id == playerId });
                    switch (player) {
                      case (null) {};
                      case (?actualPlayer) {
                        let cleanSheetEvent : FootballTypes.PlayerEventData = {
                          fixtureId = submitFixtureDataDTO.fixtureId;
                          playerId = playerId;
                          eventType = #CleanSheet;
                          eventStartMinute = 90;
                          eventEndMinute = 90;
                          clubId = actualPlayer.clubId;
                          position = actualPlayer.position;
                        };
                        allPlayerEventsBuffer.add(cleanSheetEvent);
                      };
                    };
                  };
                } else {
                  for (goal in Iter.fromArray(awayTeamGoals)) {
                    for (playerId in Iter.fromArray(Buffer.toArray(homeTeamDefensivePlayerIdsBuffer))) {
                      let player = Array.find<PlayerQueries.Player>(allPlayers, func(p : PlayerQueries.Player) : Bool { return p.id == playerId });
                      switch (player) {
                        case (null) {};
                        case (?actualPlayer) {
                          let concededEvent : FootballTypes.PlayerEventData = {
                            fixtureId = goal.fixtureId;
                            playerId = actualPlayer.id;
                            eventType = #GoalConceded;
                            eventStartMinute = goal.eventStartMinute;
                            eventEndMinute = goal.eventStartMinute;
                            clubId = actualPlayer.clubId;
                            position = actualPlayer.position;
                          };
                          allPlayerEventsBuffer.add(concededEvent);
                        };
                      };
                    };
                  };
                };

                let playerEvents = Buffer.toArray<FootballTypes.PlayerEventData>(allPlayerEventsBuffer);
                let eventsWithHighestScoringPlayer = populateHighestScoringPlayer(playerEvents, foundFixture, allPlayers);
                return ?eventsWithHighestScoringPlayer;
              };
            };
          };
        };
      };
    };
  };

  private func populateHighestScoringPlayer(playerEvents : [FootballTypes.PlayerEventData], fixture : FootballTypes.Fixture, players : [PlayerQueries.Player]) : [FootballTypes.PlayerEventData] {

    var homeGoalsCount : Nat8 = 0;
    var awayGoalsCount : Nat8 = 0;

    let playerEventsMap : TrieMap.TrieMap<FootballIds.PlayerId, [FootballTypes.PlayerEventData]> = TrieMap.TrieMap<FootballIds.PlayerId, [FootballTypes.PlayerEventData]>(Utilities.eqNat16, Utilities.hashNat16);

    for (event in Iter.fromArray(playerEvents)) {
      switch (event.eventType) {
        case (#Goal) {
          if (event.clubId == fixture.homeClubId) {
            homeGoalsCount += 1;
          } else if (event.clubId == fixture.awayClubId) {
            awayGoalsCount += 1;
          };
        };
        case (#OwnGoal) {
          if (event.clubId == fixture.homeClubId) {
            awayGoalsCount += 1;
          } else if (event.clubId == fixture.awayClubId) {
            homeGoalsCount += 1;
          };
        };
        case _ {};
      };

      let playerId : FootballIds.PlayerId = event.playerId;
      switch (playerEventsMap.get(playerId)) {
        case (null) {
          playerEventsMap.put(playerId, [event]);
        };
        case (?existingEvents) {
          let existingEventsBuffer = Buffer.fromArray<FootballTypes.PlayerEventData>(existingEvents);
          existingEventsBuffer.add(event);
          playerEventsMap.put(playerId, Buffer.toArray(existingEventsBuffer));
        };
      };
    };

    let playerScoresMap : TrieMap.TrieMap<Nat16, Int16> = TrieMap.TrieMap<Nat16, Int16>(Utilities.eqNat16, Utilities.hashNat16);
    for ((playerId, events) in playerEventsMap.entries()) {
      let currentPlayer = Array.find<PlayerQueries.Player>(
        players,
        func(player : PlayerQueries.Player) : Bool {
          return player.id == playerId;
        },
      );

      switch (currentPlayer) {
        case (null) {};
        case (?foundPlayer) {
          let totalScore = Array.foldLeft<FootballTypes.PlayerEventData, Int16>(
            events,
            0,
            func(acc : Int16, event : FootballTypes.PlayerEventData) : Int16 {
              return acc + Utilities.calculateIndividualScoreForEvent(event, foundPlayer.position);
            },
          );

          let aggregateScore = Utilities.calculateAggregatePlayerEvents(events, foundPlayer.position);
          playerScoresMap.put(playerId, totalScore + aggregateScore);
        };
      };
    };

    var highestScore : Int16 = 0;
    var highestScoringPlayerId : FootballIds.PlayerId = 0;
    var isUniqueHighScore : Bool = true;
    let uniquePlayerIdsBuffer = Buffer.fromArray<FootballIds.PlayerId>([]);

    for (event in Iter.fromArray(playerEvents)) {
      if (not Buffer.contains<FootballIds.PlayerId>(uniquePlayerIdsBuffer, event.playerId, func(a : FootballIds.PlayerId, b : FootballIds.PlayerId) : Bool { a == b })) {
        uniquePlayerIdsBuffer.add(event.playerId);
      };
    };

    let uniquePlayerIds = Buffer.toArray<Nat16>(uniquePlayerIdsBuffer);

    for (j in Iter.range(0, Array.size(uniquePlayerIds) -1)) {
      let playerId = uniquePlayerIds[j];
      switch (playerScoresMap.get(playerId)) {
        case (?playerScore) {
          if (playerScore > highestScore) {
            highestScore := playerScore;
            highestScoringPlayerId := playerId;
            isUniqueHighScore := true;
          } else if (playerScore == highestScore) {
            isUniqueHighScore := false;
          };
        };
        case null {};
      };
    };

    if (isUniqueHighScore) {
      let highestScoringPlayer = Array.find<PlayerQueries.Player>(players, func(p : PlayerQueries.Player) : Bool { return p.id == highestScoringPlayerId });
      switch (highestScoringPlayer) {
        case (null) {};
        case (?foundPlayer) {
          let newEvent : FootballTypes.PlayerEventData = {
            fixtureId = fixture.id;
            playerId = highestScoringPlayerId;
            eventType = #HighestScoringPlayer;
            eventStartMinute = 90;
            eventEndMinute = 90;
            clubId = foundPlayer.clubId;
          };
          let existingEvents = playerEventsMap.get(highestScoringPlayerId);
          switch (existingEvents) {
            case (null) {};
            case (?foundEvents) {
              let existingEventsBuffer = Buffer.fromArray<FootballTypes.PlayerEventData>(foundEvents);
              existingEventsBuffer.add(newEvent);
              playerEventsMap.put(highestScoringPlayerId, Buffer.toArray(existingEventsBuffer));
            };
          };
        };
      };
    };

    let allEventsBuffer = Buffer.fromArray<FootballTypes.PlayerEventData>([]);
    for ((playerId, playerEventArray) in playerEventsMap.entries()) {
      allEventsBuffer.append(Buffer.fromArray(playerEventArray));
    };

    return Buffer.toArray(allEventsBuffer);
  };

  private func addEventsToFixture(leagueId : FootballIds.LeagueId, playerEventData : [FootballTypes.PlayerEventData], seasonId : FootballIds.SeasonId, fixtureId : FootballIds.FixtureId) {

    leagueSeasons := Array.map<(FootballIds.LeagueId, [FootballTypes.Season]), (FootballIds.LeagueId, [FootballTypes.Season])>(
      leagueSeasons,
      func(leagueSeasonsEntry : (FootballIds.LeagueId, [FootballTypes.Season])) {
        if (leagueSeasonsEntry.0 == leagueId) {
          return (
            leagueSeasonsEntry.0,
            Array.map<FootballTypes.Season, FootballTypes.Season>(
              leagueSeasonsEntry.1,
              func(season : FootballTypes.Season) {
                if (season.id == seasonId) {
                  return {
                    id = season.id;
                    name = season.name;
                    year = season.year;
                    fixtures = List.map<FootballTypes.Fixture, FootballTypes.Fixture>(
                      season.fixtures,
                      func(fixture : FootballTypes.Fixture) : FootballTypes.Fixture {
                        if (fixture.id == fixtureId) {
                          return {
                            id = fixture.id;
                            seasonId = fixture.seasonId;
                            gameweek = fixture.gameweek;
                            kickOff = fixture.kickOff;
                            homeClubId = fixture.homeClubId;
                            awayClubId = fixture.awayClubId;
                            homeGoals = fixture.homeGoals;
                            awayGoals = fixture.awayGoals;
                            status = fixture.status;
                            events = List.fromArray(playerEventData);
                            highestScoringPlayerId = fixture.highestScoringPlayerId;
                          };
                        } else { return fixture };
                      },
                    );
                    postponedFixtures = season.postponedFixtures;
                  };
                } else {
                  return season;
                };
              },
            ),
          );
        } else { return leagueSeasonsEntry };
      },
    );
    setGameScore(leagueId, seasonId, fixtureId);
  };

  private func addEventsToPlayers(leagueId : FootballIds.LeagueId, playerEventData : [FootballTypes.PlayerEventData], seasonId : FootballIds.SeasonId, gameweek : FootballDefinitions.GameweekNumber, fixtureId : FootballIds.FixtureId) {

    var updatedSeasons : List.List<FootballTypes.PlayerSeason> = List.nil<FootballTypes.PlayerSeason>();
    let playerEventsMap : TrieMap.TrieMap<Nat16, [FootballTypes.PlayerEventData]> = TrieMap.TrieMap<Nat16, [FootballTypes.PlayerEventData]>(Utilities.eqNat16, Utilities.hashNat16);

    for (event in Iter.fromArray(playerEventData)) {
      let playerId : Nat16 = event.playerId;
      switch (playerEventsMap.get(playerId)) {
        case (null) {
          playerEventsMap.put(playerId, [event]);
        };
        case (?existingEvents) {
          let existingEventsBuffer = Buffer.fromArray<FootballTypes.PlayerEventData>(existingEvents);
          existingEventsBuffer.add(event);
          playerEventsMap.put(playerId, Buffer.toArray(existingEventsBuffer));
        };
      };
    };

    let leaguePlayerArray = Array.find<(FootballIds.LeagueId, [FootballTypes.Player])>(
      leaguePlayers,
      func(leaguePlayersArray : (FootballIds.LeagueId, [FootballTypes.Player])) : Bool {
        return leaguePlayersArray.0 == leagueId;
      },
    );

    switch (leaguePlayerArray) {
      case (?foundArray) {

        let players = List.fromArray(foundArray.1);

        for (playerEventMap in playerEventsMap.entries()) {
          let player = List.find<FootballTypes.Player>(
            players,
            func(p : FootballTypes.Player) : Bool {
              return p.id == playerEventMap.0;
            },
          );
          switch (player) {
            case (null) {};
            case (?foundPlayer) {

              let score : Int16 = calculatePlayerScore(foundPlayer.position, playerEventMap.1);

              if (foundPlayer.seasons == null) {
                let newGameweek : FootballTypes.PlayerGameweek = {
                  number = gameweek;
                  events = List.fromArray<FootballTypes.PlayerEventData>(playerEventMap.1);
                  points = score;
                };
                let newSeason : FootballTypes.PlayerSeason = {
                  id = seasonId;
                  gameweeks = List.fromArray<FootballTypes.PlayerGameweek>([newGameweek]);
                  totalPoints = 0;
                };
                updatedSeasons := List.fromArray<FootballTypes.PlayerSeason>([newSeason]);
              } else {
                let currentSeason = List.find<FootballTypes.PlayerSeason>(
                  foundPlayer.seasons,
                  func(s : FootballTypes.PlayerSeason) : Bool {
                    s.id == seasonId;
                  },
                );

                if (currentSeason == null) {
                  let newGameweek : FootballTypes.PlayerGameweek = {
                    number = gameweek;
                    events = List.fromArray<FootballTypes.PlayerEventData>(playerEventMap.1);
                    points = score;
                  };
                  let newSeason : FootballTypes.PlayerSeason = {
                    id = seasonId;
                    gameweeks = List.fromArray<FootballTypes.PlayerGameweek>([newGameweek]);
                    totalPoints = 0;
                  };
                  updatedSeasons := List.append<FootballTypes.PlayerSeason>(foundPlayer.seasons, List.fromArray<FootballTypes.PlayerSeason>([newSeason]));

                } else {
                  updatedSeasons := List.map<FootballTypes.PlayerSeason, FootballTypes.PlayerSeason>(
                    foundPlayer.seasons,
                    func(season : FootballTypes.PlayerSeason) : FootballTypes.PlayerSeason {

                      if (season.id != seasonId) {
                        return season;
                      };

                      let currentGameweek = List.find<FootballTypes.PlayerGameweek>(
                        season.gameweeks,
                        func(gw : FootballTypes.PlayerGameweek) : Bool {
                          gw.number == gameweek;
                        },
                      );

                      if (currentGameweek == null) {
                        let newGameweek : FootballTypes.PlayerGameweek = {
                          number = gameweek;
                          events = List.fromArray<FootballTypes.PlayerEventData>(playerEventMap.1);
                          points = score;
                        };
                        let updatedSeason : FootballTypes.PlayerSeason = {
                          id = season.id;
                          gameweeks = List.append<FootballTypes.PlayerGameweek>(season.gameweeks, List.fromArray<FootballTypes.PlayerGameweek>([newGameweek]));
                          totalPoints = 0;
                        };
                        return updatedSeason;
                      } else {
                        let updatedGameweeks = List.map<FootballTypes.PlayerGameweek, FootballTypes.PlayerGameweek>(
                          season.gameweeks,
                          func(gw : FootballTypes.PlayerGameweek) : FootballTypes.PlayerGameweek {
                            if (gw.number != gameweek) {
                              return gw;
                            };

                            let otherFixtureEvents = List.filter<FootballTypes.PlayerEventData>(
                              gw.events,
                              func(playerEvent : FootballTypes.PlayerEventData) {
                                playerEvent.fixtureId != fixtureId;
                              },
                            );

                            return {
                              number = gw.number;
                              events = List.append<FootballTypes.PlayerEventData>(otherFixtureEvents, List.fromArray(playerEventMap.1));
                              points = score;
                            };
                          },
                        );
                        return {
                          id = season.id;
                          gameweeks = updatedGameweeks;
                          totalPoints = 0;
                        };
                      };
                    },
                  );
                };
              };

              let updatedPlayer : FootballTypes.Player = {
                leagueId = foundPlayer.leagueId;
                id = foundPlayer.id;
                clubId = foundPlayer.clubId;
                position = foundPlayer.position;
                firstName = foundPlayer.firstName;
                lastName = foundPlayer.lastName;
                shirtNumber = foundPlayer.shirtNumber;
                valueQuarterMillions = foundPlayer.valueQuarterMillions;
                dateOfBirth = foundPlayer.dateOfBirth;
                nationality = foundPlayer.nationality;
                seasons = updatedSeasons;
                valueHistory = foundPlayer.valueHistory;
                status = foundPlayer.status;
                parentLeagueId = foundPlayer.parentLeagueId;
                parentClubId = foundPlayer.parentClubId;
                currentLoanEndDate = foundPlayer.currentLoanEndDate;
                latestInjuryEndDate = foundPlayer.latestInjuryEndDate;
                injuryHistory = foundPlayer.injuryHistory;
                retirementDate = foundPlayer.retirementDate;
                transferHistory = foundPlayer.transferHistory;
                gender = foundPlayer.gender;
              };

              updateLeaguePlayer(leagueId, updatedPlayer);
            };
          }

        };

      };
      case (null) {

      };
    };
  };

  private func setGameScore(leagueId : FootballIds.LeagueId, seasonId : FootballIds.SeasonId, fixtureId : FootballIds.FixtureId) {

    leagueSeasons := Array.map<(FootballIds.LeagueId, [FootballTypes.Season]), (FootballIds.LeagueId, [FootballTypes.Season])>(
      leagueSeasons,
      func(leagueSeasonsEntry : (FootballIds.LeagueId, [FootballTypes.Season])) {
        if (leagueSeasonsEntry.0 == leagueId) {
          return (
            leagueSeasonsEntry.0,
            Array.map<FootballTypes.Season, FootballTypes.Season>(
              leagueSeasonsEntry.1,
              func(season : FootballTypes.Season) {
                if (season.id == seasonId) {

                  let fixturesBuffer = Buffer.fromArray<FootballTypes.Fixture>([]);
                  for (fixture in Iter.fromList(season.fixtures)) {
                    if (fixture.id == fixtureId) {

                      var homeGoals : Nat8 = 0;
                      var awayGoals : Nat8 = 0;

                      for (event in Iter.fromList(fixture.events)) {
                        switch (event.eventType) {
                          case (#Goal) {
                            if (event.clubId == fixture.homeClubId) {
                              homeGoals += 1;
                            } else {
                              awayGoals += 1;
                            };
                          };
                          case (#OwnGoal) {
                            if (event.clubId == fixture.homeClubId) {
                              awayGoals += 1;
                            } else {
                              homeGoals += 1;
                            };
                          };
                          case _ {};
                        };
                      };

                      fixturesBuffer.add({
                        awayClubId = fixture.awayClubId;
                        awayGoals = awayGoals;
                        events = fixture.events;
                        gameweek = fixture.gameweek;
                        highestScoringPlayerId = fixture.highestScoringPlayerId;
                        homeClubId = fixture.homeClubId;
                        homeGoals = homeGoals;
                        id = fixture.id;
                        kickOff = fixture.kickOff;
                        seasonId = fixture.seasonId;
                        status = fixture.status;
                      });
                    } else {
                      fixturesBuffer.add(fixture);
                    };
                  };
                  return {
                    fixtures = List.fromArray(Buffer.toArray(fixturesBuffer));
                    id = season.id;
                    name = season.name;
                    postponedFixtures = season.postponedFixtures;
                    year = season.year;
                  };

                } else {
                  return season;
                };
              },
            ),
          );
        } else { return leagueSeasonsEntry };
      },
    );
  };

  private func updateLeaguePlayer(leagueId : FootballIds.LeagueId, updatedPlayer : FootballTypes.Player) {

    leaguePlayers := Array.map<(FootballIds.LeagueId, [FootballTypes.Player]), (FootballIds.LeagueId, [FootballTypes.Player])>(
      leaguePlayers,
      func(leaguePlayersSet : (FootballIds.LeagueId, [FootballTypes.Player])) {
        if (leaguePlayersSet.0 == leagueId) {
          return (
            leaguePlayersSet.0,
            Array.map<FootballTypes.Player, FootballTypes.Player>(
              leaguePlayersSet.1,
              func(player : FootballTypes.Player) {
                if (player.id == updatedPlayer.id) {
                  updatedPlayer;
                } else {
                  return player;
                };
              },
            ),
          );
        } else {
          return leaguePlayersSet;
        };
      },
    );
  };

  private func getPlayer(leagueId : FootballIds.LeagueId, playerId : FootballIds.PlayerId) : ?FootballTypes.Player {
    let playersLeague = Array.find<(FootballIds.LeagueId, [FootballTypes.Player])>(
      leaguePlayers,
      func(playerLeagueEntry : (FootballIds.LeagueId, [FootballTypes.Player])) : Bool {
        playerLeagueEntry.0 == leagueId;
      },
    );
    switch (playersLeague) {
      case (null) {
        return null;
      };
      case (?foundPlayersLeague) {
        return Array.find<FootballTypes.Player>(
          foundPlayersLeague.1,
          func(player : FootballTypes.Player) : Bool {
            player.id == playerId;
          },
        );
      };
    };
  };

  private func movePlayerToFreeAgents(leagueId : FootballIds.LeagueId, playerId : FootballIds.PlayerId, updatedValue : Nat16) {

    let playerToMove = getPlayer(leagueId, playerId);

    switch (playerToMove) {
      case (?foundPlayer) {
        leaguePlayers := Array.map<(FootballIds.LeagueId, [FootballTypes.Player]), (FootballIds.LeagueId, [FootballTypes.Player])>(
          leaguePlayers,
          func(leagueWithPlayers : (FootballIds.LeagueId, [FootballTypes.Player])) {
            if (leagueWithPlayers.0 == leagueId) {
              return (
                leagueWithPlayers.0,
                Array.filter<FootballTypes.Player>(
                  leagueWithPlayers.1,
                  func(player : FootballTypes.Player) : Bool {
                    player.id != playerId;
                  },
                ),
              );
            } else {
              return leagueWithPlayers;
            };
          },
        );

        let newTransferHistoryEntry : FootballTypes.TransferHistory = {
          transferDate = Time.now();
          fromClub = foundPlayer.clubId;
          toClub = 0;
          loanEndDate = 0;
          fromLeagueId = leagueId;
          toLeagueId = 0;
        };

        let freeAgentsBuffer = Buffer.fromArray<FootballTypes.Player>(freeAgents);
        freeAgentsBuffer.add({
          leagueId = 0;
          clubId = 0;
          currentLoanEndDate = 0;
          dateOfBirth = foundPlayer.dateOfBirth;
          firstName = foundPlayer.firstName;
          gender = foundPlayer.gender;
          id = foundPlayer.id;
          injuryHistory = foundPlayer.injuryHistory;
          lastName = foundPlayer.lastName;
          latestInjuryEndDate = foundPlayer.latestInjuryEndDate;
          nationality = foundPlayer.nationality;
          parentLeagueId = foundPlayer.parentLeagueId;
          parentClubId = foundPlayer.parentClubId;
          position = foundPlayer.position;
          retirementDate = foundPlayer.retirementDate;
          seasons = foundPlayer.seasons;
          shirtNumber = 0;
          status = foundPlayer.status;
          transferHistory = List.append<FootballTypes.TransferHistory>(foundPlayer.transferHistory, List.fromArray([newTransferHistoryEntry]));
          valueHistory = foundPlayer.valueHistory;
          valueQuarterMillions = updatedValue;
        });
        freeAgents := Buffer.toArray(freeAgentsBuffer);
      };
      case (null) {};
    };
  };

  private func movePlayerWithinLeague(currentLeagueId : FootballIds.LeagueId, newClubId : FootballIds.ClubId, playerId : FootballIds.PlayerId, shirtNumber : Nat8, updatedValue : Nat16) {

    leaguePlayers := Array.map<(FootballIds.LeagueId, [FootballTypes.Player]), (FootballIds.LeagueId, [FootballTypes.Player])>(
      leaguePlayers,
      func(leaguePlayersEntry : (FootballIds.LeagueId, [FootballTypes.Player])) {
        if (leaguePlayersEntry.0 == currentLeagueId) {
          return (
            leaguePlayersEntry.0,
            Array.map<FootballTypes.Player, FootballTypes.Player>(
              leaguePlayersEntry.1,
              func(player : FootballTypes.Player) {
                if (player.id == playerId) {

                  let newTransferHistoryEntry : FootballTypes.TransferHistory = {
                    transferDate = Time.now();
                    fromClub = player.clubId;
                    toClub = newClubId;
                    loanEndDate = 0;
                    fromLeagueId = currentLeagueId;
                    toLeagueId = currentLeagueId;
                  };

                  return {
                    leagueId = currentLeagueId;
                    clubId = newClubId;
                    currentLoanEndDate = 0;
                    dateOfBirth = player.dateOfBirth;
                    firstName = player.firstName;
                    gender = player.gender;
                    id = player.id;
                    injuryHistory = player.injuryHistory;
                    lastName = player.lastName;
                    latestInjuryEndDate = player.latestInjuryEndDate;
                    nationality = player.nationality;
                    parentLeagueId = 0;
                    parentClubId = 0;
                    position = player.position;
                    retirementDate = player.retirementDate;
                    seasons = player.seasons;
                    shirtNumber = shirtNumber;
                    status = player.status;
                    transferHistory = List.append<FootballTypes.TransferHistory>(player.transferHistory, List.fromArray([newTransferHistoryEntry]));
                    valueHistory = player.valueHistory;
                    valueQuarterMillions = updatedValue;
                  };
                } else {
                  return player;
                };
              },
            ),
          );
        } else {
          return leaguePlayersEntry;
        };
      },
    );
  };

  private func movePlayerToLeague(currentLeagueId : FootballIds.LeagueId, newLeagueId : FootballIds.LeagueId, newClubId : FootballIds.ClubId, playerId : FootballIds.PlayerId, shirtNumber : Nat8) {

    let playerToMove = getPlayer(currentLeagueId, playerId);

    switch (playerToMove) {
      case (?foundPlayer) {
        leaguePlayers := Array.map<(FootballIds.LeagueId, [FootballTypes.Player]), (FootballIds.LeagueId, [FootballTypes.Player])>(
          leaguePlayers,
          func(leagueWithPlayers : (FootballIds.LeagueId, [FootballTypes.Player])) {
            if (leagueWithPlayers.0 == currentLeagueId) {
              return (
                leagueWithPlayers.0,
                Array.filter<FootballTypes.Player>(
                  leagueWithPlayers.1,
                  func(player : FootballTypes.Player) : Bool {
                    player.id != playerId;
                  },
                ),
              );
            } else {
              return leagueWithPlayers;
            };
          },
        );

        leaguePlayers := Array.map<(FootballIds.LeagueId, [FootballTypes.Player]), (FootballIds.LeagueId, [FootballTypes.Player])>(
          leaguePlayers,
          func(leagueWithPlayers : (FootballIds.LeagueId, [FootballTypes.Player])) {
            if (leagueWithPlayers.0 == newLeagueId) {

              let newTransferHistoryEntry : FootballTypes.TransferHistory = {
                transferDate = Time.now();
                fromLeagueId = currentLeagueId;
                fromClub = foundPlayer.clubId;
                toLeagueId = newLeagueId;
                toClub = newClubId;
                loanEndDate = 0;
              };

              let transferHistoryBuffer = Buffer.fromArray<FootballTypes.TransferHistory>(List.toArray(foundPlayer.transferHistory));
              transferHistoryBuffer.add(newTransferHistoryEntry);

              let updatedPlayersBuffer = Buffer.fromArray<FootballTypes.Player>(leagueWithPlayers.1);

              updatedPlayersBuffer.add({
                leagueId = newLeagueId;
                clubId = newClubId;
                currentLoanEndDate = 0;
                dateOfBirth = foundPlayer.dateOfBirth;
                firstName = foundPlayer.firstName;
                gender = foundPlayer.gender;
                id = foundPlayer.id;
                injuryHistory = foundPlayer.injuryHistory;
                lastName = foundPlayer.lastName;
                latestInjuryEndDate = foundPlayer.latestInjuryEndDate;
                nationality = foundPlayer.nationality;
                parentLeagueId = 0;
                parentClubId = 0;
                position = foundPlayer.position;
                retirementDate = foundPlayer.retirementDate;
                seasons = foundPlayer.seasons;
                shirtNumber = foundPlayer.shirtNumber;
                status = foundPlayer.status;
                transferHistory = List.fromArray(Buffer.toArray(transferHistoryBuffer));
                valueHistory = foundPlayer.valueHistory;
                valueQuarterMillions = foundPlayer.valueQuarterMillions;
              });

              return (leagueWithPlayers.0, Buffer.toArray(updatedPlayersBuffer));
            } else {
              return leagueWithPlayers;
            };
          },
        );
      };
      case (null) {};
    };
  };

  private func calculatePlayerScore(playerPosition : FootballEnums.PlayerPosition, events : [FootballTypes.PlayerEventData]) : Int16 {
    let totalScore = Array.foldLeft<FootballTypes.PlayerEventData, Int16>(
      events,
      0,
      func(acc : Int16, event : FootballTypes.PlayerEventData) : Int16 {
        return acc + Utilities.calculateIndividualScoreForEvent(event, playerPosition);
      },
    );

    let aggregateScore = Utilities.calculateAggregatePlayerEvents(events, playerPosition);
    return totalScore + aggregateScore;
  };

  private func leagueExists(leagueId : FootballIds.LeagueId) : Bool {
    let foundLeague = Array.find<FootballTypes.League>(
      leagues,
      func(league : FootballTypes.League) : Bool {
        league.id == leagueId;
      },
    );
    return Option.isSome(foundLeague);
  };

  private func seasonExists(leagueId : FootballIds.LeagueId, seasonId : FootballIds.SeasonId) : Bool {

    let foundLeagueSeasons = Array.find<(FootballIds.LeagueId, [FootballTypes.Season])>(
      leagueSeasons,
      func(entry : (FootballIds.LeagueId, [FootballTypes.Season])) : Bool {
        entry.0 == leagueId;
      },
    );
    switch (foundLeagueSeasons) {
      case (?foundSeasons) {
        let leagueSeasonResult = Array.find<FootballTypes.Season>(
          foundSeasons.1,
          func(seasonEntry : FootballTypes.Season) : Bool {
            return seasonEntry.id == seasonId;
          },
        );

        return Option.isSome(leagueSeasonResult);
      };
      case (null) {
        return false;
      };
    };
  };

  private func seasonActive(leagueId : FootballIds.LeagueId) : Bool {
    let leagueStatusResult = Array.find<FootballTypes.LeagueStatus>(
      leagueStatuses,
      func(statusEntry : FootballTypes.LeagueStatus) : Bool {
        statusEntry.leagueId == leagueId;
      },
    );
    switch (leagueStatusResult) {
      case (?leagueStatus) {
        return leagueStatus.seasonActive;
      };
      case (null) {};
    };
    return false;
  };

  private func fixtureExists(leagueId : FootballIds.LeagueId, seasonId : FootballIds.SeasonId, fixtureId : FootballIds.FixtureId) : Bool {
    let foundLeagueSeasons = Array.find<(FootballIds.LeagueId, [FootballTypes.Season])>(
      leagueSeasons,
      func(entry : (FootballIds.LeagueId, [FootballTypes.Season])) : Bool {
        entry.0 == leagueId;
      },
    );
    switch (foundLeagueSeasons) {
      case (?leagueSeasonsEntry) {
        let foundSeason = Array.find<FootballTypes.Season>(
          leagueSeasonsEntry.1,
          func(seasonEntry : FootballTypes.Season) : Bool {
            seasonEntry.id == seasonId;
          },
        );
        switch (foundSeason) {
          case (?foundSeasonEntry) {
            let foundFixture = List.find<FootballTypes.Fixture>(
              foundSeasonEntry.fixtures,
              func(fixtureEntry : FootballTypes.Fixture) : Bool {
                fixtureEntry.id == fixtureId;
              },
            );
            return Option.isSome(foundFixture);
          };
          case (null) {};
        };
      };
      case (null) {};
    };
    return false;
  };

  private func postponedFixtureExists(leagueId : FootballIds.LeagueId, seasonId : FootballIds.SeasonId, fixtureId : FootballIds.FixtureId) : Bool {
    let foundLeagueSeasons = Array.find<(FootballIds.LeagueId, [FootballTypes.Season])>(
      leagueSeasons,
      func(entry : (FootballIds.LeagueId, [FootballTypes.Season])) : Bool {
        entry.0 == leagueId;
      },
    );
    switch (foundLeagueSeasons) {
      case (?leagueSeasonsEntry) {
        let foundSeason = Array.find<FootballTypes.Season>(
          leagueSeasonsEntry.1,
          func(seasonEntry : FootballTypes.Season) : Bool {
            seasonEntry.id == seasonId;
          },
        );
        switch (foundSeason) {
          case (?foundSeasonEntry) {
            let foundFixture = List.find<FootballTypes.Fixture>(
              foundSeasonEntry.postponedFixtures,
              func(fixtureEntry : FootballTypes.Fixture) : Bool {
                fixtureEntry.id == fixtureId;
              },
            );
            return Option.isSome(foundFixture);
          };
          case (null) {};
        };
      };
      case (null) {};
    };
    return false;
  };

  private func clubExists(leagueId : FootballIds.LeagueId, clubId : FootballIds.ClubId) : Bool {

    let league = Array.find<(FootballIds.LeagueId, [FootballTypes.Club])>(
      leagueClubs,
      func(league : (FootballIds.LeagueId, [FootballTypes.Club])) : Bool {
        league.0 == leagueId;
      },
    );

    switch (league) {
      case (?foundLeague) {
        let foundClub = Array.find<FootballTypes.Club>(
          foundLeague.1,
          func(club : FootballTypes.Club) : Bool {
            return club.id == clubId;
          },
        );

        return Option.isSome(foundClub);
      };
      case (null) {
        return false;
      };
    };
  };

  private func checkPlayerExists(leagueId : FootballIds.LeagueId, playerId : FootballIds.PlayerId) : ?FootballTypes.Player {
    let playersInLeague = Array.find<(FootballIds.LeagueId, [FootballTypes.Player])>(
      leaguePlayers,
      func(foundLeaguePlayers : (FootballIds.LeagueId, [FootballTypes.Player])) : Bool {
        foundLeaguePlayers.0 == leagueId;
      },
    );

    switch (playersInLeague) {
      case (?foundPlayersInLeague) {
        let foundPlayer = Array.find<FootballTypes.Player>(
          foundPlayersInLeague.1,
          func(player : FootballTypes.Player) : Bool {
            player.id == playerId;
          },
        );
        return foundPlayer;
      };
      case (null) {
        return null;
      };
    };
  };

  private func validatePlayerEvents(playerEvents : [FootballTypes.PlayerEventData]) : Bool {

    let eventsBelow0 = Array.filter<FootballTypes.PlayerEventData>(
      playerEvents,
      func(event : FootballTypes.PlayerEventData) : Bool {
        return event.eventStartMinute < 0;
      },
    );

    if (Array.size(eventsBelow0) > 0) {
      return false;
    };

    let eventsAbove90 = Array.filter<FootballTypes.PlayerEventData>(
      playerEvents,
      func(event : FootballTypes.PlayerEventData) : Bool {
        return event.eventStartMinute > 90;
      },
    );

    if (Array.size(eventsAbove90) > 0) {
      return false;
    };

    let playerEventsMap : TrieMap.TrieMap<FootballIds.PlayerId, List.List<FootballTypes.PlayerEventData>> = TrieMap.TrieMap<FootballIds.PlayerId, List.List<FootballTypes.PlayerEventData>>(Utilities.eqNat16, Utilities.hashNat16);

    for (playerEvent in Iter.fromArray(playerEvents)) {
      switch (playerEventsMap.get(playerEvent.playerId)) {
        case (null) {};
        case (?existingEvents) {
          playerEventsMap.put(playerEvent.playerId, List.push<FootballTypes.PlayerEventData>(playerEvent, existingEvents));
        };
      };
    };

    for ((playerId, events) in playerEventsMap.entries()) {
      let redCards = List.filter<FootballTypes.PlayerEventData>(
        events,
        func(event : FootballTypes.PlayerEventData) : Bool {
          return event.eventType == #RedCard;
        },
      );

      if (List.size<FootballTypes.PlayerEventData>(redCards) > 1) {
        return false;
      };

      let yellowCards = List.filter<FootballTypes.PlayerEventData>(
        events,
        func(event : FootballTypes.PlayerEventData) : Bool {
          return event.eventType == #YellowCard;
        },
      );

      if (List.size<FootballTypes.PlayerEventData>(yellowCards) > 2) {
        return false;
      };

      if (List.size<FootballTypes.PlayerEventData>(yellowCards) == 2 and List.size<FootballTypes.PlayerEventData>(redCards) != 1) {
        return false;
      };

      let assists = List.filter<FootballTypes.PlayerEventData>(
        events,
        func(event : FootballTypes.PlayerEventData) : Bool {
          return event.eventType == #GoalAssisted;
        },
      );

      for (assist in Iter.fromList(assists)) {
        let goalsAtSameMinute = List.filter<FootballTypes.PlayerEventData>(
          events,
          func(event : FootballTypes.PlayerEventData) : Bool {
            return (event.eventType == #Goal or event.eventType == #OwnGoal) and event.eventStartMinute == assist.eventStartMinute;
          },
        );

        if (List.size<FootballTypes.PlayerEventData>(goalsAtSameMinute) == 0) {
          return false;
        };
      };

      let penaltySaves = List.filter<FootballTypes.PlayerEventData>(
        events,
        func(event : FootballTypes.PlayerEventData) : Bool {
          return event.eventType == #PenaltySaved;
        },
      );

      for (penaltySave in Iter.fromList(penaltySaves)) {
        let penaltyMissesAtSameMinute = List.filter<FootballTypes.PlayerEventData>(
          events,
          func(event : FootballTypes.PlayerEventData) : Bool {
            return event.eventType == #PenaltyMissed and event.eventStartMinute == penaltySave.eventStartMinute;
          },
        );

        if (List.size<FootballTypes.PlayerEventData>(penaltyMissesAtSameMinute) == 0) {
          return false;
        };
      };
    };

    return true;
  };

  private func countryExists(countryId : Ids.CountryId) : Bool {
    let playerCountry = Array.find<BaseTypes.Country>(Countries.countries, func(country : BaseTypes.Country) : Bool { return country.id == countryId });
    return Option.isSome(playerCountry);
  };

  private func logoSizeValid(logo : Blob) : Bool {
    let sizeInKB = Array.size(Blob.toArray(logo)) / 1024;
    return (sizeInKB <= 500);
  };

  system func preupgrade() {};

  system func postupgrade() {
    populateClubSummaries();    
    ignore Timer.setTimer<system>(#nanoseconds(Int.abs(1)), postUpgradeCallback);
  };

  private func postUpgradeCallback() : async () {
    await createFixtureTimers();
    await createTransferWindowStartTimers();
    await createTransferWindowEndTimers();
    await createLoanExpiredTimers();
    await createInjuryExpiredTimers();
    //await createInitialHashes();
    //addDefaultClubsToRequiredStatus();
    //checkRequiredStatus(1); //TODO - ONLY SHOW LEAGUES ON BETTING FOR LEAGUES WITH NO CLUBS THAT REQUIRE DATA
    //await checkRollOverPickTeam();
  };

  private func addDefaultClubsToRequiredStatus() {
    let leagueClubsRequiringDataBuffer = Buffer.fromArray<(FootballIds.LeagueId, [FootballIds.ClubId])>([]);
    for (league in Iter.fromArray(leagueClubs)) {
      leagueClubsRequiringDataBuffer.add(
        league.0,
        Array.map<FootballTypes.Club, FootballIds.ClubId>(
          league.1,
          func(entry : FootballTypes.Club) {
            return entry.id;
          },
        ),
      );
    };
    leagueClubsRequiringData := Buffer.toArray(leagueClubsRequiringDataBuffer);
  };

  private func createInitialHashes() : async () {

    for (league in Iter.fromArray(leagueStatuses)) {
      let _ = await updateDataHash(league.leagueId, "clubs");
      let _ = await updateDataHash(league.leagueId, "seasons");
      let _ = await updateDataHash(league.leagueId, "fixtures");
      let _ = await updateDataHash(league.leagueId, "players");
      let _ = await updateDataHash(league.leagueId, "player_events");
      let _ = await updateDataHash(league.leagueId, "countries");
      let _ = await updateDataHash(league.leagueId, "league_status");
    };

  };

  //Timer Creation Functions

  //Fixture Timer Creation Functions

  private func createFixtureTimers() : async () {
    await createPickTeamRolloverTimers();
    await createActivateFixtureTimers();
    await createCompleteFixtureTimers();
  };

  private func createPickTeamRolloverTimers() : async () {

    for (timerId in Iter.fromArray(pickTeamRollOverTimerIds)) {
      Timer.cancelTimer(timerId);
    };
    pickTeamRollOverTimerIds := [];

    for (leagueSeasonsEntry in Iter.fromArray(leagueSeasons)) {
      let leagueStatusResult = Array.find<FootballTypes.LeagueStatus>(
        leagueStatuses,
        func(statusEntry : FootballTypes.LeagueStatus) : Bool {
          return statusEntry.leagueId == leagueSeasonsEntry.0;
        },
      );

      switch (leagueStatusResult) {
        case (?leagueState) {
          let activeSeason = Array.find<FootballTypes.Season>(
            leagueSeasonsEntry.1,
            func(seasonEntry : FootballTypes.Season) : Bool {
              seasonEntry.id == leagueState.activeSeasonId;
            },
          );

          switch (activeSeason) {
            case (?season) {
              let activeFutureFixtures = List.filter<FootballTypes.Fixture>(
                season.fixtures,
                func(fixture : FootballTypes.Fixture) {
                  fixture.kickOff - Utilities.getHour() >= Time.now();
                },
              ); // TODO
              for (fixture in Iter.fromList(activeFutureFixtures)) {
                let triggerDuration = #nanoseconds(Int.abs((fixture.kickOff - Utilities.getHour() - Time.now())));
                await setTimer(triggerDuration, "rollOverPickTeam");
              };
            };
            case (null) {};
          };
        };
        case (null) {};
      };
    };
  };

  private func createTransferWindowStartTimers() : async () {
    for (timerId in Iter.fromArray(transferWindowStartTimerIds)) {
      Timer.cancelTimer(timerId);
    };
    transferWindowStartTimerIds := [];

    for (leagueSeasonsEntry in Iter.fromArray(leagueSeasons)) {
      let leagueStatusResult = Array.find<FootballTypes.LeagueStatus>(
        leagueStatuses,
        func(statusEntry : FootballTypes.LeagueStatus) : Bool {
          return statusEntry.leagueId == leagueSeasonsEntry.0;
        },
      );

      switch (leagueStatusResult) {
        case (?leagueState) {
          let nextTransferWindowStartDate = Utilities.getNextUnixTimestampForDayMonth(leagueState.transferWindowStartDay, leagueState.transferWindowStartMonth);
          switch (nextTransferWindowStartDate) {
            case (?foundDate) {
              let triggerDuration = #nanoseconds(Int.abs((foundDate - Time.now())));
              await setTimer(triggerDuration, "transferWindowStart");
            };
            case (null) {};
          }

        };
        case (null) {};
      };
    };
  };

  private func createTransferWindowEndTimers() : async () {
    for (timerId in Iter.fromArray(transferWindowEndTimerIds)) {
      Timer.cancelTimer(timerId);
    };
    transferWindowEndTimerIds := [];

    for (leagueSeasonsEntry in Iter.fromArray(leagueSeasons)) {
      let leagueStatusResult = Array.find<FootballTypes.LeagueStatus>(
        leagueStatuses,
        func(statusEntry : FootballTypes.LeagueStatus) : Bool {
          return statusEntry.leagueId == leagueSeasonsEntry.0;
        },
      );

      switch (leagueStatusResult) {
        case (?leagueState) {
          let nextTransferWindowEndDate = Utilities.getNextUnixTimestampForDayMonth(leagueState.transferWindowEndDay, leagueState.transferWindowEndMonth);
          switch (nextTransferWindowEndDate) {
            case (?foundDate) {
              let triggerDuration = #nanoseconds(Int.abs((foundDate - Time.now())));
              await setTimer(triggerDuration, "transferWindowEnd");
            };
            case (null) {};
          }

        };
        case (null) {};
      };
    };
  };

  private func createActivateFixtureTimers() : async () {
    for (timerId in Iter.fromArray(activateFixtureTimerIds)) {
      Timer.cancelTimer(timerId);
    };
    activateFixtureTimerIds := [];
    for (leagueSeasonsEntry in Iter.fromArray(leagueSeasons)) {
      let leagueStatusResult = Array.find<FootballTypes.LeagueStatus>(
        leagueStatuses,
        func(statusEntry : FootballTypes.LeagueStatus) : Bool {
          return statusEntry.leagueId == leagueSeasonsEntry.0;
        },
      );

      switch (leagueStatusResult) {
        case (?leagueState) {
          let activeSeason = Array.find<FootballTypes.Season>(
            leagueSeasonsEntry.1,
            func(seasonEntry : FootballTypes.Season) : Bool {
              seasonEntry.id == leagueState.activeSeasonId;
            },
          );

          switch (activeSeason) {
            case (?season) {

              let unplayedFixtures = List.filter<FootballTypes.Fixture>(
                season.fixtures,
                func(entry : FootballTypes.Fixture) {
                  entry.status == #Unplayed;
                },
              );

              for (fixture in Iter.fromList(unplayedFixtures)) {
                let kickOffDuration = #nanoseconds(Int.abs((fixture.kickOff - Time.now())));
                let _ = setTimer(kickOffDuration, "setFixtureToActive");
              };
            };
            case (null) {};
          };
        };
        case (null) {};
      };
    };
  };

  private func createCompleteFixtureTimers() : async () {
    for (timerId in Iter.fromArray(completeFixtureTimerIds)) {
      Timer.cancelTimer(timerId);
    };
    completeFixtureTimerIds := [];
    for (leagueSeasonsEntry in Iter.fromArray(leagueSeasons)) {
      let leagueStatusResult = Array.find<FootballTypes.LeagueStatus>(
        leagueStatuses,
        func(statusEntry : FootballTypes.LeagueStatus) : Bool {
          return statusEntry.leagueId == leagueSeasonsEntry.0;
        },
      );

      switch (leagueStatusResult) {
        case (?leagueState) {
          let activeSeason = Array.find<FootballTypes.Season>(
            leagueSeasonsEntry.1,
            func(seasonEntry : FootballTypes.Season) : Bool {
              seasonEntry.id == leagueState.activeSeasonId;
            },
          );

          switch (activeSeason) {
            case (?season) {

              let unplayedFixtures = List.filter<FootballTypes.Fixture>(
                season.fixtures,
                func(entry : FootballTypes.Fixture) {
                  entry.status == #Unplayed;
                },
              );

              for (fixture in Iter.fromList(unplayedFixtures)) {
                let gameCompletedDuration = #nanoseconds(Int.abs(((fixture.kickOff + (Utilities.getHour() * 2)) - Time.now())));
                let _ = setTimer(gameCompletedDuration, "setFixtureToComplete");
              };
            };
            case (null) {};
          };
        };
        case (null) {};
      };
    };
  };

  //Player Timer Creation Functions

  private func createLoanExpiredTimers() : async () {
    for (timerId in Iter.fromArray(loanExpiredTimerIds)) {
      Timer.cancelTimer(timerId);
    };
    loanExpiredTimerIds := [];
    for (leaguePlayersEntry in Iter.fromArray(leaguePlayers)) {
      let playersOnLoan = Array.filter<FootballTypes.Player>(
        leaguePlayersEntry.1,
        func(entry : FootballTypes.Player) {
          entry.currentLoanEndDate > 0 and entry.currentLoanEndDate > Time.now()
        },
      );
      for (player in Iter.fromArray(playersOnLoan)) {
        let triggerDuration = #nanoseconds(Int.abs((player.currentLoanEndDate - Time.now())));
        let _ = setTimer(triggerDuration, "loanExpired");
      };
    };
  };

  private func createInjuryExpiredTimers() : async () {
    for (timerId in Iter.fromArray(injuryExpiredTimerIds)) {
      Timer.cancelTimer(timerId);
    };
    injuryExpiredTimerIds := [];
    for (leaguePlayersEntry in Iter.fromArray(leaguePlayers)) {
      let injuredPlayers = Array.filter<FootballTypes.Player>(
        leaguePlayersEntry.1,
        func(entry : FootballTypes.Player) {
          entry.latestInjuryEndDate > 0 and entry.latestInjuryEndDate > Time.now()
        },
      );
      for (player in Iter.fromArray(injuredPlayers)) {
        let triggerDuration = #nanoseconds(Int.abs((player.latestInjuryEndDate - Time.now())));
        let _ = setTimer(triggerDuration, "injuryExpired");
      };
    };
  };

  //Timer Set Functions

  private func setTimer(duration : Timer.Duration, callbackName : Text) : async () {
    switch (callbackName) {
      case "rollOverPickTeam" {
        let timerBuffer = Buffer.fromArray<Nat>(pickTeamRollOverTimerIds);
        let result = Timer.setTimer<system>(duration, checkRollOverPickTeam);
        timerBuffer.add(result);
        pickTeamRollOverTimerIds := Buffer.toArray(timerBuffer);
      };
      case "transferWindowStart" {
        let timerBuffer = Buffer.fromArray<Nat>(transferWindowStartTimerIds);
        let result = Timer.setTimer<system>(duration, transferWindowStart);
        timerBuffer.add(result);
        transferWindowStartTimerIds := Buffer.toArray(timerBuffer);
      };
      case "transferWindowEnd" {
        let timerBuffer = Buffer.fromArray<Nat>(transferWindowEndTimerIds);
        let result = Timer.setTimer<system>(duration, transferWindowEnd);
        timerBuffer.add(result);
        transferWindowEndTimerIds := Buffer.toArray(timerBuffer);
      };
      case "setFixtureToActive" {
        let timerBuffer = Buffer.fromArray<Nat>(activateFixtureTimerIds);
        let result = Timer.setTimer<system>(duration, setFixtureToActive);
        timerBuffer.add(result);
        activateFixtureTimerIds := Buffer.toArray(timerBuffer);
      };
      case "setFixtureToComplete" {
        let timerBuffer = Buffer.fromArray<Nat>(completeFixtureTimerIds);
        let result = Timer.setTimer<system>(duration, setFixtureToComplete);
        timerBuffer.add(result);
        completeFixtureTimerIds := Buffer.toArray(timerBuffer);
      };
      case "loanExpired" {
        let timerBuffer = Buffer.fromArray<Nat>(loanExpiredTimerIds);
        let result = Timer.setTimer<system>(duration, loanExpiredCallback);
        timerBuffer.add(result);
        loanExpiredTimerIds := Buffer.toArray(timerBuffer);
      };
      case "injuryExpired" {
        let timerBuffer = Buffer.fromArray<Nat>(injuryExpiredTimerIds);
        let result = Timer.setTimer<system>(duration, injuryExpiredCallback);
        timerBuffer.add(result);
        injuryExpiredTimerIds := Buffer.toArray(timerBuffer);
      };
      case _ {};
    };
  };

  //Timer Callback Functions

  private func checkRollOverPickTeam() : async () {
    label leagueLoop for (league in Iter.fromArray(leagueSeasons)) {
      let leagueStatusResult = Array.find<FootballTypes.LeagueStatus>(
        leagueStatuses,
        func(statusEntry : FootballTypes.LeagueStatus) : Bool {
          statusEntry.leagueId == league.0;
        },
      );
      switch (leagueStatusResult) {
        case (?leagueStatus) {

          let seasonEntry = Array.find<FootballTypes.Season>(
            league.1,
            func(seasonEntry : FootballTypes.Season) : Bool {
              seasonEntry.id == leagueStatus.activeSeasonId;
            },
          );

          switch (seasonEntry) {
            case (?season) {
              let sortedFixtures = Array.sort<FootballTypes.Fixture>(
                List.toArray<FootballTypes.Fixture>(season.fixtures),
                func(a : FootballTypes.Fixture, b : FootballTypes.Fixture) {
                  if (a.kickOff < b.kickOff) {
                    return #less;
                  } else if (a.kickOff > b.kickOff) {
                    return #greater;
                  } else {
                    return #equal;
                  };
                },
              );

              if (Array.size(sortedFixtures) <= 1) {
                continue leagueLoop;
              };

              var nextFixtureIndex = 0;
              label fixtureLoop for (fixture in Iter.fromArray(sortedFixtures)) {
                if (fixture.kickOff > Time.now()) {
                  break fixtureLoop;
                };
                nextFixtureIndex += 1;
              };

              let nextFixture = sortedFixtures[nextFixtureIndex];

              var activeGameweek : FootballDefinitions.GameweekNumber = 0;
              var completedGameweek : FootballDefinitions.GameweekNumber = nextFixture.gameweek - 1;
              var unplayedGameweek : FootballDefinitions.GameweekNumber = nextFixture.gameweek;

              let nextFixtureGameweekFixtures = Array.filter<FootballTypes.Fixture>(
                sortedFixtures,
                func(fixtureEntry : FootballTypes.Fixture) {
                  fixtureEntry.gameweek == nextFixture.gameweek;
                },
              );

              let nextFixtureGameweekFixturesBeforeNow = Array.filter<FootballTypes.Fixture>(
                nextFixtureGameweekFixtures,
                func(fixtureEntry : FootballTypes.Fixture) {
                  fixtureEntry.kickOff < Time.now();
                },
              );

              if (Array.size(nextFixtureGameweekFixturesBeforeNow) > 0) {
                activeGameweek := nextFixture.gameweek;
                unplayedGameweek := activeGameweek + 1;
                setLeagueGameweek(leagueStatus.leagueId, unplayedGameweek, activeGameweek, completedGameweek, nextFixtureGameweekFixtures[0].kickOff);
                let _ = await notificationManager.distributeNotification(#BeginGameweek, #BeginGameweek {  });
              };
            };
            case (null) {};
          };
        };
        case (null) {};
      };
    };
  };

  private func transferWindowStart() : async () {
    for (league in Iter.fromArray(leagueStatuses)) {
      let transferWindowStartDate : Int = 0;
      let transferWindowEndDate : Int = 0;

      let now = Time.now();

      if (not league.transferWindowActive and now >= transferWindowStartDate and now <= transferWindowEndDate) {
        leagueStatuses := Array.map<FootballTypes.LeagueStatus, FootballTypes.LeagueStatus>(
          leagueStatuses,
          func(statusEntry : FootballTypes.LeagueStatus) {
            if (statusEntry.leagueId == league.leagueId) {
              return {
                activeMonth = statusEntry.activeMonth;
                activeSeasonId = statusEntry.activeSeasonId;
                activeGameweek = statusEntry.activeGameweek;
                completedGameweek = statusEntry.completedGameweek;
                unplayedGameweek = statusEntry.unplayedGameweek;
                leagueId = statusEntry.leagueId;
                seasonActive = statusEntry.seasonActive;
                totalGameweeks = statusEntry.totalGameweeks;
                transferWindowActive = true;
                transferWindowEndDay = statusEntry.transferWindowEndDay;
                transferWindowEndMonth = statusEntry.transferWindowEndMonth;
                transferWindowStartDay = statusEntry.transferWindowStartDay;
                transferWindowStartMonth = statusEntry.transferWindowStartMonth;
              };
            } else {
              return statusEntry;
            };
          },
        );
      };
    };
  };

  private func transferWindowEnd() : async () {
    for (league in Iter.fromArray(leagueStatuses)) {
      let transferWindowEndDate : Int = 0;

      let now = Time.now();

      if (league.transferWindowActive and now > transferWindowEndDate) {
        leagueStatuses := Array.map<FootballTypes.LeagueStatus, FootballTypes.LeagueStatus>(
          leagueStatuses,
          func(statusEntry : FootballTypes.LeagueStatus) {
            if (not statusEntry.transferWindowActive and statusEntry.leagueId == league.leagueId) {
              return {
                activeMonth = statusEntry.activeMonth;
                activeSeasonId = statusEntry.activeSeasonId;
                activeGameweek = statusEntry.activeGameweek;
                completedGameweek = statusEntry.completedGameweek;
                unplayedGameweek = statusEntry.unplayedGameweek;
                leagueId = statusEntry.leagueId;
                seasonActive = statusEntry.seasonActive;
                totalGameweeks = statusEntry.totalGameweeks;
                transferWindowActive = false;
                transferWindowEndDay = statusEntry.transferWindowEndDay;
                transferWindowEndMonth = statusEntry.transferWindowEndMonth;
                transferWindowStartDay = statusEntry.transferWindowStartDay;
                transferWindowStartMonth = statusEntry.transferWindowStartMonth;
              };
            } else {
              return statusEntry;
            };
          },
        );
      };
    };
  };

  private func setFixtureToActive() : async () {
    leagueSeasons := Array.map<(FootballIds.LeagueId, [FootballTypes.Season]), (FootballIds.LeagueId, [FootballTypes.Season])>(
      leagueSeasons,
      func(leagueSeasonsEntry : (FootballIds.LeagueId, [FootballTypes.Season])) {

        let leagueStatusResult = Array.find<FootballTypes.LeagueStatus>(
          leagueStatuses,
          func(statusEntry : FootballTypes.LeagueStatus) : Bool {
            statusEntry.leagueId == leagueSeasonsEntry.0;
          },
        );

        switch (leagueStatusResult) {
          case (?leagueStatus) {

            return (
              leagueSeasonsEntry.0,
              Array.map<FootballTypes.Season, FootballTypes.Season>(
                leagueSeasonsEntry.1,
                func(season : FootballTypes.Season) {
                  if (season.id == leagueStatus.activeSeasonId) {
                    return {
                      fixtures = List.map<FootballTypes.Fixture, FootballTypes.Fixture>(
                        season.fixtures,
                        func(fixture : FootballTypes.Fixture) {

                          let now = Time.now();
                          let fixtureEndTime = fixture.kickOff + (Utilities.getHour() * 2);

                          if (fixture.gameweek == leagueStatus.activeGameweek and fixture.status == #Unplayed and now <= fixtureEndTime) {
                            checkRequiredStatus(leagueStatus.leagueId);
                            return {
                              awayClubId = fixture.awayClubId;
                              awayGoals = fixture.awayGoals;
                              events = fixture.events;
                              gameweek = fixture.gameweek;
                              highestScoringPlayerId = fixture.highestScoringPlayerId;
                              homeClubId = fixture.homeClubId;
                              homeGoals = fixture.homeGoals;
                              id = fixture.id;
                              kickOff = fixture.kickOff;
                              seasonId = fixture.seasonId;
                              status = #Active;
                            };
                          } else {
                            return fixture;
                          };

                        },
                      );
                      id = season.id;
                      name = season.name;
                      postponedFixtures = season.postponedFixtures;
                      year = season.year;
                    };
                  } else {
                    return season;
                  };
                },
              ),
            );

          };
          case (null) {
            return leagueSeasonsEntry;
          };
        };
      },
    );
  };

  private func setFixtureToComplete() : async () {
    var completedFixtureLeagueId : Nat16 = 0;
    var completeFixtureSeasonId : Nat16 = 0;
    var compeltedFixtureGameweek : Nat8 = 0;

    leagueSeasons := Array.map<(FootballIds.LeagueId, [FootballTypes.Season]), (FootballIds.LeagueId, [FootballTypes.Season])>(
      leagueSeasons,
      func(leagueSeasonsEntry : (FootballIds.LeagueId, [FootballTypes.Season])) {

        let leagueStatusResult = Array.find<FootballTypes.LeagueStatus>(
          leagueStatuses,
          func(statusEntry : FootballTypes.LeagueStatus) : Bool {
            statusEntry.leagueId == leagueSeasonsEntry.0;
          },
        );

        switch (leagueStatusResult) {
          case (?leagueStatus) {

            return (
              leagueSeasonsEntry.0,
              Array.map<FootballTypes.Season, FootballTypes.Season>(
                leagueSeasonsEntry.1,
                func(season : FootballTypes.Season) {
                  if (season.id == leagueStatus.activeSeasonId) {
                    return {
                      fixtures = List.map<FootballTypes.Fixture, FootballTypes.Fixture>(
                        season.fixtures,
                        func(fixture : FootballTypes.Fixture) {

                          let now = Time.now();
                          let fixtureEndTime = fixture.kickOff + (Utilities.getHour() * 2);

                          if (fixture.gameweek == leagueStatus.activeGameweek and fixture.status == #Active and now > fixtureEndTime) {
                            checkRequiredStatus(leagueStatus.leagueId);
                            completedFixtureLeagueId := leagueStatus.leagueId;
                            completeFixtureSeasonId := fixture.seasonId;
                            compeltedFixtureGameweek := fixture.gameweek;
                            return {
                              awayClubId = fixture.awayClubId;
                              awayGoals = fixture.awayGoals;
                              events = fixture.events;
                              gameweek = fixture.gameweek;
                              highestScoringPlayerId = fixture.highestScoringPlayerId;
                              homeClubId = fixture.homeClubId;
                              homeGoals = fixture.homeGoals;
                              id = fixture.id;
                              kickOff = fixture.kickOff;
                              seasonId = fixture.seasonId;
                              status = #Complete;
                            };
                          } else {
                            return fixture;
                          };

                        },
                      );
                      id = season.id;
                      name = season.name;
                      postponedFixtures = season.postponedFixtures;
                      year = season.year;
                    };
                  } else {
                    return season;
                  };
                },
              ),
            );

          };
          case (null) {
            return leagueSeasonsEntry;
          };
        };
      },
    );

    if (completedFixtureLeagueId > 0 and completeFixtureSeasonId > 0 and compeltedFixtureGameweek > 0) {
      let _ = await notificationManager.distributeNotification(#CompleteFixture, #CompleteFixture {  });
    };
  };

  private func checkRequiredStatus(leagueId : FootballIds.LeagueId) {
    let filteredLeagueSeasons = Array.find<(FootballIds.LeagueId, [FootballTypes.Season])>(
      leagueSeasons,
      func(currentLeagueSeason : (FootballIds.LeagueId, [FootballTypes.Season])) : Bool {
        currentLeagueSeason.0 == leagueId;
      },
    );

    switch (filteredLeagueSeasons) {
      case (?foundLeagueSeasons) {

        let status = Array.find<FootballTypes.LeagueStatus>(
          leagueStatuses,
          func(entry : FootballTypes.LeagueStatus) : Bool {
            entry.leagueId == leagueId;
          },
        );
        switch (status) {
          case (?foundStatus) {

            let filteredSeason = Array.find<FootballTypes.Season>(
              foundLeagueSeasons.1,
              func(leagueSeason : FootballTypes.Season) : Bool {
                leagueSeason.id == foundStatus.activeSeasonId;
              },
            );

            switch (filteredSeason) {
              case (?foundSeason) {

                let unfinalisedFixturesInPast = List.filter<FootballTypes.Fixture>(
                  foundSeason.fixtures,
                  func(entry : FootballTypes.Fixture) {
                    entry.kickOff < Time.now() and entry.status != #Finalised;
                  },
                );

                let clubIdBuffer = Buffer.fromArray<FootballIds.ClubId>([]);

                for (fixture in Iter.fromList(unfinalisedFixturesInPast)) {
                  clubIdBuffer.add(fixture.homeClubId);
                  clubIdBuffer.add(fixture.awayClubId);
                };

                leagueClubsRequiringData := Array.map<(FootballIds.LeagueId, [FootballIds.ClubId]), (FootballIds.LeagueId, [FootballIds.ClubId])>(
                  leagueClubsRequiringData,
                  func(entry : (FootballIds.LeagueId, [FootballIds.ClubId])) {
                    if (entry.0 == leagueId) {
                      Buffer.removeDuplicates<FootballIds.ClubId>(clubIdBuffer, Nat16.compare);
                      let clubIds = Buffer.toArray<FootballIds.ClubId>(clubIdBuffer);
                      return (entry.0, clubIds);
                    } else {
                      return entry;
                    };
                  },
                );
              };
              case (null) {};
            };
          };
          case (null) {};
        };
      };
      case (null) {};
    };
  };

  private func addRequireStatusToClub(leagueId : FootballIds.LeagueId, nextClubId : FootballIds.LeagueId) {
    leagueClubsRequiringData := Array.map<(FootballIds.LeagueId, [FootballIds.ClubId]), (FootballIds.LeagueId, [FootballIds.ClubId])>(
      leagueClubsRequiringData,
      func(entry : (FootballIds.LeagueId, [FootballIds.ClubId])) {
        if (entry.0 == leagueId) {
          let clubIdBuffer = Buffer.fromArray<FootballIds.ClubId>([]);
          clubIdBuffer.add(nextClubId);
          return (entry.0, Buffer.toArray(clubIdBuffer));
        } else {
          return entry;
        };
      },
    );

    let filteredLeagueSeasons = Array.find<(FootballIds.LeagueId, [FootballTypes.Season])>(
      leagueSeasons,
      func(currentLeagueSeason : (FootballIds.LeagueId, [FootballTypes.Season])) : Bool {
        currentLeagueSeason.0 == leagueId;
      },
    );

    switch (filteredLeagueSeasons) {
      case (?foundLeagueSeasons) {

        let status = Array.find<FootballTypes.LeagueStatus>(
          leagueStatuses,
          func(entry : FootballTypes.LeagueStatus) : Bool {
            entry.leagueId == leagueId;
          },
        );
        switch (status) {
          case (?foundStatus) {

            let filteredSeason = Array.find<FootballTypes.Season>(
              foundLeagueSeasons.1,
              func(leagueSeason : FootballTypes.Season) : Bool {
                leagueSeason.id == foundStatus.activeSeasonId;
              },
            );

            switch (filteredSeason) {
              case (?foundSeason) {

                let unfinalisedFixturesInPast = List.filter<FootballTypes.Fixture>(
                  foundSeason.fixtures,
                  func(entry : FootballTypes.Fixture) {
                    entry.kickOff < Time.now() and entry.status != #Finalised;
                  },
                );

                let clubIdBuffer = Buffer.fromArray<FootballIds.ClubId>([]);

                for (fixture in Iter.fromList(unfinalisedFixturesInPast)) {
                  clubIdBuffer.add(fixture.homeClubId);
                  clubIdBuffer.add(fixture.awayClubId);
                };

              };
              case (null) {};
            };
          };
          case (null) {};
        };
      };
      case (null) {};
    };
  };

  private func loanExpiredCallback() : async () {

    for (leaguePlayersEntry in Iter.fromArray(leaguePlayers)) {
      let playersToRecall = Array.filter<FootballTypes.Player>(
        leaguePlayersEntry.1,
        func(currentPlayer : FootballTypes.Player) : Bool {
          return currentPlayer.status == #OnLoan and currentPlayer.currentLoanEndDate <= Time.now() and currentPlayer.currentLoanEndDate != 0;
        },
      );

      for (player in Iter.fromArray(playersToRecall)) {
        leaguePlayers := Array.map<(FootballIds.LeagueId, [FootballTypes.Player]), (FootballIds.LeagueId, [FootballTypes.Player])>(
          leaguePlayers,
          func(entry : (FootballIds.LeagueId, [FootballTypes.Player])) {
            if (entry.0 == leaguePlayersEntry.0 and leaguePlayersEntry.0 == player.parentLeagueId) {
              return (
                entry.0,
                Array.map<FootballTypes.Player, FootballTypes.Player>(
                  entry.1,
                  func(playerEntry : FootballTypes.Player) {
                    if (playerEntry.id == player.id) {
                      return {
                        clubId = playerEntry.parentClubId;
                        currentLoanEndDate = 0;
                        dateOfBirth = playerEntry.dateOfBirth;
                        firstName = playerEntry.firstName;
                        gender = playerEntry.gender;
                        id = playerEntry.id;
                        injuryHistory = playerEntry.injuryHistory;
                        lastName = playerEntry.lastName;
                        latestInjuryEndDate = playerEntry.latestInjuryEndDate;
                        leagueId = playerEntry.leagueId;
                        nationality = playerEntry.nationality;
                        parentClubId = 0;
                        parentLeagueId = 0;
                        position = playerEntry.position;
                        retirementDate = playerEntry.retirementDate;
                        seasons = playerEntry.seasons;
                        shirtNumber = playerEntry.shirtNumber;
                        status = playerEntry.status;
                        transferHistory = playerEntry.transferHistory;
                        valueHistory = playerEntry.valueHistory;
                        valueQuarterMillions = playerEntry.valueQuarterMillions;
                      };
                    } else {
                      return playerEntry;
                    };
                  },
                ),
              );
            } else if (entry.0 == leaguePlayersEntry.0) {
              return (
                entry.0,
                Array.filter<FootballTypes.Player>(
                  entry.1,
                  func(playerEntry : FootballTypes.Player) {
                    playerEntry.id != player.id;
                  },
                ),
              );
            } else if (entry.0 == player.parentLeagueId) {
              let playerBuffer = Buffer.fromArray<FootballTypes.Player>(entry.1);
              playerBuffer.add({
                clubId = player.parentClubId;
                currentLoanEndDate = 0;
                dateOfBirth = player.dateOfBirth;
                firstName = player.firstName;
                gender = player.gender;
                id = player.id;
                injuryHistory = player.injuryHistory;
                lastName = player.lastName;
                latestInjuryEndDate = player.latestInjuryEndDate;
                leagueId = player.parentLeagueId;
                nationality = player.nationality;
                parentClubId = 0;
                parentLeagueId = 0;
                position = player.position;
                retirementDate = player.retirementDate;
                seasons = player.seasons;
                shirtNumber = player.shirtNumber;
                status = #Active;
                transferHistory = player.transferHistory;
                valueHistory = player.valueHistory;
                valueQuarterMillions = player.valueQuarterMillions;
              });
              return (entry.0, Buffer.toArray(playerBuffer));
            } else {
              return entry;
            };
          },
        );

        let _ = await notificationManager.distributeNotification(#ExpireLoan, #ExpireLoan {  });
      };
    };
  };

  private func injuryExpiredCallback() : async () {
    leaguePlayers := Array.map<(FootballIds.LeagueId, [FootballTypes.Player]), (FootballIds.LeagueId, [FootballTypes.Player])>(
      leaguePlayers,
      func(leaguePlayersEntry : (FootballIds.LeagueId, [FootballTypes.Player])) {
        return (
          leaguePlayersEntry.0,
          Array.map<FootballTypes.Player, FootballTypes.Player>(
            leaguePlayersEntry.1,
            func(playersEntry : FootballTypes.Player) {
              if (playersEntry.latestInjuryEndDate <= Time.now()) {
                return {
                  clubId = playersEntry.clubId;
                  currentLoanEndDate = playersEntry.currentLoanEndDate;
                  dateOfBirth = playersEntry.dateOfBirth;
                  firstName = playersEntry.firstName;
                  gender = playersEntry.gender;
                  id = playersEntry.id;
                  injuryHistory = playersEntry.injuryHistory;
                  lastName = playersEntry.lastName;
                  latestInjuryEndDate = 0;
                  leagueId = playersEntry.leagueId;
                  nationality = playersEntry.nationality;
                  parentClubId = playersEntry.parentClubId;
                  parentLeagueId = playersEntry.parentLeagueId;
                  position = playersEntry.position;
                  retirementDate = playersEntry.retirementDate;
                  seasons = playersEntry.seasons;
                  shirtNumber = playersEntry.shirtNumber;
                  status = playersEntry.status;
                  transferHistory = playersEntry.transferHistory;
                  valueHistory = playersEntry.valueHistory;
                  valueQuarterMillions = playersEntry.valueQuarterMillions;
                };
              } else {
                return playersEntry;
              };
            },
          ),
        );
        return leaguePlayersEntry;
      },
    );
  };

  /*

  //Application Notification Functions
  private func notifyAppsOfLoan(leagueId : FootballIds.LeagueId, playerId : FootballIds.PlayerId) : async Result.Result<(), Enums.Error> {
    for (leagueApplication in Iter.fromArray(leagueApplications)) {
      if (leagueApplication.0 == leagueId) {
        let application_canister = actor (leagueApplication.1) : actor {
          notifyAppsOfLoan : (leagueId : FootballIds.LeagueId, playerId : FootballIds.PlayerId) -> async Result.Result<(), Enums.Error>;
        };

        try {
          let _ = await application_canister.notifyAppsOfLoan(leagueId, playerId);

        } catch _ {

          return #err(#FailedInterCanisterCall);
        };
      };
    };
    return #ok();
  };

  private func notifyAppsOfLoanExpired(leagueId : FootballIds.LeagueId, playerId : FootballIds.PlayerId) : async Result.Result<(), Enums.Error> {
    for (leagueApplication in Iter.fromArray(leagueApplications)) {
      if (leagueApplication.0 == leagueId) {
        let application_canister = actor (leagueApplication.1) : actor {
          notifyAppsOfLoanExpired : (leagueId : FootballIds.LeagueId, playerId : FootballIds.PlayerId) -> async Result.Result<(), Enums.Error>;
        };
        try {
          let _ = await application_canister.notifyAppsOfLoanExpired(leagueId, playerId);
        } catch _ {
          return #err(#FailedInterCanisterCall);
        };
      };
    };
    return #ok();
  };

  private func notifyAppsOfTransfer(leagueId : FootballIds.LeagueId, playerId : FootballIds.PlayerId) : async Result.Result<(), Enums.Error> {
    for (leagueApplication in Iter.fromArray(leagueApplications)) {
      if (leagueApplication.0 == leagueId) {
        let application_canister = actor (leagueApplication.1) : actor {
          notifyAppsOfTransfer : (leagueId : FootballIds.LeagueId, playerId : FootballIds.PlayerId) -> async Result.Result<(), Enums.Error>;
        };
        try {
          let _ = await application_canister.notifyAppsOfTransfer(leagueId, playerId);
        } catch _ {
          return #err(#FailedInterCanisterCall);
        };
      };
    };
    return #ok();
  };

  private func notifyAppsOfRetirement(leagueId : FootballIds.LeagueId, playerId : FootballIds.PlayerId) : async Result.Result<(), Enums.Error> {
    for (leagueApplication in Iter.fromArray(leagueApplications)) {
      if (leagueApplication.0 == leagueId) {
        let application_canister = actor (leagueApplication.1) : actor {
          notifyAppsOfRetirement : (leagueId : FootballIds.LeagueId, playerId : FootballIds.PlayerId) -> async Result.Result<(), Enums.Error>;
        };
        try {
          let _ = await application_canister.notifyAppsOfRetirement(leagueId, playerId);
        } catch _ {
          return #err(#FailedInterCanisterCall);
        };
      };
    };
    return #ok();
  };

  private func notifyAppsOfPositionChange(leagueId : FootballIds.LeagueId, playerId : FootballIds.PlayerId) : async Result.Result<(), Enums.Error> {
    for (leagueApplication in Iter.fromArray(leagueApplications)) {
      if (leagueApplication.0 == leagueId) {
        let application_canister = actor (leagueApplication.1) : actor {
          notifyAppsOfPositionChange : (leagueId : FootballIds.LeagueId, playerId : FootballIds.PlayerId) -> async Result.Result<(), Enums.Error>;
        };
        try {
          let _ = await application_canister.notifyAppsOfPositionChange(leagueId, playerId);
        } catch _ {
          return #err(#FailedInterCanisterCall);
        };
      };
    };
    return #ok();
  };

  //Fixture Notification Functions

  private func notifyAppsOfGameweekStarting(leagueId : FootballIds.LeagueId, seasonId : FootballIds.SeasonId, gameweek : FootballDefinitions.GameweekNumber) : async Result.Result<(), Enums.Error> {
    for (leagueApplication in Iter.fromArray(leagueApplications)) {
      if (leagueApplication.0 == leagueId) {
        let application_canister = actor (leagueApplication.1) : actor {
          notifyAppsOfGameweekStarting : (leagueId : FootballIds.LeagueId, seasonId : FootballIds.SeasonId, gameweek : FootballDefinitions.GameweekNumber) -> async Result.Result<(), Enums.Error>;
        };
        try {
          let _ = await application_canister.notifyAppsOfGameweekStarting(leagueId, seasonId, gameweek);
        } catch _ {
          return #err(#FailedInterCanisterCall);
        };
      };
    };
    return #ok();
  };

  private func notifyAppsOfFixtureComplete(leagueId : FootballIds.LeagueId, seasonId : FootballIds.SeasonId, gameweek : FootballDefinitions.GameweekNumber) : async Result.Result<(), Enums.Error> {
    for (leagueApplication in Iter.fromArray(leagueApplications)) {
      if (leagueApplication.0 == leagueId) {
        let application_canister = actor (leagueApplication.1) : actor {
          notifyAppsOfFixtureComplete : (leagueId : FootballIds.LeagueId, seasonId : FootballIds.SeasonId, gameweek : FootballDefinitions.GameweekNumber) -> async Result.Result<(), Enums.Error>;
        };
        try {
          let _ = await application_canister.notifyAppsOfFixtureComplete(leagueId, seasonId, gameweek);
        } catch _ {
          return #err(#FailedInterCanisterCall);
        };
      };
    };
    return #ok();
  };

  private func notifyAppsOfFixtureFinalised(leagueId : FootballIds.LeagueId, seasonId : FootballIds.SeasonId, gameweek : FootballDefinitions.GameweekNumber) : async Result.Result<(), Enums.Error> {
    for (leagueApplication in Iter.fromArray(leagueApplications)) {
      if (leagueApplication.0 == leagueId) {
        let application_canister = actor (leagueApplication.1) : actor {
          notifyAppsOfFixtureFinalised : (leagueId : FootballIds.LeagueId, seasonId : FootballIds.SeasonId, gameweek : FootballDefinitions.GameweekNumber) -> async Result.Result<(), Enums.Error>;
        };
        try {
          let _ = await application_canister.notifyAppsOfFixtureFinalised(leagueId, seasonId, gameweek);
        } catch _ {
          return #err(#FailedInterCanisterCall);
        };
      };
    };
    return #ok();
  };

  private func notifyAppsOfSeasonComplete(leagueId : FootballIds.LeagueId, seasonId : FootballIds.SeasonId) : async Result.Result<(), Enums.Error> {
    for (leagueApplication in Iter.fromArray(leagueApplications)) {
      if (leagueApplication.0 == leagueId) {
        let application_canister = actor (leagueApplication.1) : actor {
          notifyAppsOfSeasonComplete : (leagueId : FootballIds.LeagueId, seasonId : FootballIds.SeasonId) -> async Result.Result<(), Enums.Error>;
        };
        try {
          let _ = await application_canister.notifyAppsOfSeasonComplete(leagueId, seasonId);
        } catch _ {
          return #err(#FailedInterCanisterCall);
        };
      };
    };
    return #ok();
  };

  */

  //Private data update functions

  private func setLeagueGameweek(leagueId : FootballIds.LeagueId, unplayedGameweek : FootballDefinitions.GameweekNumber, activeGameweek : FootballDefinitions.GameweekNumber, completedGameweek : FootballDefinitions.GameweekNumber, earliestGameweekKickOffTime : Int) {

    leagueStatuses := Array.map<FootballTypes.LeagueStatus, FootballTypes.LeagueStatus>(
      leagueStatuses,
      func(status : FootballTypes.LeagueStatus) {

        let activeMonth : BaseDefinitions.CalendarMonth = Utilities.unixTimeToMonth(earliestGameweekKickOffTime);

        if (status.leagueId == leagueId) {
          return {
            activeMonth = activeMonth;
            activeSeasonId = status.activeSeasonId;
            activeGameweek = activeGameweek;
            completedGameweek = completedGameweek;
            unplayedGameweek = unplayedGameweek;
            leagueId = status.leagueId;
            seasonActive = status.seasonActive;
            transferWindowActive = status.transferWindowActive;
            totalGameweeks = status.totalGameweeks;
            transferWindowStartDay = status.transferWindowStartDay;
            transferWindowStartMonth = status.transferWindowStartMonth;
            transferWindowEndDay = status.transferWindowEndDay;
            transferWindowEndMonth = status.transferWindowEndMonth;
          };
        } else {
          return status;
        };
      },
    );
  };

  private func updateDataHash(leagueId : FootballIds.LeagueId, category : Text) : async () {
    let randomHash = await SHA224.getRandomHash();

    var updated = false;

    leagueDataHashes := Array.map<(FootballIds.LeagueId, [BaseTypes.DataHash]), (FootballIds.LeagueId, [BaseTypes.DataHash])>(
      leagueDataHashes,
      func(entry : (FootballIds.LeagueId, [BaseTypes.DataHash])) {
        if (entry.0 == leagueId) {
          let hashBuffer = Buffer.fromArray<BaseTypes.DataHash>([]);
          for (hashObj in Iter.fromArray(entry.1)) {
            if (hashObj.category == category) {
              hashBuffer.add({ category = hashObj.category; hash = randomHash });
              updated := true;
            } else { hashBuffer.add(hashObj) };
          };
          if (not updated) {
            hashBuffer.add({ category = category; hash = randomHash });
            updated := true;
          };
          return (entry.0, Buffer.toArray(hashBuffer));
        } else {
          return entry;
        };
      },
    );

  };

  private func populateClubSummaries() {
    /*
    
    let clubSummaryBuffer = Buffer.fromArray<SummaryTypes.ClubSummary>([]);

    for(league in Iter.fromArray(leagueClubs)){
      for(club in Iter.fromArray(league.1)){
        clubSummaryBuffer.add({
          clubId = club.id;
          clubName = club.name;
          leagueId = league.0;
          position = 0;
          positionText = "-";
          primaryColour = club.primaryColourHex;
          secondaryColour = club.secondaryColourHex;
          shirtType = club.shirtType;
          thirdColour = club.thirdColourHex;
          totalValue = getClubTotalValue(league.0, club.id);
          gender = club.gender;
        })
      }
    };

    let sortedClubSummaries = Array.sort(
      Buffer.toArray(clubSummaryBuffer),
      func(entry1 : SummaryTypes.ClubSummary, entry2 : SummaryTypes.ClubSummary) : Order.Order {
        if (entry1.totalValue < entry2.totalValue) { return #greater };
        if (entry1.totalValue == entry2.totalValue) { return #equal };
        return #less;
      },
    );

    var position: Nat = 1;
    let positionedBuffer = Buffer.fromArray<SummaryTypes.ClubSummary>([]);

    for(sortedEntry in Iter.fromArray(sortedClubSummaries)){
      positionedBuffer.add({
        clubId = sortedEntry.clubId;
        clubName = sortedEntry.clubName;
        leagueId = sortedEntry.leagueId;
        position = position;
        positionText = Nat.toText(position);
        primaryColour = sortedEntry.primaryColour;
        secondaryColour = sortedEntry.secondaryColour;
        shirtType = sortedEntry.shirtType;
        thirdColour = sortedEntry.thirdColour;
        totalValue = sortedEntry.totalValue;
      });
      position += 1;
    };

    clubSummaries := sortedClubSummaries;
    */
  };

  private func remapData(){
    //if league id == 2
      //set as womens clubs
        //give new club ids
        
  };
  
  private func getClubTotalValue(leagueId: FootballIds.LeagueId, clubId: FootballIds.ClubId) : Nat16 {

    var totalClubValue: Nat16 = 0;

    for(league in Iter.fromArray(leaguePlayers)){
      if(league.0 == leagueId){
        for(player in Iter.fromArray(league.1)){
          if(player.clubId == clubId){
            totalClubValue += player.valueQuarterMillions 
          }
        }
      };
    };

    return totalClubValue;
  };

};
