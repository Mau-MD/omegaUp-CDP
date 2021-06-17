import * as React from "react";
import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Button,
  FormControl,
  FormHelperText,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  toast,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import { useStoreActions, useStoreState } from "../../Redux/Store";

interface PropTypes {
  isOpen: boolean;
  onClose: () => void;
  groupName: string;
}

interface IData {
  name: string;
  points: number;
}

const CasesEditGroup = ({ isOpen, onClose, groupName }: PropTypes) => {
  const caseState = useStoreState((state) => state.cases.cases);
  const updateState = useStoreActions((actions) => actions.cases.updateCase);

  const toast = useToast();

  function editCase(data: IData) {
    // TODO verificar que no se duplique el nombre del grupo

    // let isValid = true;
    // caseState.forEach((group) => {
    //   if (group.name === data.name) {
    //     isValid = false;
    //     return;
    //   }
    // });
    //
    // if (!isValid) {
    //   toast({
    //     title: "Nombre repetido",
    //     description: "No puedes tener dos grupos con el mismo nombre",
    //     status: "error",
    //   });
    //   return;
    // }

    updateState({
      oldName: groupName,
      newName: data.name,
      points: data.points,
    });
    console.log("here");
    onClose();
  }

  const { register, handleSubmit } = useForm({
    defaultValues: {
      name: `${groupName}`,
      points: `-1`,
    },
  });

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Editar Grupo</ModalHeader>
        <ModalCloseButton />
        <form onSubmit={handleSubmit(editCase)} autoComplete={"off"}>
          <ModalBody>
            <FormControl isRequired>
              <FormLabel> Nombre del caso</FormLabel>
              <Input {...register("name")} />
            </FormControl>
            <FormControl mt={4}>
              <FormLabel> Puntaje del grupo (opcional)</FormLabel>
              <Input
                type={"number"}
                {...register("points", { min: 0, max: 100 })}
              />
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button variant={"ghost"} mr={3} onClick={onClose}>
              Close
            </Button>
            <Button colorScheme="green" type={"submit"}>
              Editar Caso
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
};

export default CasesEditGroup;
