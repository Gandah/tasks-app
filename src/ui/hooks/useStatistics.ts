import { useEffect, useState } from 'react';

type StatsHistory = (Statistics & {timestamp: string})[]
export function useStatistics(dataPointCount: number) {
  const [value, setValue] = useState<StatsHistory>([]);
  const [generalStats, setGeneralStats] = useState({
    cpuUsage: 0,
    ramUsage: 0,
    storageUsage: 0
  });

  useEffect(() => {
    const unsub = window.electron.subscribeStatistics((stats) => {
      setGeneralStats(stats)
      const statWithTimestamp = {
        ...stats,
        timestamp: new Date().toLocaleTimeString()
      };

      setValue((prev) => {
        const newData = [...prev, statWithTimestamp];
       
        if (newData.length > dataPointCount) {
          newData.shift();
        }

        return newData;
      })}
    );
    return unsub;
  }, []);

  return {
    statsHistory: value,
    generalStats : generalStats
  };
}