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
import { ChangeEvent } from "react";

type CreateCategoryProps = {
  modalProps: Pick<ModalProps, "isOpen" | "onClose">;
  imageURLs: string[];
  onImageChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onChangeCategory: (identifier: string, value: string) => void;
  inputCategory: any;
  onCloseCreateCategory: () => void;
  onSaveCategory: () => void;
};

export default function CreateCategory({
  modalProps,
  imageURLs,
  inputCategory,
  onChangeCategory,
  onCloseCreateCategory,
  onImageChange,
  onSaveCategory,
}: CreateCategoryProps) {
  const { Typography } = typographyComponent;
  const { isOpen, onClose } = modalProps;
  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalContent>
        <ModalHeader>Create Category</ModalHeader>
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
            <Input
              id="upload-image"
              type="file"
              multiple
              accept="image/*"
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
