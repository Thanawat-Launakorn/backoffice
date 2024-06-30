import axiosConfig from "@/app/axios";
import { GetCategoryProductRequest } from "@/app/models/request_body/getCategoryProductRequestBody";
import { GetCategoryProductResponse } from "@/app/models/response_body/getCategoryProductResponseBody";
import { atom } from "jotai";

export type GetCategoryProductAtomServiceReturnValue = {
  response_status: number;
  response: GetCategoryProductResponse[];
};

class GetCategoryProductAtomService {
  private readonly _initReturnValue: GetCategoryProductResponse[] = [
    {
      id: 0,
      name: "",
      price: 0,
      image: "",
      category_id: 0,
      description: "",
    },
  ];

  private _response = atom<GetCategoryProductResponse[]>(this._initReturnValue);

  public response = atom((get) => get(this._response));

  private _responseError = atom<boolean>(false);

  public responseError = atom((get) => get(this._responseError));

  private _isLoading = atom<boolean>(false);

  public isLoading = atom((get) => get(this._isLoading));

  public fetchData = atom(
    null,
    async (_get, set, params: GetCategoryProductRequest) => {
      set(this._isLoading, true);
      set(this._responseError, false);

      let returnValue: GetCategoryProductAtomServiceReturnValue = {
        response_status: 0,
        response: this._initReturnValue,
      };

      returnValue = await axiosConfig.ENDPOINT.get(
        `product/category/${params.cateogry_id}`
      )
        .then(async (res) => {
          if (Number(res.status) === 200) {
            console.log("async res url:", res.config.url);
          } else if (Number(res.status) !== 200) {
            console.error("APIs Response GetCategoryProduct Error", res.data);
            set(this._responseError, true);
            set(this._isLoading, false);
            returnValue = {
              response_status: res.status,
              response: this._initReturnValue,
            };
            return returnValue;
          }

          const json: GetCategoryProductResponse[] = await res.data;
          set(this._response, json);
          set(this._isLoading, false);
          set(this._responseError, false);
          returnValue = {
            response: json,
            response_status: res.status,
          };

          return returnValue;
        })
        .catch((err) => {
          console.log("Error fetching GetCategoryProductAtomService", err);
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

const getCategoryProductAtomService = new GetCategoryProductAtomService();

export default getCategoryProductAtomService;
