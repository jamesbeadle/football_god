export const idlFactory = ({ IDL }) => {
  const GetAppStatus = IDL.Record({});
  const AppStatus = IDL.Record({ version: IDL.Text, onHold: IDL.Bool });
  const Error = IDL.Variant({
    DecodeError: IDL.Null,
    NotAllowed: IDL.Null,
    DuplicateData: IDL.Null,
    InvalidProperty: IDL.Null,
    NotFound: IDL.Null,
    IncorrectSetup: IDL.Null,
    NotAuthorized: IDL.Null,
    MaxDataExceeded: IDL.Null,
    InvalidData: IDL.Null,
    SystemOnHold: IDL.Null,
    AlreadyExists: IDL.Null,
    CanisterCreateError: IDL.Null,
    FailedInterCanisterCall: IDL.Null,
    InsufficientFunds: IDL.Null,
  });
  const Result = IDL.Variant({ ok: AppStatus, err: Error });
  return IDL.Service({
    getAppStatus: IDL.Func([GetAppStatus], [Result], ["query"]),
  });
};
export const init = ({ IDL }) => {
  return [];
};
