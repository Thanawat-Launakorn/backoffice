import Typography from "@/app/component/typography/typography";
import { InputValues } from "@/app/types";
import {
  Box,
  Input,
  Stack,
  Button,
  Drawer,
  Textarea,
  FormLabel,
  DrawerBody,
  DrawerProps,
  DrawerHeader,
  DrawerFooter,
  DrawerContent,
  DrawerOverlay,
  DrawerCloseButton,
} from "@chakra-ui/react";
import Image from "next/image";
import { ChangeEvent, Fragment, useCallback, useRef } from "react";
import { inputCategoryProductProps } from "../page";
type ManageCategoryProductProps = {
  imageURLs: string[];
  onSaveCategoryProduct: () => void;
  onCloseCategoryProduct: () => void;
  drawerProps: Pick<DrawerProps, "isOpen" | "onClose">;
  onChange: (identifier: string, value: string) => void;
  inputCategoryProduct: InputValues<keyof inputCategoryProductProps>;
  onImageChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
};
export default function ManageCategoryProduct({
  imageURLs,
  onChange,
  drawerProps,
  onImageChange,
  inputCategoryProduct,
  onSaveCategoryProduct,
  onCloseCategoryProduct,
}: ManageCategoryProductProps) {
  const { isOpen, onClose } = drawerProps;
  const firstField = useRef<any>();
  const renderImage = useCallback(() => {
    return (
      <Fragment>
        {imageURLs.length < 1 ? (
          <label htmlFor="upload-image" className="cursor-pointer">
            <div className="min-h-[300px] justify-center items-center flex">
              <Typography title="Choose A Photo" color="white" />
            </div>
          </label>
        ) : (
          imageURLs.map((imageSrc) => {
            return (
              <label
                key={imageSrc}
                htmlFor="upload-image"
                className="cursor-pointer"
              >
                <div
                  key={imageSrc}
                  className="min-h-[300px] justify-center items-center flex"
                >
                  <Image
                    src={imageSrc}
                    alt="image-category"
                    width={300}
                    height={300}
                  />
                </div>
              </label>
            );
          })
        )}
      </Fragment>
    );
  }, [imageURLs]);

  return (
    <Drawer
      size={"lg"}
      isOpen={isOpen}
      placement="right"
      initialFocusRef={firstField}
      onClose={onClose}
    >
      <DrawerOverlay />
      <DrawerContent>
        <DrawerCloseButton />
        <DrawerHeader borderBottomWidth="1px">
          Create a new account
        </DrawerHeader>

        <DrawerBody>
          <Stack spacing="24px">
            <Box>
              <FormLabel htmlFor="image">
                <Input
                  multiple
                  type="file"
                  accept="image/*"
                  id="upload-image"
                  onChange={onImageChange}
                />
              </FormLabel>
              {renderImage()}
            </Box>

            <Box>
              <FormLabel htmlFor="name">Name</FormLabel>
              <Input
                ref={firstField}
                id="username"
                placeholder="Please enter name"
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  onChange("name", e.target.value)
                }
                value={inputCategoryProduct.name.value}
              />
            </Box>

            <Box>
              <FormLabel htmlFor="price">Price</FormLabel>
              <Input
                placeholder="Please enter price"
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  onChange("price", e.target.value)
                }
                type="number"
                value={inputCategoryProduct.price.value}
              />
            </Box>

            <Box>
              <FormLabel htmlFor="desc">Description</FormLabel>
              <Textarea
                id="desc"
                rows={10}
                onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
                  onChange("description", e.target.value)
                }
                placeholder="Please enter description..."
                value={inputCategoryProduct.description.value}
              />
            </Box>
          </Stack>
        </DrawerBody>

        <DrawerFooter borderTopWidth="1px">
          <Button variant="outline" mr={3} onClick={onCloseCategoryProduct}>
            Cancel
          </Button>
          <Button colorScheme="green" onClick={onSaveCategoryProduct}>
            Submit
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
