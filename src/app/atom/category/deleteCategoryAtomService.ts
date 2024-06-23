import { atom } from "jotai";
import axiosConfig from "@/app/axios";

export type DeleteCategoryAtomServiceReturnValue = {
  response_status: number;
  response_error: boolean;
};

class DeleteCategoryAtomService {
  private _responseError = atom<boolean>(false);

  public responseError = atom((get) => get(this._responseError));

  private _isLoading = atom<boolean>(true);

  public isLoading = atom((get) => get(this._isLoading));

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

      let returnValue: DeleteCategoryAtomServiceReturnValue = {
        response_status: 0,
        response_error: false,
      };

      returnValue = await axiosConfig.ENDPOINT.delete(
        `category/delete/${params.id}`
      )
        .then(async (res) => {
          if (Number(res.status) === 200) {
            console.log("async res url:", res.config.url);
          } else if (Number(res.status) !== 200) {
            console.error("APIs Response DeleteCategory Error", res.data);
            set(this._responseError, true);
            set(this._isLoading, false);
            return returnValue;
          }
          set(this._isLoading, false);
          set(this._responseError, false);
          returnValue = {
            response_status: res.status,
            response_error: false,
          };
          return returnValue;
        })
        .catch((err) => {
          console.log("Error fetching DeleteCategoryAtomService", err);
          set(this._isLoading, false);
          set(this._responseError, true);
          return returnValue;
        });
      return returnValue;
    }
  );
}

const deleteCategoryAtomService = new DeleteCategoryAtomService();

export default deleteCategoryAtomService;
