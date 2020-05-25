import React from 'react';
import { ListGroup } from 'react-bootstrap';

import {
  getPollutionQuestion,
  getPollutionString,
  cleanestCities,
} from '../../utils/utils';
import {
  resultsPage,
} from './ResultsPage.module.css';

const scoreTotal = (accumulator, currentValue) => accumulator + currentValue.score;

export default ({ results }) => (
  <div className={resultsPage}>
    <h1>
      {`Your Climate IQ is `}
      <span style={{ fontWeight: 'bold' }}>{`${150 - Math.round(results.reduce(scoreTotal, 0) / results.length)}`}</span>
    </h1>
    <ListGroup>
      {results.map((result, i) => (
        <ListGroup.Item
          variant={result.score > 70 ? 'danger' : result.score > 20 ? 'warning' : 'success'}
          key={i}
        >
          <h3 style={{ fontWeight: 'bold' }}>
            {getPollutionQuestion(result.stage)}
          </h3>
          <h5>
            <span style={{ fontWeight: 'bold' }}>{result.name}</span>
            {` (${getPollutionString(result.stage, result.data[result.stage])}) was `}
            <span style={{ fontWeight: 'bold' }}>{`${Math.round(result.score)}%`}</span>
            {' worse than the best city, '}
            <span style={{ fontWeight: 'bold' }}>{cleanestCities[result.stage].name}</span>
            {` (${getPollutionString(result.stage, cleanestCities[result.stage].value)})`}
          </h5>
        </ListGroup.Item>
      ))}
    </ListGroup>
  </div>
);
