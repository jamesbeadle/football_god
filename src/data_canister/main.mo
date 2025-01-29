  import Array "mo:base/Array";
  import Blob "mo:base/Blob";
  import Bool "mo:base/Bool";
  import Buffer "mo:base/Buffer";
  import Int "mo:base/Int";
  import Iter "mo:base/Iter";
  import List "mo:base/List";
  import Nat16 "mo:base/Nat16";
  import Option "mo:base/Option";
  import Order "mo:base/Order";
  import Principal "mo:base/Principal";
  import Result "mo:base/Result";
  import Text "mo:base/Text";
  import Time "mo:base/Time";
  import Timer "mo:base/Timer";
  import TrieMap "mo:base/TrieMap";
  import Debug "mo:base/Debug";
  
  import Base "../backend/types/base_types";
  import FootballTypes "../backend/types/football_types";
  import T "../backend/types/app_types";

  import RequestDTOs "../backend/dtos/request_DTOs";
  import ResponseDTOs "../backend/dtos/response_DTOs";
  import GovernanceDTOs "../backend/dtos/governance_DTOs";
  
  import Countries "../backend/utilities/Countries";
  import Utilities "../backend/utilities/utilities";
  import SHA224 "../backend/utilities/SHA224";
  
  import Environment "environment";
  
  actor Self {
      
    private var leagueApplications: [(FootballTypes.LeagueId, Base.CanisterId)] = [(1, Environment.OPENFPL_BACKEND_CANISTER_ID), (2, Environment.OPENWSL_BACKEND_CANISTER_ID)];

    private stable var leagues : [FootballTypes.League] = [
      {
        id = 1;
        name = "Premier League";
        abbreviation = "EPL";
        teamCount = 20;
        relatedGender = #Male;
        governingBody = "FA";
        countryId = 186;
        formed = 698544000000000000;
        logo = Blob.fromArray([]);
      },
      {
        id = 2;
        name = "Women's Super League";
        abbreviation = "WSL";
        teamCount = 12;
        relatedGender = #Female;
        governingBody = "FA";
        countryId = 186;
        formed = 1269388800000000000;
        logo = Blob.fromArray([]);
      }
    ]; 

    private stable var leagueStatuses: [FootballTypes.LeagueStatus] = [
      {
        activeSeasonId = 1;
        lastConfirmedGameweek = 13;
        leagueId = 1;
        unplayedGameweek = 15;
        activeGameweek = 0;
        completedGameweek = 14;
        activeMonth = 12;
        seasonActive = true;
        transferWindowActive = false;
        totalGameweeks = 38;
        transferWindowStartDay = 1;
        transferWindowStartMonth = 1;
        transferWindowEndDay = 31;
        transferWindowEndMonth = 1;
      },
      {
        activeSeasonId = 1;
        activeMonth = 1;
        leagueId = 2;
        unplayedGameweek = 1;
        activeGameweek = 0;
        completedGameweek = 0;
        seasonActive = false;
        transferWindowActive = false;
        totalGameweeks = 22;
        transferWindowStartDay = 1;
        transferWindowStartMonth = 1;
        transferWindowEndDay = 31;
        transferWindowEndMonth = 1;
      }
    ]; 

    private stable var leagueSeasons: [(FootballTypes.LeagueId, [FootballTypes.Season])] = [];
    private stable var leagueClubs: [(FootballTypes.LeagueId, [FootballTypes.Club])] = [];
    private stable var leaguePlayers: [(FootballTypes.LeagueId, [FootballTypes.Player])] = [];
    private stable var freeAgents: [FootballTypes.Player] = [];
    
    private stable var retiredLeaguePlayers: [(FootballTypes.LeagueId, [FootballTypes.Player])] = [];
    private stable var retiredFreeAgents: [FootballTypes.Player] = []; //TODO
    private stable var unknownPlayers: [FootballTypes.Player] = []; //TODO

    private stable var untrackedClubs: [FootballTypes.Club] = []; //TODO
    private stable var clubsInAdministration: [FootballTypes.Club] = []; //TODO

    private stable var nextLeagueId: FootballTypes.LeagueId = 10;
    private stable var nextClubId: FootballTypes.ClubId = 24;
    private stable var nextPlayerId: FootballTypes.PlayerId = 726;

    private stable var timers : [Base.TimerInfo] = [];

    private stable var leagueDataHashes: [(FootballTypes.LeagueId, [Base.DataHash])] = [];

    private func callerAllowed(caller: Principal) : Bool {
      let foundCaller = Array.find<Base.PrincipalId>(Environment.APPROVED_CANISTERS, func(canisterId: Base.CanisterId) : Bool {
        Principal.toText(caller) == canisterId
      });
      return Option.isSome(foundCaller);
    };

    /* Verified Getters */

    public shared composite query func getDataHashes(leagueId: FootballTypes.LeagueId) : async Result.Result<[ResponseDTOs.DataHashDTO], T.Error> {
      let leagueDataHashesResult = Array.find<(FootballTypes.LeagueId, [Base.DataHash])>(leagueDataHashes, func(entry: (FootballTypes.LeagueId, [Base.DataHash])) : Bool {
        entry.0 == leagueId
      });
      switch(leagueDataHashesResult){
        case (?foundHashes){
          return #ok(foundHashes.1)
        };
        case (null){}
      };
      return #err(#NotFound);
    };

    public func updateDataHash(leagueId: FootballTypes.LeagueId, category : Text) : async () {
      let randomHash = await SHA224.getRandomHash();
      leagueDataHashes := Array.map<(FootballTypes.LeagueId, [Base.DataHash]), (FootballTypes.LeagueId, [Base.DataHash])>(leagueDataHashes, func(entry: (FootballTypes.LeagueId, [Base.DataHash])){
        if(entry.0 == leagueId){
          let hashBuffer = Buffer.fromArray<Base.DataHash>([]);
          var updated = false;
          for (hashObj in Iter.fromArray(entry.1)) {
            if (hashObj.category == category) {
              hashBuffer.add({ category = hashObj.category; hash = randomHash });
              updated := true;
            } else { hashBuffer.add(hashObj) };
          };
          if(not updated){
              hashBuffer.add({ category = category; hash = randomHash });
          };
          return (entry.0, entry.1);
        } else {
          return entry;
        }
      });
    };

    public shared ( {caller} ) func getVerifiedPlayers(leagueId: FootballTypes.LeagueId) : async Result.Result<[ResponseDTOs.PlayerDTO], T.Error>{
      assert callerAllowed(caller);
      return getPrivatePlayers(leagueId);
    };

    public shared query ( {caller} ) func getPlayers(leagueId: FootballTypes.LeagueId) : async Result.Result<[ResponseDTOs.PlayerDTO], T.Error>{
      //assert callerAllowed(caller);
      return getPrivatePlayers(leagueId);
    };

    public shared query func getLeagueStatus(leagueId: FootballTypes.LeagueId) : async Result.Result<FootballTypes.LeagueStatus, T.Error>{
      let status = Array.find<FootballTypes.LeagueStatus>(leagueStatuses, func(entry: FootballTypes.LeagueStatus) : Bool {
        entry.leagueId == leagueId
      });
      switch(status){
        case (?foundStatus){
          return #ok(foundStatus)
        };
        case (null){
          return #err(#NotFound);
        }
      };
    };

    private func getPrivatePlayers(leagueId: FootballTypes.LeagueId) : Result.Result<[ResponseDTOs.PlayerDTO], T.Error> {
      let filteredLeaguePlayers = Array.find<(FootballTypes.LeagueId, [FootballTypes.Player])>(leaguePlayers, 
        func(currentLeaguePlayers: (FootballTypes.LeagueId, [FootballTypes.Player])) : Bool{
            currentLeaguePlayers.0 == leagueId;
      });

      switch(filteredLeaguePlayers){
        case (?foundLeaguePlayers){             
          return #ok(Array.map<FootballTypes.Player, ResponseDTOs.PlayerDTO>(foundLeaguePlayers.1, func(player: FootballTypes.Player){
            
            
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

          }));
        };
        case (null){
          return #err(#NotFound);
        }
      };
    };

    private func getClubPlayers(leagueId: FootballTypes.LeagueId, clubId: FootballTypes.ClubId) : Result.Result<[ResponseDTOs.PlayerDTO], T.Error> {
      let filteredLeaguePlayers = Array.find<(FootballTypes.LeagueId, [FootballTypes.Player])>(leaguePlayers, 
        func(currentLeaguePlayers: (FootballTypes.LeagueId, [FootballTypes.Player])) : Bool{
            currentLeaguePlayers.0 == leagueId;
      });

      switch(filteredLeaguePlayers){
        case (?foundLeaguePlayers){    
          let clubPlayers = Array.filter<FootballTypes.Player>(foundLeaguePlayers.1, func(player: FootballTypes.Player) {
            player.clubId == clubId
          });         
          return #ok(Array.map<FootballTypes.Player, ResponseDTOs.PlayerDTO>(clubPlayers, func(player: FootballTypes.Player){
            
            
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

          }));
        };
        case (null){
          return #err(#NotFound);
        }
      };
    };

    public shared ( {caller} ) func getVerifiedFixtures(dto: RequestDTOs.RequestFixturesDTO) : async Result.Result<[ResponseDTOs.FixtureDTO], T.Error>{
      assert callerAllowed(caller);
      return getPrivateFixtures(dto);
    };

    public shared query ( {caller} ) func getFixtures(leagueId: FootballTypes.LeagueId) : async Result.Result<[ResponseDTOs.FixtureDTO], T.Error>{
      assert callerAllowed(caller);
      let seasonResult = Array.find<FootballTypes.LeagueStatus>(leagueStatuses, func(entry: FootballTypes.LeagueStatus) : Bool {
        entry.leagueId == leagueId;
      });
      
      switch(seasonResult){
        case (?foundSeason){
          return getPrivateFixtures({leagueId; seasonId = foundSeason.activeSeasonId});
        };
        case (null){
          return #err(#NotFound);
        }
      };
    };

    private func getPrivateFixtures(dto: RequestDTOs.RequestFixturesDTO) : Result.Result<[ResponseDTOs.FixtureDTO], T.Error> {
      let filteredLeagueSeasons = Array.find<(FootballTypes.LeagueId, [FootballTypes.Season])>(leagueSeasons, 
        func(leagueSeason: (FootballTypes.LeagueId, [FootballTypes.Season])) : Bool{
            leagueSeason.0 == dto.leagueId;
      });

      switch(filteredLeagueSeasons){
        case (?foundLeagueSeasons){          
          
          let filteredSeason = Array.find<FootballTypes.Season>(foundLeagueSeasons.1, 
            func(leagueSeason: FootballTypes.Season) : Bool{
              leagueSeason.id == dto.seasonId;
          });
      
          switch(filteredSeason){
            case (?foundSeason){
              return #ok(List.toArray(List.map<FootballTypes.Fixture, ResponseDTOs.FixtureDTO>(foundSeason.fixtures, func(fixture: FootballTypes.Fixture){
                return {
                  awayClubId = fixture.awayClubId;
                  awayGoals  = fixture.awayGoals;
                  events  = List.toArray(fixture.events);
                  gameweek = fixture.gameweek;
                  highestScoringPlayerId = fixture.highestScoringPlayerId;
                  homeClubId = fixture.homeClubId;
                  homeGoals = fixture.homeGoals;
                  id = fixture.id;
                  kickOff = fixture.kickOff;
                  seasonId = fixture.seasonId;
                  status = fixture.status
                }
              })));
            };
            case (null){
              return #err(#NotFound);
            }
          };
        };
        case (null){
          return #err(#NotFound);
        }
      };
    };

    public shared ( {caller} ) func getVerifiedClubs(leagueId: FootballTypes.LeagueId) : async Result.Result<[ResponseDTOs.ClubDTO], T.Error>{
      assert callerAllowed(caller);
      return getPrivateClubs(leagueId);
    };

    public shared query ( {caller} ) func getClubs(leagueId: FootballTypes.LeagueId) : async Result.Result<[ResponseDTOs.ClubDTO], T.Error>{
      assert callerAllowed(caller);
      return getPrivateClubs(leagueId);
    };

    private func getPrivateClubs(leagueId: FootballTypes.LeagueId) : Result.Result<[ResponseDTOs.ClubDTO], T.Error> {
      
      let filteredLeagueClubs = Array.find<(FootballTypes.LeagueId, [FootballTypes.Club])>(leagueClubs, 
        func(leagueClubs: (FootballTypes.LeagueId, [FootballTypes.Club])) : Bool {
            leagueClubs.0 == leagueId;
      });

      switch(filteredLeagueClubs){
        case (?foundLeagueClubs){
          let sortedArray = Array.sort<FootballTypes.Club>(
          foundLeagueClubs.1,
          func(a : FootballTypes.Club, b : FootballTypes.Club) : Order.Order {
          if (a.friendlyName < b.friendlyName) { return #less };
          if (a.friendlyName == b.friendlyName) { return #equal };
          return #greater;
          },
        );
        return #ok(sortedArray);

        };
        case (null){
          return #err(#NotFound);
        }
      };
    };

    /* Query functions */

    public shared query func getLeagues() : async Result.Result<[ResponseDTOs.FootballLeagueDTO], T.Error>{
      return #ok(leagues);
    };  

    public shared query ( {caller} ) func getSeasons(leagueId: FootballTypes.LeagueId) : async Result.Result<[ResponseDTOs.SeasonDTO], T.Error>{
      assert callerAllowed(caller);

      let filteredLeagueSeasons = Array.find<(FootballTypes.LeagueId, [FootballTypes.Season])>(leagueSeasons, 
        func(leagueSeason: (FootballTypes.LeagueId, [FootballTypes.Season])) : Bool{
            leagueSeason.0 == leagueId;
      });

      switch(filteredLeagueSeasons){
        case (?foundLeagueSeasons){
          let sortedArray = Array.sort<FootballTypes.Season>(
          foundLeagueSeasons.1,
          func(a : FootballTypes.Season, b : FootballTypes.Season) : Order.Order {
          if (a.id > b.id) { return #greater };
          if (a.id == b.id) { return #equal };
          return #less;
          },
        );
        return #ok(sortedArray);

        };
        case (null){
          return #err(#NotFound);
        }
      };
    };

    public shared query ( {caller} ) func getPostponedFixtures(leagueId: FootballTypes.LeagueId, dto: RequestDTOs.RequestFixturesDTO) : async Result.Result<[ResponseDTOs.FixtureDTO], T.Error>{
      assert callerAllowed(caller);

      let filteredLeagueSeasons = Array.find<(FootballTypes.LeagueId, [FootballTypes.Season])>(leagueSeasons, 
        func(currentLeagueSeason: (FootballTypes.LeagueId, [FootballTypes.Season])) : Bool{
            currentLeagueSeason.0 == leagueId;
      });

      switch(filteredLeagueSeasons){
        case (?foundLeagueSeasons){          
          
          let filteredSeason = Array.find<FootballTypes.Season>(foundLeagueSeasons.1, 
            func(leagueSeason: FootballTypes.Season) : Bool{
              leagueSeason.id == dto.seasonId;
          });

          switch(filteredSeason){
            case (?foundSeason){
              return #ok(List.toArray(List.map<FootballTypes.Fixture, ResponseDTOs.FixtureDTO>(foundSeason.postponedFixtures, func(fixture: FootballTypes.Fixture){
                return {
                  awayClubId = fixture.awayClubId;
                  awayGoals  = fixture.awayGoals;
                  events  = List.toArray(fixture.events);
                  gameweek = fixture.gameweek;
                  highestScoringPlayerId = fixture.highestScoringPlayerId;
                  homeClubId = fixture.homeClubId;
                  homeGoals = fixture.homeGoals;
                  id = fixture.id;
                  kickOff = fixture.kickOff;
                  seasonId = fixture.seasonId;
                  status = fixture.status
                }
              })));
            };
            case (null){
              return #err(#NotFound);
            }
          };
        };
        case (null){
          return #err(#NotFound);
        }
      };
    };

    public shared query ( {caller} ) func getLoanedPlayers(leagueId: FootballTypes.LeagueId) : async Result.Result<[ResponseDTOs.LoanedPlayerDTO], T.Error>{
      assert callerAllowed(caller);

      let filteredLeaguePlayers = Array.find<(FootballTypes.LeagueId, [FootballTypes.Player])>(leaguePlayers, 
        func(currentLeaguePlayers: (FootballTypes.LeagueId, [FootballTypes.Player])) : Bool{
            currentLeaguePlayers.0 == leagueId;
      });

      switch(filteredLeaguePlayers){
        case (?foundLeaguePlayers){             

          let loanedClubPlayers = Array.filter<FootballTypes.Player>(foundLeaguePlayers.1, func(player: FootballTypes.Player) : Bool {
            player.parentClubId > 0
          });

          return #ok(Array.map<FootballTypes.Player, ResponseDTOs.LoanedPlayerDTO>(loanedClubPlayers, func(player: FootballTypes.Player){
            
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

          }));
        };
        case (null){
          return #err(#NotFound);
        }
      };
    };

    public shared query ( {caller} ) func getRetiredPlayers(leagueId: FootballTypes.LeagueId, dto: RequestDTOs.ClubFilterDTO) : async Result.Result<[ResponseDTOs.PlayerDTO], T.Error>{
      assert callerAllowed(caller);
      
      let filteredLeaguePlayers = Array.find<(FootballTypes.LeagueId, [FootballTypes.Player])>(retiredLeaguePlayers, 
        func(currentLeaguePlayers: (FootballTypes.LeagueId, [FootballTypes.Player])) : Bool{
            currentLeaguePlayers.0 == leagueId;
      });

      switch(filteredLeaguePlayers){
        case (?foundLeaguePlayers){             

          let clubPlayers = Array.filter<FootballTypes.Player>(foundLeaguePlayers.1, func(player: FootballTypes.Player) : Bool {
            player.clubId == dto.clubId
          });

          return #ok(Array.map<FootballTypes.Player, ResponseDTOs.PlayerDTO>(clubPlayers, func(player: FootballTypes.Player){
            
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

          }));
        };
        case (null){
          return #err(#NotFound);
        }
      };
    };

    public shared query ( {caller} ) func getPlayerDetails(leagueId: FootballTypes.LeagueId, dto: RequestDTOs.GetPlayerDetailsDTO) : async Result.Result<ResponseDTOs.PlayerDetailDTO, T.Error> {
      assert callerAllowed(caller);

      var clubId : FootballTypes.ClubId = 0;
      var position : FootballTypes.PlayerPosition = #Goalkeeper;
      var firstName = "";
      var lastName = "";
      var shirtNumber : Nat8 = 0;
      var valueQuarterMillions : Nat16 = 0;
      var dateOfBirth : Int = 0;
      var nationality : Base.CountryId = 0;
      var valueHistory : [FootballTypes.ValueHistory] = [];
      var status : FootballTypes.PlayerStatus = #Active;
      var parentClubId : FootballTypes.ClubId = 0;
      var latestInjuryEndDate : Int = 0;
      var injuryHistory : [FootballTypes.InjuryHistory] = [];
      var retirementDate : Int = 0;

      let gameweeksBuffer = Buffer.fromArray<ResponseDTOs.PlayerGameweekDTO>([]);

      let filteredLeaguePlayers = Array.find<(FootballTypes.LeagueId, [FootballTypes.Player])>(leaguePlayers, 
        func(leagueWithPlayers: (FootballTypes.LeagueId, [FootballTypes.Player])) : Bool{
        leagueWithPlayers.0 == leagueId
      });

      switch(filteredLeaguePlayers){
        case (?foundLeaguePlayers){

          let foundPlayer = Array.find<FootballTypes.Player>(foundLeaguePlayers.1, func(player: FootballTypes.Player) : Bool{
            player.id == dto.playerId;
          });

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

                    var fixtureId : FootballTypes.FixtureId = 0;
                    let events = List.toArray<FootballTypes.PlayerEventData>(gw.events);
                    if (Array.size(events) > 0) {
                      fixtureId := events[0].fixtureId;
                    };

                    let gameweekDTO : ResponseDTOs.PlayerGameweekDTO = {
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
            gameweeks = Buffer.toArray<ResponseDTOs.PlayerGameweekDTO>(gameweeksBuffer);
          });

        };
        case (null){
          return #err(#NotFound);
        }
      };
    };
    
    public shared query ( {caller} ) func getPlayerDetailsForGameweek(leagueId: FootballTypes.LeagueId, dto: RequestDTOs.GameweekFiltersDTO) : async Result.Result<[ResponseDTOs.PlayerPointsDTO], T.Error>{
      assert callerAllowed(caller);

      var playerDetailsBuffer = Buffer.fromArray<ResponseDTOs.PlayerPointsDTO>([]);

      let filteredLeaguePlayers = Array.find<(FootballTypes.LeagueId, [FootballTypes.Player])>(leaguePlayers, func(leagueWithPlayers: (FootballTypes.LeagueId, [FootballTypes.Player])) : Bool{
        leagueWithPlayers.0 == leagueId
      });

      switch(filteredLeaguePlayers){
        case (?players){
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
          
          let playerGameweek : ResponseDTOs.PlayerPointsDTO = {
            id = player.id;
            points = points;
            clubId = player.clubId;
            position = player.position;
            events = List.toArray(events);
            gameweek = dto.gameweek;
          };
          playerDetailsBuffer.add(playerGameweek);
        };


        return #ok(Buffer.toArray(playerDetailsBuffer));
        };
        case (null){
          return #err(#NotFound);
        }
      };
    };

    public shared query ( {caller} ) func getPlayersMap(leagueId: FootballTypes.LeagueId, dto: RequestDTOs.GameweekFiltersDTO) : async Result.Result<[(Nat16, ResponseDTOs.PlayerScoreDTO)], T.Error>{
      assert callerAllowed(caller);
      
      var playersMap : TrieMap.TrieMap<Nat16, ResponseDTOs.PlayerScoreDTO> = TrieMap.TrieMap<Nat16, ResponseDTOs.PlayerScoreDTO>(Utilities.eqNat16, Utilities.hashNat16);
      
      let filteredLeaguePlayers = Array.find<(FootballTypes.LeagueId, [FootballTypes.Player])>(leaguePlayers, func(leagueWithPlayers: (FootballTypes.LeagueId, [FootballTypes.Player])) : Bool {
        leagueWithPlayers.0 == leagueId
      });

      switch(filteredLeaguePlayers){
        case (?players){
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

            let scoreDTO : ResponseDTOs.PlayerScoreDTO = {
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
          return #ok(Iter.toArray(playersMap.entries()));
        };
        case (null){
          return #err(#NotFound);
        }
      };
    };

    public shared query ( {caller} ) func getTimers() : async Result.Result<[Base.TimerInfo], T.Error>{
      return #ok(timers);
    };

    /* Governance Validation Functions */

    /* Player */

    public shared ( {caller} ) func validateRevaluePlayerUp(leagueId: FootballTypes.LeagueId, dto : GovernanceDTOs.RevaluePlayerUpDTO) : async Result.Result<(), T.Error>{
      assert callerAllowed(caller);
      assert leagueExists(leagueId);
      assert checkPlayerExists(leagueId, dto.playerId);
      //TODO (KELLY): Add validation checks
      return #ok();
    };

    public shared ( {caller} ) func validateRevaluePlayerDown(leagueId: FootballTypes.LeagueId, dto : GovernanceDTOs.RevaluePlayerDownDTO) : async Result.Result<(), T.Error>{
      assert callerAllowed(caller);
      assert leagueExists(leagueId);
      assert checkPlayerExists(leagueId, dto.playerId);
      //TODO (KELLY): Add validation checks
      return #ok();
    };

    public shared ( {caller} ) func validateLoanPlayer(leagueId: FootballTypes.LeagueId, dto : GovernanceDTOs.LoanPlayerDTO) : async Result.Result<(), T.Error>{
      assert callerAllowed(caller);
      assert leagueExists(leagueId);
      assert checkPlayerExists(leagueId, dto.playerId);

      let filteredLeaguePlayers = Array.find<(FootballTypes.LeagueId, [FootballTypes.Player])>(leaguePlayers, 
        func(leagueWithPlayers: (FootballTypes.LeagueId, [FootballTypes.Player])) : Bool{
        leagueWithPlayers.0 == leagueId
      });

      switch(filteredLeaguePlayers){
        case (?players){
          if (dto.loanEndDate <= Time.now()) {
            return #err(#InvalidData);
          };

          let player = Array.find<FootballTypes.Player>(players.1, func(currentPlayer: FootballTypes.Player) : Bool{
            currentPlayer.id == dto.playerId;
          });


          switch (player) {
            case (null) {
            return #err(#InvalidData);
            };
            case (?foundPlayer) {
              if (foundPlayer.status == #OnLoan) {
                return #err(#InvalidData);
              };
            };
          };

          if (dto.loanClubId > 0) {

            let filteredLeagueClubs = Array.find<(FootballTypes.LeagueId, [FootballTypes.Club])>(leagueClubs, 
              func(leagueClubs: (FootballTypes.LeagueId, [FootballTypes.Club])) : Bool{
                  leagueClubs.0 == leagueId;
            });

            switch(filteredLeagueClubs){
              case (?foundLeagueClubs){

                let loanClub = List.find<FootballTypes.Club>(
                  List.fromArray(foundLeagueClubs.1),
                  func(club : FootballTypes.Club) : Bool {
                    return club.id == dto.loanClubId;
                  },
                );

                switch (loanClub) {
                  case (null) {
                    return #err(#InvalidData);
                  };
                  case (?_) {
                    return #ok();
                  };
                };
              };
              case (null){
                return #err(#NotFound);
              }
            };     
          };

          return #ok();
          
        };
        case (null){
          return #err(#NotFound);
        }
      };      
      //TODO (KELLY): Add validation checks
    };

    public shared ( {caller} ) func validateTransferPlayer(leagueId: FootballTypes.LeagueId, dto : GovernanceDTOs.TransferPlayerDTO) : async Result.Result<(), T.Error>{
      assert callerAllowed(caller);
      assert leagueExists(leagueId);
      assert checkPlayerExists(leagueId, dto.playerId);

      let filteredLeaguePlayers = Array.find<(FootballTypes.LeagueId, [FootballTypes.Player])>(leaguePlayers, func(leagueWithPlayers: (FootballTypes.LeagueId, [FootballTypes.Player])) : Bool{
        leagueWithPlayers.0 == leagueId
      });

      switch(filteredLeaguePlayers){
        case (?foundLeaguePlayers){
          let player = Array.find<FootballTypes.Player>(
            foundLeaguePlayers.1,
            func(p : FootballTypes.Player) : Bool {
              return p.id == dto.playerId;
            },
          );

          switch (player) {
            case (null) {
              return #err(#NotFound);
            };
            case (?foundPlayer) {
              //TODO
            };
          };

          if (dto.newClubId > 0) {

            let filteredLeagueClubs = Array.find<(FootballTypes.LeagueId, [FootballTypes.Club])>(leagueClubs, 
              func(leagueClubs: (FootballTypes.LeagueId, [FootballTypes.Club])) : Bool{
                  leagueClubs.0 == leagueId;
            });

            switch(filteredLeagueClubs){
              case (?foundLeagueClubs){
                let newClub = Array.find<FootballTypes.Club>(
                  foundLeagueClubs.1,
                  func(club : FootballTypes.Club) : Bool {
                    return club.id == dto.newClubId;
                  },
                );

                switch (newClub) {
                  case (null) {
                    return #err(#NotFound);
                  };
                  case (?foundTeam) {};
                };
                return #ok();

              };
              case (null){
                return #err(#NotFound);
              }
            }; 
          };

          return #ok();
          
        };
        case (null){
          return #err(#NotFound);
        }
      };  
      //TODO (KELLY): Add validation checks
    };

    public shared ( {caller} ) func validateSetFreeAgent(leagueId: FootballTypes.LeagueId, dto : GovernanceDTOs.SetFreeAgentDTO) : async Result.Result<(), T.Error>{
      assert callerAllowed(caller);
      assert leagueExists(leagueId);
      assert checkPlayerExists(leagueId, dto.playerId);
      return #err(#NotFound);

      //TODO (KELLY): Add validation checks
    };

    public shared ( {caller} ) func validateRecallPlayer(leagueId: FootballTypes.LeagueId, dto : GovernanceDTOs.RecallPlayerDTO) : async Result.Result<(), T.Error> {
      
      assert callerAllowed(caller);
      assert leagueExists(leagueId);
      assert checkPlayerExists(leagueId, dto.playerId);

      let filteredLeaguePlayers = Array.find<(FootballTypes.LeagueId, [FootballTypes.Player])>(leaguePlayers, func(leagueWithPlayers: (FootballTypes.LeagueId, [FootballTypes.Player])) : Bool{
        leagueWithPlayers.0 == leagueId
      });

      switch(filteredLeaguePlayers){
        case (?foundLeaguePlayers){
          let player = Array.find<FootballTypes.Player>(
            foundLeaguePlayers.1,
            func(p : FootballTypes.Player) : Bool {
              return p.id == dto.playerId;
            },
          );

          switch (player) {
            case (null) {
              return #err(#NotFound);
            };
            case (?foundPlayer) {
              if (foundPlayer.status != #OnLoan) {
                return #err(#NotFound);
              };
            };
          };
          return #ok();
          
        };
        case (null){
          return #err(#NotFound);
        }
      };  
      //TODO (KELLY): Add validation checks
    };

    public shared ( {caller} ) func validateCreatePlayer(leagueId: FootballTypes.LeagueId, dto : GovernanceDTOs.CreatePlayerDTO) : async Result.Result<(), T.Error>{
      assert callerAllowed(caller);
      assert leagueExists(leagueId);

      if (Text.size(dto.firstName) > 50) {
        return #err(#InvalidData);
      };

      if (Text.size(dto.lastName) > 50) {
        return #err(#InvalidData);
      };

      let playerCountry = Array.find<Base.Country>(Countries.countries, func(country : Base.Country) : Bool { return country.id == dto.nationality });
      switch (playerCountry) {
        case (null) {
        return #err(#InvalidData);
        };
        case (?foundCountry) {};
      };

      if (Utilities.calculateAgeFromUnix(dto.dateOfBirth) < 16) {
        return #err(#InvalidData);
      };

      let filteredLeagueClubs = Array.find<(FootballTypes.LeagueId, [FootballTypes.Club])>(leagueClubs, 
        func(leagueClubs: (FootballTypes.LeagueId, [FootballTypes.Club])) : Bool{
            leagueClubs.0 == leagueId;
      });

      switch(filteredLeagueClubs){
        case (?foundLeagueClubs){
          let newClub = Array.find<FootballTypes.Club>(
            foundLeagueClubs.1,
            func(club : FootballTypes.Club) : Bool {
              return club.id == dto.clubId;
            },
          );

          switch (newClub) {
            case (null) {
              return #err(#NotFound);
            };
            case (?foundTeam) {};
          };
          return #ok();

        };
        case (null){
          return #err(#NotFound);
        }
      };   
      //TODO (KELLY): Add validation checks 
    };

    public shared ( {caller} ) func validateUpdatePlayer(leagueId: FootballTypes.LeagueId, dto : GovernanceDTOs.UpdatePlayerDTO) : async Result.Result<(), T.Error>{
      assert callerAllowed(caller);
      assert leagueExists(leagueId);
      assert checkPlayerExists(leagueId, dto.playerId);

      let filteredLeaguePlayers = Array.find<(FootballTypes.LeagueId, [FootballTypes.Player])>(leaguePlayers, func(leagueWithPlayers: (FootballTypes.LeagueId, [FootballTypes.Player])) : Bool{
        leagueWithPlayers.0 == leagueId
      });

      switch(filteredLeaguePlayers){
        case (?foundLeaguePlayers){
          let player = Array.find<FootballTypes.Player>(
            foundLeaguePlayers.1,
            func(p : FootballTypes.Player) : Bool {
              return p.id == dto.playerId;
            },
          );

          switch (player) {
            case (null) {
              return #err(#NotFound);
            };
            case (?foundPlayer) {};
          };

          if (Text.size(dto.firstName) > 50) {
            return #err(#InvalidData);
          };

          if (Text.size(dto.lastName) > 50) {
            return #err(#InvalidData);
          };

          let playerCountry = Array.find<Base.Country>(Countries.countries, func(country : Base.Country) : Bool { return country.id == dto.nationality });
          switch (playerCountry) {
            case (null) {
            return #err(#InvalidData);
            };
            case (?foundCountry) {};
          };

          if (Utilities.calculateAgeFromUnix(dto.dateOfBirth) < 16) {
            return #err(#InvalidData);
          };
          return #ok();
          
        };
        case (null){
          return #err(#NotFound);
        }
      };  
      //TODO (KELLY): Add validation checks
    };

    public shared ( {caller} ) func validateSetPlayerInjury(leagueId: FootballTypes.LeagueId, dto : GovernanceDTOs.SetPlayerInjuryDTO) : async Result.Result<(), T.Error>{
      assert callerAllowed(caller);
      assert leagueExists(leagueId);
      assert checkPlayerExists(leagueId, dto.playerId);

      let filteredLeaguePlayers = Array.find<(FootballTypes.LeagueId, [FootballTypes.Player])>(leaguePlayers, func(leagueWithPlayers: (FootballTypes.LeagueId, [FootballTypes.Player])) : Bool{
        leagueWithPlayers.0 == leagueId
      });

      switch(filteredLeaguePlayers){
        case (?foundLeaguePlayers){
         let player = Array.find<FootballTypes.Player>(
            foundLeaguePlayers.1,
            func(p : FootballTypes.Player) : Bool {
              return p.id == dto.playerId;
            },
          );

          switch (player) {
            case (null) {
              return #err(#NotFound);
            };
            case (?foundPlayer) {};
          };

          return #ok();
        };
        case (null){
          return #err(#NotFound);
        }
      }; 
      //TODO (KELLY): Add validation checks
    };

    public shared ( {caller} ) func validateRetirePlayer(leagueId: FootballTypes.LeagueId, dto : GovernanceDTOs.RetirePlayerDTO) : async Result.Result<(), T.Error>{
      assert callerAllowed(caller);
      assert leagueExists(leagueId);
      assert checkPlayerExists(leagueId, dto.playerId);

      let filteredLeaguePlayers = Array.find<(FootballTypes.LeagueId, [FootballTypes.Player])>(leaguePlayers, func(leagueWithPlayers: (FootballTypes.LeagueId, [FootballTypes.Player])) : Bool {
        leagueWithPlayers.0 == leagueId
      });

      switch(filteredLeaguePlayers){
        case (?foundLeaguePlayers){
          let player = Array.find<FootballTypes.Player>(
            foundLeaguePlayers.1,
            func(p : FootballTypes.Player) : Bool {
              return p.id == dto.playerId;
            },
          );

          switch (player) {
            case (null) {
              return #err(#NotFound);
            };
            case (?foundPlayer) {};
          };

          return #ok();
        };
        case (null){
          return #err(#NotFound);
        }
      }; 
      //TODO (KELLY): Add validation checks
    };

    public shared ( {caller} ) func validateUnretirePlayer(leagueId: FootballTypes.LeagueId, dto : GovernanceDTOs.UnretirePlayerDTO) : async Result.Result<(), T.Error>{
      assert callerAllowed(caller);
      assert leagueExists(leagueId);
      assert checkPlayerExists(leagueId, dto.playerId);

      let filteredLeaguePlayers = Array.find<(FootballTypes.LeagueId, [FootballTypes.Player])>(leaguePlayers, func(leagueWithPlayers: (FootballTypes.LeagueId, [FootballTypes.Player])){
        leagueWithPlayers.0 == leagueId
      });

      switch(filteredLeaguePlayers){
        case (?foundLeaguePlayers){
          let playerToUnretire = Array.find<FootballTypes.Player>(foundLeaguePlayers.1, 
            func(p : FootballTypes.Player) : Bool { p.id == dto.playerId and p.status == #Retired });
            switch (playerToUnretire) {
              case (null) {
                return #err(#NotFound);
              };
              case (?foundPlayer) {};
            };
            return #ok();
        };
        case (null){
          return #err(#NotFound);
        }
      }; 
      //TODO (KELLY): Add validation checks
    };

    /* League */

    public shared ( {caller} ) func validateCreateLeague(dto : GovernanceDTOs.CreateLeagueDTO) : async Result.Result<(), T.Error>{
      assert callerAllowed(caller);
      //TODO (KELLY): Add validation checks
      return #err(#NotFound);
    };

    public shared ( {caller} ) func validateUpdateLeague(dto : GovernanceDTOs.UpdateLeagueDTO) : async Result.Result<(), T.Error>{
      assert callerAllowed(caller);
      //TODO (KELLY): Add validation checks
      return #err(#NotFound);
    };

    public shared ( {caller} ) func validateAddInitialFixtures(leagueId: FootballTypes.LeagueId, dto : GovernanceDTOs.AddInitialFixturesDTO) : async Result.Result<(), T.Error>{
      assert callerAllowed(caller);
      assert leagueExists(leagueId);
      //TODO (KELLY): Add validation checks
        //should equal the number of teams in the related environment file
      return #err(#NotFound);
    };

    public shared ( {caller} ) func validateMoveFixture(leagueId: FootballTypes.LeagueId, dto : GovernanceDTOs.MoveFixtureDTO) : async Result.Result<(), T.Error>{
      assert callerAllowed(caller);
      assert leagueExists(leagueId);
      //TODO (KELLY): Add validation checks
        //valid gameweek but that can go in a data check module in the backend
      return #err(#NotFound);
    };

    public shared ( {caller} ) func validatePostponeFixture(leagueId: FootballTypes.LeagueId, dto : GovernanceDTOs.PostponeFixtureDTO) : async Result.Result<(), T.Error>{
      assert callerAllowed(caller);
      assert leagueExists(leagueId);
      //TODO (KELLY): Add validation checks
      return #err(#NotFound);
    };

    public shared ( {caller} ) func validateRescehduleFixture(leagueId: FootballTypes.LeagueId, dto : GovernanceDTOs.RescheduleFixtureDTO) : async Result.Result<(), T.Error>{
      assert callerAllowed(caller);
      assert leagueExists(leagueId);
      //TODO (KELLY): Add validation checks
      return #err(#NotFound);
    };

    public shared ( {caller} ) func validateSubmitFixtureData(leagueId: FootballTypes.LeagueId, dto : GovernanceDTOs.SubmitFixtureDataDTO) : async Result.Result<(), T.Error>{
      assert callerAllowed(caller);
      assert leagueExists(leagueId);
      assert validatePlayerEvents(dto.playerEventData);
      //TODO (KELLY): Add validation checks
      return #err(#NotFound);
    };

    /* Club */

    public shared ( {caller} ) func validateCreateClub(leagueId: FootballTypes.LeagueId, dto : GovernanceDTOs.CreateClubDTO) : async Result.Result<(), T.Error>{
      assert callerAllowed(caller);
      assert leagueExists(leagueId);
      //TODO (KELLY): Add validation checks
      return #err(#NotFound);
    };

    public shared ( {caller} ) func validationRemoveClub(leagueId: FootballTypes.LeagueId, dto : GovernanceDTOs.RemoveClubDTO) : async Result.Result<(), T.Error>{
      assert callerAllowed(caller);
      assert leagueExists(leagueId);
      //TODO (KELLY): Add validation checks
      return #err(#NotFound);
    };

    public shared ( {caller} ) func validatePromoteClub(leagueId: FootballTypes.LeagueId, dto : GovernanceDTOs.PromoteClubDTO) : async Result.Result<(), T.Error>{
      assert callerAllowed(caller);
      assert leagueExists(leagueId);
      //TODO (KELLY): Add validation checks
      return #err(#NotFound);
    };

    public shared ( {caller} ) func validateRelegateClub(leagueId: FootballTypes.LeagueId, dto : GovernanceDTOs.RelegateClubDTO) : async Result.Result<(), T.Error>{
      assert callerAllowed(caller);
      assert leagueExists(leagueId);
      //TODO (KELLY): Add validation checks
      return #err(#NotFound);
    };

    public shared ( {caller} ) func validateUpdateClub(leagueId: FootballTypes.LeagueId, dto : GovernanceDTOs.UpdateClubDTO) : async Result.Result<(), T.Error>{
      assert callerAllowed(caller);
      assert leagueExists(leagueId);
      //TODO (KELLY): Add validation checks
      return #err(#NotFound);
    };

    /* Governance Execution Functions */

    /* Player */
    
    public shared ( {caller} ) func revaluePlayerUp(leagueId: FootballTypes.LeagueId, dto : GovernanceDTOs.RevaluePlayerUpDTO) : async Result.Result<(), T.Error>{
      assert callerAllowed(caller);

      let updatedLeaguePlayersBuffer = Buffer.fromArray<(FootballTypes.LeagueId, [FootballTypes.Player])>([]);

      for(league in Iter.fromArray(leaguePlayers)){
        if(league.0 == leagueId){

          let filteredLeaguePlayers = Array.find<(FootballTypes.LeagueId, [FootballTypes.Player])>(leaguePlayers, func(leagueWithPlayers: (FootballTypes.LeagueId, [FootballTypes.Player])) : Bool{
            leagueWithPlayers.0 == leagueId
          });

          switch(filteredLeaguePlayers){
            case (?foundLeaguePlayers){
              
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

              updatedLeaguePlayersBuffer.add((leagueId, updatedPlayers));
            };
            case (null){

            }
          };
        } else {
          updatedLeaguePlayersBuffer.add(league);
        } 
      };

      leaguePlayers := Buffer.toArray(updatedLeaguePlayersBuffer);
      let _ = await updateDataHashes(leagueId, "players");

      return #ok();
    };

    public shared ( {caller} ) func revaluePlayerDown(leagueId: FootballTypes.LeagueId, dto : GovernanceDTOs.RevaluePlayerDownDTO) : async Result.Result<(), T.Error>{
      assert callerAllowed(caller);

      let updatedLeaguePlayersBuffer = Buffer.fromArray<(FootballTypes.LeagueId, [FootballTypes.Player])>([]);

      for(league in Iter.fromArray(leaguePlayers)){
        if(league.0 == leagueId){

          let filteredLeaguePlayers = Array.find<(FootballTypes.LeagueId, [FootballTypes.Player])>(leaguePlayers, func(leagueWithPlayers: (FootballTypes.LeagueId, [FootballTypes.Player])) : Bool{
            leagueWithPlayers.0 == leagueId
          });

          switch(filteredLeaguePlayers){
            case (?foundLeaguePlayers){
              
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

              updatedLeaguePlayersBuffer.add((leagueId, updatedPlayers));
            };
            case (null){

            }
          };
        } else {
          updatedLeaguePlayersBuffer.add(league);
        } 
      };

      leaguePlayers := Buffer.toArray(updatedLeaguePlayersBuffer);
      let _ = await updateDataHashes(leagueId, "players");

      return #ok();
    };

    public shared ( {caller} ) func loanPlayer(leagueId: FootballTypes.LeagueId, dto : GovernanceDTOs.LoanPlayerDTO) : async Result.Result<(), T.Error>{
      assert callerAllowed(caller);
      assert leagueExists(leagueId);
      assert leagueExists(dto.loanLeagueId);
      assert clubExists(dto.loanLeagueId, dto.loanClubId);

      if(leagueId == dto.loanLeagueId){
        leaguePlayers := Array.map<
          (FootballTypes.LeagueId, [FootballTypes.Player]), 
          (FootballTypes.LeagueId, [FootballTypes.Player])>(
            leaguePlayers,  func (entry: (FootballTypes.LeagueId, [FootballTypes.Player])){
              if(entry.0 == leagueId){
                return (entry.0, Array.map<FootballTypes.Player, FootballTypes.Player>(entry.1, func(player: FootballTypes.Player){
                  if(player.id == dto.playerId){  

                    let newTransferHistoryEntry : FootballTypes.TransferHistory = {
                      transferDate = Time.now();
                      fromLeagueId = leagueId;
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
                      parentLeagueId = leagueId;
                      parentClubId = player.clubId;
                      position = player.position;
                      retirementDate = player.retirementDate;
                      seasons = player.seasons;
                      shirtNumber = player.shirtNumber;
                      status = player.status;
                      transferHistory = List.append<FootballTypes.TransferHistory>(player.transferHistory, List.fromArray([newTransferHistoryEntry]));
                      valueHistory = player.valueHistory;
                      valueQuarterMillions = player.valueQuarterMillions;
                    }
                  } else {
                    return player;
                  }
                }))
              } else { return entry }
            });

        let _ = await updateDataHashes(leagueId, "players");
      } else {

        let currentLeaguePlayersSet = Array.find<(FootballTypes.LeagueId, [FootballTypes.Player])>(leaguePlayers, func(playersSet: (FootballTypes.LeagueId, [FootballTypes.Player])) : Bool {
          playersSet.0 == leagueId
        });
        switch(currentLeaguePlayersSet){
          case (?playerSet){
            let loanPlayer = Array.find<FootballTypes.Player>(playerSet.1, func(player: FootballTypes.Player) : Bool {
              return player.id == dto.playerId;
            });

            switch(loanPlayer){
              case (?player){

                leaguePlayers := Array.map<
                  (FootballTypes.LeagueId, [FootballTypes.Player]), 
                  (FootballTypes.LeagueId, [FootballTypes.Player])>(
                    leaguePlayers,  func (entry: (FootballTypes.LeagueId, [FootballTypes.Player])){
                      if(entry.0 == leagueId){
                        return (entry.0, Array.filter<FootballTypes.Player>(entry.1, func(foundPlayer: FootballTypes.Player){
                          foundPlayer.id != dto.playerId
                        }));
                      } else if(entry.0 == dto.loanLeagueId) {
                        
                        let newTransferHistoryEntry : FootballTypes.TransferHistory = {
                          transferDate = Time.now();
                          fromLeagueId = leagueId;
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
                          valueQuarterMillions = player.valueQuarterMillions;
                        });
                        return (entry.0, Buffer.toArray(updatedPlayersBuffer));
                      } else { return entry }
                    }
                );

                let loanTimerDuration = #nanoseconds(Int.abs((dto.loanEndDate - Time.now())));
                let _ = setAndBackupTimer(loanTimerDuration, "loanExpired");

                let _ = await updateDataHashes(leagueId, "players");
                let _ = await updateDataHashes(dto.loanLeagueId, "players");
                let _ = await notifyAppsOfLoan(dto.loanLeagueId, dto.playerId);
                return #ok();
              };
              case (null){ }
            };
          };
          case (null){ }
        };
      };
      return #err(#NotFound);
    };

    public shared ( {caller} ) func transferPlayer(leagueId: FootballTypes.LeagueId, dto : GovernanceDTOs.TransferPlayerDTO) : async Result.Result<(), T.Error>{
      assert callerAllowed(caller);

      if(dto.newClubId == 0 and dto.newLeagueId == 0){
        movePlayerToFreeAgents(leagueId, dto.playerId);
        let _ = await updateDataHashes(leagueId, "players");
        return #ok();
      };

      if(dto.newLeagueId == leagueId){
        movePlayerWithinLeague(leagueId, dto.newClubId, dto.playerId, dto.newShirtNumber);
        let _ = await updateDataHashes(leagueId, "players");
        return #ok();
      };

      movePlayerToLeague(leagueId, dto.newLeagueId, dto.newClubId, dto.playerId, dto.newShirtNumber);
      let _ = await updateDataHashes(leagueId, "players");
      let _ = await notifyAppsOfTransfer(leagueId, dto.playerId);

      return #ok();
    };

    public shared ( {caller} ) func setFreeAgent(leagueId: FootballTypes.LeagueId, dto : GovernanceDTOs.SetFreeAgentDTO) : async Result.Result<(), T.Error>{
      assert callerAllowed(caller);

      movePlayerToFreeAgents(leagueId, dto.playerId);
      let _ = await updateDataHashes(leagueId, "players");
      let _ = await notifyAppsOfTransfer(leagueId, dto.playerId);
      
      return #ok();
    };

    public shared ( {caller} ) func recallPlayer(dto: GovernanceDTOs.RecallPlayerDTO) : async Result.Result<(), T.Error>{
      assert callerAllowed(caller);
      assert leagueExists(dto.recallFromLeagueId);

      let fromPlayerLeagueResult = Array.find(leaguePlayers, func(entry: (FootballTypes.LeagueId, [FootballTypes.Player])) : Bool {
        entry.0 == dto.recallFromLeagueId
      });

      switch(fromPlayerLeagueResult){
        case (?foundLeaguePlayers){
          let foundPlayer = Array.find<FootballTypes.Player>(foundLeaguePlayers.1, func(entry: FootballTypes.Player) : Bool {
            entry.id == dto.playerId
          });
          switch(foundPlayer){
            case (?player){
              leaguePlayers := Array.map<(FootballTypes.LeagueId, [FootballTypes.Player]), (FootballTypes.LeagueId, [FootballTypes.Player])>(leaguePlayers, func(entry: (FootballTypes.LeagueId, [FootballTypes.Player])){
                if(entry.0 == dto.recallFromLeagueId and dto.recallFromLeagueId == player.parentLeagueId){
                  return (entry.0, Array.map<FootballTypes.Player, FootballTypes.Player>(entry.1, func(playerEntry: FootballTypes.Player){
                    if(playerEntry.id == player.id){
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
                    }
                  }));
                }
                else if(entry.0 == dto.recallFromLeagueId){
                  return (entry.0, Array.filter<FootballTypes.Player>(entry.1, func(playerEntry: FootballTypes.Player){
                    playerEntry.id != player.id
                  }));
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
              });

              let _ = await notifyAppsOfTransfer(dto.recallFromLeagueId, dto.playerId);
              let _ = await notifyAppsOfTransfer(player.parentLeagueId, dto.playerId);
              return #ok();
            };
            case (null){};
          };
        };
        case (null){};
      };
      return #err(#NotFound);
    };

    public shared ( {caller} ) func createPlayer(leagueId: FootballTypes.LeagueId, dto : GovernanceDTOs.CreatePlayerDTO) : async Result.Result<(), T.Error>{
      assert callerAllowed(caller);

      let foundLeague = Array.find<FootballTypes.League>(leagues, func(league: FootballTypes.League) : Bool {
        league.id == leagueId
      });

      switch(foundLeague){
        case (?league){
      
          let newPlayer : FootballTypes.Player = {
            id = nextPlayerId;
            leagueId = leagueId;
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

          leaguePlayers := Array.map<(FootballTypes.LeagueId, [FootballTypes.Player]), (FootballTypes.LeagueId, [FootballTypes.Player])>(leaguePlayers, 
            func(leaguePlayersEntry: (FootballTypes.LeagueId, [FootballTypes.Player])){
              if(leaguePlayersEntry.0 == leagueId){
                let updatedPlayersBuffer = Buffer.fromArray<FootballTypes.Player>(leaguePlayersEntry.1);
                updatedPlayersBuffer.add(newPlayer);
                return (leaguePlayersEntry.0, Buffer.toArray(updatedPlayersBuffer));
              } else {
                return leaguePlayersEntry;
              }
          });

          nextPlayerId += 1;
          let _ = await updateDataHashes(leagueId, "players");
          return #ok();
          
        };
        case (null){
          return #err(#NotFound);
        }
      };
    };

    public shared ( {caller} ) func updatePlayer(leagueId: FootballTypes.LeagueId, dto : GovernanceDTOs.UpdatePlayerDTO) : async Result.Result<(), T.Error>{
      assert callerAllowed(caller);

      var positionUpdated = false;

      leaguePlayers := Array.map<(FootballTypes.LeagueId, [FootballTypes.Player]), (FootballTypes.LeagueId, [FootballTypes.Player])>(leaguePlayers, 
        func(leaguePlayersEntry: (FootballTypes.LeagueId, [FootballTypes.Player])){
          if(leaguePlayersEntry.0 == leagueId){

            let existingPlayer = Array.find<FootballTypes.Player>(leaguePlayersEntry.1, func(player: FootballTypes.Player) : Bool{
              player.id == dto.playerId
            });

            let updatedPlayersBuffer = Buffer.fromArray<FootballTypes.Player>(Array.filter<FootballTypes.Player>(leaguePlayersEntry.1, func(player: FootballTypes.Player) : Bool{
              player.id != dto.playerId
            }));

            switch(existingPlayer){
              case (?currentPlayer){
                if(currentPlayer.position != dto.position){
                  positionUpdated := true;
                };
                let updatedPlayer: FootballTypes.Player = {
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
              case (null){

              }
            };

            return (leaguePlayersEntry.0, Buffer.toArray(updatedPlayersBuffer));
          } else {
            return leaguePlayersEntry;
          }
      });

      if(positionUpdated){
        let _ = await notifyAppsOfPositionChange(leagueId, dto.playerId);
      };

      let _ = await updateDataHashes(leagueId, "players");
      return #ok();
    };

    public shared ( {caller} ) func setPlayerInjury(leagueId: FootballTypes.LeagueId, dto : GovernanceDTOs.SetPlayerInjuryDTO) : async Result.Result<(), T.Error>{
      assert callerAllowed(caller);


      leaguePlayers := Array.map<(FootballTypes.LeagueId, [FootballTypes.Player]), (FootballTypes.LeagueId, [FootballTypes.Player])>(leaguePlayers, 
        func(leaguePlayersEntry: (FootballTypes.LeagueId, [FootballTypes.Player]))
        {
          if(leaguePlayersEntry.0 == leagueId){
            
             let existingPlayer = Array.find<FootballTypes.Player>(leaguePlayersEntry.1, func(player: FootballTypes.Player) : Bool{
              player.id == dto.playerId
            });

            let updatedPlayersBuffer = Buffer.fromArray<FootballTypes.Player>(Array.filter<FootballTypes.Player>(leaguePlayersEntry.1, func(player: FootballTypes.Player) : Bool{
              player.id != dto.playerId
            }));

            switch(existingPlayer){
              case (?currentPlayer){
                
                let injuryHistoryEntry : FootballTypes.InjuryHistory = {
                  description = dto.description;
                  injuryStartDate = Time.now();
                  expectedEndDate = dto.expectedEndDate;
                };

                let updatedPlayer: FootballTypes.Player = {
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
              case (null){

              }
            };

            return (leaguePlayersEntry.0, Buffer.toArray(updatedPlayersBuffer));


          } else {
            return leaguePlayersEntry;
          }
        }
      );

      let playerInjuryDuration = #nanoseconds(Int.abs((dto.expectedEndDate - Time.now())));
      let _ = await setAndBackupTimer(playerInjuryDuration, "injuryExpired");
      let _ = await updateDataHashes(leagueId, "players");
      return #ok();
    };

    public shared ( {caller} ) func retirePlayer(leagueId: FootballTypes.LeagueId, dto : GovernanceDTOs.RetirePlayerDTO) : async Result.Result<(), T.Error>{
      assert callerAllowed(caller);
      
      leaguePlayers := Array.map<(FootballTypes.LeagueId, [FootballTypes.Player]), (FootballTypes.LeagueId, [FootballTypes.Player])>(leaguePlayers, func(leaguePlayersEntry: (FootballTypes.LeagueId, [FootballTypes.Player])){
        if(leaguePlayersEntry.0 == leagueId){

          let retiredLeague = Array.find<(FootballTypes.LeagueId, [FootballTypes.Player])>(retiredLeaguePlayers, func(entry: (FootballTypes.LeagueId, [FootballTypes.Player])) : Bool {
            entry.0 == leagueId;
          });

          if(Option.isNull(retiredLeague)){
            let retiredLeaguesBuffer = Buffer.fromArray<(FootballTypes.LeagueId, [FootballTypes.Player])>(retiredLeaguePlayers);
            retiredLeaguesBuffer.add(leagueId, []);
            retiredLeaguePlayers := Buffer.toArray(retiredLeaguesBuffer);
          };

          retiredLeaguePlayers := Array.map<(FootballTypes.LeagueId, [FootballTypes.Player]), (FootballTypes.LeagueId, [FootballTypes.Player])>(retiredLeaguePlayers, func(retiredPlayersEntry: (FootballTypes.LeagueId, [FootballTypes.Player])){
            return retiredPlayersEntry;
          });

          return (leaguePlayersEntry.0, Array.filter<FootballTypes.Player>(leaguePlayersEntry.1, func(player: FootballTypes.Player){
            player.id != dto.playerId;
          }));
        } else {
          return leaguePlayersEntry;
        };        
      });
      let _ = await updateDataHashes(leagueId, "players");
      let _ = await notifyAppsOfTransfer(leagueId, dto.playerId);
      return #ok();
    };

    public shared ( {caller} ) func unretirePlayer(dto : GovernanceDTOs.UnretirePlayerDTO) : async Result.Result<(), T.Error>{
      assert callerAllowed(caller);

      let leagueRetiredPlayers = Array.find<(FootballTypes.LeagueId, [FootballTypes.Player])>(retiredLeaguePlayers, func(entry: (FootballTypes.LeagueId, [FootballTypes.Player])) : Bool {
        entry.0 == dto.leagueId;
      });

      switch(leagueRetiredPlayers){
        case (?foundPlayers){
          
          let playerResult = Array.find<FootballTypes.Player>(foundPlayers.1, func(player: FootballTypes.Player) : Bool {
            player.id == dto.playerId;
          });

          switch(playerResult){
            case (?foundPlayer){

              retiredLeaguePlayers := Array.map<(FootballTypes.LeagueId, [FootballTypes.Player]), (FootballTypes.LeagueId, [FootballTypes.Player])>(retiredLeaguePlayers, func(leaguePlayersEntry: (FootballTypes.LeagueId, [FootballTypes.Player])){
                if(leaguePlayersEntry.0 == foundPlayer.leagueId){
              
                  return (leaguePlayersEntry.0, Array.filter<FootballTypes.Player>(leaguePlayersEntry.1, func(player: FootballTypes.Player){
                    player.id == dto.playerId;
                  }));
                } else {
                  return leaguePlayersEntry;
                };
              });
              
              leaguePlayers := Array.map<(FootballTypes.LeagueId, [FootballTypes.Player]), (FootballTypes.LeagueId, [FootballTypes.Player])>(leaguePlayers, func(leaguePlayersEntry: (FootballTypes.LeagueId, [FootballTypes.Player])){
                if(leaguePlayersEntry.0 == foundPlayer.leagueId){
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
                    valueQuarterMillions = foundPlayer.valueQuarterMillions;
                  });
                  return (leaguePlayersEntry.0, Buffer.toArray(leaguePlayersBuffer));
                } else {
                  return leaguePlayersEntry;
                };                
              });

              let _ = await updateDataHashes(dto.leagueId, "players");
              return #ok();
            };
            case (null){

            };
          };
        };
        case (null){};
      };

      return #err(#NotFound);
    };

    /* League */

    public shared ({ caller }) func createLeague(dto: GovernanceDTOs.CreateLeagueDTO) : async Result.Result<(), T.Error> {
      assert callerAllowed(caller);

      let leaguesBuffer = Buffer.fromArray<FootballTypes.League>(leagues);
      leaguesBuffer.add({
        abbreviation = dto.abbreviation;
        countryId = dto.countryId;
        formed = dto.formed;
        governingBody = dto.governingBody;
        id = nextLeagueId;
        logo = dto.logo;
        name = dto.name;
        teamCount = dto.teamCount;
        relatedGender = dto.relatedGender;
      });

      leagues := Buffer.toArray(leaguesBuffer);

      let leagueSeasonsBuffer = Buffer.fromArray<(FootballTypes.LeagueId, [FootballTypes.Season])>(leagueSeasons);
      let leaguesClubsBuffer = Buffer.fromArray<(FootballTypes.LeagueId, [FootballTypes.Club])>(leagueClubs);
      let leaguePlayersBuffer = Buffer.fromArray<(FootballTypes.LeagueId, [FootballTypes.Player])>(leaguePlayers);

      leagueSeasonsBuffer.add((nextLeagueId, []));
      leaguesClubsBuffer.add((nextLeagueId, []));
      leaguePlayersBuffer.add((nextLeagueId, []));

      leagueSeasons := Buffer.toArray(leagueSeasonsBuffer);
      leagueClubs := Buffer.toArray(leaguesClubsBuffer);
      leaguePlayers := Buffer.toArray(leaguePlayersBuffer);

      nextLeagueId += 1;
      return #ok();
    };

    public shared ({ caller }) func updateLeague(dto : GovernanceDTOs.UpdateLeagueDTO) : async Result.Result<(), T.Error> {
      assert callerAllowed(caller);
      
      let league = Array.find<FootballTypes.League>(leagues, func(currentLeague: FootballTypes.League) : Bool {
        currentLeague.id == dto.leagueId;
      });

      switch(league){
        case (?_){
          leagues := Array.map<FootballTypes.League, FootballTypes.League>(leagues, func(currentLeague: FootballTypes.League){
            if(currentLeague.id == dto.leagueId){
              return {
                abbreviation = dto.abbreviation;
                countryId = dto.countryId;
                formed = dto.formed;
                governingBody = dto.governingBody;
                id = currentLeague.id;
                logo = dto.logo;
                name =  dto.name;
                relatedGender = dto.relatedGender;
                teamCount = dto.teamCount
              }
            } else {
              return currentLeague;
            }
          });
          return #ok();
        };
        case (null){
          return #err(#NotFound);
        }
      };
    };

    public shared ({ caller }) func moveFixture(dto : GovernanceDTOs.MoveFixtureDTO) : async Result.Result<(), T.Error> {
      assert callerAllowed(caller);

      leagueSeasons := Array.map<(FootballTypes.LeagueId, [FootballTypes.Season]), (FootballTypes.LeagueId, [FootballTypes.Season])>(
        leagueSeasons, 
        func(leagueSeasonEntry: (FootballTypes.LeagueId, [FootballTypes.Season])){
          if(leagueSeasonEntry.0 == dto.leagueId){
            return (
              leagueSeasonEntry.0, 
              Array.map<FootballTypes.Season, FootballTypes.Season>(leagueSeasonEntry.1, func(season: FootballTypes.Season){
                if(season.id == dto.seasonId){
                  return {
                    fixtures = List.map<FootballTypes.Fixture, FootballTypes.Fixture>(season.fixtures, func(fixture: FootballTypes.Fixture){
                      if(fixture.id == dto.fixtureId){
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
                        }
                      } else {
                        return fixture;
                      };
                    });
                    id = season.id;
                    name = season.name;
                    postponedFixtures = season.postponedFixtures;
                    year = season.year;
                  }
                } else {
                  return season;
                }
              })
            )
          } else { return leagueSeasonEntry}
        }
      );
      await checkCurrentGameweekExpired();
      let _ = await updateDataHashes(dto.leagueId, "fixtures");
      return #ok();
    };

    public shared ({ caller }) func postponeFixture(dto : GovernanceDTOs.PostponeFixtureDTO) : async Result.Result<(), T.Error> {
      
      assert callerAllowed(caller);

      leagueSeasons := Array.map<(FootballTypes.LeagueId, [FootballTypes.Season]), (FootballTypes.LeagueId, [FootballTypes.Season])>(
        leagueSeasons, 
        func(leagueSeasonEntry: (FootballTypes.LeagueId, [FootballTypes.Season])){
          if(leagueSeasonEntry.0 == dto.leagueId){
            return (
              leagueSeasonEntry.0, 
              Array.map<FootballTypes.Season, FootballTypes.Season>(leagueSeasonEntry.1, func(season: FootballTypes.Season){
                if(season.id == dto.seasonId){
                  let foundFixture = List.find<FootballTypes.Fixture>(season.fixtures, func(fixture: FootballTypes.Fixture): Bool{
                    fixture.id == dto.fixtureId
                  });
                  switch(foundFixture){
                    case (?fixture){
                      return {
                        
                        fixtures = List.filter<FootballTypes.Fixture>(season.fixtures, func(fixture: FootballTypes.Fixture){
                          fixture.id != dto.fixtureId
                        });
                        id = season.id;
                        name = season.name;
                        postponedFixtures = List.append<FootballTypes.Fixture>(season.postponedFixtures, List.make<FootballTypes.Fixture>({
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
                          status = fixture.status
                        }));
                        year = season.year;
                      }
                    };
                    case (null){
                      return season;
                    }
                  }
                } else {
                  return season;
                }
              })
            )
          } else { return leagueSeasonEntry}
        }
      );
      await checkCurrentGameweekExpired();
      let _ = await updateDataHashes(dto.leagueId, "fixtures");
      return #ok();
    };

    //TODO: Reschedule fixture
        //When a fixture time is changed check gameweek times

    public shared ({ caller }) func addInitialFixtures() : async () {
      assert callerAllowed(caller);

      //TODO
      return;
      //TODO: Make sure timer to roll gameweek over called:
      await setCheckCurrentGameweekTimer();


    //TODO: Add function to add initial fixtures to league from csv file
      //TODO: Add the fixtures in the data manager
      //TODO: Call back to each app notifying them of fixtures added for season

    };

    public shared ({ caller }) func submitFixtureData(dto : GovernanceDTOs.SubmitFixtureDataDTO) : async Result.Result<(), T.Error>{
      assert callerAllowed(caller);
     
      for(leagueApplication in Iter.fromArray(leagueApplications)){
        if(leagueApplication.0 == dto.leagueId){
          
          let leaguePlayerArray = Array.find<(FootballTypes.LeagueId, [FootballTypes.Player])>(leaguePlayers, 
            func(leaguePlayersArray: (FootballTypes.LeagueId, [FootballTypes.Player])) :  Bool {
              return leaguePlayersArray.0 == dto.leagueId;
          });

          switch(leaguePlayerArray){
            case (?foundArray){
              let players = foundArray.1;
              let populatedPlayerEvents = await populatePlayerEventData(dto, players);
              switch (populatedPlayerEvents) {
                case (null) {};
                case (?events) {
                  addEventsToFixture(dto.leagueId, events, dto.seasonId, dto.fixtureId);
                  addEventsToPlayers(dto.leagueId, events, dto.seasonId, dto.gameweek, dto.fixtureId);
                  var highestScoringPlayerId: Nat16 = 0;
                  let highestScoringPlayerEvent = Array.find<FootballTypes.PlayerEventData>(events, func(event: FootballTypes.PlayerEventData) : Bool{
                    event.eventType == #HighestScoringPlayer;
                  });
                  switch(highestScoringPlayerEvent){
                    case (?foundEvent){
                      highestScoringPlayerId := foundEvent.playerId;
                    };
                    case (null){

                    }
                  };
                  finaliseFixture(dto.leagueId, dto.seasonId, dto.fixtureId, highestScoringPlayerId);
                  let _ = await notifyAppsOfFixtureFinalised(dto.leagueId, dto.seasonId, dto.gameweek);
                  let _ =  await updateDataHashes(dto.leagueId, "players");
                  let _ =  await updateDataHashes(dto.leagueId, "fixtures");
                  let _ =  await updateDataHashes(dto.leagueId, "player_events");
                  let _ = await updateBettingOdds(dto.leagueId);
                  
                };
              };
            };
            case (null){};
          };
        };
      };        
      return #ok();
    };
    
    /* Club */

    public shared ({ caller }) func createClub(dto: GovernanceDTOs.CreateClubDTO) : async Result.Result<(), T.Error> {
      assert callerAllowed(caller);

      let leagueResult = Array.find<FootballTypes.League>(leagues, func(league: FootballTypes.League) : Bool {
        league.id == dto.leagueId
      });

      switch(leagueResult){
        case (?_){
          leagueClubs := Array.map<(FootballTypes.LeagueId, [FootballTypes.Club]), (FootballTypes.LeagueId, [FootballTypes.Club])>(leagueClubs, func(leagueEntry: (FootballTypes.LeagueId, [FootballTypes.Club])){
            if(leagueEntry.0 == dto.leagueId){
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
              return (leagueEntry.0, Buffer.toArray(updatedClubsBuffer));
            } else {
              return leagueEntry;
            }
          });
          return #ok();
          
        };
        case (null){
          return #err(#NotFound);
        }
      };
    };

    public shared ( {caller} ) func removeClub(dto: GovernanceDTOs.RemoveClubDTO) : async Result.Result<(), T.Error> {
      assert callerAllowed(caller);
      
      let playersResult = getClubPlayers(dto.leagueId, dto.clubId);
      switch(playersResult){
        case (#ok foundPlayers){
          if(Array.size(foundPlayers) > 0){
            return #err(#NotAllowed);
          }
        };
        case (#err _) {}
      };
      
      leagueClubs := Array.map<(FootballTypes.LeagueId, [FootballTypes.Club]), (FootballTypes.LeagueId, [FootballTypes.Club])>(leagueClubs, 
        func(leagueClubsEntry: (FootballTypes.LeagueId, [FootballTypes.Club])){
          if(leagueClubsEntry.0 == dto.leagueId) {
            (leagueClubsEntry.0, Array.filter<FootballTypes.Club>(leagueClubsEntry.1, func(club: FootballTypes.Club){
              club.id != dto.clubId
            }))
          } else { return leagueClubsEntry }
        }
      );

      return #err(#NotFound);
    };

    public shared func getLeagueClubs() : async [(FootballTypes.LeagueId, [FootballTypes.Club])] {
      return leagueClubs;
    };

    public shared func getLeaguePlayers() : async [(FootballTypes.LeagueId, [FootballTypes.Player])] {
      return leaguePlayers;
    };

    public shared ({ caller }) func promoteClub(leagueId: FootballTypes.LeagueId, dto : GovernanceDTOs.PromoteClubDTO) : async Result.Result<(), T.Error> {
      assert callerAllowed(caller);

      //TODO (KELLY)
      /*
      assert callerAllowed(caller);


        if (Array.size(clubs) >= 20) {
            return #err(#InvalidData);
        };

        if (Text.size(promoteNewClubDTO.name) > 100) {
            return #err(#InvalidData);
        };

        if (Text.size(promoteNewClubDTO.friendlyName) > 50) {
                return #err(#InvalidData);
        };

        if (Text.size(promoteNewClubDTO.abbreviatedName) != 3) {
                return #err(#InvalidData);
        };

        if (not Utilities.validateHexColor(promoteNewClubDTO.primaryColourHex)) {
            return #err(#InvalidData);
        };

        if (not Utilities.validateHexColor(promoteNewClubDTO.secondaryColourHex)) {
            return #err(#InvalidData);
        };

        if (not Utilities.validateHexColor(promoteNewClubDTO.thirdColourHex)) {
            return #err(#InvalidData);
        };
      
        let newClub : T.Club = {
            id = nextClubId;
            name = promoteNewClubDTO.name;
            friendlyName = promoteNewClubDTO.friendlyName;
            abbreviatedName = promoteNewClubDTO.abbreviatedName;
            primaryColourHex = promoteNewClubDTO.primaryColourHex;
            secondaryColourHex = promoteNewClubDTO.secondaryColourHex;
            thirdColourHex = promoteNewClubDTO.thirdColourHex;
            shirtType = promoteNewClubDTO.shirtType;
        };

        let clubsBuffer = Buffer.fromArray<T.Club>(clubs);
        clubsBuffer.add(newClub);
        clubs := Buffer.toArray(clubsBuffer);
      let _ = await updateDataHashes(leagueId, "clubs");
        return #ok();
        */

      return #err(#NotFound);
    };

    public shared ({ caller }) func relegateClub(leagueId: FootballTypes.LeagueId, dto : GovernanceDTOs.RelegateClubDTO) : async Result.Result<(), T.Error> {
      assert callerAllowed(caller);

      //TODO (KELLY)
      return #err(#NotFound);
    };

    public shared ({ caller }) func updateClub(updateClubDTO : GovernanceDTOs.UpdateClubDTO) : async Result.Result<(), T.Error> {
      assert callerAllowed(caller);

      //TODO (KELLY)
      /*
      assert callerAllowed(caller);
        let club = Array.find(
            clubs,
            func(c : T.Club) : Bool {
            return c.id == updateClubDTO.clubId;
            },
        );

        switch (club) {
            case (null) {
                return #err(#InvalidData);
            };
            case (?foundTeam) {

            if (Text.size(foundTeam.name) > 100) {
                return #err(#InvalidData);
            };

            if (Text.size(foundTeam.friendlyName) > 50) {
                return #err(#InvalidData);
            };

            if (Text.size(foundTeam.abbreviatedName) != 3) {
                return #err(#InvalidData);
            };

            if (not Utilities.validateHexColor(foundTeam.primaryColourHex)) {
                return #err(#InvalidData);
            };

            if (not Utilities.validateHexColor(foundTeam.secondaryColourHex)) {
                return #err(#InvalidData);
            };

            if (not Utilities.validateHexColor(foundTeam.thirdColourHex)) {
                return #err(#InvalidData);
            };
            };
        };

        clubs := Array.map<T.Club, T.Club>(
            clubs,
            func(currentClub : T.Club) : T.Club {
            if (currentClub.id == updateClubDTO.clubId) {
                return {
                id = currentClub.id;
                name = updateClubDTO.name;
                friendlyName = updateClubDTO.friendlyName;
                primaryColourHex = updateClubDTO.primaryColourHex;
                secondaryColourHex = updateClubDTO.secondaryColourHex;
                thirdColourHex = updateClubDTO.thirdColourHex;
                abbreviatedName = updateClubDTO.abbreviatedName;
                shirtType = updateClubDTO.shirtType;
                };
            } else {
                return currentClub;
            };
            },
        );
        return #ok();
      let _ = await updateDataHashes(leagueId, "clubs");
        */
      return #err(#NotFound);
    };

    //TODO SHOULD BE PRIVATE IN HERE
      //WHERE IS THIS BEING SET

    public shared func getBetslipFixtures(dto: RequestDTOs.GetBetslipFixturesDTO) : async Result.Result<[ResponseDTOs.FixtureDTO], T.Error>{
      return #err(#NotFound); //TODO: Implement
    };

    /* Private Functions */

    private func finaliseFixture(leagueId: FootballTypes.LeagueId, seasonId: FootballTypes.SeasonId, fixtureId: FootballTypes.FixtureId, highestScoringPlayerId: FootballTypes.PlayerId){
      leagueSeasons := Array.map<(FootballTypes.LeagueId, [FootballTypes.Season]), (FootballTypes.LeagueId, [FootballTypes.Season])>(leagueSeasons, 
        func (leagueSeasonsEntry: (FootballTypes.LeagueId, [FootballTypes.Season])){
          if(leagueSeasonsEntry.0 == leagueId){
            return (leagueSeasonsEntry.0, Array.map<FootballTypes.Season, FootballTypes.Season>(leagueSeasonsEntry.1, func(season: FootballTypes.Season){
              if(season.id == seasonId){
                
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
              }
            }));
          } else { return leagueSeasonsEntry }
      });
    };

    public func populatePlayerEventData(submitFixtureDataDTO : GovernanceDTOs.SubmitFixtureDataDTO, allPlayers : [FootballTypes.Player]) : async ?[FootballTypes.PlayerEventData] {

      let allPlayerEventsBuffer = Buffer.fromArray<FootballTypes.PlayerEventData>(submitFixtureDataDTO.playerEventData);

      let homeTeamPlayerIdsBuffer = Buffer.fromArray<Nat16>([]);
      let awayTeamPlayerIdsBuffer = Buffer.fromArray<Nat16>([]);

      let leagueSeasonEntry = 
        Array.find<(FootballTypes.LeagueId, [FootballTypes.Season])>(leagueSeasons, func(leagueSeasonEntry: (FootballTypes.LeagueId, [FootballTypes.Season])) : Bool {
          leagueSeasonEntry.0 == submitFixtureDataDTO.leagueId;
      });

      switch(leagueSeasonEntry){
        case (null){
          return null;
        };
        case (?foundLeagueSeasonEntry){
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
                    let player = Array.find<ResponseDTOs.PlayerDTO>(allPlayers, func(p : ResponseDTOs.PlayerDTO) : Bool { return p.id == playerId });
                    switch (player) {
                      case (null) {};
                      case (?actualPlayer) {
                        if (actualPlayer.position == #Goalkeeper or actualPlayer.position == #Defender) {
                          if (Array.find<Nat16>(Buffer.toArray(homeTeamDefensivePlayerIdsBuffer), 
                          func(x : Nat16) : Bool { return x == playerId }) == null) {
                            homeTeamDefensivePlayerIdsBuffer.add(playerId);
                          };
                        };
                      };
                    };
                  };

                  for (playerId in Iter.fromArray<Nat16>(Buffer.toArray(awayTeamPlayerIdsBuffer))) {
                    let player = Array.find<ResponseDTOs.PlayerDTO>(allPlayers, func(p : ResponseDTOs.PlayerDTO) : Bool { return p.id == playerId });
                    switch (player) {
                      case (null) {};
                      case (?actualPlayer) {
                        if (actualPlayer.position == #Goalkeeper or actualPlayer.position == #Defender) {
                          if (Array.find<Nat16>(Buffer.toArray(awayTeamDefensivePlayerIdsBuffer), 
                          func(x : Nat16) : Bool { return x == playerId }) == null) {
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
                      let player = Array.find<ResponseDTOs.PlayerDTO>(allPlayers, func(p : ResponseDTOs.PlayerDTO) : Bool { return p.id == playerId });
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
                        let player = Array.find<ResponseDTOs.PlayerDTO>(allPlayers, func(p : ResponseDTOs.PlayerDTO) : Bool { return p.id == playerId });
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
                      let player = Array.find<ResponseDTOs.PlayerDTO>(allPlayers, func(p : ResponseDTOs.PlayerDTO) : Bool { return p.id == playerId });
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
                        let player = Array.find<ResponseDTOs.PlayerDTO>(allPlayers, func(p : ResponseDTOs.PlayerDTO) : Bool { return p.id == playerId });
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
        }
      };
    };

    private func populateHighestScoringPlayer(playerEvents : [FootballTypes.PlayerEventData], fixture : FootballTypes.Fixture, players : [ResponseDTOs.PlayerDTO]) : [FootballTypes.PlayerEventData] {

      var homeGoalsCount : Nat8 = 0;
      var awayGoalsCount : Nat8 = 0;

      let playerEventsMap : TrieMap.TrieMap<FootballTypes.PlayerId, [FootballTypes.PlayerEventData]> = TrieMap.TrieMap<FootballTypes.PlayerId, [FootballTypes.PlayerEventData]>(Utilities.eqNat16, Utilities.hashNat16);

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

        let playerId : FootballTypes.PlayerId = event.playerId;
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
        let currentPlayer = Array.find<ResponseDTOs.PlayerDTO>(
          players,
          func(player : ResponseDTOs.PlayerDTO) : Bool {
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
      var highestScoringPlayerId : FootballTypes.PlayerId = 0;
      var isUniqueHighScore : Bool = true;
      let uniquePlayerIdsBuffer = Buffer.fromArray<FootballTypes.PlayerId>([]);

      for (event in Iter.fromArray(playerEvents)) {
        if (not Buffer.contains<FootballTypes.PlayerId>(uniquePlayerIdsBuffer, event.playerId, func(a : FootballTypes.PlayerId, b : FootballTypes.PlayerId) : Bool { a == b })) {
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
        let highestScoringPlayer = Array.find<ResponseDTOs.PlayerDTO>(players, func(p : ResponseDTOs.PlayerDTO) : Bool { return p.id == highestScoringPlayerId });
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

    private func addEventsToFixture(leagueId: FootballTypes.LeagueId, playerEventData : [FootballTypes.PlayerEventData], seasonId : FootballTypes.SeasonId, fixtureId : FootballTypes.FixtureId) {
      
      leagueSeasons := Array.map<(FootballTypes.LeagueId, [FootballTypes.Season]), (FootballTypes.LeagueId, [FootballTypes.Season])>(leagueSeasons, 
        func (leagueSeasonsEntry: (FootballTypes.LeagueId, [FootballTypes.Season])){
          if(leagueSeasonsEntry.0 == leagueId){
            return (leagueSeasonsEntry.0, Array.map<FootballTypes.Season, FootballTypes.Season>(leagueSeasonsEntry.1, func(season: FootballTypes.Season){
              if(season.id == seasonId){
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
              }
            }));
          } else { return leagueSeasonsEntry }
      });
      setGameScore(leagueId, seasonId, fixtureId);
    };

    private func addEventsToPlayers(leagueId: FootballTypes.LeagueId, playerEventData : [FootballTypes.PlayerEventData], seasonId : FootballTypes.SeasonId, gameweek : FootballTypes.GameweekNumber, fixtureId: FootballTypes.FixtureId) {
  
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

      let leaguePlayerArray = Array.find<(FootballTypes.LeagueId, [FootballTypes.Player])>(leaguePlayers, 
        func(leaguePlayersArray: (FootballTypes.LeagueId, [FootballTypes.Player])) :  Bool {
          return leaguePlayersArray.0 == leagueId;
      });

      switch(leaguePlayerArray){
        case (?foundArray){

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

                              let otherFixtureEvents = List.filter<FootballTypes.PlayerEventData>(gw.events, func(playerEvent: FootballTypes.PlayerEventData){
                                playerEvent.fixtureId != fixtureId
                              });

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

                let updatedPlayer: FootballTypes.Player = {
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
                  gender = foundPlayer.gender
                };

                updateLeaguePlayer(leagueId, updatedPlayer);
              };
            }

          };

        };
        case (null){
          
        }
      };  
    };

    private func setGameScore(leagueId: FootballTypes.LeagueId, seasonId: FootballTypes.SeasonId, fixtureId: FootballTypes.FixtureId){
      
      leagueSeasons := Array.map<(FootballTypes.LeagueId, [FootballTypes.Season]), (FootballTypes.LeagueId, [FootballTypes.Season])>(leagueSeasons, 
        func (leagueSeasonsEntry: (FootballTypes.LeagueId, [FootballTypes.Season])){
          if(leagueSeasonsEntry.0 == leagueId){
            return (leagueSeasonsEntry.0, Array.map<FootballTypes.Season, FootballTypes.Season>(leagueSeasonsEntry.1, func(season: FootballTypes.Season){
              if(season.id == seasonId){
                
                let fixturesBuffer = Buffer.fromArray<FootballTypes.Fixture>([]);
                for(fixture in Iter.fromList(season.fixtures)){
                  if(fixture.id == fixtureId){

                    var homeGoals: Nat8 = 0;
                    var awayGoals: Nat8 = 0;

                    for(event in Iter.fromList(fixture.events)){
                      switch(event.eventType){
                        case (#Goal) {
                          if(event.clubId == fixture.homeClubId){
                            homeGoals += 1;
                          } else {
                            awayGoals += 1;
                          }
                        };
                        case (#OwnGoal){
                          if(event.clubId == fixture.homeClubId){
                            awayGoals += 1;
                          } else {
                            homeGoals += 1;
                          }
                        };
                        case _ { };
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
                  }
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
              }
            }));
          } else { return leagueSeasonsEntry }
      });
    };

    private func updateLeaguePlayer(leagueId: FootballTypes.LeagueId, updatedPlayer: FootballTypes.Player){

      leaguePlayers := Array.map<(FootballTypes.LeagueId, [FootballTypes.Player]), (FootballTypes.LeagueId, [FootballTypes.Player])>(leaguePlayers, func(leaguePlayersSet: (FootballTypes.LeagueId, [FootballTypes.Player])){
        if(leaguePlayersSet.0 == leagueId){
          return (leaguePlayersSet.0, Array.map<FootballTypes.Player, FootballTypes.Player>(leaguePlayersSet.1, func(player: FootballTypes.Player){
            if(player.id == updatedPlayer.id){
              updatedPlayer;
            } else {
              return player;
            }
          }));
        } else {
          return leaguePlayersSet;
        }
      });
    };

    private func getPlayer(leagueId: FootballTypes.LeagueId, playerId: FootballTypes.PlayerId) : ?FootballTypes.Player{
      let playersLeague = Array.find<(FootballTypes.LeagueId, [FootballTypes.Player])>(leaguePlayers, func(playerLeagueEntry: (FootballTypes.LeagueId, [FootballTypes.Player])) : Bool{
        playerLeagueEntry.0 == leagueId;
      });
      switch(playersLeague){
        case (null){
          return null;
        };
        case (?foundPlayersLeague){
          return Array.find<FootballTypes.Player>(foundPlayersLeague.1, func(player: FootballTypes.Player) : Bool{
            player.id == playerId
          });
        }
      }
    };

    private func movePlayerToFreeAgents(leagueId: FootballTypes.LeagueId, playerId: FootballTypes.PlayerId){

      let playerToMove = getPlayer(leagueId, playerId);

      switch(playerToMove){
        case (?foundPlayer){
          leaguePlayers := Array.map<(FootballTypes.LeagueId, [FootballTypes.Player]), (FootballTypes.LeagueId, [FootballTypes.Player])>(leaguePlayers, 
            func(leagueWithPlayers: (FootballTypes.LeagueId, [FootballTypes.Player]))
            {
              if(leagueWithPlayers.0 == leagueId){
                return (leagueWithPlayers.0, 
                  Array.filter<FootballTypes.Player>(leagueWithPlayers.1, func(player: FootballTypes.Player) : Bool{
                    player.id != playerId
                  })
                );
              } else {
                return leagueWithPlayers;
              }
            }
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
            valueQuarterMillions = foundPlayer.valueQuarterMillions;
          });
          freeAgents := Buffer.toArray(freeAgentsBuffer);
        };
        case (null){ }
      };
    };

    private func movePlayerWithinLeague(currentLeagueId: FootballTypes.LeagueId, newClubId: FootballTypes.ClubId, playerId: FootballTypes.PlayerId, shirtNumber: Nat8){
      
      leaguePlayers := Array.map<(FootballTypes.LeagueId, [FootballTypes.Player]),(FootballTypes.LeagueId, [FootballTypes.Player])>(leaguePlayers, func(leaguePlayersEntry: (FootballTypes.LeagueId, [FootballTypes.Player])){
        if(leaguePlayersEntry.0 == currentLeagueId){
          return (leaguePlayersEntry.0, Array.map<FootballTypes.Player, FootballTypes.Player>(leaguePlayersEntry.1, func(player: FootballTypes.Player){
            if(player.id == playerId){

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
                valueQuarterMillions = player.valueQuarterMillions;
              }
            } else {
              return player;
            }
          }));
        } else {
          return leaguePlayersEntry;
        };
      });
    };

    private func movePlayerToLeague(currentLeagueId: FootballTypes.LeagueId, newLeagueId: FootballTypes.LeagueId, newClubId: FootballTypes.ClubId, playerId: FootballTypes.PlayerId, shirtNumber: Nat8){
      
      let playerToMove = getPlayer(currentLeagueId, playerId);

      switch(playerToMove){
        case (?foundPlayer){
          leaguePlayers := Array.map<(FootballTypes.LeagueId, [FootballTypes.Player]), (FootballTypes.LeagueId, [FootballTypes.Player])>(leaguePlayers, 
            func(leagueWithPlayers: (FootballTypes.LeagueId, [FootballTypes.Player]))
            {
              if(leagueWithPlayers.0 == currentLeagueId){
                return (leagueWithPlayers.0, 
                  Array.filter<FootballTypes.Player>(leagueWithPlayers.1, func(player: FootballTypes.Player) : Bool{
                    player.id != playerId
                  })
                );
              } else {
                return leagueWithPlayers;
              }
            }
          );

          leaguePlayers := Array.map<(FootballTypes.LeagueId, [FootballTypes.Player]), (FootballTypes.LeagueId, [FootballTypes.Player])>(leaguePlayers, 
            func(leagueWithPlayers: (FootballTypes.LeagueId, [FootballTypes.Player]))
            {
              if(leagueWithPlayers.0 == newLeagueId){
          
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
              }
            }
          );
        };
        case (null){ }
      };
    };

    private func calculatePlayerScore(playerPosition : FootballTypes.PlayerPosition, events : [FootballTypes.PlayerEventData]) : Int16 {
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

    private func leagueExists(leagueId: FootballTypes.LeagueId) : Bool {
      let foundLeague = Array.find<FootballTypes.League>(leagues, func(league: FootballTypes.League) : Bool {
        league.id == leagueId
      });
      return Option.isSome(foundLeague);
    }; 

    private func clubExists(leagueId: FootballTypes.LeagueId, clubId: FootballTypes.ClubId) : Bool {
      
      let league = Array.find<(FootballTypes.LeagueId, [FootballTypes.Club])>(leagueClubs, func(league: (FootballTypes.LeagueId, [FootballTypes.Club])) : Bool {
        league.0 == leagueId
      });

      switch(league){
        case (?foundLeague){
          let foundClub = Array.find<FootballTypes.Club>(foundLeague.1, func(club: FootballTypes.Club) : Bool {
            return club.id == clubId;
          });

          return Option.isSome(foundClub);
        };
        case (null){
          return false;
        }
      };
    }; 

    private func checkPlayerExists(leagueId: FootballTypes.LeagueId, playerId: FootballTypes.PlayerId) : Bool {
      let playersInLeague = Array.find<(FootballTypes.LeagueId, [FootballTypes.Player])>(leaguePlayers, 
        func(foundLeaguePlayers: (FootballTypes.LeagueId, [FootballTypes.Player])) : Bool{
          foundLeaguePlayers.0 == leagueId;
        }
      );

      switch(playersInLeague){
        case (?foundPlayersInLeague){
          let foundPlayer = Array.find<FootballTypes.Player>(foundPlayersInLeague.1, func(player: FootballTypes.Player) : Bool{
            player.id == playerId;
          });
          if(Option.isNull(foundPlayer)){
            return false;
          }
        };
        case (null){
          return false;
        }
      };
      return true;
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

      let playerEventsMap : TrieMap.TrieMap<FootballTypes.PlayerId, List.List<FootballTypes.PlayerEventData>> = TrieMap.TrieMap<FootballTypes.PlayerId, List.List<FootballTypes.PlayerEventData>>(Utilities.eqNat16, Utilities.hashNat16);

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

    system func preupgrade() { };

    system func postupgrade() {
      ignore Timer.setTimer<system>(#nanoseconds(Int.abs(1)), postUpgradeCallback); 
    };

    private func postUpgradeCallback() : async (){
      await setSystemTimers();
      await checkCurrentGameweekExpired();
      //TODO: Check cycles for betting canisters when created
    };

    //Timer Callback Functions

    private func setAndBackupTimer(duration : Timer.Duration, callbackName : Text) : async () {
      let jobId : Timer.TimerId = switch (callbackName) {
        case "checkCurrentGameweek" {
          Timer.setTimer<system>(duration, checkCurrentGameweekExpired);
        };
        case "endOfSeason" {
          Timer.setTimer<system>(duration, endOfSeasonExpired);
        };
        case "transferWindowStart" {
          Timer.setTimer<system>(duration, transferWindowStart);
        };
        case "transferWindowEnd" {
          Timer.setTimer<system>(duration, transferWindowEnd);
        };
        case "setFixtureToActive" {
          Timer.setTimer<system>(duration, setFixtureToActive);
        };
        case "setFixtureToComplete" {
          Timer.setTimer<system>(duration, setFixtureToComplete);
        };
        case "loanExpired" {
          Timer.setTimer<system>(duration, loanExpiredCallback);
        };
        case "injuryExpired" {
          Timer.setTimer<system>(duration, injuryExpiredCallback);
        };
        case _ {
          Timer.setTimer<system>(duration, defaultCallback);
        }
      };

      let triggerTime = switch (duration) {
        case (#seconds s) {
          Time.now() + s * 1_000_000_000;
        };
        case (#nanoseconds ns) {
          Time.now() + ns;
        };
      };

      let newTimerInfo : Base.TimerInfo = {
        id = jobId;
        triggerTime = triggerTime;
        callbackName = callbackName;
      };

      var timerBuffer = Buffer.fromArray<Base.TimerInfo>(timers);
      timerBuffer.add(newTimerInfo);
      timers := Buffer.toArray(timerBuffer);
    };
    
    private func setSystemTimers() : async (){
      
      let currentTime = Time.now();
      for (timerInfo in Iter.fromArray(timers)) {
        let remainingDuration = timerInfo.triggerTime - currentTime;

        if (remainingDuration > 0) {
          let duration : Timer.Duration = #nanoseconds(Int.abs(remainingDuration));

          switch (timerInfo.callbackName) {
            case "checkCurrentGameweek" {
              ignore Timer.setTimer<system>(duration, checkCurrentGameweekExpired);
            };
            case "endOfSeason" {
              ignore Timer.setTimer<system>(duration, endOfSeasonExpired);
            };
            case "transferWindowStart" {
              ignore Timer.setTimer<system>(duration, transferWindowStart);
            };
            case "transferWindowEnd" {
              ignore Timer.setTimer<system>(duration, transferWindowEnd);
            };
            case "setFixtureToActive" {
              ignore Timer.setTimer<system>(duration, setFixtureToActive);
            };
            case "setFixtureToComplete" {
              ignore Timer.setTimer<system>(duration, setFixtureToComplete);
            };
            case "loanExpired" {
              ignore Timer.setTimer<system>(duration, loanExpiredCallback);
            };
            case "injuryExpired" {
              ignore Timer.setTimer<system>(duration, injuryExpiredCallback);
            };
            case _ {};
          };
        };
      };
    };

    private func removeExpiredTimers() : () {
      let currentTime = Time.now();
      timers := Array.filter<Base.TimerInfo>(
        timers,
        func(timer : Base.TimerInfo) : Bool {
          return timer.triggerTime > currentTime;
        },
      );
    };

    private func defaultCallback() : async () {};

    private func checkCurrentGameweekExpired() : async () {
      for(league in Iter.fromArray(leagueSeasons)){
        let leagueStatusResult = Array.find<FootballTypes.LeagueStatus>(leagueStatuses, func(statusEntry: FootballTypes.LeagueStatus) : Bool {
          statusEntry.leagueId == league.0;
        });
        switch(leagueStatusResult){
          case (?leagueStatus){

            let seasonEntry = Array.find<FootballTypes.Season>(league.1, func(seasonEntry: FootballTypes.Season) : Bool {
              seasonEntry.id == leagueStatus.activeSeasonId;
            });

            switch(seasonEntry){
              case (?season){
                let sortedFixtures = Array.sort<FootballTypes.Fixture>(List.toArray<FootballTypes.Fixture>(season.fixtures), func (a: FootballTypes.Fixture, b: FootballTypes.Fixture) {
                  if (a.kickOff < b.kickOff) {
                      return #less;
                  } else if (a.kickOff > b.kickOff) {
                      return #greater;
                  } else {
                      return #equal;
                  }
                });

                if(Array.size(sortedFixtures) <= 1){
                  return;
                };
                
                var nextFixtureIndex = 0;
                //Loops through all 380 fixtures
                label fixtureLoop for(fixture in Iter.fromArray(sortedFixtures)){
                  if(fixture.kickOff > Time.now()){
                    break fixtureLoop;
                  };
                  nextFixtureIndex += 1;
                };

                //at 2pm the next fixture was the 3pm fixture

                let nextFixture = sortedFixtures[nextFixtureIndex];

                //this gets you the next fixture object

                //this is the default
                var activeGameweek: FootballTypes.GameweekNumber = 0;
                var completedGameweek: FootballTypes.GameweekNumber = nextFixture.gameweek - 1; //gw16
                var unplayedGameweek: FootballTypes.GameweekNumber = nextFixture.gameweek; //gw17
                
                //these are all the gw 17 fixtures
                let nextFixtureGameweekFixtures = Array.filter<FootballTypes.Fixture>(sortedFixtures, func(fixtureEntry: FootballTypes.Fixture) {
                  fixtureEntry.gameweek == nextFixture.gameweek
                });

                //there should have been no fixtures before this point at 2pm
                
                //need to decide if the gameweek needs to change, the active gameweek was zero at 2pm
                  //

                let nextFixtureGameweekFixturesBeforeNow = Array.filter<FootballTypes.Fixture>(nextFixtureGameweekFixtures, func(fixtureEntry: FootballTypes.Fixture) {
                  fixtureEntry.kickOff < Time.now();
                });

                if(Array.size(nextFixtureGameweekFixturesBeforeNow) > 0){
                  activeGameweek := nextFixture.gameweek;
                  unplayedGameweek := activeGameweek + 1;
                  completedGameweek := activeGameweek - 1; 

                  let _ = await notifyAppsOfGameweekStarting(leagueStatus.leagueId, season.id, activeGameweek);
                } else {
                  await setFixtureTimers(nextFixtureGameweekFixtures);
                };
                
                setLeagueGameweek(leagueStatus.leagueId, unplayedGameweek, activeGameweek, completedGameweek, nextFixtureGameweekFixtures[0].kickOff);
              };
              case (null){}
            };
          };
          case (null){}
        };
      };
      await setCheckCurrentGameweekTimer();
      removeExpiredTimers();
    };

    private func endOfSeasonExpired() : async (){
      for(league in Iter.fromArray(leagueSeasons)){
        let leagueStatusResult = Array.find<FootballTypes.LeagueStatus>(leagueStatuses, func(statusEntry: FootballTypes.LeagueStatus) : Bool {
          statusEntry.leagueId == league.0;
        });
        switch(leagueStatusResult){
          case (?leagueStatus){

            let seasonEntry = Array.find<FootballTypes.Season>(league.1, func(seasonEntry: FootballTypes.Season) : Bool {
              seasonEntry.id == leagueStatus.activeSeasonId;
            });

            switch(seasonEntry){
              case (?season){
                let sortedFixtures = Array.sort<FootballTypes.Fixture>(List.toArray<FootballTypes.Fixture>(season.fixtures), func (a: FootballTypes.Fixture, b: FootballTypes.Fixture) {
                  if (a.kickOff < b.kickOff) {
                      return #less;
                  } else if (a.kickOff > b.kickOff) {
                      return #greater;
                  } else {
                      return #equal;
                  }
                });

                if(Array.size(sortedFixtures) == 0){
                  return;
                };

                var nextFixtureResult: ?FootballTypes.Fixture = null;

                var seasonComplete = true;
                label fixtureLoop for(fixture in Iter.fromArray(sortedFixtures)){
                  if(fixture.kickOff > Time.now()){
                    seasonComplete := false;
                    nextFixtureResult := ?fixture;
                    break fixtureLoop;
                  };
                };

                if(seasonComplete){

                  let currentLeague = Array.find<FootballTypes.League>(leagues, func(league: FootballTypes.League) : Bool {
                    league.id == leagueStatus.leagueId;
                  });

                  let newSeasonId: FootballTypes.SeasonId = season.id + 1;
                  let newSeasonYear = season.year + 1;
                  let chars = Text.toArray(Nat16.toText(newSeasonYear + 1));
                  let lastTwoChars = Iter.fromArray([chars[chars.size() - 2], chars[chars.size() - 1]]);
                  let lastTwo = Text.fromIter(lastTwoChars);
                  let newSeasonName = Nat16.toText(newSeasonYear) # "/" # lastTwo;
                  
                  leagueSeasons := Array.map<(FootballTypes.LeagueId, [FootballTypes.Season]), (FootballTypes.LeagueId, [FootballTypes.Season])>(leagueSeasons, func(entry: (FootballTypes.LeagueId, [FootballTypes.Season])){
                    
                    let seasonsBuffer = Buffer.fromArray<FootballTypes.Season>(entry.1);
                    seasonsBuffer.add({
                      fixtures = List.nil();
                      id = newSeasonId;
                      name = newSeasonName;
                      postponedFixtures = List.nil();
                      year = newSeasonYear;
                    });
                    
                    return (entry.0, Buffer.toArray(seasonsBuffer));
                  });

                  leagueStatuses := Array.map<FootballTypes.LeagueStatus, FootballTypes.LeagueStatus>(leagueStatuses, func(updateEntry: FootballTypes.LeagueStatus){
                    if(updateEntry.leagueId == leagueStatus.leagueId){
                      return {
                        activeGameweek = 0;
                        completedGameweek = 0;
                        unplayedGameweek = 1;
                        activeMonth = 1;
                        activeSeasonId = newSeasonId;
                        lastConfirmedGameweek = 0;
                        leagueId = updateEntry.leagueId;
                        seasonActive = false;
                        totalGameweeks = updateEntry.totalGameweeks;
                        transferWindowActive = updateEntry.transferWindowActive;
                        transferWindowStartDay = updateEntry.transferWindowStartDay;
                        transferWindowStartMonth = updateEntry.transferWindowStartMonth;
                        transferWindowEndDay = updateEntry.transferWindowEndDay;
                        transferWindowEndMonth = updateEntry.transferWindowEndMonth;
                      };
                    } else {
                      return updateEntry;
                    };
                  });
                  return;
                };
              };
              case (null){}
            };
          };
          case (null){}
        };
      };
      removeExpiredTimers();
    };

    private func transferWindowStart () : async (){
      for(league in Iter.fromArray(leagueStatuses)){
        let transferWindowStartDate: Int = 0;
        let transferWindowEndDate: Int = 0;

        let now = Time.now();

        if(not league.transferWindowActive and  now >= transferWindowStartDate and now <= transferWindowEndDate){
          leagueStatuses := Array.map<FootballTypes.LeagueStatus, FootballTypes.LeagueStatus>(leagueStatuses, func(statusEntry: FootballTypes.LeagueStatus){
            if(statusEntry.leagueId == league.leagueId){
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
          });
        };
      };
      removeExpiredTimers();
    };

    private func transferWindowEnd() : async () {
      for(league in Iter.fromArray(leagueStatuses)){
        let transferWindowEndDate: Int = 0;

        let now = Time.now();

        if(league.transferWindowActive and now > transferWindowEndDate){
          leagueStatuses := Array.map<FootballTypes.LeagueStatus, FootballTypes.LeagueStatus>(leagueStatuses, func(statusEntry: FootballTypes.LeagueStatus){
            if(not statusEntry.transferWindowActive and statusEntry.leagueId == league.leagueId){
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
          });
        };
      };
      removeExpiredTimers();
    };

    private func setFixtureToActive() : async (){
      leagueSeasons := Array.map<(FootballTypes.LeagueId, [FootballTypes.Season]), (FootballTypes.LeagueId, [FootballTypes.Season])>(leagueSeasons, 
        func (leagueSeasonsEntry: (FootballTypes.LeagueId, [FootballTypes.Season])){

          let leagueStatusResult = Array.find<FootballTypes.LeagueStatus>(leagueStatuses, func(statusEntry: FootballTypes.LeagueStatus) : Bool {
            statusEntry.leagueId == leagueSeasonsEntry.0;
          });

          switch(leagueStatusResult){
            case (?leagueStatus){

              return (leagueSeasonsEntry.0, Array.map<FootballTypes.Season, FootballTypes.Season>(leagueSeasonsEntry.1, func(season: FootballTypes.Season){
                if(season.id == leagueStatus.activeSeasonId){              
                  return {
                    fixtures = List.map<FootballTypes.Fixture, FootballTypes.Fixture>(season.fixtures, func(fixture: FootballTypes.Fixture){

                      let now = Time.now();
                      let fixtureEndTime = fixture.kickOff + (Utilities.getHour() * 2);
                      
                      if(fixture.gameweek == leagueStatus.activeGameweek and fixture.status == #Unplayed and now <= fixtureEndTime){
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
                      
                    });
                    id = season.id;
                    name = season.name;
                    postponedFixtures = season.postponedFixtures;
                    year = season.year;
                  };  
                } else {
                  return season;
                }
              }));

            };
            case (null){
              return leagueSeasonsEntry;
            };
          };
      });
      removeExpiredTimers();
    };

    private func setFixtureToComplete() : async (){
      leagueSeasons := Array.map<(FootballTypes.LeagueId, [FootballTypes.Season]), (FootballTypes.LeagueId, [FootballTypes.Season])>(leagueSeasons, 
        func (leagueSeasonsEntry: (FootballTypes.LeagueId, [FootballTypes.Season])){

          let leagueStatusResult = Array.find<FootballTypes.LeagueStatus>(leagueStatuses, func(statusEntry: FootballTypes.LeagueStatus) : Bool {
            statusEntry.leagueId == leagueSeasonsEntry.0;
          });

          switch(leagueStatusResult){
            case (?leagueStatus){

              return (leagueSeasonsEntry.0, Array.map<FootballTypes.Season, FootballTypes.Season>(leagueSeasonsEntry.1, func(season: FootballTypes.Season){
                if(season.id == leagueStatus.activeSeasonId){              
                  return {
                    fixtures = List.map<FootballTypes.Fixture, FootballTypes.Fixture>(season.fixtures, func(fixture: FootballTypes.Fixture){

                      let now = Time.now();
                      let fixtureEndTime = fixture.kickOff + (Utilities.getHour() * 2);
                      
                      if(fixture.gameweek == leagueStatus.activeGameweek and fixture.status == #Active and now > fixtureEndTime){
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
                      
                    });
                    id = season.id;
                    name = season.name;
                    postponedFixtures = season.postponedFixtures;
                    year = season.year;
                  };  
                } else {
                  return season;
                }
              }));

            };
            case (null){
              return leagueSeasonsEntry;
            };
          };
      });
      removeExpiredTimers();
    };

    private func loanExpiredCallback() : async (){

      //when the load timer ends
        //find any player who has a current loan end date greater than now and a parent club id > 0

      //TODO (KELLY)
      /*
      assert callerAllowed(caller);
      let playersToRecall = List.filter<T.Player>(
        players,
        func(currentPlayer : FootballTypes.Player) : Bool {
          return currentPlayer.status == #OnLoan and currentPlayer.currentLoanEndDate <= Time.now();
        },
      );

      for (player in Iter.fromList(playersToRecall)) {
        let recallPlayerDTO : DTOs.RecallPlayerDTO = {
          playerId = player.id;
        };

        let _ = await executeRecallPlayer(recallPlayerDTO);
      };
      */
    };

    private func injuryExpiredCallback() : async (){
      //TODO (KELLY)
      /*
      assert callerAllowed(caller);

      let playersNoLongerInjured = Array.filter<FootballTypes.Player>(
        players,
        func(currentPlayer : FootballTypes.Player) : Bool {
          return currentPlayer.latestInjuryEndDate > 0 and currentPlayer.latestInjuryEndDate <= Time.now();
        },
      );

      for (player in Iter.fromArray(playersNoLongerInjured)) {
        let _ = await executeResetPlayerInjury(player.id);
      };
      removeExpiredTimers();
      return #ok();
      */
    };

    //Timer Set Functions

    private func setCheckCurrentGameweekTimer() : async (){
      for(league in Iter.fromArray(leagueSeasons)){
        let leagueStatusResult = Array.find<FootballTypes.LeagueStatus>(leagueStatuses, func(statusEntry: FootballTypes.LeagueStatus) : Bool {
          statusEntry.leagueId == league.0;
        });
        switch(leagueStatusResult){
          case (?leagueStatus){

            let seasonEntry = Array.find<FootballTypes.Season>(league.1, func(seasonEntry: FootballTypes.Season) : Bool {
              seasonEntry.id == leagueStatus.activeSeasonId;
            });

            switch(seasonEntry){
              case (?season){
                let sortedFixtures = Array.sort<FootballTypes.Fixture>(List.toArray<FootballTypes.Fixture>(season.fixtures), func (a: FootballTypes.Fixture, b: FootballTypes.Fixture) {
                  if (a.kickOff < b.kickOff) {
                      return #less;
                  } else if (a.kickOff > b.kickOff) {
                      return #greater;
                  } else {
                      return #equal;
                  }
                });

                if(Array.size(sortedFixtures) == 0){
                  return;
                };

                if(leagueStatus.activeGameweek == 0){
                  
                  var firstNextGameweekFixture: ?FootballTypes.Fixture = null;

                  label fixtureLoop for(fixture in Iter.fromArray(sortedFixtures)){
                    if(fixture.gameweek == (leagueStatus.unplayedGameweek)){
                      firstNextGameweekFixture := ?fixture;
                      break fixtureLoop;
                    };
                  };
                  switch(firstNextGameweekFixture){
                    case (?nextFixture){
                      let hourBeforeKickOff = nextFixture.kickOff - Utilities.getHour();
                      let triggerDuration = #nanoseconds(Int.abs((hourBeforeKickOff - Time.now())));
                       await setAndBackupTimer(triggerDuration, "checkCurrentGameweek"); 
                    };
                    case (null){}
                  };
                              
                } else {
                  
                  let currentGameweekFixtures = Array.filter<FootballTypes.Fixture>(sortedFixtures, func(fixtureEntry: FootballTypes.Fixture){
                    fixtureEntry.gameweek == leagueStatus.activeGameweek;
                  });

                  if(Array.size(currentGameweekFixtures) == 0){
                    await setAndBackupTimer(#nanoseconds(0), "checkCurrentGameweek");
                    return;
                  };

                  let lastGame = currentGameweekFixtures[Array.size(currentGameweekFixtures) - 1];
                  let triggerDuration = #nanoseconds(Int.abs((lastGame.kickOff + (Utilities.getHour() * 2) - Time.now())));
                  await setAndBackupTimer(triggerDuration, "checkCurrentGameweek"); 
                };
              };
              case (null){}
            };
          };
          case (null){}
        };
      };
    };

    private func setFixtureTimers(fixtures: [FootballTypes.Fixture]) : async (){
      for(fixture in Iter.fromArray(fixtures)){
        let hourBeforeKickOff = fixture.kickOff - Utilities.getHour();
        let activeTriggerTime = #nanoseconds(Int.abs((hourBeforeKickOff - Time.now())));

        let twoHoursAfterKickOff = fixture.kickOff + (Utilities.getHour() * 2);
        let completeTriggerTime = #nanoseconds(Int.abs((twoHoursAfterKickOff - Time.now())));

        await setAndBackupTimer(activeTriggerTime, "setFixtureToActive"); 
        await setAndBackupTimer(completeTriggerTime, "setFixtureToComplete"); 
      };
    };

    private func setFinishSeasonTimer() : async (){

      for(league in Iter.fromArray(leagueSeasons)){
        let leagueStatusResult = Array.find<FootballTypes.LeagueStatus>(leagueStatuses, func(statusEntry: FootballTypes.LeagueStatus) : Bool {
          statusEntry.leagueId == league.0;
        });
        switch(leagueStatusResult){
          case (?leagueStatus){

            let seasonEntry = Array.find<FootballTypes.Season>(league.1, func(seasonEntry: FootballTypes.Season) : Bool {
              seasonEntry.id == leagueStatus.activeSeasonId;
            });

            switch(seasonEntry){
              case (?season){
                let sortedFixtures = Array.sort<FootballTypes.Fixture>(List.toArray<FootballTypes.Fixture>(season.fixtures), func (a: FootballTypes.Fixture, b: FootballTypes.Fixture) {
                  if (a.kickOff < b.kickOff) {
                      return #less;
                  } else if (a.kickOff > b.kickOff) {
                      return #greater;
                  } else {
                      return #equal;
                  }
                });

                if(Array.size(sortedFixtures) == 0){
                  return;
                };
                
                let lastFixture = sortedFixtures[Array.size(sortedFixtures) - 1];
                let triggerDuration = #nanoseconds(Int.abs((lastFixture.kickOff - Time.now())));
                await setAndBackupTimer(triggerDuration, "endOfSeason");
              };
              case (null){}
            };
          };
          case (null){}
        };
      };    
    };

    //Actions

    private func updateDataHashes(leagueId: FootballTypes.LeagueId, category: Text) : async Result.Result<(), T.Error> {
      for(leagueApplication in Iter.fromArray(leagueApplications)){
        if(leagueApplication.0 == leagueId){
          let application_canister = actor (leagueApplication.1) : actor {
            updateDataHashes : (category: Text) -> async Result.Result<(), T.Error>;
          };
         let _ = await application_canister.updateDataHashes(category);
        };
      };
      return #ok();
    };

    private func notifyAppsOfPositionChange(leagueId: FootballTypes.LeagueId, playerId: FootballTypes.PlayerId) : async Result.Result<(), T.Error> {
      for(leagueApplication in Iter.fromArray(leagueApplications)){
        if(leagueApplication.0 == leagueId){
          let application_canister = actor (leagueApplication.1) : actor {
            notifyAppsOfPositionChange : (leagueId: FootballTypes.LeagueId, playerId: FootballTypes.PlayerId) -> async Result.Result<(), T.Error>;
          };
          let _ = await application_canister.notifyAppsOfPositionChange(leagueId, playerId);
        };
      };
      return #ok();
    };

    private func notifyAppsOfLoan(leagueId: FootballTypes.LeagueId, playerId: FootballTypes.PlayerId) : async Result.Result<(), T.Error> {
      for(leagueApplication in Iter.fromArray(leagueApplications)){
        if(leagueApplication.0 == leagueId){
          let application_canister = actor (leagueApplication.1) : actor {
            notifyAppsOfLoan : (leagueId: FootballTypes.LeagueId, playerId: FootballTypes.PlayerId) -> async Result.Result<(), T.Error>;
          };
          let _ = await application_canister.notifyAppsOfLoan(leagueId, playerId);
        };
      };
      return #ok();
    };

    private func notifyAppsOfTransfer(leagueId: FootballTypes.LeagueId, playerId: FootballTypes.PlayerId) : async Result.Result<(), T.Error> {
      for(leagueApplication in Iter.fromArray(leagueApplications)){
        if(leagueApplication.0 == leagueId){
          let application_canister = actor (leagueApplication.1) : actor {
            notifyAppsOfTransfer : (leagueId: FootballTypes.LeagueId, playerId: FootballTypes.PlayerId) -> async Result.Result<(), T.Error>;
          };
          let _ = await application_canister.notifyAppsOfTransfer(leagueId, playerId);
        };
      };
      return #ok();
    };

    private func notifyAppsOfFixtureFinalised(leagueId: FootballTypes.LeagueId, seasonId: FootballTypes.SeasonId, gameweek: FootballTypes.GameweekNumber) : async Result.Result<(), T.Error> {
      for(leagueApplication in Iter.fromArray(leagueApplications)){
        if(leagueApplication.0 == leagueId){
          let application_canister = actor (leagueApplication.1) : actor {
            notifyAppsOfFixtureFinalised : (seasonId: FootballTypes.SeasonId, gameweek: FootballTypes.GameweekNumber) -> async Result.Result<(), T.Error>;
          };
          let _ = await application_canister.notifyAppsOfFixtureFinalised(seasonId, gameweek);
        };
      };
      return #ok();
    };

    private func updateBettingOdds(leagueId: FootballTypes.LeagueId) : async Result.Result<(), T.Error> {
      let application_canister = actor (Environment.FOOTBALL_GOD_BACKEND_CANISTER_ID) : actor {
        updateBettingOdds : (leagueId: FootballTypes.LeagueId) -> async Result.Result<(), T.Error>;
      };
      let _ = await application_canister.updateBettingOdds(leagueId);
    };

    private func notifyAppsOfGameweekStarting(leagueId: FootballTypes.LeagueId, seasonId: FootballTypes.SeasonId, gameweek: FootballTypes.GameweekNumber) : async Result.Result<(), T.Error> {
      for(leagueApplication in Iter.fromArray(leagueApplications)){
        if(leagueApplication.0 == leagueId){
          let application_canister = actor (leagueApplication.1) : actor {
            notifyAppsOfGameweekStarting : (seasonId: FootballTypes.SeasonId, gameweek: FootballTypes.GameweekNumber) -> async Result.Result<(), T.Error>;
          };
          let _ = await application_canister.notifyAppsOfGameweekStarting(seasonId, gameweek);
        };
      };
      return #ok();
    };

    private func setLeagueGameweek(leagueId: FootballTypes.LeagueId, unplayedGameweek: FootballTypes.GameweekNumber, activeGameweek: FootballTypes.GameweekNumber, completedGameweek: FootballTypes.GameweekNumber, earliestGameweekKickOffTime: Int) {
      
      leagueStatuses := Array.map<FootballTypes.LeagueStatus, FootballTypes.LeagueStatus>(leagueStatuses, func(status: FootballTypes.LeagueStatus) {
         
        let activeMonth: Base.CalendarMonth = Utilities.unixTimeToMonth(earliestGameweekKickOffTime);

        if(status.leagueId == leagueId){
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
          }
        } else {
          return status;
        };
      });
    };

    //ONE OFF FUNCTION FOR UPDATING PLAYER VALUES
    public shared ({ caller }) func updatePlayerValue(playerId: FootballTypes.PlayerId, value: Nat16) : async (){
      assert callerAllowed(caller);
      revaluePlayer(playerId, value);
    };

    private func revaluePlayer(playerId: FootballTypes.PlayerId, value: Nat16){
      
      let updatedLeaguePlayersBuffer = Buffer.fromArray<(FootballTypes.LeagueId, [FootballTypes.Player])>([]);

      for(league in Iter.fromArray(leaguePlayers)){
        if(league.0 == 1){

          let filteredLeaguePlayers = Array.find<(FootballTypes.LeagueId, [FootballTypes.Player])>(leaguePlayers, func(leagueWithPlayers: (FootballTypes.LeagueId, [FootballTypes.Player])) : Bool{
            leagueWithPlayers.0 == 1
          });

          switch(filteredLeaguePlayers){
            case (?foundLeaguePlayers){
              
              var updatedPlayers = Array.map<FootballTypes.Player, FootballTypes.Player>(
                foundLeaguePlayers.1,
                  func(p : FootballTypes.Player) : FootballTypes.Player {
                    if (p.id == playerId) {

                      let historyEntry : FootballTypes.ValueHistory = {
                        changedOn = Time.now();
                        oldValue = p.valueQuarterMillions;
                        newValue = value;
                      };

                      let updatedPlayer : FootballTypes.Player = {
                        id = p.id;
                        leagueId = p.leagueId;
                        clubId = p.clubId;
                        position = p.position;
                        firstName = p.firstName;
                        lastName = p.lastName;
                        shirtNumber = p.shirtNumber;
                        valueQuarterMillions = value;
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

              updatedLeaguePlayersBuffer.add((1, updatedPlayers));
            };
            case (null){

            }
          };
        } else {
          updatedLeaguePlayersBuffer.add(league);
        } 
      };

      leaguePlayers := Buffer.toArray(updatedLeaguePlayersBuffer);
    };
  };
