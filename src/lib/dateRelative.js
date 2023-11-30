// lib/dateRelative.js
// Format a date to be relative to now.
// I do not think this is used anymore, needs review.

import formatDistanceToNowStrict from "date-fns/formatDistanceToNowStrict";

function distanceToNow(dateTime) {
    return formatDistanceToNowStrict(dateTime, {
        addSuffix: true,
    });
}

export default distanceToNow;
