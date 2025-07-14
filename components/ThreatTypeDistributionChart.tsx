import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, LabelList } from 'recharts';
import { THREAT_TYPE_DATA } from '../constants';

const COLORS = ['#3b82f6', '#60a5fa', '#93c5fd', '#bfdbfe', '#dbeafe'];

interface ChartProps {
    onBarClick: (threatType: string) => void;
}

const ThreatTypeDistributionChart: React.FC<ChartProps> = ({ onBarClick }) => {
  const total = THREAT_TYPE_DATA.reduce((sum, entry) => sum + entry.value, 0);

  const renderCustomizedLabel = (props: any) => {
    const { x, y, width, value } = props;
    const percentage = ((value / total) * 100).toFixed(0);
    return (
      <text x={x + width + 5} y={y + 15} fill="#94a3b8" textAnchor="start" fontSize={12}>
        {`${percentage}%`}
      </text>
    );
  };
  
  return (
    <div style={{ width: '100%', height: 300 }}>
      <ResponsiveContainer>
        <BarChart
          data={THREAT_TYPE_DATA}
          layout="vertical"
          margin={{
            top: 5,
            right: 40,
            left: 20,
            bottom: 5,
          }}
        >
          <XAxis type="number" hide />
          <YAxis
            type="category"
            dataKey="name"
            stroke="#94a3b8"
            fontSize={12}
            width={100}
            tickLine={false}
            axisLine={false}
          />
          <Tooltip
            cursor={{ fill: '#334155' }}
            contentStyle={{
              backgroundColor: '#1e293b',
              borderColor: '#334155',
              color: '#f8fafc',
            }}
            labelStyle={{ color: '#94a3b8' }}
            formatter={(value: number) => [value, 'Count']}
          />
          <Bar dataKey="value" barSize={20} radius={[0, 4, 4, 0]} onClick={(data) => onBarClick(data.name)}>
            {THREAT_TYPE_DATA.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} cursor="pointer"/>
            ))}
            <LabelList dataKey="value" content={renderCustomizedLabel} />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ThreatTypeDistributionChart;