import Nat64 "mo:base/Nat64";
import Int64 "mo:base/Int64";
import Array "mo:base/Array";
import Int "mo:base/Int";
import Nat "mo:base/Nat";
import Time "mo:base/Time";
import Iter "mo:base/Iter";
import Nat8 "mo:base/Nat8";
import Nat16 "mo:base/Nat16";
import Int16 "mo:base/Int16";
import FootballTypes "mo:waterway-mops/football/FootballTypes";
import FootballEnums "mo:waterway-mops/football/FootballEnums";

module {


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

  public func calculateAggregatePlayerEvents(events : [FootballTypes.PlayerEventData], playerPosition : FootballEnums.PlayerPosition) : Int16 {
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

  public func calculateIndividualScoreForEvent(event : FootballTypes.PlayerEventData, playerPosition : FootballEnums.PlayerPosition) : Int16 {
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
  
  public func getNextUnixTimestampForDayMonth(day : Nat8, month : Nat8) : ?Int {
  if (day < 1 or day > 31)  { return null };
  if (month < 1 or month > 12) { return null };

  let currentUnixTime : Int = Time.now();
  let secondsInADay : Int = 86_400;
  let nowSeconds : Int = currentUnixTime / 1_000_000_000;
  let currentDays : Int = nowSeconds / secondsInADay;
  let currentYear : Int = getYear(currentDays);
  let currentDayOfYear : Int = getDayOfYear(currentDays, currentYear) + 1; 
  let maybeDayOfYearTarget = dayOfYear(currentYear, month, day);
  switch (maybeDayOfYearTarget) {
    case (null) {
      return null;
    };
    case (?dayOfYearTarget) {
      if (dayOfYearTarget > currentDayOfYear) {
        return ?(makeUnixTimestamp(currentYear, dayOfYearTarget));
      } else if (dayOfYearTarget == currentDayOfYear) {
        let midnightToday = makeUnixTimestamp(currentYear, dayOfYearTarget);
        if (midnightToday > currentUnixTime) {
          return ?midnightToday;
        } else {
          let nextYear = currentYear + 1;
          let maybeNextDayOfYear = dayOfYear(nextYear, month, day);
          switch(maybeNextDayOfYear){
            case (?foundNextDayOfYear){
              return ?(makeUnixTimestamp(nextYear, foundNextDayOfYear));
            };
            case (null)  { return null };
          };
        };
      } else {
        let nextYear = currentYear + 1;
        let maybeNextDayOfYear = dayOfYear(nextYear, month, day);
        switch(maybeNextDayOfYear){
          case (?foundNextDayOfYear){
            return ?(makeUnixTimestamp(nextYear, foundNextDayOfYear));
          };
          case (null)  { return null };
        };
      };
    };
  };
};

private func isLeapYear(y : Int) : Bool {
  if (y % 400 == 0) return true;
  if (y % 100 == 0) return false;
  if (y % 4 == 0)   return true;
  return false;
};

private func daysInMonth(y : Int, m : Nat8) : Nat8 {
  switch (m) {
    case (2) { if (isLeapYear(y)) 29 else 28 };
    case (4) { 30 };
    case (6) { 30 };
    case (9) { 30 };
    case (11) { 30 };
    case _ { 31 };
  }
};

private func dayOfYear(year : Int, month : Nat8, day : Nat8) : ?Int {
  if (day > daysInMonth(year, month)) return null;

  var total : Int = 0;
  var m : Nat8 = 1;
  while (m < month) {
    total += natToInt(Nat8.toNat(daysInMonth(year, m)));
    m += 1;
  };
  let result = total + natToInt(Nat8.toNat(day));
  return ?result;
};

private func makeUnixTimestamp(year : Int, dayOfYear : Int) : Int {
  let epochDays = daysSince1970(year, dayOfYear);
  let epochSeconds = epochDays * 86_400;
  return epochSeconds * 1_000_000_000;
};

private func daysSince1970(year : Int, dayOfYear : Int) : Int {
  var daysCount = 0;
  var y = 1970;

  while (y < year) {
    if (isLeapYear(y)) {
      daysCount += 366;
    } else {
      daysCount += 365;
    };
    y += 1;
  };
  daysCount += (intToNat(dayOfYear) - 1);
  return daysCount;
};


public func intToNat(input: Int) : Nat {
  return Nat64.toNat(Int64.toNat64(Int64.fromInt(input)))
};

public func natToInt(input: Nat) : Int {
  return Int64.toInt(Int64.fromNat64(Nat64.fromNat(input)));
};

};
