"use client";

import Swal from "sweetalert2";
import "../asset/css/input.css";
import { InputValues } from "../types";
import authProvider from "../provider/auth";
import tableComponent from "../component/table";
import { useAtomValue, useSetAtom } from "jotai";
import layoutComponent from "../component/layout";
import { ColumnType } from "../component/table/table";
import ManageCategory from "./component/manageCategory";
import typographyComponent from "../component/typography";
import { Button, Card, Flex, useDisclosure } from "@chakra-ui/react";
import React, {
  Fragment,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import getCategoryAtomService from "../atom/category/getCategoryAtomService";
import deleteCategoryAtomService from "../atom/category/deleteCategoryAtomService";
import { GetCategoryResponse } from "../models/response_body/getCategoryResponseBody";
import detailCategoryAtomService from "../atom/category/detailCategoryAtomService";
import axiosConfig from "../axios";
import getCategoryProductAtomService from "../atom/product/getCategoryProductAtomService";
import { GetCategoryProductResponse } from "../models/response_body/getCategoryProductResponseBody";
import ItemCategoryProduct from "./component/itemCategoryProduct";
import ManageCategoryProduct from "./component/manageCategoryProduct";
import createCategoryProductAtomService from "../atom/product/createCategoryProductAtomService";
import deleteProductAtomService from "../atom/product/deleteProductAtomService";

export type inputCategoryProps = {
  image: string;
  category: string;
  description: string;
};

export type inputCategoryProductProps = {
  image: string;
  name: string;
  price: string;
  description: string;
  category_id: number;
};

const columns: ColumnType<GetCategoryResponse>[] = [
  { id: "id", accessor: "id", header: "id", type: "text", width: "10px" },
  {
    id: "image",
    accessor: "image",
    header: "Image",
    type: "image",
    width: "30px",
  },
  {
    id: "category",
    accessor: "category",
    header: "Category",
    type: "text",
    width: "120px",
  },
  {
    id: "description",
    accessor: "description",
    header: "Description",
    type: "text",
  },
];

function Product() {
  const { TableApp } = tableComponent;
  const { AuthProvider } = authProvider;
  const { SidebarPage } = layoutComponent;
  const { Typography } = typographyComponent;

  const [images, setImages] = useState<File[]>([]);
  const [imagesDrawer, setImagesDrawer] = useState<File[]>([]);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isDrawerOpen,
    onOpen: onDrawerOpen,
    onClose: onDrawerClose,
  } = useDisclosure();
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [isActive, setIsActive] = useState<string>("");
  const [imageURLs, setImageURLs] = useState<string[]>([]);
  const [imageDrawerURLs, setImageDrawerURLs] = useState<string[]>([]);
  const [CategoryProduct, setCategoryProduct] = useState<
    GetCategoryProductResponse[]
  >([]);

  const deleteCategory = useSetAtom(deleteCategoryAtomService.fetchData);
  const deleteCategoryProduct = useSetAtom(deleteProductAtomService.fetchData);
  const fetchDataCategory = useSetAtom(getCategoryAtomService.fetchData);
  const fetchDataDetailCategory = useSetAtom(
    detailCategoryAtomService.fetchData
  );
  const fetchDataCategoryProduct = useSetAtom(
    getCategoryProductAtomService.fetchData
  );
  const fetchDataCreateCategoryProduct = useSetAtom(
    createCategoryProductAtomService.fetchData
  );

  const responseCategory = useAtomValue(getCategoryAtomService.response);

  const isLoadingCategory = useAtomValue(getCategoryAtomService.isLoading);
  const isLoadingDetailCategory = useAtomValue(
    detailCategoryAtomService.isLoading
  );
  const isLoadingCategoryProduct = useAtomValue(
    getCategoryProductAtomService.isLoading
  );
  const isLoadingCreateCategoryProduct = useAtomValue(
    createCategoryProductAtomService.isLoading
  );

  const isErrorDetailCategory = useAtomValue(
    detailCategoryAtomService.responseError
  );

  const isAPIsLoading = useMemo(
    () => [isLoadingCategory].some((_) => _),
    [isLoadingCategory]
  );

  const isAPIsFail = useMemo(
    () => [isErrorDetailCategory],
    [isErrorDetailCategory]
  );

  const initCategory: InputValues<keyof inputCategoryProps> = {
    image: { value: "" },
    category: { value: "" },
    description: { value: "" },
  };

  const initCategoryProduct: InputValues<keyof inputCategoryProductProps> = {
    image: { value: "" },
    name: { value: "" },
    description: { value: "" },
    price: { value: "" },
    category_id: { value: 0 },
  };

  const [inputCategory, setInputCategory] =
    useState<InputValues<keyof inputCategoryProps>>(initCategory);

  const [inputCategoryProduct, setInputCategoryProduct] =
    useState<InputValues<keyof inputCategoryProductProps>>(initCategoryProduct);

  const onImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files) return;
    setImages([...event.target.files]);
  };

  const onImageDrawerChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files) return;
    setImagesDrawer([...event.target.files]);
  };

  const onChangeCategory = useCallback(
    (identifier: string, value: string | File) => {
      setInputCategory({
        ...inputCategory,
        [identifier]: { value },
      });
    },
    [inputCategory]
  );

  const onChangeCategoryProduct = useCallback(
    (identifier: string, value: string | File | number) => {
      setInputCategoryProduct({
        ...inputCategoryProduct,
        [identifier]: { value },
      });
    },
    [inputCategoryProduct]
  );

  useEffect(() => {
    if (images.length < 1) return;
    const newImageUrls = images.map((image) => URL.createObjectURL(image));
    setImageURLs(newImageUrls);
  }, [images]);

  useEffect(() => {
    if (imagesDrawer.length < 1) return;

    const newImageUrls = imagesDrawer.map((image) =>
      URL.createObjectURL(image)
    );
    setImageDrawerURLs(newImageUrls);
  }, [imagesDrawer]);

  const onCloseCreateCategory = () => {
    onClose();
    setImageURLs([]); // <=== clear images 🗑️
    setInputCategory(initCategory); // <=== clear input 🗑️
  };

  const onCloseCreateCategoryProduct = () => {
    onDrawerClose();
    setImageDrawerURLs([]);
    setInputCategoryProduct(initCategoryProduct);
  };

  const onSaveCategory = useCallback(async () => {
    const formData = new FormData();
    const selectedFile = images[0] ?? "";
    if (selectedFile.size > 1024 * 1024 * 2) {
      Swal.fire("File is over for upload", "", "warning");
    }
    formData.append("image", selectedFile);
    formData.append("category", inputCategory.category.value);
    formData.append("description", inputCategory.description.value);
    if (isActive && isEdit) {
      await axiosConfig.ENDPOINT.patch(
        `category/update/${isActive}`,
        formData
      ).then((res) => {
        try {
          if (Number(res.status) === 200) {
            fetchDataCategory().then((res) => {
              const { response_status } = res;
              if (Number(response_status) === 200) {
                Swal.fire("Saved!", "", "success");
              }
            });
          } else {
            onCloseCreateCategory();
            Swal.fire("Changes are not saved", "", "error");
          }
        } finally {
          setImageURLs([]); // <=== clear images 🗑️
          onCloseCreateCategory();
        }
      });
    } else {
      await axiosConfig.ENDPOINT.post(`category/create`, formData).then(
        (res) => {
          if (Number(res.status) === 201) {
            fetchDataCategory().then((res) => {
              try {
                const { response_status } = res;
                if (Number(response_status) === 200) {
                  Swal.fire("Saved!", "", "success");
                }
              } finally {
                setImageURLs([]); // <=== clear images 🗑️
                onCloseCreateCategory();
              }
            });
          } else {
            onCloseCreateCategory();
            Swal.fire("Changes are not saved", "", "error");
          }
        }
      );
    }
  }, [inputCategory, imageURLs, images]);

  const onSaveCategoryProduct = useCallback(async () => {
    const formData = new FormData();
    const selectedFile = imagesDrawer[0] ?? "";
    if (selectedFile.size > 1024 * 1024 * 2) {
      Swal.fire("File is over for upload", "", "warning");
    }
    formData.append("image", selectedFile);
    formData.append("name", inputCategoryProduct.name.value);
    formData.append("price", inputCategoryProduct.price.value);
    formData.append("description", inputCategoryProduct.description.value);
    formData.append("category_id", isActive);
    console.log("inputCategoryProduct", inputCategoryProduct);
    fetchDataCreateCategoryProduct(formData).then((res) => {
      if (Number(res.response_status) === 201) {
        fetchDataCategoryProduct({
          cateogry_id: +isActive,
        }).then((res) => {
          try {
            const { response, response_status } = res;
            if (Number(response_status) === 200) {
              Swal.fire("Saved!", "", "success");
              setCategoryProduct(response);
            } else {
              Swal.fire("Change are not saved", "", "error");
            }
          } finally {
            setImageDrawerURLs([]);
            onCloseCreateCategoryProduct();
          }
        });
      } else {
        onCloseCreateCategoryProduct();
        Swal.fire("Change are not saved", "", "error");
      }
    });
  }, [
    inputCategoryProduct,
    imageDrawerURLs,
    imagesDrawer,
    isActive,
    CategoryProduct,
  ]);

  const loadCategory = React.useCallback(() => {
    fetchDataCategory();
  }, [fetchDataCategory]);

  const onCategoryDetail = useCallback(
    (id: string) => {
      setIsActive(id);
      onChangeCategoryProduct("category_id", isActive);
      fetchDataCategoryProduct({ cateogry_id: +id }).then((res) => {
        const { response, response_status } = res;
        if (Number(response_status) === 200) {
          setCategoryProduct(response);
        }
      });
    },
    [isActive]
  );

  const onEditCategory = useCallback(() => {
    onOpen();
    setIsEdit(true);
    fetchDataDetailCategory({ id: +isActive }).then((res) => {
      if (Number(res.response_status) === 200) {
        const { category, description, image } = res.response;
        setInputCategory({
          image: { value: image },
          category: { value: category },
          description: { value: description },
        });
      }
    });
  }, [isEdit, isActive, inputCategory]);

  const onCreateCategory = useCallback(() => {
    onOpen();
    setIsEdit(false);
    setInputCategory(initCategory);
  }, [isEdit]);

  const onDeleteCategory = useCallback(() => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "green",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        deleteCategory({ id: +isActive }).then((res) => {
          try {
            if (Number(res.response_status) === 200) {
              Swal.fire({
                title: "Deleted!",
                text: "Your file has been deleted.",
                icon: "success",
              });
            } else {
              Swal.fire("Changes are not saved", "", "error");
            }
          } finally {
            fetchDataCategory().then((res) => {
              const { response, response_status } = res;
              if (Number(response_status) === 200) {
              }
            });
          }
        });
      }
    });
  }, [isActive]);

  const onDeleteProduct = useCallback(
    (id: number) => {
      deleteCategoryProduct({ id }).then((res) => {
        try {
          if (Number(res.response_status) === 200) {
            Swal.fire({
              title: "Deleted!",
              text: "Your file has been deleted.",
              icon: "success",
            });
          } else {
            Swal.fire("Changes are not saved", "", "error");
          }
        } finally {
          fetchDataCategoryProduct({ cateogry_id: +isActive }).then((res) => {
            const { response, response_status } = res;
            if (Number(response_status) === 200) {
              setCategoryProduct(response);
            }
          });
        }
      });
    },
    [isActive, CategoryProduct]
  );

  const onClear = () => {
    setIsActive("");
    setCategoryProduct([]);
  };

  const onCreateCategoryProduct = useCallback(() => {
    onDrawerOpen();
  }, [isActive]);

  useEffect(() => {
    loadCategory();
  }, [loadCategory]);

  if (isAPIsLoading) {
    return <div>loading...</div>;
  }

  const getCategoryProduct = () => {
    if (!isActive) {
      return (
        <div className="w-full h-full flex justify-center items-center">
          <Typography title="select your category!" size="large" />
        </div>
      );
    }

    if (isActive) {
      return (
        <Fragment>
          {CategoryProduct.map((it, idx) => {
            return (
              <ItemCategoryProduct
                data={it}
                key={idx}
                onDelete={onDeleteProduct}
              />
            );
          })}
          {isActive && (
            <Card
              objectFit={"cover"}
              margin={2.5}
              height={200}
              overflow="hidden"
              variant="outline"
              cursor={"pointer"}
              transition={"ease-in-out .125s"}
              direction={{ base: "column", sm: "row" }}
              css={{
                "&:hover": {
                  backgroundColor: "#ced4da",
                },
              }}
            >
              <div
                className="flex justify-center items-center w-full text-5xl text-green-500"
                onClick={onCreateCategoryProduct}
              >
                +
              </div>
            </Card>
          )}
        </Fragment>
      );
    }

    if (isLoadingCategoryProduct) {
      return <Fragment>...isLoading</Fragment>;
    }
  };

  return (
    <AuthProvider>
      <SidebarPage>
        <Flex flexDirection={"row"} flexGrow={"1"} height={"auto"}>
          <div className="w-[50%] flex flex-col h-auto">
            <div className="w-[100%]">
              <Flex justify={"space-between"} justifyItems={"center"}>
                <Button
                  mb={5}
                  fontSize={14}
                  isDisabled={!!isActive}
                  onClick={onCreateCategory}
                >
                  Create Category
                </Button>

                <Button
                  mb={5}
                  fontSize={14}
                  colorScheme="yellow"
                  isDisabled={!isActive}
                  onClick={onEditCategory}
                >
                  Edit Category
                </Button>

                <Button
                  mb={5}
                  fontSize={14}
                  colorScheme="red"
                  isDisabled={!isActive}
                  onClick={onDeleteCategory}
                >
                  Delete Category
                </Button>
              </Flex>
            </div>

            <TableApp<GetCategoryResponse>
              columns={columns}
              data={responseCategory}
              isActive={isActive}
              onPressItem={onCategoryDetail}
            />
          </div>
          <div className="flex mx-6 flex-col justify-center h-auto">
            <Typography
              title={"your product 👉🏻"}
              size="small"
              className="my-2"
            />
            <Button onClick={onClear} fontSize={12} isDisabled={!isActive}>
              Clear
            </Button>
          </div>
          <div className="flex-1 h-[450px] rounded-md shadow-md border-[1px] overflow-y-auto">
            {getCategoryProduct()}
          </div>
        </Flex>
        <ManageCategory
          isAPIsFail={false}
          isAPIsLoading={isEdit ? isLoadingDetailCategory : isAPIsLoading}
          isEdit={isEdit}
          imageURLs={imageURLs}
          inputCategory={inputCategory}
          modalProps={{
            isOpen,
            onClose,
          }}
          onImageChange={onImageChange}
          onSaveCategory={onSaveCategory}
          onChangeCategory={onChangeCategory}
          onCloseCreateCategory={onCloseCreateCategory}
        />

        <ManageCategoryProduct
          inputCategoryProduct={inputCategoryProduct}
          imageURLs={imageDrawerURLs}
          onImageChange={onImageDrawerChange}
          onChange={onChangeCategoryProduct}
          onSaveCategoryProduct={onSaveCategoryProduct}
          onCloseCategoryProduct={onCloseCreateCategoryProduct}
          drawerProps={{ isOpen: isDrawerOpen, onClose: onDrawerClose }}
        />
      </SidebarPage>
    </AuthProvider>
  );
}

export default Product;
