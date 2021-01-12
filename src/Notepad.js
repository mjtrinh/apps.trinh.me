import React, { useState, useEffect } from 'react';
import { Alert, Button, List } from '@fluentui/react-northstar';
import { AddIcon, SyncIcon, TrashCanIcon } from '@fluentui/react-icons-northstar';
import MDEditor from '@uiw/react-md-editor';
import axios from 'axios';

import { notesToList, processAndSortNotes } from './utils/parsing';
import { API_GW_URL, colors } from './constants';
import './App.css';

const NOTES_API_URL = `${API_GW_URL}/notes`;

export default function Notepad() {
    const [syncing, setSyncing] = useState(false);
    const [apiError, setApiError] = useState();
    const [updateTime, setUpdateTime] = useState(Date.now());

    const [notes, setNotes] = useState([]);
    const [selectedId, setSelectedId] = useState();
    const [editorValue, setEditorValue] = useState();

    const selectedIndex = notes.findIndex((item) => item.note_id === selectedId);
    const selectedNote = notes[selectedIndex];

    useEffect(() => {
        async function fetchData() {
            setSyncing(true);
            try {
                const result = await axios.get(NOTES_API_URL);
                setNotes(processAndSortNotes(result.data.notes));
                setApiError(null);
                setSyncing(false);
            } catch (err) {
                setApiError(err);
                setSyncing(false);
            }
        }
        fetchData();
    }, [updateTime]);

    async function handleNotesApi(action) {
        setSyncing(true);
        try {
            if (action === 'create') {
                await axios.post(NOTES_API_URL);
            } else if (action === 'update') {
                await axios.put(`${NOTES_API_URL}/${selectedId}`, {
                    content: escape(editorValue)
                });
            } else if (action === 'delete') {
                await axios.delete(`${NOTES_API_URL}/${selectedId}`);
            }
            setUpdateTime(Date.now());
        } catch (err) {
            setApiError(err.toString());
            setSyncing(false);
        }
    }

    function handleListClick(i) {
        setSelectedId(notes[i].note_id);
        setEditorValue(notes[i].content);
    }

    function renderAbout(note) {
        if (!note || !note.created_date || !note.updated_date) return null;
        return (
            <>
                <div> Created at: {note.created_date.toString()} </div>
                <div> Updated at: {note.updated_date.toString()} </div>
            </>
        );
    }

    function renderApiError() {
        if (!apiError) return null;
        return <Alert content={String(apiError)} variables={{ urgent: true }} dismissible />;
    }

    return (
        <div>
            <h1>Notes</h1>

            {renderApiError()}

            <div style={{ margin: '2rem 1rem 1rem 1rem' }}>
                <Button
                    fluid
                    icon={<AddIcon style={{ color: colors.illuminating }} />}
                    content="New note"
                    onClick={() => handleNotesApi('create')}
                    disabled={syncing}
                    style={{
                        height: '3rem',
                        color: '#111111',
                        borderColor: colors.illuminating
                    }}
                />
            </div>

            <List
                selectable
                selectedIndex={selectedIndex}
                onSelectedIndexChange={(e, newProps) => handleListClick(newProps.selectedIndex)}
                items={notesToList(notes)}
                style={{ height: '40%', overflowY: 'scroll' }}
            />

            {selectedId ? (
                <div style={{ margin: '3rem 1rem' }}>
                    <MDEditor key={selectedId} value={editorValue} onChange={setEditorValue} />
                    <br /> <br />
                    <Button
                        content="Save"
                        icon={<SyncIcon />}
                        onClick={() => handleNotesApi('update')}
                        disabled={syncing}
                        style={{
                            marginRight: '1rem',
                            backgroundColor: colors.illuminating,
                            color: '#404040'
                        }}
                        primary
                    />
                    <Button
                        icon={<TrashCanIcon />}
                        content="Delete"
                        onClick={() => handleNotesApi('delete')}
                        disabled={syncing}
                    />
                </div>
            ) : null}

            {renderAbout(selectedNote)}
        </div>
    );
}

// F5DF4D
// 959A9C
