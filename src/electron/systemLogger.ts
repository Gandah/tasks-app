import * as fs from 'fs';
import * as path from 'path';

const DEFAULT_LOG_DIR = path.join(process.cwd(), 'logs');

function ensureLogDirectory(logDirectory = DEFAULT_LOG_DIR) {
    try {
        if (!fs.existsSync(logDirectory)) {
            fs.mkdirSync(logDirectory, { recursive: true });
            console.log(`Created log directory: ${logDirectory}`);
        }
        return logDirectory;
    } catch (error) {
        console.error(`Failed to create log directory: ${error}`);
        throw error;
    }
}

function getLogFilePath(timestamp: any, logDirectory = DEFAULT_LOG_DIR) {
    return path.join(logDirectory, `system_metrics_${timestamp.split('T')[0]}.log`);
}

function writeLogEntry(logFile: string, metrics: any): number {
    try {
        const logEntry = JSON.stringify(metrics) + '\n';
        fs.appendFileSync(logFile, logEntry);
        const stats = fs.statSync(logFile);
        console.log(`Log updated - File: ${logFile}, Size: ${stats.size} bytes`);
        return stats.size;
    } catch (error) {
        console.error(`Failed to write log entry: ${error}`);
        throw error;
    }
}

export function logSystemMetrics(getStorageData: any, getRamUsage: any, getCpuUsage: any) {
    return Promise.all([
        getStorageData(),
        getRamUsage(),
        Promise.resolve(getCpuUsage())
    ]).then(([storage, ram, cpu]) => {
        const timestamp = new Date().toISOString();
        const metrics = { timestamp, storage, ram, cpu };
        
        ensureLogDirectory();
        const logFile = getLogFilePath(timestamp);
        const fileSize = writeLogEntry(logFile, metrics);

        console.log('I run')
        
        return {
            fileSize: fileSize,
            fileName: logFile,
        };
    });
}

// export function logSystemMetrics(metrics: { cpuUsage: number; ramUsage: number; storageUsage:number; }) {
    
//         const timestamp = new Date().toLocaleDateString('en-US')
//         const metricsWithTimestamp = { timestamp, ...metrics };
        
//         ensureLogDirectory();
//         const logFile = getLogFilePath(timestamp);
//         writeLogEntry(logFile, metricsWithTimestamp);

//         console.log('I run')
        
//         return metricsWithTimestamp;   
// }

