"use client";

import { useEffect, useState } from "react";

export default function LogsPage() {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    const fetchLogs = async () => {
      const response = await fetch("/api/logs");
      const data = await response.json();
      setLogs(data);
    };

    fetchLogs();
    const interval = setInterval(fetchLogs, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-2xl mb-4">System Logs</h1>
      <div className="space-y-2">
        {logs.map((log: any) => (
          <div key={log.id} className="p-2 border rounded">
            <div className="font-bold">
              {new Date(log.timestamp).toLocaleString()}
            </div>
            <div
              className={`text-${log.level === "error" ? "red" : "gray"}-600`}
            >
              {log.message}
            </div>
            {log.data && (
              <pre className="text-sm mt-1 bg-gray-100 p-2 rounded">
                {JSON.stringify(JSON.parse(log.data), null, 2)}
              </pre>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
