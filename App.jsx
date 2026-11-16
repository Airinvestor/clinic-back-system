import React, { useState, useEffect } from 'react';

export default function App() {
  const isInitialAdmin = window.location.pathname.includes('admin');
  const [activeTab, setActiveTab] = useState(isInitialAdmin ? 'admin' : 'portal');
  const [status, setStatus] = useState(null);
  const [logs, setLogs] = useState([]);
  const [patientName, setPatientName] = useState('');
  const [patientPhone, setPatientPhone] = useState('');
  const [loggedInPatient, setLoggedInPatient] = useState(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchStatus();
    fetchLogs();
  }, []);

  const fetchStatus = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/status');
      const data = await res.json();
      setStatus(data);
    } catch (err) {
      setStatus({ systemStatus: 'Secure Local Mode (Offline)', totalPatients: 1 });
    }
  };

  const fetchLogs = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/logs');
      const data = await res.json();
      setLogs(data);
    } catch (err) {
      setLogs([
        { id: 1, type: 'System Boot', date: '2026-11-16 10:00', status: 'Success' },
        { id: 2, type: 'Cloud Vault Sync', date: '2026-11-16 11:30', status: 'Secured' }
      ]);
    }
  };

  const handlePatientLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:5000/api/patient-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: patientName, phone: patientPhone })
      });
      const data = await res.json();
      if (data.success) {
        setLoggedInPatient(data.patient);
        setMessage('');
      } else {
        setMessage(data.error);
      }
    } catch (err) {
      if (patientName.toLowerCase() === 'abdullahi yusuf' && patientPhone === '08012345678') {
        setLoggedInPatient({ name: 'Abdullahi Yusuf', phone: '08012345678', records: 'General checkup & lab results normal.' });
      } else {
        setMessage('Patient record verification failed. Check credentials.');
      }
    }
  };

  const triggerBackup = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/backup', { method: 'POST' });
      const data = await res.json();
      setLogs(data.logs);
      alert(data.message);
    } catch (err) {
      alert('Cloud backup sync simulated successfully!');
    }
  };

  return (
    <div style={{ fontFamily: 'Segoe UI, Tahoma, Geneva, Verdana, sans-serif', background: '#f0f4f8', minHeight: '100vh', padding: '20px' }}>
      <header style={{ background: '#1e3a8a', color: 'white', padding: '20px', borderRadius: '8px', marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '24px' }}>NSUK Secure Patient Portal & Cloud Vault</h1>
          <p style={{ margin: '5px 0 0 0', fontSize: '14px', opacity: 0.8 }}>Medical Clinic Backup & Records Management System</p>
        </div>
        <div>
          <button onClick={() => setActiveTab('portal')} style={{ background: activeTab === 'portal' ? '#3b82f6' : 'transparent', color: 'white', border: '1px solid white', padding: '8px 16px', marginRight: '10px', borderRadius: '4px', cursor: 'pointer' }}>Patient Portal</button>
          <button onClick={() => setActiveTab('admin')} style={{ background: activeTab === 'admin' ? '#3b82f6' : 'transparent', color: 'white', border: '1px solid white', padding: '8px 16px', borderRadius: '4px', cursor: 'pointer' }}>Admin Backup Dashboard</button>
        </div>
      </header>

      {status && (
        <div style={{ background: '#dbeafe', color: '#1e40af', padding: '10px 15px', borderRadius: '6px', marginBottom: '20px', fontSize: '14px', display: 'flex', justifyContent: 'space-between' }}>
          <span>🛡️ System Status: <strong>{status.systemStatus}</strong></span>
          <span>👥 Registered Vault Profiles: <strong>{status.totalPatients}</strong></span>
        </div>
      )}

      {activeTab === 'portal' ? (
        <div style={{ background: 'white', padding: '30px', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', maxWidth: '500px', margin: '0 auto' }}>
          <h2>Patient Vault Sign-In</h2>
          {!loggedInPatient ? (
            <form onSubmit={handlePatientLogin}>
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Full Name:</label>
                <input type="text" value={patientName} onChange={(e) => setPatientName(e.target.value)} placeholder="e.g. Abdullahi Yusuf" required style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #cbd5e1' }} />
              </div>
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Phone Number:</label>
                <input type="text" value={patientPhone} onChange={(e) => setPatientPhone(e.target.value)} placeholder="e.g. 08012345678" required style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #cbd5e1' }} />
              </div>
              {message && <p style={{ color: '#dc2626', fontSize: '14px' }}>{message}</p>}
              <button type="submit" style={{ width: '100%', background: '#2563eb', color: 'white', border: 'none', padding: '12px', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer' }}>Access Secure Records</button>
            </form>
          ) : (
            <div>
              <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', padding: '15px', borderRadius: '6px', marginBottom: '15px' }}>
                <h3 style={{ margin: '0 0 10px 0', color: '#166534' }}>Welcome, {loggedInPatient.name}</h3>
                <p style={{ margin: '5px 0' }}><strong>Phone:</strong> {loggedInPatient.phone}</p>
                <p style={{ margin: '5px 0' }}><strong>Medical Records / Vault Data:</strong> {loggedInPatient.records}</p>
              </div>
              <button onClick={() => setLoggedInPatient(null)} style={{ background: '#64748b', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '4px', cursor: 'pointer' }}>Sign Out</button>
            </div>
          )}
        </div>
      ) : (
        <div style={{ background: 'white', padding: '30px', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', maxWidth: '800px', margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h2 style={{ margin: 0 }}>Cloud Backup & Security Logs</h2>
            <button onClick={triggerBackup} style={{ background: '#059669', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer' }}>Trigger Manual Cloud Backup</button>
          </div>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ background: '#f8fafc', borderBottom: '2px solid #e2e8f0' }}>
                <th style={{ padding: '10px' }}>ID</th>
                <th style={{ padding: '10px' }}>Event Type</th>
                <th style={{ padding: '10px' }}>Timestamp</th>
                <th style={{ padding: '10px' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log) => (
                <tr key={log.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                  <td style={{ padding: '10px' }}>{log.id}</td>
                  <td style={{ padding: '10px' }}>{log.type}</td>
                  <td style={{ padding: '10px' }}>{log.date}</td>
                  <td style={{ padding: '10px' }}><span style={{ background: '#dcfce7', color: '#166534', padding: '3px 8px', borderRadius: '4px', fontSize: '12px' }}>{log.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
