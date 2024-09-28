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
        homeService.getHealthCheck().then(data => {
            setHealthInfo(data);
        }).catch(error => {
            handleError(error);
        })
        if (currentUser.roles.includes("ADMIN")) {
            homeService.getMetrics().then(data => {
                setMetricsInfo(data);
            }).catch(error => {
                handleError(error);
            });
        }
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

    function handleRefresh() {
        fetchData();
    }

    return (
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
                        <p>{t('rules-content-1')}</p>
                        <br/>
                        <p>{t('rules-content-2')}</p>
                        <br/>
                        <p>{t('rules-content-3')}</p>
                        <br/>
                        <p>{t('rules-content-4')}</p>
                    </section>
                )}
                {activeTab === 'project' && (
                    <section>
                        {t('code')}
                        <ul>    
                            <li><a href="https://api.jamb.com.hr">API Documentation</a></li>
                            <li><a href="https://github.com/yamb-hr">yamb-hr</a></li>
                            <li><a href="https://github.com/yamb-hr/yamb">yamb</a></li>
                            <li><a href="https://github.com/yamb-hr/yamb-frontend">yamb-frontend</a></li>
                        </ul>
                    </section>
                )}
                {activeTab === 'status' && (
                    <section>
                        <ul>
                            <li><strong>Version:</strong> {healthInfo.version}</li>
                            <li><strong>Uptime:</strong> {healthInfo.uptime}</li>
                            <li><strong>PostgreSQL:</strong> {healthInfo.postgres}</li>
                            <li><strong>MongoDB:</strong> {healthInfo.mongo}</li>
                            <li><strong>reCAPTCHA API:</strong> {healthInfo.recaptchaAPI}</li>
                        </ul>
                        {currentUser?.roles.includes("ADMIN") && (
                            <ul>
                                <li><strong>Memory Usage:</strong> {metricsInfo.memoryUsage}</li>
                                <li><strong>CPU Usage:</strong> {metricsInfo.cpuUsage}</li>
                                <li><strong>Disk Space:</strong> {metricsInfo.diskSpace}</li>
                                <li><strong>Uptime:</strong> {metricsInfo.uptime}</li>
                                <li><strong>Average Response Time:</strong> {metricsInfo.averageResponseTime}</li>
                                <li><strong>Requests Processed:</strong> {metricsInfo.requestsProcessed}</li>
                                <li><strong>Error Count:</strong> {metricsInfo.errorCount}</li>
                                <li><strong>Error Rate:</strong> {metricsInfo.errorRate}</li>
                            </ul>
                        )}
                        <button className="button-refresh" onClick={handleRefresh}>
                            Refresh
                        </button>
                        <br/>
                        <br/>
                        <p>
                            <a href="https://status.jamb.com.hr">Keep Yourself Alive</a>
                        </p>
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
                    </section>
                )}
            </div>
        </div>
    );
};

export default About;
