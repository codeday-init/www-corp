import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { default as Checkbox } from '@codeday/topo/Atom/Input/Checkbox';
import Box from '@codeday/topo/Atom/Box';
import Text from '@codeday/topo/Atom/Text';
import Image from '@codeday/topo/Atom/Image';
import List, { Item as ListItem } from '@codeday/topo/Atom/List';
import { formatInterval } from '../../utils/time';
import ContentfulRichText from '../ContentfulRichText';

export default function ProgramInfoCheck({ program, disabled }) {
  const [isSelected, setIsSelected] = useState(false);
  if (disabled) return <></>;

  return (
    <Box
      cursor={disabled ? 'cursor' : undefined}
      borderWidth={1}
      borderColor={isSelected ? undefined : 'transparent'}
      shadow={isSelected ? 'md' : undefined}
      p={4}
      pt={6}
      pb={2}
    >
      <Checkbox
        alignItems="top"
        value={program.webname}
        isDisabled={disabled}
        variantColor="green"
        onChange={(e) => {
          setIsSelected(e.target.checked);
        }}
      >
        <Box mt={-3} ml={4}>
          <Box fontSize="3xl" fontWeight="bold" mb={4}>
            <Image src={program.logo.url} height="1em" alt="" d="inline" />{' '}
            {program.name}
            {program.virtual && (
              <Box fontWeight="bold" color="red.600" fontSize="md">
                Online volunteer opportunity.
              </Box>
            )}
          </Box>
          <ContentfulRichText json={program.volunteerDetails.json} />
          {program.upcoming.length > 0 && (
          <Box mb={4}>
            <Text bold mb={1}>Upcoming Dates</Text>
            <List styleType="disc" pl={2}>
              {program.upcoming.slice(0, 3).map((event) => (
                <ListItem>
                  {formatInterval(event.startsAt, event.endsAt)}
                </ListItem>
              ))}
            </List>
          </Box>
          )}
        </Box>
      </Checkbox>
    </Box>
  );
}
ProgramInfoCheck.propTypes = {
  program: PropTypes.object.isRequired,
};
