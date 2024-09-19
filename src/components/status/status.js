import React, { useState, useEffect } from 'react';
import homeService from '../../services/homeService';
import './status.css';

const Status = () => {
    const [versionInfo, setVersionInfo] = useState({});
    const [healthInfo, setHealthInfo] = useState({});
    const [statusInfo, setStatusInfo] = useState({});
    const [systemInfo, setSystemInfo] = useState({});
    const [metricsInfo, setMetricsInfo] = useState({});
  
    const fetchData = async () => {
        try {
            const versionResponse = await homeService.getVersionInfo();
            setVersionInfo(versionResponse.data);

            const healthResponse = await homeService.getHealthCheck();
            setHealthInfo(healthResponse.data);

            const statusResponse = await homeService.getStatus();
            setStatusInfo(statusResponse.data);

            const systemResponse = await homeService.getSystemInfo();
            setSystemInfo(systemResponse.data);

            const metricsResponse = await homeService.getMetrics();
            setMetricsInfo(metricsResponse.data);
        } catch (error) {
            console.error('Error fetching info:', error);
        }
    };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="status">
      <h2>System & Application Information</h2>

      <section>
        <h3>Version Info</h3>
        <ul>
          <li><strong>Version:</strong> {versionInfo.version}</li>
        </ul>
      </section>

      <section>
        <h3>Health Info</h3>
        <ul>
          <li><strong>Status:</strong> {healthInfo.status}</li>
          <li><strong>Uptime:</strong> {healthInfo.uptime}</li>
        </ul>
      </section>

      <section>
        <h3>Status Info</h3>
        <ul>
          <li><strong>PostgreSQL:</strong> {statusInfo.postgres}</li>
          <li><strong>MongoDB:</strong> {statusInfo.mongo}</li>
          <li><strong>reCAPTCHA API:</strong> {statusInfo.recaptchaAPI}</li>
        </ul>
      </section>

      <section>
        <h3>System Info</h3>
        <ul>
          <li><strong>Memory Usage:</strong> {systemInfo.memoryUsage}</li>
          <li><strong>CPU Usage:</strong> {systemInfo.cpuUsage}</li>
          <li><strong>Disk Space:</strong> {systemInfo.diskSpace}</li>
        </ul>
      </section>

      <section>
        <h3>Metrics</h3>
        <ul>
          <li><strong>Uptime:</strong> {metricsInfo.uptime}</li>
          <li><strong>Requests Processed:</strong> {metricsInfo.requestsProcessed}</li>
          <li><strong>Average Response Time:</strong> {metricsInfo.averageResponseTime}</li>
          <li><strong>Error Rate:</strong> {metricsInfo.errorRate}</li>
        </ul>
      </section>
    </div>
  );
};

export default Status;
