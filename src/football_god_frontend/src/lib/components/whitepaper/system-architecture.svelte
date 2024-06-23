<div class="flex flex-col space-y-2">
    <h1 class="text-2xl">System Architecture</h1>
    <p>
        FootballGod has the following core canisters:
    </p>
    <ul>
        <li>
            Players Canister: 
            Stores all information on each football player's career from in game events to career achievements.
        </li>
        <li>Events Canister: All sports event </li>
        <li>Users Canister: Horizontally scaled canisters to store all user information.</li>
        <li>Index Canister: Used to map information between canisters.</li>
        <li>
            Odds Canister: 
            Stores all live and historical odds information for all games.
        </li>
    </ul>
    <p>
        If a user purchases a private agency, a single canister is created to manage the agency data.
    </p>
</div>