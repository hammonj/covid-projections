import React from 'react';
import { isUndefined as _isUndefined } from 'lodash';
import { extent as d3extent } from 'd3-array';
import { scaleLinear, scaleTime } from '@vx/scale';
import { Group } from '@vx/group';
import { RectClipPath } from '@vx/clip-path';
import { AxisBottom, AxisLeft } from '@vx/axis';
import { GridRows } from '@vx/grid';
import AreaRangeChart from './AreaRangeChart';
import LineChart from './LineChart';
import { RegionChartWrapper } from './RegionChart.style';
import { calculateYTicks, formatDecimal, last, randomizeId } from './utils';
import { Zones } from '../../enums/zones';

const isDefined = (d: any): boolean => !_isUndefined(d);

const RegionChart = ({
  width = 600,
  height = 400,
  marginLeft = 40,
  marginTop = 10,
  marginRight = 50,
  marginBottom = 40,
  data,
  x = d => d.x,
  y = d => d.y,
  y0,
  y1,
  zones,
}: {
  width: number;
  height: number;
  marginLeft: number;
  marginTop: number;
  marginRight: number;
  marginBottom: number;
  data: any[];
  x: (d: any) => Date;
  y: (d: any) => number;
  y0?: (d: any) => number;
  y1?: (d: any) => number;
  zones: Zones;
}) => {
  const innerWidth = width - marginLeft - marginRight;
  const innerHeight = height - marginTop - marginBottom;

  // TODO(@pnavarrc) - Fix the TS warning here (min, max could be undefined)
  const [minX, maxX] = d3extent(data, x);
  const xScale = scaleTime({
    domain: [minX, maxX],
    range: [0, innerWidth],
  });

  const [minY, maxY] = d3extent(data, y);
  const yScale = scaleLinear({
    domain: [minY, maxY],
    range: [innerHeight, 0],
    tickFormat: formatDecimal,
  });

  // Element IDs should be unique in the DOM
  const clipPathId = randomizeId('chart-clip-path');
  const yTicks = calculateYTicks(minY, maxY, zones);

  // Current Value Annotation
  const isValidPoint = (d: any): boolean => isDefined(x(d)) && isDefined(y(d));
  const lastDataPoint = last(data.filter(isValidPoint));
  const lastDataY = y(lastDataPoint);

  return (
    <RegionChartWrapper>
      <svg className="chart chart--region" width={width} height={height}>
        <RectClipPath id={clipPathId} width={innerWidth} height={innerHeight} />
        <Group left={marginLeft} top={marginTop}>
          <Group clipPath={`url(#${clipPathId})`}>
            <AreaRangeChart
              data={data}
              x={d => xScale(x(d))}
              y0={d => (y0 ? yScale(y0(d)) : y0)}
              y1={d => (y1 ? yScale(y1(d)) : y1)}
            />
            <LineChart
              data={data}
              x={d => xScale(x(d))}
              y={d => yScale(y(d))}
            />
            <GridRows
              className="chart__grid chart__grid--zones"
              scale={yScale}
              width={innerWidth}
              tickValues={yTicks}
            />
          </Group>
          <text
            className="chart-annotation chart-annotation--current-value"
            x={innerWidth}
            y={yScale(lastDataY)}
            dx={5}
          >
            {formatDecimal(lastDataY)}
          </text>
          <AxisBottom
            axisClassName="chart__axis"
            top={innerHeight}
            scale={xScale}
            numTicks={7}
          />
          <AxisLeft
            axisClassName="chart__axis"
            scale={yScale}
            tickValues={yTicks}
            hideAxisLine
            hideTicks
          />
        </Group>
      </svg>
    </RegionChartWrapper>
  );
};

export default RegionChart;
