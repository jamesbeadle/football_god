import Result "mo:base/Result";
import List "mo:base/List";
import Text "mo:base/Text";
import Nat64 "mo:base/Nat64";
import Blob "mo:base/Blob";
import Buffer "mo:base/Buffer";
import Account "../utilities/Account";
import T "../types/app_types";
import Base "../types/base_types";

module {

  public class UserManager() {

    private var userProfiles = List.nil<T.Profile>();


    public func setData(stable_profiles : [T.Profile]) {
      userProfiles := List.fromArray(stable_profiles);
    };

    public func getProfiles() : [T.Profile] {
      return List.toArray(
        List.map<T.Profile, T.Profile>(
          userProfiles,
          func(profile : T.Profile) : T.Profile {
            return {
              principalId = profile.principalId;
              username = profile.username;
              withdrawalAddress = profile.withdrawalAddress;
            };
          },
        ),
      );
    };

    public func getProfile(principalId : Text) : ?T.Profile {
      let foundProfile = List.find<T.Profile>(
        userProfiles,
        func(profile : T.Profile) : Bool {
          return profile.principalId == principalId;
        },
      );

      switch (foundProfile) {
        case (null) { return null };
        case (?profile) { return ?profile };
      };
    };

    public func createProfile(principalId : Base.PrincipalId, username : Text, withdrawalAddress : Text) : () {

      let updatedProfile : T.Profile = {
        principalId = principalId;
        username = username;
        withdrawalAddress = withdrawalAddress;
      };

      let existingProfile = List.find<T.Profile>(
        userProfiles,
        func(profile : T.Profile) : Bool {
          return profile.principalId == principalId;
        },
      );

      switch (existingProfile) {
        case (null) {
          var newProfilesList = List.nil<T.Profile>();
          newProfilesList := List.push(updatedProfile, newProfilesList);
          userProfiles := List.append(userProfiles, newProfilesList);
        };
        case (?existingProfile) {};
      };
    };

    public func updateUsername(principalId : Base.PrincipalId, username : Text) : Result.Result<(), T.Error> {

      let existingProfile = List.find<T.Profile>(
        userProfiles,
        func(profile : T.Profile) : Bool {
          return profile.principalId == principalId;
        },
      );

      switch (existingProfile) {
        case (null) {
          return #err(#NotFound);
        };
        case (?existingProfile) {

          if (existingProfile.principalId == principalId) {
            return #ok(());
          };

          let updatedProfile : T.Profile = {
            principalId = existingProfile.principalId;
            username = username;
            withdrawalAddress = existingProfile.withdrawalAddress;
          };

          let nameValid = isDisplayNameValid(updatedProfile.username);
          if (not nameValid) {
            return #err(#NotAllowed);
          };

          userProfiles := List.map<T.Profile, T.Profile>(
            userProfiles,
            func(profile : T.Profile) : T.Profile {
              if (profile.principalId == principalId) { updatedProfile } else {
                profile;
              };
            },
          );

          return #ok(());
        };
      };
    };

    public func updateWithdrawalAddress(principalId : Base.PrincipalId, withdrawalAddress : Text) : Result.Result<(), T.Error> {

      let existingProfile = List.find<T.Profile>(
        userProfiles,
        func(profile : T.Profile) : Bool {
          return profile.principalId == principalId;
        },
      );

      switch (existingProfile) {
        case (null) {
          return #err(#NotFound);
        };
        case (?existingProfile) {

          if (existingProfile.withdrawalAddress == withdrawalAddress) {
            return #ok(());
          };

          let updatedProfile : T.Profile = {
            principalId = existingProfile.principalId;
            username = existingProfile.username;
            withdrawalAddress = withdrawalAddress;
          };

          userProfiles := List.map<T.Profile, T.Profile>(
            userProfiles,
            func(profile : T.Profile) : T.Profile {
              if (profile.principalId == principalId) { updatedProfile } else {
                profile;
              };
            },
          );

          return #ok(());
        };
      };
    };

    public func isDisplayNameValid(principalId : Text) : Bool {

      if (Text.size(principalId) < 3 or Text.size(principalId) > 20) {
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

      if (not isAlphanumeric(principalId)) {
        return false;
      };

      let foundProfile = List.find<T.Profile>(
        userProfiles,
        func(profile : T.Profile) : Bool {
          return profile.principalId == principalId;
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

    //TODO: ADD WITHDRAWAL CODE

  };
};
