import React, { FC, useState } from 'react';
import {
  Stack,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverArrow,
  PopoverBody,
  Button,
  Text,
  Image,
  Flex,
} from '@chakra-ui/react';
import {
  IoMdArrowDropdown,
  IoMdArrowDropup,
} from '../../../assets/images';

type TimeByProps = {
  selectedTime: string,
  setSelectedTime: React.Dispatch<React.SetStateAction<string>>
}

const TimeBy: FC<TimeByProps> = ({ selectedTime, setSelectedTime }) => {
  const [opening, setOpening] = useState(false);
  const Time = [
    { key: 'seven', value: '过去 7天 ' },
    { key: 'recently_sold', value: '过去 14 天' },
    { key: 'thirty', value: '过去 30 天' },
    { key: 'sixty', value: '过去 60 天' },
    { key: 'ninety', value: '过去 90 天' },
    { key: 'year', value: '去年' },
  ];

  const handleSelect = (key: string) => {
    setSelectedTime(key);
    setOpening(false);
  };

  const renderButton = (time: { key: string, value: string }) => (
    <Button
      display="flex"
      justifyContent="flex-start"
      key={time.value}
      variant="ghost"
      fontSize="14px"
      fontFamily="TTHoves-Regular, TTHoves"
      fontWeight="400"
      color="#191A24"
      onClick={() => handleSelect(time.key)}
    >
      {time.value}
    </Button>
  );

  return (
    <Popover
      placement="bottom"
      size="sm"
      variant="menu"
      isOpen={opening}
      onOpen={() => setOpening(true)}
      onClose={() => setOpening(false)}
    >
      <PopoverTrigger>
        <Stack
          minWidth="140px"
          height="40px"
          background="#FFFFFF"
          borderRadius="4px"
          border="1px solid #E5E5E5"
          direction="row"
          cursor="pointer"
          alignItems="center"
          justifyContent="space-between"
          spacing={0}
          fontSize="14px"
          fontFamily="PingFangSC-Regular, PingFang SC"
          fontWeight="400"
          color="#191A24"
          lineHeight="14px"
        >
          <Text m="14px">{Time.find((s) => s.key === selectedTime)?.value}</Text>
          <Flex
            width="54px"
            height="40px"
            background="#F4F4F4"
            borderRadius="0px 4px 4px 0px"
            border="1px solid #E5E5E5"
            justifyContent="center"
            alignItems="center"
          >
            {opening ? (
              <Image
                display="inline-block"
                width="12px"
                height="12px"
                src={IoMdArrowDropup.default}
              />
            ) : (
              <Image
                display="inline-block"
                width="12px"
                height="12px"
                src={IoMdArrowDropdown.default}
              />
            )}
          </Flex>
        </Stack>
      </PopoverTrigger>
      <PopoverContent width="" _focus={{ boxShadow: 'none' }}>
        <PopoverArrow />
        <PopoverBody display="flex" justifyContent="center">
          <Stack
            paddingY={2}
          >
            {Time.map(renderButton)}
          </Stack>
        </PopoverBody>
      </PopoverContent>
    </Popover>
  );
};

export default TimeBy;
