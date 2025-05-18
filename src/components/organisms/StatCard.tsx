import { Card, CardContent, CardHeader, CardTitle } from '@/components/atoms/card';

import { ReactNode } from 'react';

interface StatCardProps {
  title: string | ReactNode;
  value: string;
}

export const StatCard = ({ title, value }: StatCardProps) => {
  return (
    <Card className={`shadow-sm border-olive-100`}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <CardTitle className="text-base font-medium text-gray-400">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-medium text-black">
          {value === '0 min' ? '--:--' : value}
        </div>
      </CardContent>
    </Card>
  );
};
