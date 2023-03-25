import List "mo:base/List";
import Types "types";
import Result "mo:base/Result";
import Iter "mo:base/Iter";
import Nat8 "mo:base/Nat8";

module {
    
  public class Seasons(){

    private var seasons = List.nil<Types.Season>();
    private var nextSeasonId : Nat16 = 1;
    private var nextFixtureId : Nat32 = 1;

    public func createSeason(name : Text, year : Nat16) : Result.Result<(), Types.Error> {
        
        var initGameweeks = List.nil<Types.Gameweek>();

        for (i in Iter.range(1, 38)) {
          let gameweek : Types.Gameweek = {
            id = Nat8.fromNat(i);
            number = Nat8.fromNat(i);
            status = 0; // 0 = Unopened
            fixtures = List.nil<Types.Fixture>();
          };

          initGameweeks := List.push<Types.Gameweek>(gameweek, initGameweeks);
        };

        let id = nextSeasonId;
        let newSeason : Types.Season = {
          id = id;
          name = name;
          year = year;
          gameweeks = initGameweeks;
        };
        
        seasons := List.push(newSeason, seasons);
        
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

    public func getSeasons() : [Types.Season] {
        return List.toArray(seasons);
    };
    
    public func getSeason(seasonId: Nat16) : ?Types.Season {
        let foundSeason = List.find<Types.Season>(seasons, func (season: Types.Season): Bool {
            return season.id == seasonId;
        });

        return foundSeason;
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
                        return {
                            number = gameweek.number;
                            status = gameweek.status;
                            fixtures = List.push<Types.Fixture>(newFixture, gameweek.fixtures);
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

    
    public func updateFixture(seasonId: Nat16, gameweekNumber: Nat8, fixtureId: Nat32, homeTeamId: Nat16, awayTeamId: Nat16) : Result.Result<(), Types.Error>{
        
        var seasonFound = false;
        var gameweekFound = false;
        var fixtureFound = false;

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
                        return {
                            number = gameweek.number;
                            status = gameweek.status;
                            fixtures = List.map<Types.Fixture, Types.Fixture>(gameweek.fixtures, func (fixture: Types.Fixture): Types.Fixture {
                              if (fixture.id == fixtureId) {
                                fixtureFound := true;
                                { id = fixture.id; seasonId = seasonId; gameweekNumber = gameweekNumber; homeTeamId = homeTeamId; awayTeamId = awayTeamId; status = 0; homeGoals = 0; awayGoals = 0; }
                              } 
                              else { fixture }
                            });
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
      } else if (not fixtureFound) {
          return #err(#NotFound);
      } else {
          return #ok(());
      }
    };

    public func getFixtures(seasonId: Nat16, gameweekNumber: Nat8) : [Types.Fixture] {
      let foundSeason = List.find<Types.Season>(seasons, func (season: Types.Season): Bool {
          return season.id == seasonId;
      });

      switch (foundSeason) {
          case (null) { return []; };
          case (?season) {
              let foundGameweek = List.find<Types.Gameweek>(season.gameweeks, func (gameweek: Types.Gameweek): Bool {
                  return gameweek.number == gameweekNumber;
              });

              switch (foundGameweek) {
                  case (null) { return []; };
                  case (?gameweek) {
                      return List.toArray(gameweek.fixtures);
                  };
              };
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
              
              return foundGameweek;
          };
      };    
    };

  };

}
