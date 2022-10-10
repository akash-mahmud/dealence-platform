import React, { PureComponent } from 'react';
import { ResponsiveContainer, PieChart, Pie, Legend, Cell } from 'recharts';
import { useTranslation } from 'react-i18next';


export default function PieInvestments() {
   const { t } = useTranslation();
    const data = [
    { name: t('Real_estate'), value: 1025000 },
    { name: t('Catering_Sector'), value: 120000 },
    { name: t('Low_Risk'), value: 571496 },
      { name: t('High_Risk'), value: 11000 },
    ];
    const COLORS = ["#b6d9fc", "#006dc1", "#0041C1", "#072968"];

    return (
        <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer>
                <PieChart>
                    <Pie
                        data={data}
                        labelLine={false}
                        label={false}
                        outerRadius={70}
                        innerRadius={40}
                        fill="#8884d8"
                        dataKey="value"
                    >
                        {data.map((entry, index) => (
                            <Cell className='chartCell' key={`cell-${index}`} stroke={COLORS[index % COLORS.length]} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Pie>
                    <Legend layout="horizontal" verticalAlign="bottom" align="center" />

                </PieChart>
            </ResponsiveContainer>
        </div>
    );
}
