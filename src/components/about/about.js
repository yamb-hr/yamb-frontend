import React, { useContext, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { CurrentUserContext } from '../../providers/currentUserProvider';
import { ErrorContext } from '../../providers/errorProvider';
import homeService from '../../services/homeService';
import './about.css';

function About() {

    const navigate = useNavigate();
    const location = useLocation();
    const { t } = useTranslation(); 
    const [ activeTab, setActiveTab ] = useState('');
    const [ healthInfo, setHealthInfo ] = useState(null);
    const [ metricsInfo, setMetricsInfo ] = useState(null);
    const [ loading, setLoading ] = useState(false);
    const [ cooldown, setCooldown ] = useState(false);
    const [ bugReport, setBugReport ] = useState({
        subject: '',
        description: ''
    });
    const { currentUser } = useContext(CurrentUserContext);
    const { handleError } = useContext(ErrorContext);
    
    useEffect(() => {   
        const tab = location.pathname.split("#")[1] || 'rules'
        handleTabChange(tab)
    }, []);

    useEffect(() => {
        if (currentUser) {
            fetchData();
        }
    }, [currentUser])
    
    const handleTabChange = (tab) => {
        setActiveTab(tab);
        navigate(`/about#${tab}`);
    };
  
    const fetchData = async () => {
        setLoading(true);
        homeService.getHealthCheck().then(data => {
            setHealthInfo(data);
            if (currentUser.roles.includes("ADMIN")) {
                homeService.getMetrics().then(data => {
                    setMetricsInfo(data);
                }).catch(error => {
                    handleError(error);
                });
            }
        }).catch(error => {
            handleError(error);
        }).finally(() => {
            setLoading(false);
        });        
    };

    const handleBugReportChange = (e) => {
        setBugReport({
            ...bugReport,
            [e.target.name]: e.target.value
        });
    };

    const handleBugReportSubmit = (e) => {
        e.preventDefault();
        console.log('Bug report submitted:', bugReport);
    };

    const handleRefresh = () => {
        if (cooldown) return;

        fetchData();

        setCooldown(15);
        setTimeout(() => {
            setCooldown(false);
        }, 15000);
    };

    const formatUptime = (uptimeInMiliseconds) => {
        let seconds = uptimeInMiliseconds / 1000;
        const days = Math.floor(seconds / (3600 * 24));
        seconds %= 3600 * 24;
        const hours = Math.floor(seconds / 3600);
        seconds %= 3600;
        const minutes = Math.floor(seconds / 60);
        seconds = Math.floor(seconds % 60);
        
        return `${days} days ${hours.toString().padStart(1, '0')} hours ${minutes.toString().padStart(1, '0')} minutes ${seconds.toString().padStart(1, '0')} seconds`;
    };

    return (
        <div className="about-container">
            <div className="about">
                <div className="section-buttons">
                    <button className={activeTab === 'rules' ? 'active' : ''} onClick={() => handleTabChange('rules')}><span className="icon">&#128221;</span>&nbsp;{t('rules')}</button>
                    <button className={activeTab === 'project' ? 'active' : ''} onClick={() => handleTabChange('project')}><span className="icon">&#128679;</span>&nbsp;{t('project')}</button>
                    <button className={activeTab === 'status' ? 'active' : ''} onClick={() => handleTabChange('status')}><span className="icon">&#128340;</span>&nbsp;{t('status')}</button>
                    <button className={activeTab === 'contact' ? 'active' : ''} onClick={() => handleTabChange('contact')}><span className="icon">&#128388;</span>&nbsp;{t('contact')}</button>
                </div>
                <hr/>
                <div>
                    {activeTab === 'rules' && (
                        <section>
                            <br/>
                            <p>{t('rules-content-1')}</p>
                            <br/>
                            <p>{t('rules-content-2')}</p>
                            <br/>
                            <p>{t('rules-content-3')}</p>
                            <br/>
                            <p>{t('rules-content-4')}</p>
                            <br/>
                        </section>
                    )}
                    {activeTab === 'project' && (
                        <section>
                            <h3>{t('code')}</h3>
                            <ul>    
                                <li>API Documentation:&nbsp;<a href="https://api.jamb.com.hr">yamb</a></li>
                                <li>Org:&nbsp;<a href="https://github.com/yamb-hr">yamb-hr</a></li>
                                <li>Backend:&nbsp;<a href="https://github.com/yamb-hr/yamb">yamb</a></li>
                                <li>Frontend:&nbsp;<a href="https://github.com/yamb-hr/yamb-frontend">yamb-frontend</a></li>
                            </ul>
                        </section>
                    )}
                    {activeTab === 'status' && (
                        <section>
                            {healthInfo && (
                                <ul>
                                    <li><strong>Version:</strong> {healthInfo.version}</li>
                                    <li><strong>PostgreSQL:</strong> {healthInfo.postgres}</li>
                                    <li><strong>MongoDB:</strong> {healthInfo.mongo}</li>
                                    <li><strong>reCAPTCHA API:</strong> {healthInfo.recaptchaAPI}</li>
                                </ul>
                            )}
                            {currentUser?.roles.includes("ADMIN") && metricsInfo && (
                                <ul>
                                    <li><strong>CPU Usage:</strong> {metricsInfo.cpuUsage?.toFixed(2)}%</li>
                                    <li><strong>Uptime:</strong> {formatUptime(metricsInfo.uptime)}</li>
                                    <li><strong>Requests Processed:</strong> {metricsInfo.requestsProcessed}</li>
                                    <li><strong>Average Response Time:</strong> {metricsInfo.averageResponseTime?.toFixed(2)} ms</li>
                                    <li><strong>Error Count:</strong> {metricsInfo.errorCount}</li>
                                    <li><strong>Error Rate:</strong> {metricsInfo.errorRate?.toFixed(2)}%</li>
                                    <li><strong>Disk Space:</strong> {(metricsInfo.diskSpace / (1024 * 1024 * 1024)).toFixed(2)} GB</li>
                                    <li><strong>Free Space:</strong> {(metricsInfo.memoryUsage / (1024 * 1024 * 1024)).toFixed(2)} GB</li>
                                </ul>                                         
                            )}
                            <button disabled={loading || cooldown} className="button-refresh" onClick={handleRefresh}>
                                {cooldown ? `${t('refresh')} (${Math.ceil(15 - cooldown / 1000)}s)` : t('refresh')}
                            </button>
                            <br/>
                            <br/>
                            <p>
                                <a href="https://status.jamb.com.hr">Keep Yourself Alive</a>
                            </p>
                            <br/>
                        </section>
                    )}
                    {activeTab === 'contact' && (
                        <section>
                            <p>
                                <a href="https://matej-danic.from.hr">Matej Đanić</a>
                            </p>
                            <form onSubmit={handleBugReportSubmit}>
                                <div>
                                    <label htmlFor="subject">{t('subject')}</label>
                                    <input 
                                        type="text" 
                                        id="subject" 
                                        name="subject" 
                                        value={bugReport.subject} 
                                        onChange={handleBugReportChange} 
                                        placeholder={t('enter-subject')}
                                        required
                                    />
                                </div>
                                <div>
                                    <label htmlFor="description">{t('description')}</label>
                                    <textarea 
                                        id="description" 
                                        name="description" 
                                        value={bugReport.description} 
                                        onChange={handleBugReportChange} 
                                        placeholder={t('describe-the-bug')} 
                                        required
                                    />
                                </div>
                                <button type="submit">{t('report-a-bug')}</button>
                            </form>
                            <br/>
                            <p>
                                <a href="mailto:matej@jamb.com.hr">matej@jamb.com.hr</a>
                            </p>
                            <br/>
                        </section>
                    )}
                </div>
            </div>
        </div>
    );
};

export default About;
