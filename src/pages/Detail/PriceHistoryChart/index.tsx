import { Flex } from '@chakra-ui/react';
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

interface PriceHistoryProps {
  PriceDate:[]
}

const PriceHistoryChart = ({
  PriceDate,
}: PriceHistoryProps) => (
  <ResponsiveContainer height={246} width="100%">
    <AreaChart
      data={PriceDate}
    >
      <defs>
        <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#F8F9FA" stopOpacity={0.8} />
          <stop offset="70%" stopColor="#000000" stopOpacity={0} />
        </linearGradient>
      </defs>
      <CartesianGrid height={205} stroke="#E5E5E5" vertical={false} />
      <XAxis
        dataKey="date"
        axisLine={false}
        tickLine={false}
        stroke="#999999"
        interval={0}
        style={
            {
              width: '100%',
              height: '40px',
              display: 'flex',
              flexFlow: 'row',
              justifyContent: 'center',
              alignItems: 'center',
              background: '#F8F9FA',
              fontSize: 12,
              color: '#999999',
              fontWeight: 400,
              fontFamily: 'TTHoves-Regular, TTHoves',
              lineHeight: '14px',
            }
        }
      />
      <YAxis
          // TODO: Domain should be dynamically calculated
        dataKey="price"
        mirror
        axisLine={false}
        tickLine={false}
        interval={0}
        domain={[0, 'dataMax']}
        fill="#F8F9FA"
        stroke="#999999"
        tickMargin={-5}
        style={
            {
              height: '205px',
              paddingTop: '20px',
              background: '#000000',
              fontSize: 12,
              color: '#999999',
              fontWeight: 400,
              fontFamily: 'TTHoves-Regular, TTHoves',
              lineHeight: '14px',
            }
        }
      />
      <Tooltip />
      <Area
        name="price"
        type="linear"
        dataKey="price"
        stroke={colors.text.gray}
        fill="url(#colorUv)"
      />
    </AreaChart>
  </ResponsiveContainer>
);

export default PriceHistoryChart;
