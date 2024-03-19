import Result "mo:base/Result";
import List "mo:base/List";
import Text "mo:base/Text";
import Principal "mo:base/Principal";
import Nat64 "mo:base/Nat64";
import Blob "mo:base/Blob";
import Buffer "mo:base/Buffer";
import Types "types";
import DTOs "DTOs";
import Account "Account";

module {

  public class Profiles() {

    private var userProfiles = List.nil<Types.Profile>();

    public func setData(stable_profiles : [Types.Profile]) {
      userProfiles := List.fromArray(stable_profiles);
    };

    public func getProfiles() : [Types.Profile] {
      return List.toArray(
        List.map<Types.Profile, Types.Profile>(
          userProfiles,
          func(profile : Types.Profile) : Types.Profile {
            return {
              principalName = profile.principalName;
              displayName = profile.displayName;
              depositAddress = profile.depositAddress;
              wallet = profile.wallet;
              balance = 0;
            };
          },
        ),
      );
    };

    public func getProfile(principalName : Text) : ?Types.Profile {
      let foundProfile = List.find<Types.Profile>(
        userProfiles,
        func(profile : Types.Profile) : Bool {
          return profile.principalName == principalName;
        },
      );

      switch (foundProfile) {
        case (null) { return null };
        case (?profile) { return ?profile };
      };
    };

    public func createProfile(principalName : Types.PrincipalName, displayName : Text, wallet : Text, depositAddress : Account.AccountIdentifier) : () {

      let updatedProfile : Types.Profile = {
        principalName = principalName;
        displayName = displayName;
        wallet = wallet;
        depositAddress = depositAddress;
        balance = 0;
      };

      let existingProfile = List.find<Types.Profile>(
        userProfiles,
        func(profile : Types.Profile) : Bool {
          return profile.principalName == principalName;
        },
      );

      switch (existingProfile) {
        case (null) {
          var newProfilesList = List.nil<Types.Profile>();
          newProfilesList := List.push(updatedProfile, newProfilesList);
          userProfiles := List.append(userProfiles, newProfilesList);
        };
        case (?existingProfile) {};
      };
    };

    public func getLeaderboardEntryNames(leaderboard : DTOs.LeaderBoardDTO) : DTOs.LeaderBoardDTO {
      let populatedEntries = List.map<DTOs.LeaderboardEntryDTO, DTOs.LeaderboardEntryDTO>(
        List.fromArray(leaderboard.leaderboardEntries),
        func(entry : DTOs.LeaderboardEntryDTO) : DTOs.LeaderboardEntryDTO {
          let profile = getProfile(entry.principalName);
          switch (profile) {
            case (null) {
              return entry;
            };
            case (?profileData) {
              return {
                position = entry.position;
                principalName = entry.principalName;
                displayName = profileData.displayName;
                correctScores = entry.correctScores;
                totalFixtures = entry.totalFixtures;
                enteredSweepstake = entry.enteredSweepstake;
              };
            };
          };
        },
      );
      return {
        seasons = leaderboard.seasons;
        activeSeasonId = leaderboard.activeSeasonId;
        activeSeasonName = leaderboard.activeSeasonName;
        activeGameweekNumber = leaderboard.activeGameweekNumber;
        leaderboardEntries = List.toArray(populatedEntries);
        totalEntries = leaderboard.totalEntries;
        totalPot = leaderboard.totalPot;
        winningShare = leaderboard.winningShare;
        status = leaderboard.status;
      };
    };

    public func getProfilesByPage(page : Int, pageSize : Int) : DTOs.BalancesDTO {
      let startIndex = (page - 1) * pageSize;
      let endIndex = page * pageSize;
      var paginatedProfiles : [Types.Profile] = [];
      let totalProfiles = List.size<Types.Profile>(userProfiles);
      let buffer = Buffer.fromArray<DTOs.UserBalanceDTO>(paginatedProfiles);

      var index = 0;
      for (profile in List.toArray(userProfiles).vals()) {
        if (index >= startIndex and index < endIndex) {
          buffer.add({
            principalName = profile.principalName;
            displayName = profile.displayName;
            balance = 0;
          });
        };
        index += 1;
      };

      let profileObject : DTOs.BalancesDTO = {
        totalEntries = Nat64.fromNat(totalProfiles);
        userBalances = Buffer.toArray(buffer);
        potAccountBalance = Nat64.fromNat(0);
      };

      return profileObject;
    };

    public func updateDisplayName(principalName : Types.PrincipalName, displayName : Text) : Result.Result<(), Types.Error> {

      let existingProfile = List.find<Types.Profile>(
        userProfiles,
        func(profile : Types.Profile) : Bool {
          return profile.principalName == principalName;
        },
      );

      switch (existingProfile) {
        case (null) {
          return #err(#NotFound);
        };
        case (?existingProfile) {

          if (existingProfile.displayName == displayName) {
            return #ok(());
          };

          let updatedProfile : Types.Profile = {
            principalName = existingProfile.principalName;
            displayName = displayName;
            wallet = existingProfile.wallet;
            depositAddress = existingProfile.depositAddress;
            balance = 0;
          };

          let nameValid = isDisplayNameValid(updatedProfile.displayName);
          if (not nameValid) {
            return #err(#NotAllowed);
          };

          userProfiles := List.map<Types.Profile, Types.Profile>(
            userProfiles,
            func(profile : Types.Profile) : Types.Profile {
              if (profile.principalName == principalName) { updatedProfile } else {
                profile;
              };
            },
          );

          return #ok(());
        };
      };
    };

    public func updateWalletAddress(principalName : Types.PrincipalName, walletAddress : Text) : Result.Result<(), Types.Error> {

      let existingProfile = List.find<Types.Profile>(
        userProfiles,
        func(profile : Types.Profile) : Bool {
          return profile.principalName == principalName;
        },
      );

      switch (existingProfile) {
        case (null) {
          return #err(#NotFound);
        };
        case (?existingProfile) {

          if (existingProfile.wallet == walletAddress) {
            return #ok(());
          };

          let updatedProfile : Types.Profile = {
            principalName = existingProfile.principalName;
            displayName = existingProfile.displayName;
            wallet = walletAddress;
            depositAddress = existingProfile.depositAddress;
            balance = 0;
          };

          userProfiles := List.map<Types.Profile, Types.Profile>(
            userProfiles,
            func(profile : Types.Profile) : Types.Profile {
              if (profile.principalName == principalName) { updatedProfile } else {
                profile;
              };
            },
          );

          return #ok(());
        };
      };
    };

    public func isDisplayNameValid(displayName : Text) : Bool {

      if (Text.size(displayName) < 3 or Text.size(displayName) > 20) {
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

      if (not isAlphanumeric(displayName)) {
        return false;
      };

      let foundProfile = List.find<Types.Profile>(
        userProfiles,
        func(profile : Types.Profile) : Bool {
          return profile.displayName == displayName;
        },
      );

      if (foundProfile != null) {
        return false;
      };

      return true;
    };

    public func isWalletValid(walletAddress : Text) : Bool {

      let account_id = Account.decode(walletAddress);
      switch account_id {
        case (#ok array) {
          if (Account.validateAccountIdentifier(Blob.fromArray(array))) {
            return true;
          };
        };
        case (#err err) {
          return false;
        };
      };

      return false;
    };

    public func getPredictionNames(predictions : DTOs.CorrectPredictionsDTO) : DTOs.CorrectPredictionsDTO {
      let populatedEntries = List.map<DTOs.CorrectPredictionDTO, DTOs.CorrectPredictionDTO>(
        List.fromArray(predictions.predictions),
        func(entry : DTOs.CorrectPredictionDTO) : DTOs.CorrectPredictionDTO {
          let profile = getProfile(entry.principalName);
          switch (profile) {
            case (null) {
              return entry;
            };
            case (?profileData) {
              return {
                principalName = entry.principalName;
                displayName = profileData.displayName;
              };
            };
          };
        },
      );
      return {
        predictions = List.toArray(populatedEntries);
        totalEntries = predictions.totalEntries;
        seasonId = predictions.seasonId;
        seasonName = predictions.seasonName;
        gameweekNumber = predictions.gameweekNumber;
        homeTeamName = predictions.homeTeamName;
        awayTeamName = predictions.awayTeamName;
        homeTeamGoals = predictions.homeTeamGoals;
        awayTeamGoals = predictions.awayTeamGoals;
      };
    };

  };
};
