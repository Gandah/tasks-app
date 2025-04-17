
export const formatPercent = (value: any) => {
    return (value * 100).toFixed(1) + '%';
  };

export function analyzeCpuUsage(logFileContent: any) {
    // Split the log file content into lines
    const lines = logFileContent.trim().split("\n");
  
    // Parse each line as JSON and extract CPU usage
    const cpuUsages = lines
      .map((line) => {
        try {
          const parsedLine = JSON.parse(line);
          return parsedLine.cpu?.usage;
        } catch (error) {
          console.error("Error parsing line:", line, error);
          return null;
        }
      })
      .filter((usage) => usage !== null && !isNaN(usage));
  
    // If no valid CPU usage data is found, return appropriate message
    if (cpuUsages.length === 0) {
      return {
        error: "No valid CPU usage data found in the log file",
      };
    }
  
    // Calculate statistics
    const max = Math.max(...cpuUsages);
    const min = Math.min(...cpuUsages);
    const sum = cpuUsages.reduce((acc, curr) => acc + curr, 0);
    const average = sum / cpuUsages.length;
  
    return {
      maxCpuUsage: max,
      minCpuUsage: min,
      averageCpuUsage: average,
      sampleCount: cpuUsages.length,
    };
  }