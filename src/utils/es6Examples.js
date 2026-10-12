export let activeTrack = 'Track 04';

export const APP_NAME = 'RailGuard AI';

export const calculateRisk = (confidence) =>
  confidence >= 90
    ? 'Critical'
    : confidence >= 70
      ? 'High'
      : 'Medium';

export const buildMessage = (objectName, confidence) =>
  `${objectName} detected with ${confidence}% confidence.`;

export const getIncidentSummary = ({
  objectName,
  track,
  confidence,
}) => ({
  objectName,
  track,
  confidence,
});

export const addTag = (incident, tag) => ({
  ...incident,
  tags: [...(incident.tags ?? []), tag],
});

export const joinTags = (...tags) => tags.join(', ');

export const getOpenCount = (items) =>
  items.filter(({ status }) => status === 'Open').length;
