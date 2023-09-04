import formatDistanceToNowStrict from 'date-fns/formatDistanceToNowStrict';

function distanceToNow(dateTime) {
  return formatDistanceToNowStrict(dateTime, {
    addSuffix: true,
  });
}

export default distanceToNow;
