import React from 'react';
import { Journey } from '../../data/mockJourneys';
import JourneyCard from './JourneyCard';

interface SearchResultsProps {
  journeys: Journey[];
}

const SearchResults: React.FC<SearchResultsProps> = ({ journeys }) => {
  return (
    <div className="space-y-4">
      {journeys.map((journey) => (
        <JourneyCard key={journey.id} journey={journey} />
      ))}
    </div>
  );
};

export default SearchResults;