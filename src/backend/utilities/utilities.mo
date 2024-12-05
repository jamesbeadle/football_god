import Float "mo:base/Float";
import Nat64 "mo:base/Nat64";
import Int64 "mo:base/Int64";
import Principal "mo:base/Principal";
import Text "mo:base/Text";
import Array "mo:base/Array";
import Blob "mo:base/Blob";
import Int "mo:base/Int";
import Nat "mo:base/Nat";
import Time "mo:base/Time";
import Iter "mo:base/Iter";
import Hash "mo:base/Hash";
import Nat32 "mo:base/Nat32";
import Nat8 "mo:base/Nat8";
import Nat16 "mo:base/Nat16";
import Int16 "mo:base/Int16";
import Management "./Management";
import Base "../types/base_types";
import FootballTypes "../types/football_types";

module {

    public func convertNat64ToFloat(input: Nat64) : Float {
        return Float.fromInt64(Int64.fromNat64(input));
    };

    public func convertFloatToNat64(input: Float) : Nat64 {
        return Nat64.fromIntWrap(Int64.toInt(Float.toInt64(input)));
    };

    public func convertNatToInt(input: Nat) : Int {
        return Int64.toInt(Int64.fromNat64(Nat64.fromNat(input)));
    };

    public func updateCanister_(a : actor {}, backendCanisterController : ?Principal, IC : Management.Management) : async () {
        let cid = { canister_id = Principal.fromActor(a) };
        switch (backendCanisterController) {
        case (null) {};
        case (?controller) {
            await (
            IC.update_settings({
                canister_id = cid.canister_id;
                settings = {
                controllers = ?[controller];
                compute_allocation = ?1;
                memory_allocation = null;
                freezing_threshold = ?2_592_000;
                reserved_cycles_limit = null
                };
                sender_canister_version = null
            }),
            );
        };
        };
    };

    public func validUsername(username : Text) : Bool {

      if (Text.size(username) < 3 or Text.size(username) > 20) {
        return false;
      };

      let isAlphanumeric = func(s : Text) : Bool {
        let chars = Text.toIter(s);
        for (c in chars) {
          if (not ((c >= 'a' and c <= 'z') or (c >= 'A' and c <= 'Z') or (c >= '0' and c <= '9'))) {
            return false;
          };
        };
        return true;
      };

      if (not isAlphanumeric(username)) {
        return false;
      };

      return true;
    };

    public func validProfilePicture(profilePicture : Blob) : Bool {
      let sizeInKB = Array.size(Blob.toArray(profilePicture)) / 1024;
      return (sizeInKB > 0 and sizeInKB <= 500);
    };

    public func getCurrentYear() : Nat16 {
      return 0;
    };

    public func getCurrentMonth() : Base.CalendarMonth {
      return 0;
    };

    public func convertDaysToNanosecondsInt(pauseDays: Nat): Int {
      let secondsPerDay: Int = 24 * 60 * 60;
      let nanosecondsPerSecond: Int = 1_000_000_000;
      return convertNatToInt(pauseDays) * secondsPerDay * nanosecondsPerSecond;
    };

    public func getDay(): Int {
      let secondsPerDay: Int = 24 * 60 * 60;
      let nanosecondsPerSecond: Int = 1_000_000_000;
      return secondsPerDay * nanosecondsPerSecond;
    };

    public func getHour(): Int {
      let secondsPerHour: Int = 60 * 60;
      let nanosecondsPerSecond: Int = 1_000_000_000;
      return secondsPerHour * nanosecondsPerSecond;
    };

    public func calculateAgeFromUnix(dobUnix : Int) : Nat {
      let secondsInADay : Int = 86_400;
      let currentUnixTime : Int = Time.now();

      let currentDays : Int = currentUnixTime / (1_000_000_000 * secondsInADay);
      let dobDays : Int = dobUnix / (1_000_000_000 * secondsInADay);

      let currentYear : Int = getYear(currentDays);
      let dobYear : Int = getYear(dobDays);

      let currentDayOfYear : Int = getDayOfYear(currentDays, currentYear);
      let dobDayOfYear : Int = getDayOfYear(dobDays, dobYear);

      var age : Int = currentYear - dobYear;
      if (currentDayOfYear < dobDayOfYear) {
        age := age - 1;
      };

      return Nat64.toNat(Int64.toNat64(Int64.fromInt(age)));

    };

  private func getYear(days : Int) : Int {
    var years = 1970;
    var dayCounter = days;
    label leapLoop while (dayCounter > 365) {
      if (years % 4 == 0 and (years % 100 != 0 or years % 400 == 0) and dayCounter > 366) {
        dayCounter -= 366;
      } else {
        dayCounter -= 365;
      };
      years += 1;
    };
    return years;
  };

  private func getDayOfYear(days : Int, year : Int) : Int {
    var dayCounter = days;
    for (y in Iter.range(1970, year - 1)) {
      if (y % 4 == 0 and (y % 100 != 0 or y % 400 == 0)) {
        dayCounter -= 366; // Leap year
      } else {
        dayCounter -= 365; // Non-leap year
      };
    };
    return dayCounter;
  };

  public let eqNat8 = func(a : Nat8, b : Nat8) : Bool {
    a == b;
  };

  public let hashNat8 = func(key : Nat8) : Hash.Hash {
    Nat32.fromNat(Nat8.toNat(key) % (2 ** 32 -1));
  };

  public let eqNat16 = func(a : Nat16, b : Nat16) : Bool {
    a == b;
  };

  public let hashNat16 = func(key : Nat16) : Hash.Hash {
    Nat32.fromNat(Nat16.toNat(key) % (2 ** 32 -1));
  };

  public let eqNat32 = func(a : Nat32, b : Nat32) : Bool {
    a == b;
  };

  public let hashNat32 = func(key : Nat32) : Hash.Hash {
    Nat32.fromNat(Nat32.toNat(key) % (2 ** 32 -1));
  };

  public func unixTimeToMonth(unixTime : Int) : Nat8 {

    let secondsInADay = 86400;
    let seconds = unixTime / 1000000000;
    var days = seconds / secondsInADay;

    var years = 1970;
    var dayCounter = days;
    label leapLoop while (dayCounter > 365) {
      if (years % 4 == 0 and (years % 100 != 0 or years % 400 == 0) and dayCounter > 366) {
        dayCounter -= 366;
      } else {
        dayCounter -= 365;
      };
      years += 1;
    };

    var dayOfYear : Int = dayCounter + 1;
    if (dayOfYear == 366) {
      dayOfYear := 1;
    };

    var isLeapYear = false;
    if (years % 4 == 0) {
      if (years % 100 != 0) {
        isLeapYear := true;
      } else if (years % 400 == 0) {
        isLeapYear := true;
      };
    };

    var monthEnds : [Nat] = [];

    if (isLeapYear) {
      monthEnds := [31, 60, 91, 121, 152, 182, 213, 244, 274, 305, 335, 366];
    } else {
      monthEnds := [31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334, 365];
    };

    var month = 0;
    label monthLoop for (m in Iter.range(0, 11)) {
      month += 1;
      if (dayOfYear <= monthEnds[m]) {
        break monthLoop;
      };
    };

    return Nat8.fromNat(month);
  };

  public func calculateAggregatePlayerEvents(events : [FootballTypes.PlayerEventData], playerPosition : FootballTypes.PlayerPosition) : Int16 {
    var totalScore : Int16 = 0;

    if (playerPosition == #Goalkeeper or playerPosition == #Defender) {
      let goalsConcededCount = Array.filter<FootballTypes.PlayerEventData>(
        events,
        func(event : FootballTypes.PlayerEventData) : Bool {
          event.eventType == #GoalConceded;
        },
      ).size();

      if (goalsConcededCount >= 2) {

        totalScore += (Int16.fromNat16(Nat16.fromNat(goalsConcededCount)) / 2) * -15;
      };
    };

    if (playerPosition == #Goalkeeper) {
      let savesCount = Array.filter<FootballTypes.PlayerEventData>(
        events,
        func(event : FootballTypes.PlayerEventData) : Bool {
          event.eventType == #KeeperSave;
        },
      ).size();

      totalScore += (Int16.fromNat16(Nat16.fromNat(savesCount)) / 3) * 5;
    };

    return totalScore;
  };

  public func calculateIndividualScoreForEvent(event : FootballTypes.PlayerEventData, playerPosition : FootballTypes.PlayerPosition) : Int16 {
    switch (event.eventType) {
      case (#Appearance) { return 5 };
      case (#Goal) {
        switch (playerPosition) {
          case (#Forward) { return 10 };
          case (#Midfielder) { return 15 };
          case _ { return 20 };
        };
      };
      case (#GoalAssisted) {
        switch (playerPosition) {
          case (#Forward) { return 10 };
          case (#Midfielder) { return 10 };
          case _ { return 15 };
        };
      };
      case (#KeeperSave) { return 0 };
      case (#CleanSheet) {
        switch (playerPosition) {
          case (#Goalkeeper) { return 10 };
          case (#Defender) { return 10 };
          case _ { return 0 };
        };
      };
      case (#PenaltySaved) { return 20 };
      case (#PenaltyMissed) { return -15 };
      case (#YellowCard) { return -5 };
      case (#RedCard) { return -20 };
      case (#OwnGoal) { return -10 };
      case (#HighestScoringPlayer) { return 25 };
      case _ { return 0 };
    };
  };


};
