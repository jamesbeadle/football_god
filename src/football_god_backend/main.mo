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
  
  public shared query ({caller}) func isAdmin(): async Bool {
     Debug.print(debug_show(caller));
  
    switch (Array.find<Principal>(admins, func (admin) { admin == caller })) {
      case null { false };
      case _ { true };
    };
  };

  type Error = {
      #NotFound;
      #AlreadyExists;
      #NotAuthorized;
  };

  type Season = {
    id : Nat;
    name : Text;
    year : Nat;
    status : Text;
  };

  var seasons : [Season] = [];
  var nextId : Nat = 1;

  public shared ({caller}) func createSeason(name : Text, year : Nat) : async Result.Result<(), Error> {
    
    let isCallerAdmin = await isAdmin();
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
    
    Debug.print("Adding season");
     
    let buffer = Buffer.fromArray<Season>(seasons);
    buffer.add(newSeason);
    seasons := Buffer.toArray(buffer);

    nextId := nextId + 1;
    Debug.print("Next id");
    return #ok(());
  };

  public query func getSeasons() : async [Season] {
    return seasons;
  };
  
  /*
  public query func getSeasons() : async [Season] {
    let fakeSeasons : [Season] = [
      {
        id = 1;
        name = "Fake Season 1";
        year = 2023;
        status = "active";
      },
      {
        id = 2;
        name = "Fake Season 2";
        year = 2024;
        status = "inactive";
      }
    ];
    return fakeSeasons;
  };
  */


}
