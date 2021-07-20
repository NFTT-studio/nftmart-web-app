import React from 'react';
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  AreaChart,
  Area,
  ResponsiveContainer,
} from 'recharts';
import colors from '../../../themes/colors';

const data = [
  {
    name: '06/01',
    uv: 0,
    pv: 0,
    amt: 0,
  },
  {
    name: '06/02',
    uv: 3000,
    pv: 1398,
    amt: 2210,
  },
  {
    name: '06/03',
    uv: 2000,
    pv: 9800,
    amt: 2290,
  },
  {
    name: '06/04',
    uv: 2780,
    pv: 3908,
    amt: 2000,
  },
  {
    name: '06/05',
    uv: 1890,
    pv: 4800,
    amt: 2181,
  },
  {
    name: '06/06',
    uv: 2390,
    pv: 3800,
    amt: 2500,
  },
  {
    name: '06/07',
    uv: 3490,
    pv: 4300,
    amt: 2100,
  },
];

const PriceHistoryChart = () => (
  <ResponsiveContainer height={245} width="100%">
    <AreaChart
      data={data}

    >
      <defs>
        <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#F8F9FA" stopOpacity={0.8} />
          <stop offset="95%" stopColor="#000000" stopOpacity={0} />
        </linearGradient>
      </defs>
      <CartesianGrid stroke="#e6e6e6" vertical={false} fill="#F8F9FA" />
      <XAxis
        dataKey="name"
        axisLine={false}
        tickLine={false}
        stroke="#999999"
        tickMargin={10}
      />
      <YAxis
          // TODO: Domain should be dynamically calculated
        domain={[(dataMin: number) => Math.abs(dataMin) - 500, (dataMax: number) => dataMax * 2]}
        axisLine={false}
        tickLine={false}
        fill="#F8F9FA"
        stroke="#999999"
      />
      <Tooltip />
      <Area
        name="price"
        type="monotone"
        dataKey="uv"
        stroke={colors.text.gray}
        strokeWidth={2}
        fillOpacity={1}
        fill="url(#colorUv)"
      />
    </AreaChart>
  </ResponsiveContainer>
);

export default PriceHistoryChart;
