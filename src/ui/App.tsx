import { useEffect, useMemo, useRef, useState } from 'react'
import reactLogo from './assets/react.svg'
import './App.css'
import { BaseChart } from './BaseChart';
import { useStatistics } from './hooks/useStatistics';
import { Chart } from './Chart';
import SimpleDialog from './components/Dialog';
import FileUploader from './components/Uploader';
import { formatPercent } from '@/lib/utils';

function App() {
  const [isClicked, setIsClicked] = useState(false);
  // Ref for auto-scrolling
  const scrollViewRef = useRef(null);
  const [activeView, setActiveView] = useState<View>('CPU');
  
  const { statsHistory, generalStats } = useStatistics(10)
  
  const cpuStats = useMemo(() => statsHistory.map((stat) => stat.cpuUsage), [statsHistory])
  const ramStats = useMemo(() => statsHistory.map((stat) => stat.ramUsage), [statsHistory])
  const storageStats = useMemo(() => statsHistory.map((stat) => stat.storageUsage), [statsHistory])

 

  
  // Auto-scroll to bottom when new data arrives
  useEffect(() => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollTop = scrollViewRef.current.scrollHeight;
    }
  }, [statsHistory]);

  const [statsInfo, setStatsInfo] = useState({
    cpuUsage: 0,
    ramUsage: 0,
    storageUsage: 0
  });
  
  
  useEffect(() => {   
   const unsub =  window.electron.subscribeChangeView((view) => { 
    setActiveView(view)
  });
   return unsub;
  }, []);

  const activeUsages = useMemo(() => {
    switch (activeView) {
      case 'CPU':
        return cpuStats;
      case 'RAM':
        return ramStats;
      case 'STORAGE':
        return storageStats;
    }
  }, [activeView, cpuStats, ramStats, storageStats]);

    // Format percentage for display
  
  

  return (
    <div className='flex flex-col p-4'>
    {/* <Header/> */}
    <div>

      <h1>Resource Usage</h1>
      
      <div className="card">
        <div className="mb-6">
          <div className="flex justify-between mb-1">
            <span className="text-sm font-medium text-gray-700">CPU Usage</span>
            <span className="text-sm font-medium text-gray-700">{formatPercent(generalStats.cpuUsage)}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-4">
            <div 
              className="h-4 rounded-full bg-blue-600 transition-all duration-300 ease-in-out"
              style={{ width: `${generalStats.cpuUsage * 100}%` }}
            ></div>
          </div>
        </div>
      </div>
      {/* ScrollView */}
      <div 
        ref={scrollViewRef}
        className="border border-gray-200 rounded-md h-64 overflow-y-auto p-2 bg-gray-50 font-mono text-sm"
      >
        {isClicked && statsHistory.map((stat, index) => (
          <div key={index} className="flex flex-1 justify-between border-b border-gray-100 py-1 last:border-b-0">
            <div className="text-xs text-gray-500">{stat.timestamp}</div>
            <div className="flex flex-wrap gap-2 text-blue-600">
              <span className="">CPU: {formatPercent(stat.cpuUsage)}</span>
            </div>
          </div>
        ))}
        {statsHistory.length === 0 && (
          <div className="text-gray-400 italic text-center mt-20">
            Waiting for data...
          </div>
        )}

   
      </div>

      <div className="flex gap-4 py-6">
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          onClick={() => setIsClicked(true)}
        >
          START
        </button>
      {/* <button className="bg-blue-600 hover:bg-blue-800 text-white font-bold py-2 px-4 rounded"
        onClick={() => {
          setIsClicked(false)
          window.electron.getSystemMetricsLogs()
        }}
        >
        STOP
      </button> */}
        <SimpleDialog   
        handleStop={() => setIsClicked(false)}
        handleSave={() => window.electron.getSystemMetricsLogs()}
       />
    </div>

      <div style={{height: 120}}>
        {/* <Chart data={cpuStats} maxDataPoints={10}/> */}

      </div>
       <FileUploader />

     </div>
    </div>
  )
}

function Header() {
  return (
    <header>
      <button
        id="close"
        onClick={() => window.electron.sendFrameAction('CLOSE')}
      />
      <button
        id="minimize"
        onClick={() => window.electron.sendFrameAction('MINIMIZE')}
      />
      <button
        id="maximize"
        onClick={() => window.electron.sendFrameAction('MAXIMIZE')}
      />
    </header>
  );
}

export default App
