import React from 'react';
import { LoadingScreen } from './AllStates.style';
import { useProjections } from 'utils/model';
import { STATES } from 'enums';
import { ZoneChartWrapper } from 'components/Charts/ZoneChart.style';
import Chart from 'components/Charts/Chart';
import {
  optionsRt,
  optionsHospitalUsage,
  optionsPositiveTests,
} from 'components/Charts/zoneUtils';
import { getChartData } from 'components/LocationPage/ChartsHolder';

function AllStates() {
  return Object.keys(STATES).map(stateId => (
    <State key={stateId} stateId={stateId} />
  ));
}

function State({ stateId }) {
  const projections = useProjections(stateId);

  // Projections haven't loaded yet
  if (!projections) {
    return <LoadingScreen></LoadingScreen>;
  }
  const stateName = projections.stateName;

  const projection = projections.primary;

  // TODO(michael): This should probably be some function of today's date?
  const endDate = new Date('2020-05-15');

  const { rtRangeData, testPositiveData, icuUtilizationData } = getChartData(
    projection,
  );

  return (
    <>
      <h3>{stateName}</h3>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <div style={{ width: '32%', height: '450px' }}>
          {rtRangeData && (
            <ZoneChartWrapper>
              <Chart options={optionsRt(rtRangeData, endDate)} />
            </ZoneChartWrapper>
          )}
        </div>
        <div style={{ width: '32%', height: '450px' }}>
          {testPositiveData && (
            <ZoneChartWrapper>
              <Chart
                options={optionsPositiveTests(testPositiveData, endDate)}
              />
            </ZoneChartWrapper>
          )}
        </div>
        <div style={{ width: '32%', height: '450px' }}>
          {icuUtilizationData && (
            <ZoneChartWrapper>
              <Chart
                options={optionsHospitalUsage(icuUtilizationData, endDate)}
              />
            </ZoneChartWrapper>
          )}
        </div>
      </div>
    </>
  );
}

export default AllStates;
