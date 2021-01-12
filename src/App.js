import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Notepad from './Notepad';
import './App.css';

export default function App() {
    return (
        <Router>
            <div className="App">
                {/* <nav> <Link to="/">Home</Link> </nav> */}
                <Switch>
                    <Route path="/notes">
                        <Notepad />
                    </Route>
                    <Route path="/textcompare">
                        <Notepad />
                    </Route>
                    <Route path="/">
                        <Home />
                    </Route>
                </Switch>
            </div>
        </Router>
    );
}

function Home() {
    return (
        <div style={{ fontFamily: 'Century Schoolbook', margin: '1rem', color: '#808080' }}>
            <h1>APPS.TRINH.ME</h1>
        </div>
    );
}
