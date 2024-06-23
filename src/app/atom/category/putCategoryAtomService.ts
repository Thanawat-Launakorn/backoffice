import { atom } from "jotai";
import { HeadersProps } from "../headers";
import { CreateCateogryRequest } from "@/app/models/request_body/createCategoryRequestBody";
import { CreateCateogryResponse } from "@/app/models/response_body/createCategoryResponseBody";

export type CreateCategoryAtomServiceReturnValue = {
  responseError: boolean;
  response_status: number;
  response: CreateCateogryResponse;
};

class CreateCategoryAtomService {
  private readonly _initReturnValue: CreateCateogryResponse = { message: "" };

  private _response = atom<CreateCateogryResponse>(this._initReturnValue);

  public response = atom((get) => get(this._response));

  private _responseError = atom<boolean>(false);

  public responseError = atom((get) => get(this._responseError));

  private _isLoading = atom<boolean>(false);

  public isLoading = atom((get) => get(this._isLoading));

  public fetchData = atom(
    null,
    async (
      _get,
      set,
      signal: AbortSignal,
      headers: HeadersProps,
      bodys: CreateCateogryRequest
    ) => {
      set(this._isLoading, true);
      set(this._responseError, false);
      console.log("body createCategoryAtomService ===>", bodys);
      let returnValue: CreateCategoryAtomServiceReturnValue = {
        response: { message: "" },
        response_status: 0,
        responseError: false,
      };
      returnValue = await fetch(`${process.env.ENDPOINT}category/create`, {
        signal,
        headers,
        method: "",
        body: JSON.stringify(bodys),
      })
        .then(async (res) => {
          if (Number(res.status) === 200) {
            console.log("async res url:", res.url);
          } else if (Number(res.status) !== 200) {
            console.error(
              "APIs Response CreateCategory Error",
              await res.json()
            );
            set(this._responseError, true);
            set(this._isLoading, false);
            return returnValue
          }
          const json: CreateCateogryResponse = await res.json();
          set(this._response, json);
          set(this._isLoading, false);
          set(this._responseError, false);
          returnValue = {
            response: json,
            response_status: res.status,
            responseError: false,
          };
          return returnValue;
        })
        .catch((err) => {
          console.log("Error fetching CreateCategoryAtomService", err);
          set(this._isLoading, false);
          set(this._responseError, true);
          return returnValue;
        });

      return returnValue;
    }
  );
}

const createCategoryAtomService = new CreateCategoryAtomService();

export default createCategoryAtomService;
