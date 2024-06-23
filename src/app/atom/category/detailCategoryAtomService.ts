import { atom } from "jotai";
import axiosConfig from "@/app/axios";
import { DetailCategoryResponse } from "@/app/models/response_body/detailCategoryResponseBody";

export type DetailCategoryAtomServiceReturnValue = {
  response_status: number;
  response: DetailCategoryResponse;
};

class DetailCategoryAtomService {
  private readonly _initReturnValue: DetailCategoryResponse = {
    id: 0,
    image: "",
    category: "",
    description: "",
  };
  private _responseError = atom<boolean>(false);

  public responseError = atom((get) => get(this._responseError));

  private _isLoading = atom<boolean>(true);

  public isLoading = atom((get) => get(this._isLoading));

  private _response = atom<DetailCategoryResponse>(this._initReturnValue);

  public response = atom((get) => get(this._response));

  public fetchData = atom(
    null,
    async (
      _get,
      set,
      params: {
        id: number;
      }
    ) => {
      set(this._isLoading, true);
      set(this._responseError, false);

      let returnValue: DetailCategoryAtomServiceReturnValue;

      returnValue = await axiosConfig.ENDPOINT.get(
        `category/detail/${params.id}`
      )
        .then(async (res) => {
          if (Number(res.status) === 200) {
            console.log("async res url:", res.config.url);
          } else if (Number(res.status) !== 200) {
            console.error("APIs Response DetailCategory Error", res.data);
            set(this._responseError, true);
            set(this._isLoading, false);
            returnValue = {
              response_status: res.status,
              response: this._initReturnValue,
            };
            return returnValue;
          }
          const json: DetailCategoryResponse = await res.data;
          set(this._isLoading, false);
          set(this._responseError, false);
          returnValue = {
            response: json,
            response_status: res.status,
          };
          return returnValue;
        })
        .catch((err) => {
          console.log("Error fetching DetailCategoryAtomService", err);
          set(this._isLoading, false);
          set(this._responseError, true);
          returnValue = {
              response_status: 0,
              response: this._initReturnValue,
          };
          return returnValue;
        });
      return returnValue;
    }
  );
}

const detailCategoryAtomService = new DetailCategoryAtomService();

export default detailCategoryAtomService;
