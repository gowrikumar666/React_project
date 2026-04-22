import React from 'react';
import Dashboard from './Dashboard';
import ListComponent from './ListComponent';
import IndiaComponent from './IndiaComponent';

export default function AllInOne() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 32, padding: 24 }}>
      <Dashboard />
      <ListComponent />
      <IndiaComponent />
    </div>
  );
}
