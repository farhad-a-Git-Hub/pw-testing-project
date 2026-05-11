export class APILogger {

    //collecting all logs as an array
    private recentLogs: LogEntry[] = []

    //collect log details ie aggregated API call components (body, headers, baseUrl...)
    logRequest(method: string, url: string, headers: Record<string, string>, body?: object) {
        const logEntry = { method, url, headers, body }
        this.recentLogs.push({ type: 'Request Details', data: logEntry })

    }

    logResponse(statusCode: number, body?: object) {
        const logEntry = { statusCode, body }
        this.recentLogs.push({ type: 'Response Details', data: logEntry })
    }

    getRecentLogs() {

        const logs = this.recentLogs.map(log => {
            return `===${log.type}===\n${JSON.stringify(log.data, null, 4)}`
        }).join('\n\n')
        return logs
    }
}



interface LogEntry {
    type: 'Request Details' | 'Response Details'
    data: object
}