import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Box, { Grid } from '@codeday/topo/Atom/Box';
import Text, { Heading, Link } from '@codeday/topo/Atom/Text';
import Button from '@codeday/topo/Atom/Button';
import Html from '@codeday/topo/Molecule/Html';
import { DateTime } from 'luxon';
import TimeAgo from 'javascript-time-ago';
import en from 'javascript-time-ago/locale/en';

const SERVER_TIMEZONE = 'America/Los_Angeles';

export default function Event({ event, ...rest }) {
  const [timezone, setTimezone] = useState(SERVER_TIMEZONE);
  const [twasStart, setTwasStart] = useState();
  const [twasEnd, setTwasEnd] = useState();
  useEffect(() => {
    setTimezone(Intl.DateTimeFormat().resolvedOptions().timeZone);
  }, [typeof window, Intl.DateTimeFormat().resolvedOptions().timeZone]);

  useEffect(() => {
    try { TimeAgo.addDefaultLocale(en); } catch (ex) {}
  }, [typeof window]);

  const start = DateTime.fromISO(event.start);
  const end = DateTime.fromISO(event.end);
  const now = DateTime.local();
  const startLocal = start.setZone(timezone);
  const endLocal = end.setZone(timezone);
  const hasStarted = now > startLocal;
  const hasEnded = now > endLocal;

  const [,, type,, title] = event.title.match(/^(((\w+ ?){0,3}): )?(.*)$/);

  let relative = `Starts ${twasStart || ''}`;
  if (hasEnded) relative = `Ended ${twasEnd || ''}`;
  else if (hasStarted) relative = `Ends ${twasEnd || ''}`;

  useEffect(() => {
    if (typeof window === 'undefined') return () => {};
    const interval = setInterval(() => {
      const timeAgo = new TimeAgo('en-US');
      setTwasStart(timeAgo.format(start.toJSDate()));
      setTwasEnd(timeAgo.format(end.toJSDate()));
    }, 1000);
    return () => clearInterval(interval);
  }, [typeof window]);

  return (
    <Box {...rest}>
      <Grid templateColumns="3fr 2fr">
        <Box>
          <Text mb={0} fontWeight="bold">
            {startLocal.toLocaleString(DateTime.DATETIME_MED)}
            {' '}&mdash;{' '}
            {endLocal.toLocaleString(
              startLocal.startOf('day').toMillis() !== endLocal.startOf('day').toMillis()
                ? DateTime.DATETIME_FULL
                : { hour: 'numeric', minute: '2-digit', timeZoneName: 'short' },
            )}{' '}
          </Text>
          <Text>{relative}</Text>
        </Box>
        <Box textAlign="right">
          {type && (
            <Text d="inline-block" p={2} bg="current.border" rounded="sm">{type}</Text>
          )}
        </Box>
      </Grid>
      <Heading as="h2" fontSize="4xl">{title || 'TBA'}</Heading>
      {event.metadata?.test && (
        <Text>Presented by {event.metadata.test}</Text>
      )}
      <Box mt={4}>
        {!hasEnded ? (
          <>
            {event.location && (
              <>
                <Link fontSize="lg" href={event.location} target="_blank" mr={4}>{event.location}</Link>
                <Button as="a" href={event.location} target="_blank" variantColor="blue">Join</Button>
              </>
            )}
          </>
        ) : (
          <>
            <Button
              variantColor="blue"
              as="a"
              href="https://www.youtube.com/c/codeday"
              target="_blank"
            >
                Workshop Recordings
            </Button>
            <Text d="inline-block" ml={4} fontStyle="italic">This workshop has ended.</Text>
          </>
        )}
      </Box>
      <Html mt={8}>{event.description}</Html>
    </Box>
  );
}
Event.propTypes = {
  event: PropTypes.object.isRequired,
};
