import React, { FC } from 'react';
import {
  Modal,
  ModalContent,
  ModalOverlay,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  useDisclosure,
  Image,
  Text,
} from '@chakra-ui/react';
import {
  error, processing, prompt, success, warning,
} from '../../assets/icons';
import { Colors } from '../../constants';

type ModalProps = {
  isOpen: boolean,
  onClose: () => void,
  title: string,
  message: string,
  type: 'success' | 'error' | 'processing' | 'warning' | 'prompt'
  isCloseable: boolean
}

const iconMap = {
  success: success.default,
  error: error.default,
  processing: processing.default,
  warning: warning.default,
  prompt: prompt.default,
};

const MyModal: FC<ModalProps> = ({
  isOpen, message, type, isCloseable, title, onClose,
}) => (
  <Modal isOpen={isOpen} onClose={onClose}>
    <ModalOverlay />
    <ModalContent w="400px" h="90px" p="20px">
      <ModalHeader p="0px">
        <Image display="inline-block" src={iconMap[type]} w="20px" h="20px" />
        <Text ml="10px" display="inline-block" fontSize="16">{title}</Text>
      </ModalHeader>
      {isCloseable && <ModalCloseButton h="12px" w="12px" mr="20px" mt="20px" color={Colors.Gray} />}
      <ModalBody>
        <Text ml="10px" display="inline-block" fontSize="14">
          {' '}
          {message}
        </Text>
      </ModalBody>
    </ModalContent>
  </Modal>
);

export default MyModal;
