/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import Swal from "sweetalert2";
import "../asset/css/input.css";
import { InputValues } from "../types";
import { useRouter } from "next/navigation";
import authProvider from "../provider/auth";
import { storage } from "../helpers/storage";
import tableComponent from "../component/table";
import headerAtomService from "../atom/headers";
import { useAtomValue, useSetAtom } from "jotai";
import layoutComponent from "../component/layout";
import { ColumnType } from "../component/table/table";
import ManageCategory from "./component/manageCategory";
import typographyComponent from "../component/typography";
import { Button, Flex, useDisclosure } from "@chakra-ui/react";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import getCategoryAtomService from "../atom/category/getCategoryAtomService";
import deleteCategoryAtomService from "../atom/category/deleteCategoryAtomService";
import { GetCategoryResponse } from "../models/response_body/getCategoryResponseBody";
import detailCategoryAtomService from "../atom/category/detailCategoryAtomService";

type inputCategoryProps = {
  image: string;
  category: string;
  description: string;
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
  const { getToken } = storage;
  const { TableApp } = tableComponent;
  const { AuthProvider } = authProvider;
  const { SidebarPage } = layoutComponent;
  const { Typography } = typographyComponent;

  const [images, setImages] = useState<File[]>([]);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [isActive, setIsActive] = useState<string>("");
  const [imageURLs, setImageURLs] = useState<string[]>([]);

  const headers = useAtomValue(headerAtomService.getHeader);

  const deleteCategory = useSetAtom(deleteCategoryAtomService.fetchData);
  const fetchDataCategory = useSetAtom(getCategoryAtomService.fetchData);
  const fetchDataDetailCategory = useSetAtom(
    detailCategoryAtomService.fetchData
  );

  const responseCategory = useAtomValue(getCategoryAtomService.response);

  const isLoadingCategory = useAtomValue(getCategoryAtomService.isLoading);
  
  const isLoadingDetailCategory = useAtomValue(
    detailCategoryAtomService.isLoading
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
  const [inputCategory, setInputCategory] =
    useState<InputValues<keyof inputCategoryProps>>(initCategory);

  const onImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files) return;
    console.log(...event.target.files);
    setImages([...event.target.files]);
  };

  const onChangeCategory = (identifier: string, value: string | File) => {
    setInputCategory({
      ...inputCategory,
      [identifier]: { value },
    });
  };

  useEffect(() => {
    if (images.length < 1) return;
    const newImageUrls = images.map((image) => URL.createObjectURL(image));
    setImageURLs(newImageUrls);
  }, [images]);

  const onCloseCreateCategory = () => {
    onClose();
    setImageURLs([]); // <=== clear images 🗑️
    setInputCategory(initCategory); // <=== clear input 🗑️
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
      const response = await fetch(
        `${process.env.ENDPOINT}category/update/${isActive}`,
        {
          method: "PATCH",
          body: formData,
          headers: {
            id_token: getToken() as string,
          },
        }
      ).then((res) => {
        try {
          if (Number(res.status) === 200) {
            Swal.fire("Saved!", "", "success");
          } else {
            onCloseCreateCategory();
            Swal.fire("Changes are not saved", "", "error");
          }
        } finally {
          setImageURLs([]); // <=== clear images 🗑️
          fetchDataCategory();
          onCloseCreateCategory();
        }
      });

      return response;
    }
    const response = await fetch(`${process.env.ENDPOINT}category/create`, {
      method: "POST",
      body: formData,
      headers: {
        id_token: getToken() as string,
      },
    }).then((res) => {
      try {
        if (Number(res.status) === 200) {
          Swal.fire("Saved!", "", "success");
        } else {
          onCloseCreateCategory();
          Swal.fire("Changes are not saved", "", "error");
        }
      } finally {
        setImageURLs([]); // <=== clear images 🗑️
        fetchDataCategory();
        onCloseCreateCategory();
      }
    });

    return response;
  }, [inputCategory, headers, images]);

  const loadCategory = React.useCallback(() => {
    fetchDataCategory();
  }, []);

  const onCategoryDetail = useCallback((id: string) => {
    setIsActive(id);
  }, []);

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
            fetchDataCategory();
          }
        });
      }
    });
  }, [isActive]);

  const onClear = () => {
    setIsActive("");
  };

  useEffect(() => {
    loadCategory();
  }, [loadCategory]);

  if (isAPIsLoading) {
    return <div>loading...</div>;
  }

  return (
    <AuthProvider>
      <SidebarPage>
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
        <Flex flexGrow={1} flexDirection={"row"}>
          <div className="w-[50%] flex flex-col">
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
              isActive={isActive}
              data={responseCategory}
              onPressItem={onCategoryDetail}
            />
          </div>
          <div className="flex mx-6 flex-col justify-center">
            <Typography
              title={"your product 👉🏻"}
              size="small"
              className="my-2"
            />
            <Button onClick={onClear} fontSize={12} isDisabled={!isActive}>
              Clear
            </Button>
          </div>
          <div className="flex-1 rounded-md shadow-md border-[1px]"></div>
        </Flex>
      </SidebarPage>
    </AuthProvider>
  );
}

export default Product;
