import List "mo:base/List";
import Array "mo:base/Array";
import Nat "mo:base/Nat";
import Principal "mo:base/Principal";
import Result "mo:base/Result";
import Buffer "mo:base/Buffer";
import Debug "mo:base/Debug";

actor {

  let admins : [Principal] = [
    Principal.fromText("zzlzc-qp3hr-or44h-2ur67-umtpf-66ybr-megk3-qpqq3-icp2x-5c3vd-zqe")
  ];

  private func isAdminForCaller(caller: Principal): Bool {
    Debug.print(debug_show(caller));
    switch (Array.find<Principal>(admins, func (admin) { admin == caller })) {
      case null { false };
      case _ { true };
    };
  };
  
  public shared query ({caller}) func isAdmin(): async Bool {
    return isAdminForCaller(caller);
  };

  type Error = {
      #NotFound;
      #AlreadyExists;
      #NotAuthorized;
  };

  type Season = {
    id : Nat32;
    name : Text;
    year : Nat32;
    status : Text;
  };

  private var seasons = List.nil<Season>();

  var nextId : Nat32 = 1;

  public shared ({caller}) func createSeason(name : Text, year : Nat32) : async Result.Result<(), Error> {
    
    let isCallerAdmin = isAdminForCaller(caller);
    if(isCallerAdmin == false){
      return #err(#NotAuthorized);
    };

    let id = nextId;
    let newSeason : Season = {
      id = id;
      name = name;
      year = year;
      status = "inactive";
    };
    
    seasons := List.push(newSeason, seasons);
     
    nextId := nextId + 1;
    return #ok(());
  };

   public shared ({caller}) func updateSeason(id : Nat32, newName : Text, newYear : Nat32, newStatus : Text) : async Result.Result<(), Error> {
    let isCallerAdmin = isAdminForCaller(caller);
    if(isCallerAdmin == false){
      return #err(#NotAuthorized);
    };

    seasons := List.map<Season, Season>(seasons,
      func (season: Season): Season {
        if (season.id == id) {
          { id = season.id; name = newName; year = newYear; status = newStatus }
        } 
        else { season }
      });

    return #ok(());
    
  };

  public shared ({caller}) func deleteSeason(id : Nat32) : async Result.Result<(), Error> {
    let isCallerAdmin = isAdminForCaller(caller);
    if(isCallerAdmin == false){
      return #err(#NotAuthorized);
    };

    seasons := List.filter(seasons, func(season: Season): Bool { season.id != id });
    
    return #ok(());
  };

  public query func getSeasons() : async [Season] {
    return List.toArray(seasons);
  };
  
}
