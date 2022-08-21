import React, { useState } from 'react';
import { FormControl, FormLabel, HStack, IconButton, Input, Text } from '@chakra-ui/react';
import { CheckIcon, CloseIcon, EditIcon } from '@chakra-ui/icons';

export const CustomEditible = ({
  value,
  label,
  name,
  onSave,
  type
}: {
  value?: string;
  label: string;
  name: string;
  onSave?: (value: string) => void;
  type: string;
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [internalState, setInternalState] = useState<string | undefined>(value);
  const handleSave = () => {
    onSave && onSave(internalState || '');
    setIsEditing(false);
  };
  const handleCancel = () => {
    setInternalState(value);
    setIsEditing(false);
  };
  const handleEdit = () => {
    setInternalState(value);
    setIsEditing(true);
  };
  return (
    <FormControl>
      <FormLabel>{label}</FormLabel>
      <HStack>
        {isEditing ? (
          <>
            <Input
              value={internalState || ''}
              type={type}
              name={name}
              onChange={(event) => setInternalState(event.target.value)}
            />
            <IconButton
              variant='solid'
              aria-label='save'
              icon={<CheckIcon />}
              onClick={handleSave}
            />
            <IconButton
              variant='solid'
              aria-label='cancel'
              icon={<CloseIcon />}
              onClick={handleCancel}
            />
          </>
        ) : (
          <>
            <Text flex={1}>{value}</Text>
            <IconButton
              variant='ghost'
              aria-label='edit'
              icon={<EditIcon />}
              onClick={handleEdit}
            />
          </>
        )}
      </HStack>
    </FormControl>
  );
};
