import { GetCategoryProductResponse } from "@/app/models/response_body/getCategoryProductResponseBody";
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  Heading,
  Stack,
  Text,
} from "@chakra-ui/react";
import Image from "next/image";

type ItemCategoryProductProps = {
  data: GetCategoryProductResponse;
  onDelete: (id: number) => void;
};

export default function ItemCategoryProduct({
  data,
  onDelete,
}: ItemCategoryProductProps) {
  const { id, image, description, name, price } = data;

  return (
    <Card
      direction={{ base: "column", sm: "row" }}
      overflow="hidden"
      variant="outline"
      margin={2.5}
      height={200}
    >
      <div className="w-[30%] flex justify-center items-center">
        <Image
          width={100}
          height={100}
          objectFit="contain"
          src={image}
          alt="Caffe Latte"
        />
      </div>

      <Stack>
        <CardBody>
          <Heading size="md">{name}</Heading>

          <Text py="2">{description}</Text>
        </CardBody>

        <CardFooter>
          <Button
            variant="solid"
            colorScheme="red"
            onClick={() => onDelete(id)}
          >
            Delete
          </Button>
        </CardFooter>
      </Stack>
    </Card>
  );
}
