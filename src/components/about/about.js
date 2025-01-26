import React, { useContext, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ToastContext } from '../../providers/toastProvider';
import { CurrentUserContext } from '../../providers/currentUserProvider';
import { ErrorHandlerContext } from '../../providers/errorHandlerProvider';
import homeService from '../../services/homeService';
import ticketService from '../../services/ticketService';
import './about.css';

function About() {

    const navigate = useNavigate();
    const location = useLocation();
    const { t } = useTranslation();
    const { currentUser } = useContext(CurrentUserContext);
    const { handleError } = useContext(ErrorHandlerContext);
    const { showSuccessToast } = useContext(ToastContext);

    const [activeTab, setActiveTab] = useState(localStorage.getItem('tab') || 'rules');
    const [loading, setLoading] = useState(false);
    const [cooldown, setCooldown] = useState(false);

    const [healthInfo, setHealthInfo] = useState(null);
    const [metricsInfo, setMetricsInfo] = useState(null);
    const [isDataFetched, setIsDataFetched] = useState(false);
    
    const [ ticket, setTicket ] = useState({
        title: '',
        description: '',
        emailAddresses: '',
    });    
    
    useEffect(() => {   
        const tab = location.pathname.split("#")[1] || localStorage.getItem('tab') || 'rules'
        handleTabChange(tab)
    }, []);

    useEffect(() => {
        if (!isDataFetched) {
            fetchData();
        }
    }, [isDataFetched, currentUser]);
    
    const handleTabChange = (tab) => {
        setActiveTab(tab);
        navigate(`/about#${tab}`);
        localStorage.setItem('tab', tab);
    };
  
    const fetchData = async () => {
        if (loading) return;
        setLoading(true);
        try {
            const health = await homeService.getHealthCheck();
            setHealthInfo(health);
            if (currentUser?.admin) {
                const metrics = await homeService.getMetrics();
                setMetricsInfo(metrics);
            }
            setIsDataFetched(true);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleTicketChange = (e) => {
        setTicket({
            ...ticket,
            [e.target.name]: e.target.value,
        });
    };

    const handleTicketSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const newTicket = {
                playerId: currentUser?.externalId,
                title: ticket.title,
                description: ticket.description,
                emailAddresses: ticket.emailAddresses.split(',').map((email) => email.trim()),
            };
            ticketService.create(newTicket)
                .then(() => {
                    showSuccessToast(t('ticket-submitted-successfully'));
                    setTicket({ title: '', description: '', emailAddresses: '' });
                }).catch(error => {
                    handleError(error);
                });
        } catch (error) {
            handleError(error);
        } finally {
            setLoading(false);
        }
    };

    const handleRefresh = () => {
        if (cooldown) return;

        setIsDataFetched(false);
        setCooldown(true);
        setTimeout(() => setCooldown(false), 15000);
    };

    const formatUptime = (uptimeInMilliseconds) => {
        const seconds = Math.floor(uptimeInMilliseconds / 1000);
        const days = Math.floor(seconds / (3600 * 24));
        const hours = Math.floor((seconds % (3600 * 24)) / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const remainingSeconds = seconds % 60;

        return `${days} days ${hours.toString().padStart(2, '0')} hours ${minutes.toString().padStart(2, '0')} minutes ${remainingSeconds.toString().padStart(2, '0')} seconds`;
    };

    return (
        <div className="about-container">
            <div className="about">
                <div className="section-buttons">
                    <button className={activeTab === 'rules' ? 'active' : ''} onClick={() => handleTabChange('rules')}>
                        <span className="icon">&#128221;</span>&nbsp;{t('rules')}
                    </button>
                    <button className={activeTab === 'project' ? 'active' : ''} onClick={() => handleTabChange('project')}>
                        <span className="icon">&#128679;</span>&nbsp;{t('project')}
                    </button>
                    <button className={activeTab === 'status' ? 'active' : ''} onClick={() => handleTabChange('status')}>
                        <span className="icon">&#128340;</span>&nbsp;{t('status')}
                    </button>
                    <button className={activeTab === 'contact' ? 'active' : ''} onClick={() => handleTabChange('contact')}>
                        <span className="icon">&#128388;</span>&nbsp;{t('contact')}
                    </button>
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
                        </section>
                    )}
                    {activeTab === 'project' && (
                        <section>
                            <p><a href="https://matej-danic.from.hr"><img src="/favicon.svg" width="50"></img></a></p>
                            <p><strong>{t('yamb')}</strong></p>
                            <ul>    
                                <li>{t("api-documentation")}:&nbsp;<a href="https://api.jamb.com.hr">yamb</a></li>
                                <li>{t("org")}:&nbsp;<a href="https://github.com/yamb-hr">yamb-hr</a></li>
                                <li>{t("backend")}:&nbsp;<a href="https://github.com/yamb-hr/yamb">yamb</a></li>
                                <li>{t("frontend")}:&nbsp;<a href="https://github.com/yamb-hr/yamb-frontend">yamb-frontend</a></li>
                            </ul>
                        </section>
                    )}
                    {activeTab === 'status' && (
                        <section>
                            {healthInfo && (
                                <ul>
                                    <li><strong>{t('version')}:</strong> {healthInfo.version}</li>
                                    <li><strong>{t('postgresql')}:</strong> {healthInfo.postgres}</li>
                                    <li><strong>{t('mongodb')}:</strong> {healthInfo.mongo}</li>
                                    <li><strong>{t('recaptcha-api')}:</strong> {healthInfo.recaptchaAPI}</li>
                                </ul>
                            )}
                            {currentUser?.admin && metricsInfo && (
                                <ul>
                                    <li><strong>{t('cpu-usage')}:</strong> {metricsInfo.cpuUsage?.toFixed(2)}%</li>
                                    <li><strong>{t('uptime')}:</strong> {formatUptime(metricsInfo.uptime)}</li>
                                    <li><strong>{t('requests-processed')}:</strong> {metricsInfo.requestsProcessed}</li>
                                    <li><strong>{t('average-response-time')}:</strong> {metricsInfo.averageResponseTime?.toFixed(2)} ms</li>
                                    <li><strong>{t('error-count')}:</strong> {metricsInfo.errorCount}</li>
                                    <li><strong>{t('error-rate')}:</strong> {metricsInfo.errorRate?.toFixed(2)}%</li>
                                    <li><strong>{t('disk-space')}:</strong> {(metricsInfo.diskSpace / (1024 ** 3)).toFixed(2)} GB</li>
                                    <li><strong>{t('free-space')}:</strong> {(metricsInfo.memoryUsage / (1024 ** 3)).toFixed(2)} GB</li>
                                </ul>
                            )}
                            <button disabled={loading || cooldown} onClick={handleRefresh} className="button-refresh">
                                {cooldown ? `${t('refresh')} (${Math.ceil(15)}s)` : t('refresh')}
                            </button>
                        </section>
                    )}
                    {activeTab === 'contact' && (
                        <section>
                            <p><a href="https://matej-danic.from.hr"><img src="/img/matej.webp" width="50"></img></a></p>
                            <p><a href="https://matej-danic.from.hr"><strong>Matej Đanić</strong></a></p>
                            <p><a href="mailto:matej@jamb.com.hr">matej@jamb.com.hr</a></p>
                            <form onSubmit={handleTicketSubmit}>
                                <div>
                                    <label htmlFor="title">{t('title')}</label>
                                    <input
                                        type="text"
                                        id="title"
                                        name="title"
                                        value={ticket.title}
                                        onChange={handleTicketChange}
                                        placeholder={t('enter-title')}
                                        required
                                    />
                                </div>
                                <div>
                                    <label htmlFor="description">{t('description')}</label>
                                    <textarea
                                        id="description"
                                        name="description"
                                        value={ticket.description}
                                        onChange={handleTicketChange}
                                        placeholder={t('enter-description')}
                                        required
                                    />
                                </div>
                                <div>
                                    <label htmlFor="emailAddresses">{t('email-addresses')}</label>
                                    <input
                                        type="text"
                                        id="emailAddresses"
                                        name="emailAddresses"
                                        value={ticket.emailAddresses}
                                        onChange={handleTicketChange}
                                        placeholder={t('enter-email-addresses-comma-separated')}
                                    />
                                </div>
                                <button type="submit" disabled={loading}>
                                    {loading ? t('submitting') : t('submit')}
                                </button>
                            </form>
                        </section>
                    )}
                </div>
            </div>
        </div>
    );
};

export default About;
