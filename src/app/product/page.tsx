"use client";
import tableComponent from "../component/table";
import layoutComponent from "../component/layout";
import authProvider from "../provider/auth";
import "../asset/css/input.css";
import { Button, useDisclosure } from "@chakra-ui/react";
import React, { useCallback, useEffect, useState } from "react";
import { InputValues } from "../types";
import { useAtomValue, useSetAtom } from "jotai";
import headerAtomService from "../atom/headers";
import Swal from "sweetalert2";
import CreateCategory from "./component/createCategory";
import { storage } from "../helpers/storage";
import getCategoryAtomService from "../atom/category/getCategoryAtomService";
import { ColumnType } from "../component/table/table";
import { GetCategoryResponse } from "../models/response_body/getCategoryResponseBody";
import { Page } from "../component/layout/page";

type inputCategoryProps = {
  image: string;
  category: string;
  description: string;
};

function Product() {
  const { getToken } = storage;
  const { TableApp } = tableComponent;
  const { AuthProvider } = authProvider;
  const { SidebarPage } = layoutComponent;
  const [images, setImages] = useState<File[]>([]);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [imageURLs, setImageURLs] = useState<string[]>([]);
  const headers = useAtomValue(headerAtomService.getHeader);
  const fetchDataCategory = useSetAtom(getCategoryAtomService.fetchData);
  const responseCategory = useAtomValue(getCategoryAtomService.response);
  const isLoadingCategory = useAtomValue(getCategoryAtomService.isLoading);

  const initCategory: InputValues<keyof inputCategoryProps> = {
    image: { value: "" },
    category: { value: "" },
    description: { value: "" },
  };
  const [inputCategory, setInputCategory] =
    useState<InputValues<keyof inputCategoryProps>>(initCategory);

  const onImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files) return;
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

    formData.append("image", images[0]);
    formData.append("category", inputCategory.category.value);
    formData.append("description", inputCategory.description.value);
    const response = await fetch(`${process.env.ENDPOINT}category/create`, {
      method: "POST",
      body: formData,
      headers: {
        id_token: getToken() as string,
      },
    }).then((res) => {
      if (Number(res.status) === 200) {
        fetchDataCategory();
        onCloseCreateCategory();
        Swal.fire("Saved!", "", "success");
      } else {
        onCloseCreateCategory();
        Swal.fire("Changes are not saved", "", "error");
      }
    });

    return response;
  }, [inputCategory, headers, images]);

  const loadCategory = React.useCallback(() => {
    fetchDataCategory();
  }, []);

  useEffect(() => {
    loadCategory();
  }, [loadCategory]);

  const columns: ColumnType<GetCategoryResponse>[] = [
    { id: "id", accessor: "id", header: "id", type: "text" },
    { id: "image", accessor: "image", header: "Image", type: "image" },
    { id: "category", accessor: "category", header: "Category", type: "text" },
    {
      id: "description",
      accessor: "description",
      header: "Description",
      type: "text",
    },
  ];

  return (
    // 👉🏻 client component
    <AuthProvider>
      <SidebarPage>
        <CreateCategory
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
        <Button onClick={onOpen} mb={5} float={"right"}>
          Create Category
        </Button>

        {/* 👉🏻 server component */}
        <TableApp<GetCategoryResponse>
          data={responseCategory}
          columns={columns}
        />
      </SidebarPage>
    </AuthProvider>
  );
}

export default Product;
