import { atom } from "jotai";
import projectConfig from "@/app/config/project.config";
import { LoginRequest } from "@/app/models/request_body/loginRequestBody";
import { LoginResponse } from "@/app/models/response_body/loginResponseBody";

export type LoginAtomServiceReturnValue = {
  response_status: number;
  response: LoginResponse;
  responseError: boolean;
};

class LoginAtomService {
  private readonly _initReturnValue: LoginResponse = {
    access_token: "",
    response_status: 0,
    response: { errorDetails: { errorDesc_EN: "", errorDesc_TH: "" } },
  };

  private _response = atom<LoginResponse>(this._initReturnValue);

  public response = atom((get) => get(this._response));

  private _responseError = atom<boolean>(false);

  public responseError = atom((get) => get(this._responseError));

  private _isLoading = atom<boolean>(false);

  public isLoading = atom((get) => get(this._isLoading));

  public fetchData = atom(
    null,
    async (_get, set, signal: AbortSignal, bodys: LoginRequest) => {
      set(this._isLoading, true);
      set(this._responseError, false);
      console.log("body loginAtomService ===>", bodys);
      let returnValue: LoginResponse;
      returnValue = await fetch(`${projectConfig.envpoint}auth/login`, {
        signal,
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify(bodys),
      })
        .then(async (res) => {
          if (Number(res.status) === 200) {
            console.log("async res url:", res.url);
          } else if (Number(res.status) !== 200) {
            console.error("APIs Response authLogin Error", await res.json());
            set(this._responseError, true);
            set(this._isLoading, false);
            return this._initReturnValue;
          }
          const json: LoginResponse = await res.json();
          set(this._response, json);
          set(this._isLoading, false);
          set(this._responseError, false);
          returnValue = {
            response: json.response,
            access_token: json.access_token,
            response_status: json.response_status,
          };
          return returnValue;
        })
        .catch((err) => {
          console.log("Error fetching LoginAtomService", err);
          set(this._isLoading, false);
          set(this._responseError, true);
          return this._initReturnValue;
        });

      return returnValue;
    }
  );
}

const loginAtomService = new LoginAtomService();

export default loginAtomService;
