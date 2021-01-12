import React from 'react';
import { format } from 'date-fns';

/**
 * Converts epoch time to Date.
 * @param {string} epoch time in ms
 * @returns date
 */
export function epochToDate(epoch) {
    const d = new Date(0);
    d.setUTCMilliseconds(epoch);
    return d;
}

/**
 * Returns a time only if date is within the past 24 hours.
 * Otherwise, return date + time string.
 * @param {Date} date
 */
export function formatTimeWithin24Hours(date) {
    const is24Hours = Date.now() - date < 24 * 60 * 60 * 1000;
    const formatString = is24Hours ? 'HH:mm' : 'MMM dd, yyyy / HH:mm';
    return format(date, formatString);
}

/**
 * Extracts title
 * @param {string} content markdown text to match
 * @param {number} fallback value to return if no match - default -1
 * @param {number} max maximum number to return
 */
export function findEndOfMdTitleIndex(content, fallback = -1) {
    const titleRegex = /^#+ .*\n/;
    const split = content.match(titleRegex);
    return split == null ? fallback : split.index + split[0].length;
}

/**
 * Process notes from API into friendlier JavaScript objects
 * @param {object[]} notes
 */
export function processAndSortNotes(notes = []) {
    return notes
        .map((item) => ({
            ...item,
            content: unescape(item.content),
            created_date: epochToDate(item.created_date),
            updated_date: epochToDate(item.updated_date)
        }))
        .sort((a, b) => b.updated_date - a.updated_date);
}

/**
 * Converts notes in state (after processAndSortNotes) into List items.
 * @param {object[]} notes
 */
export function notesToList(notes) {
    function formatHeaderContent(str) {
        let header;
        let content;
        const endOfTitle = findEndOfMdTitleIndex(str);
        if (endOfTitle) {
            header = <b className="truncate"> {str.substring(0, endOfTitle)} </b>;
            content = <span className="truncate"> {str.substring(endOfTitle)} </span>;
        } else {
            header = <span className="truncate"> {str} </span>;
        }
        return { header, content };
    }

    return notes.map((note) => ({
        key: note.note_id,
        headerMedia: formatTimeWithin24Hours(note.updated_date),
        ...formatHeaderContent(note.content)
    }));
}
