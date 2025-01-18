import React from 'react';
import ReactMarkdown from 'react-markdown';
import './MedicalSummary.css';

export const MedicalSummary = ({ summaryText }) => {
  return (
    <div className="medical-summary">
      <ReactMarkdown children={summaryText} />
    </div>
  );
};