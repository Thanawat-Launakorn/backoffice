import typographyComponent from "@/app/component/typography";
import {
  Button,
  FormControl,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalProps,
  Input,
  Textarea,
} from "@chakra-ui/react";
import Image from "next/image";
import { ChangeEvent, Fragment } from "react";

type ManageCategoryProps = {
  isEdit: boolean;
  inputCategory: any;
  imageURLs: string[];
  isAPIsFail: boolean;
  isAPIsLoading: boolean;
  onSaveCategory: () => void;
  onCloseCreateCategory: () => void;
  modalProps: Pick<ModalProps, "isOpen" | "onClose">;
  onChangeCategory: (identifier: string, value: string) => void;
  onImageChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
};

export default function ManageCategory({
  isEdit,
  imageURLs,
  modalProps,
  isAPIsFail,
  isAPIsLoading,
  inputCategory,
  onImageChange,
  onSaveCategory,
  onChangeCategory,
  onCloseCreateCategory,
}: ManageCategoryProps) {
  const { isOpen, onClose } = modalProps;
  const { Typography } = typographyComponent;
  function getComponent() {
    if (isAPIsLoading) {
      return <>isLoading...</>;
    }

    if (isAPIsFail) {
      return <>isAPIsFail...</>;
    }
    return (
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalContent>
          <ModalHeader>{`${isEdit ? "Edit" : "Create"} Category`}</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <FormControl mt={4}>
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
                          src={isEdit ? inputCategory.image.value : imageSrc}
                          alt="image-category"
                          width={300}
                          height={300}
                        />
                      </div>
                    </label>
                  );
                })
              )}
              <Input
                multiple
                type="file"
                accept="image/*"
                id="upload-image"
                onChange={onImageChange}
              />
            </FormControl>

            <FormControl mt={4}>
              <Input
                placeholder="Category"
                value={inputCategory.category.value}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  onChangeCategory("category", e.target.value)
                }
              />
            </FormControl>

            <FormControl mt={4}>
              <Textarea
                placeholder="Description"
                onChange={(e: ChangeEvent<HTMLTextAreaElement>) => {
                  onChangeCategory("description", e.target.value);
                }}
                value={inputCategory.description.value}
              />
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="green" mr={3} onClick={onCloseCreateCategory}>
              Cancel
            </Button>
            <Button variant="ghost" onClick={onSaveCategory}>
              Save
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    );
  }

  return <Fragment>{getComponent()}</Fragment>;
}
