import { atom } from "jotai";
import axiosConfig from "@/app/axios";
import { GetCategoryResponse } from "@/app/models/response_body/getCategoryResponseBody";

export type GetCategoryAtomServiceReturnValue = {
  response_status: number;
  response_error: boolean;
  response: GetCategoryResponse[];
};

class GetCategoryAtomService {
  private readonly _initReturnValue: GetCategoryResponse[] = [{
    id: 0,
    image: "",
    category: "",
    description: "",
  }];

  private _response = atom<GetCategoryResponse[]>(this._initReturnValue);

  public response = atom((get) => get(this._response));

  private _responseError = atom<boolean>(false);

  public responseError = atom((get) => get(this._responseError));

  private _isLoading = atom<boolean>(true);

  public isLoading = atom((get) => get(this._isLoading));

  public fetchData = atom(null, async (_get, set) => {
    set(this._isLoading, true);
    set(this._responseError, false);

    let returnValue: GetCategoryAtomServiceReturnValue = {
      response_status: 0,
      response_error: false,
      response: this._initReturnValue,
    };

    returnValue = await axiosConfig.ENDPOINT
      .get(`category/all`)
      .then(async (res) => {
        if (Number(res.status) === 200) {
          console.log("async res url:", res.config.url);
        } else if (Number(res.status) !== 200) {
          console.error("APIs Response GetCategory Error", res.data);
          set(this._responseError, true);
          set(this._isLoading, false);
          return returnValue;
        }
        const json: GetCategoryResponse[] = await res.data;
        set(this._response, json);
        set(this._isLoading, false);
        set(this._responseError, false);
        returnValue = {
          response: json,
          response_status: res.status,
          response_error: false,
        };
        return returnValue;
      })
      .catch((err) => {
        console.log("Error fetching GetCategoryAtomService", err);
        set(this._isLoading, false);
        set(this._responseError, true);
        return returnValue;
      });
  });
}

const getCategoryAtomService = new GetCategoryAtomService();

export default getCategoryAtomService;
