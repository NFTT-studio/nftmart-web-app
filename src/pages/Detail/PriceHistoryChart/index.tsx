/* eslint-disable no-new-wrappers */
import { Flex } from '@chakra-ui/react';
import React, { useEffect } from 'react';
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
import { renderNmtNumberText } from '../../../components/Balance';
import { NumberToString, formatNum } from '../../../utils/format';

interface PriceHistoryProps {
  PriceDate:[]
}

const PriceHistoryChart = ({
  PriceDate,
}: PriceHistoryProps) => {
  const add0 = (m) => (m < 10 ? `0${m}` : m);
  const format = (shijianchuo) => {
    const times = new Date(shijianchuo);
    const y = times.getFullYear();
    const m = times.getMonth() + 1;
    const d = times.getDate();
    const h = times.getHours();
    const mm = times.getMinutes();
    const s = times.getSeconds();
    // return `${y}-${add0(m)}-${add0(d)} ${add0(h)}:${add0(mm)}:${add0(s)}`;
    return `${add0(m)}/${add0(d)}`;
  };
  const PriceDateone = JSON.parse(JSON.stringify(PriceDate));
  PriceDateone.forEach((item) => {
    const num = Number(formatNum(NumberToString(item.price)));
    // item.price = Number(num);
    // item.date = format(item.date);
    item.date = format(item.date);
    item.price = num;
  });
  // useEffect(() => {

  // }, []);
  return (
    <ResponsiveContainer height={246} width="100%">
      <AreaChart
        data={PriceDateone}
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
          padding={{
            left: 15,
            right: 15,
          }}
          style={
            {
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
};

export default PriceHistoryChart;
