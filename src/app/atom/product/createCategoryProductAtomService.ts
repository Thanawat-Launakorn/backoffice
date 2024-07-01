import axiosConfig from "@/app/axios";
import { atom } from "jotai";

export type CreateCategoryProductAtomServiceReturnValue = {
  response_status: number;
};

class CreateCategoryProductAtomService {
  private _responseError = atom<boolean>(false);

  public responseError = atom((get) => get(this._responseError));

  private _isLoading = atom<boolean>(false);

  public isLoading = atom((get) => get(this._isLoading));

  public fetchData = atom(null, async (_get, set, formData: FormData) => {
    set(this._isLoading, true);
    set(this._responseError, false);

    let returnValue: CreateCategoryProductAtomServiceReturnValue = {
      response_status: 0,
    };

    returnValue = await axiosConfig.ENDPOINT.post(`product/create`, formData)
      .then((res) => {
        if (Number(res.status) === 201) {
          console.log("async res url:", res.config.url);
        } else if (Number(res.status) !== 200) {
          set(this._isLoading, false);
          set(this._responseError, true);
          returnValue = {
            response_status: res.status,
          };

          return returnValue;
        }
        set(this._isLoading, false);
        set(this._responseError, false);
        returnValue = {
          response_status: res.status,
        };
        return returnValue;
      })
      .catch((err) => {
        console.error("Error Fetch CreateCategoryProductAtomService", err);
        set(this._isLoading, false);
        set(this._responseError, true);
        returnValue = {
          response_status: 0,
        };
        return returnValue;
      });

    return returnValue;
  });
}

const createCategoryProductAtomService = new CreateCategoryProductAtomService();

export default createCategoryProductAtomService;
