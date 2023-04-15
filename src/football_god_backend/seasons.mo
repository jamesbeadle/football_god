import List "mo:base/List";
import Result "mo:base/Result";
import Iter "mo:base/Iter";
import Nat8 "mo:base/Nat8";
import Array "mo:base/Array";
import Debug "mo:base/Debug";

import Types "types";
import DTOs "DTOs";

module {
    
  public class Seasons(){

    private var seasons = List.nil<Types.Season>();
    private var nextSeasonId : Nat16 = 1;
    private var nextFixtureId : Nat32 = 1;

    public func setData(stable_seasons: [Types.Season], stable_seasonId : Nat16, stable_fixtureId : Nat32){
        seasons := List.fromArray(stable_seasons);
        nextSeasonId := stable_seasonId;
        nextFixtureId := stable_fixtureId;
    };

    public func getAllData() : [Types.Season] {
        return List.toArray(seasons);
    };

    public func getSeason(seasonId: Nat16) : ?Types.Season {
        let foundSeason = List.find<Types.Season>(seasons, func (season: Types.Season): Bool {
            return season.id == seasonId;
        });

        switch (foundSeason) {
            case (null) { return null; };
            case (?season) {
                let seasonInfo = {
                    id = season.id;
                    name = season.name;
                    year = season.year;
                    gameweeks = List.nil<Types.Gameweek>();
                };
                return ?seasonInfo;
            };
        };
    };
    
    public func getGameweek(seasonId: Nat16, gameweekNumber: Nat8) : ?Types.Gameweek {
        let foundSeason = List.find<Types.Season>(seasons, func (season: Types.Season): Bool {
            return season.id == seasonId;
        });

        switch (foundSeason) {
            case (null) { return null; };
            case (?season) {
                let foundGameweek = List.find<Types.Gameweek>(season.gameweeks, func (gameweek: Types.Gameweek): Bool {
                    return gameweek.number == gameweekNumber;
                });

                switch(foundGameweek){
                    case (null) { return null; };
                    case (?gameweek) {
                        let gameweekInfo = {
                            number = gameweek.number;
                            status = gameweek.status;
                            totalPot = gameweek.totalPot;
                            winningShare = gameweek.winningShare;
                            fixtureCount = Nat8.fromNat(0);
                            fixtures = List.nil<Types.Fixture>();
                        };
                        return ?gameweekInfo;
                    };
                };
                
            };
        };    
    };

    public func getFixtures(seasonId: Nat16, gameweekNumber: Nat8) : ?List.List<Types.Fixture> {
      let foundSeason = List.find<Types.Season>(seasons, func (season: Types.Season): Bool {
          return season.id == seasonId;
      });

      switch (foundSeason) {
          case (null) { return null; };
          case (?season) {
              let foundGameweek = List.find<Types.Gameweek>(season.gameweeks, func (gameweek: Types.Gameweek): Bool {
                  return gameweek.number == gameweekNumber;
              });

              switch (foundGameweek) {
                  case (null) { return null; };
                  case (?gameweek) {
                      return ?gameweek.fixtures;
                  };
              };
          };
      };    
    };

    public func checkValidPredictions(seasonId: Nat16, gameweekNumber: Nat8, predictions: [DTOs.FixtureDTO]) : Bool {
        
        var fixturesCount = 0;
        var predictionsCount = Array.size<DTOs.FixtureDTO>(predictions);

        let fixtures = getFixtures(seasonId, gameweekNumber);
        switch(fixtures){
            case (null) { return false; };
            case (?f){  
                fixturesCount := List.size<Types.Fixture>(f);

                if (fixturesCount != predictionsCount) {
                    return false;
                };

                let fixturesWithPredictions = Array.filter<Types.Fixture>(List.toArray(f), func (fixture: Types.Fixture) : Bool {
                    return Array.find<DTOs.FixtureDTO>(predictions, func (prediction: DTOs.FixtureDTO) : Bool {
                        return prediction.fixtureId == fixture.id;
                    }) != null;
                });

                return Array.size<Types.Fixture>(fixturesWithPredictions) == fixturesCount;
            };
        };
    };

    public func getSeasons() : [Types.Season] {
        return List.toArray(List.map<Types.Season, Types.Season>(seasons, func (season: Types.Season): Types.Season {
            return {
                id = season.id;
                name = season.name;
                year = season.year;
                gameweeks = List.nil<Types.Gameweek>();
            };
        }));
    };

    public func getNextSeasonId() : Nat16 {
        return nextSeasonId;
    };

    public func getNextFixtureId() : Nat32 {
        return nextFixtureId;
    };

    public func getGameweeks(seasonId: Nat16) : [Types.Gameweek] {
        let foundSeason = List.find<Types.Season>(seasons, func (season: Types.Season): Bool {
            return season.id == seasonId;
        });

        switch (foundSeason) {
            case (null) {
                return [];
            };
            case (?season) {
                return List.toArray(List.map<Types.Gameweek, Types.Gameweek>(season.gameweeks, func (gameweek: Types.Gameweek): Types.Gameweek {
                    return {
                        number = gameweek.number;
                        status = gameweek.status;
                        totalPot = gameweek.totalPot;
                        winningShare = gameweek.winningShare;
                        fixtureCount = Nat8.fromNat(List.size<Types.Fixture>(gameweek.fixtures));
                        fixtures = List.nil<Types.Fixture>();
                    };
                }));
            };
        };
    };

    public func createSeason(name : Text, year : Nat16) : Result.Result<(), Types.Error> {
        
        var initGameweeks = List.nil<Types.Gameweek>();

        for (i in Iter.range(1, 38)) {
          let gameweek : Types.Gameweek = {
            id = Nat8.fromNat(i);
            number = Nat8.fromNat(i);
            status = 0; // 0 = Unopened
            fixtureCount = 0;
            fixtures = List.nil<Types.Fixture>();
            totalPot = 0;
            winningShare = 0;
          };

          initGameweeks := List.push<Types.Gameweek>(gameweek, initGameweeks);
        };

        let id = nextSeasonId;
        let newSeason : Types.Season = {
          id = id;
          name = name;
          year = year;
          gameweeks = List.reverse(initGameweeks);
        };

        var newSeasonList = List.nil<Types.Season>();
        newSeasonList := List.push(newSeason, newSeasonList);

        seasons := List.append(seasons, newSeasonList);
        
        nextSeasonId := nextSeasonId + 1;
        return #ok(());
    };

    public func updateSeason(id : Nat16, newName : Text, newYear : Nat16) : Result.Result<(), Types.Error> {
    
        seasons := List.map<Types.Season, Types.Season>(seasons,
            func (season: Types.Season): Types.Season {
                if (season.id == id) {
                { id = season.id; name = newName; year = newYear; gameweeks = season.gameweeks; }
                } 
                else { season }
        });

        return #ok(());
    };

    public func deleteSeason(id : Nat16) : Result.Result<(), Types.Error> {
        
        seasons := List.filter(seasons, func(season: Types.Season): Bool { season.id != id });
        return #ok(());
    };

    public func updateGameweekStatus(seasonId: Nat16, gameweekNumber: Nat8, status: Nat8, totalPot: Nat64) : Result.Result<(), Types.Error> {
        var seasonFound = false;
        var gameweekFound = false;

        seasons := List.map<Types.Season, Types.Season>(seasons, func (season: Types.Season): Types.Season {
            if (season.id == seasonId) {
                seasonFound := true;
                return {
                    id = season.id;
                    name = season.name;
                    year = season.year;
                    gameweeks = List.map<Types.Gameweek, Types.Gameweek>(season.gameweeks, func (gameweek: Types.Gameweek): Types.Gameweek {
                        if (gameweek.number == gameweekNumber) {
                            
                            var pot = gameweek.totalPot;
                            if(status == 2){
                                pot := totalPot;
                            };
                            gameweekFound := true;
                            return {
                                number = gameweek.number;
                                status = status;
                                fixtures = gameweek.fixtures;
                                fixtureCount = gameweek.fixtureCount;
                                totalPot = pot;
                                winningShare = gameweek.winningShare;
                            };
                        } else { return gameweek; }
                    });
                };
            } else { return season; }
        });

        if (not seasonFound) {
            return #err(#NotFound);
        } else if (not gameweekFound) {
            return #err(#NotFound);
        } else {
            return #ok(());
        }
    };

    public func getFixture(seasonId: Nat16, gameweekNumber: Nat8, fixtureId: Nat32) : ?Types.Fixture {
        let foundSeason = List.find<Types.Season>(seasons, func (season: Types.Season): Bool {
            return season.id == seasonId;
        });

        switch (foundSeason) {
            case (null) { return null; };
            case (?season) {
                let foundGameweek = List.find<Types.Gameweek>(season.gameweeks, func (gameweek: Types.Gameweek): Bool {
                    return gameweek.number == gameweekNumber;
                });

                switch (foundGameweek) {
                    case (null) { return null; };
                    case (?gameweek) {
                        let foundFixture = List.find<Types.Fixture>(gameweek.fixtures, func (fixture: Types.Fixture): Bool {
                            return fixture.id == fixtureId;
                        });
                        return foundFixture;
                    };
                };
            };
        };
    };

    public func addFixtureToGameweek(seasonId: Nat16, gameweekNumber: Nat8, homeTeamId: Nat16, awayTeamId: Nat16) : Result.Result<(), Types.Error>{
        
        let id = nextFixtureId;
        let newFixture : Types.Fixture = {
          id = id;
          seasonId = seasonId;
          gameweekNumber = gameweekNumber;
          homeTeamId = homeTeamId;
          awayTeamId = awayTeamId;
          homeGoals = 0;
          awayGoals = 0;
          status = 0;
        }; 

        var seasonFound = false;
        var gameweekFound = false;

        seasons := List.map<Types.Season, Types.Season>(seasons, func (season: Types.Season): Types.Season {
          if (season.id == seasonId) {
            seasonFound := true;
            return {
                id = season.id;
                name = season.name;
                year = season.year;
                gameweeks = List.map<Types.Gameweek, Types.Gameweek>(season.gameweeks, func (gameweek: Types.Gameweek): Types.Gameweek {
                    if (gameweek.number == gameweekNumber) {
                        gameweekFound := true;

                        var newFixturesList = List.nil<Types.Fixture>();
                        newFixturesList := List.push(newFixture, newFixturesList);

                        return {
                            number = gameweek.number;
                            status = gameweek.status;
                            totalPot = gameweek.totalPot;
                            winningShare = gameweek.winningShare;
                            fixtures = List.append(gameweek.fixtures, newFixturesList);
                            fixtureCount = 0;
                        };
                    } else { return gameweek; }
                });
            };
        } else { return season; }
      });

      nextFixtureId := nextFixtureId + 1;

      if (not seasonFound) {
          return #err(#NotFound);
      } else if (not gameweekFound) {
          return #err(#NotFound);
      } else {
          return #ok(());
      }
    };

    public func updateFixture(seasonId: Nat16, gameweekNumber: Nat8, fixtureId: Nat32, homeTeamId: Nat16, awayTeamId: Nat16, fixtureStatus: Nat8, homeGoals: Nat8, awayGoals: Nat8) : (){
        
        seasons := List.map<Types.Season, Types.Season>(seasons, func (season: Types.Season): Types.Season {
          if (season.id == seasonId) {
            return {
                id = season.id;
                name = season.name;
                year = season.year;
                gameweeks = List.map<Types.Gameweek, Types.Gameweek>(season.gameweeks, func (gameweek: Types.Gameweek): Types.Gameweek {
                    if (gameweek.number == gameweekNumber) {
                        return {
                            number = gameweek.number;
                            status = gameweek.status;
                            totalPot = gameweek.totalPot;
                            winningShare = gameweek.winningShare;
                            fixtureCount = 0;
                            fixtures = List.map<Types.Fixture, Types.Fixture>(gameweek.fixtures, func (fixture: Types.Fixture): Types.Fixture {
                              if (fixture.id == fixtureId) {
                                { 
                                    id = fixture.id; 
                                    seasonId = seasonId; 
                                    gameweekNumber = gameweekNumber; 
                                    homeTeamId = homeTeamId; 
                                    awayTeamId = awayTeamId; 
                                    status = fixtureStatus; 
                                    homeGoals = homeGoals; 
                                    awayGoals = awayGoals; 
                                }
                              } 
                              else { fixture }
                            });
                        };
                    } else { return gameweek; }
                });
            };
        } else { return season; }
      });
    };

    public func deleteFixture(seasonId: Nat16, gameweekNumber: Nat8, fixtureId: Nat32) : () {
        
        seasons := List.map<Types.Season, Types.Season>(seasons, func (season: Types.Season): Types.Season {
            if (season.id == seasonId) {
                return {
                    id = season.id;
                    name = season.name;
                    year = season.year;
                    gameweeks = List.map<Types.Gameweek, Types.Gameweek>(season.gameweeks, func (gameweek: Types.Gameweek): Types.Gameweek {
                        if (gameweek.number == gameweekNumber) {
                            return {
                                number = gameweek.number;
                                status = gameweek.status;
                                totalPot = gameweek.totalPot;
                                winningShare = gameweek.winningShare;
                                fixtures = List.filter<Types.Fixture>(gameweek.fixtures, func (fixture: Types.Fixture): Bool {
                                    if (fixture.id == fixtureId) {
                                        return false;
                                    } else {
                                        return true;
                                    }
                                });
                                fixtureCount = gameweek.fixtureCount;
                            };
                        } else { return gameweek; }
                    });
                };
            } else { return season; }
        });
    };

    public func updatePayoutInfo(seasonId: Nat16, gameweekNumber: Nat8, potBalance: Nat64, winnerShare: Nat64) : (){
        seasons := List.map<Types.Season, Types.Season>(seasons, func (season: Types.Season): Types.Season {
            if (season.id == seasonId) {
                return {
                    id = season.id;
                    name = season.name;
                    year = season.year;
                    gameweeks = List.map<Types.Gameweek, Types.Gameweek>(season.gameweeks, func (gameweek: Types.Gameweek): Types.Gameweek {
                        if (gameweek.number == gameweekNumber) {
                            return {
                                number = gameweek.number;
                                status = gameweek.status;
                                fixtures = gameweek.fixtures;
                                fixtureCount = gameweek.fixtureCount;
                                totalPot = potBalance;
                                winningShare = winnerShare;
                            };
                        } else { return gameweek; }
                    });
                };
            } else { return season; }
        });
    };

  };

}
