import React, { useEffect, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { supabase } from './supabase';
import './styles.css';

const emptyForm = {
  record_date: new Date().toISOString().slice(0, 10),
  systolic: '',
  diastolic: '',
  heart_rate: '',
  weight: '',
  exercise_minutes: '',
  sleep_hours: '',
  water_glasses: '',
  notes: ''
};

function useDarkMode() {
  const [dark, setDark] = useState(() => localStorage.getItem('healthtrack-theme') === 'dark');
  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark);
    localStorage.setItem('healthtrack-theme', dark ? 'dark' : 'light');
  }, [dark]);
  return [dark, setDark];
}

function Auth({ onLogin }) {
  const [mode, setMode] = useState('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [msg, setMsg] = useState('');
  const [busy, setBusy] = useState(false);

  async function submit(e) {
    e.preventDefault();
    setBusy(true);
    setMsg('');

    if (mode === 'signup') {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { name } }
      });
      if (error) setMsg(error.message);
      else {
        setMsg('Account created. Check your email if confirmation is enabled.');
        setMode('login');
      }
    } else {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) setMsg(error.message);
      else onLogin(data.user);
    }
    setBusy(false);
  }

  return (
    <div className="auth">
      <div className="card">
        <div className="brand center">Health<span>Track</span></div>
        <div className="tabs">
          <button className={mode === 'login' ? 'active' : ''} onClick={() => setMode('login')}>Log in</button>
          <button className={mode === 'signup' ? 'active' : ''} onClick={() => setMode('signup')}>Sign up</button>
        </div>
        <h1>{mode === 'login' ? 'Welcome back' : 'Create your account'}</h1>
        <p className="muted">{mode === 'login' ? 'Continue tracking your health.' : 'Start your private health journal.'}</p>

        <form onSubmit={submit}>
          {mode === 'signup' && (
            <label>Name<input value={name} onChange={e => setName(e.target.value)} required /></label>
          )}
          <label>Email<input type="email" value={email} onChange={e => setEmail(e.target.value)} required /></label>
          <label>Password<input type="password" value={password} onChange={e => setPassword(e.target.value)} minLength="6" required /></label>
          {msg && <div className="msg">{msg}</div>}
          <button className="primary full" disabled={busy}>{busy ? 'Please wait…' : mode === 'login' ? 'Log in' : 'Create account'}</button>
        </form>
        <small>HealthTrack is for personal tracking and does not provide medical diagnosis or treatment.</small>
      </div>
    </div>
  );
}

function RecordModal({ user, recordToEdit, onClose, onSaved }) {
  const [form, setForm] = useState(() => recordToEdit ? {
    record_date: recordToEdit.record_date || new Date().toISOString().slice(0, 10),
    systolic: recordToEdit.systolic ?? '',
    diastolic: recordToEdit.diastolic ?? '',
    heart_rate: recordToEdit.heart_rate ?? '',
    weight: recordToEdit.weight ?? '',
    exercise_minutes: recordToEdit.exercise_minutes ?? '',
    sleep_hours: recordToEdit.sleep_hours ?? '',
    water_glasses: recordToEdit.water_glasses ?? '',
    notes: recordToEdit.notes || ''
  } : emptyForm);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState('');

  function change(e) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function save(e) {
    e.preventDefault();
    setBusy(true);
    setMsg('');

    const numberOrNull = value => value === '' ? null : Number(value);
    const checks = [
      ['Systolic', form.systolic, 40, 300], ['Diastolic', form.diastolic, 20, 200],
      ['Heart rate', form.heart_rate, 20, 250], ['Weight', form.weight, 1, 500],
      ['Exercise', form.exercise_minutes, 0, 1440], ['Sleep', form.sleep_hours, 0, 24],
      ['Water', form.water_glasses, 0, 100]
    ];
    const invalid = checks.find(([, value, min, max]) => value !== '' && (Number(value) < min || Number(value) > max));
    if (invalid) {
      setMsg(`${invalid[0]} should be between ${invalid[2]} and ${invalid[3]}.`);
      setBusy(false);
      return;
    }
    if ((form.systolic !== '' && form.diastolic === '') || (form.systolic === '' && form.diastolic !== '')) {
      setMsg('Please enter both systolic and diastolic values, or leave both empty.');
      setBusy(false);
      return;
    }

    const record = {
      user_id: user.id,
      record_date: form.record_date,
      systolic: numberOrNull(form.systolic),
      diastolic: numberOrNull(form.diastolic),
      heart_rate: numberOrNull(form.heart_rate),
      weight: numberOrNull(form.weight),
      exercise_minutes: numberOrNull(form.exercise_minutes),
      sleep_hours: numberOrNull(form.sleep_hours),
      water_glasses: numberOrNull(form.water_glasses),
      notes: form.notes.trim() || null
    };

    const query = recordToEdit
      ? supabase.from('health_records').update(record).eq('id', recordToEdit.id).eq('user_id', user.id)
      : supabase.from('health_records').insert(record);

    const { data, error } = await query.select().single();

    if (error) {
      setMsg(error.message);
    } else {
      onSaved(data);
      onClose();
    }
    setBusy(false);
  }

  return (
    <div className="overlay" onMouseDown={e => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-head">
          <div><small>{recordToEdit ? 'EDIT HEALTH RECORD' : 'NEW HEALTH RECORD'}</small><h2>{recordToEdit ? 'Edit health record' : "Add today's record"}</h2></div>
          <button className="close" onClick={onClose}>×</button>
        </div>

        <form onSubmit={save}>
          <div className="form-grid">
            <label>Date<input type="date" name="record_date" value={form.record_date} onChange={change} required /></label>
            <div></div>

            <div className="section-label">Blood pressure</div>
            <div></div>
            <label>Systolic (upper)<input type="number" name="systolic" value={form.systolic} onChange={change} placeholder="120" min="0" /></label>
            <label>Diastolic (lower)<input type="number" name="diastolic" value={form.diastolic} onChange={change} placeholder="80" min="0" /></label>

            <label>Heart rate (BPM)<input type="number" name="heart_rate" value={form.heart_rate} onChange={change} placeholder="72" min="0" /></label>
            <label>Weight (kg)<input type="number" name="weight" value={form.weight} onChange={change} placeholder="70" min="0" step="0.1" /></label>
            <label>Exercise (minutes)<input type="number" name="exercise_minutes" value={form.exercise_minutes} onChange={change} placeholder="30" min="0" /></label>
            <label>Sleep (hours)<input type="number" name="sleep_hours" value={form.sleep_hours} onChange={change} placeholder="8" min="0" step="0.1" /></label>
            <label>Water (glasses)<input type="number" name="water_glasses" value={form.water_glasses} onChange={change} placeholder="8" min="0" /></label>
            <label className="wide">Notes<textarea name="notes" value={form.notes} onChange={change} placeholder="Optional notes about today…"></textarea></label>
          </div>

          {msg && <div className="error">{msg}</div>}
          <div className="modal-actions">
            <button type="button" className="outline" onClick={onClose}>Cancel</button>
            <button className="primary" disabled={busy}>{busy ? 'Saving…' : recordToEdit ? 'Update record' : 'Save record'}</button>
          </div>
        </form>
      </div>
    </div>
  );
}

function HealthHistory({ user, refreshKey, onEdit }) {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');

  async function loadHistory() {
    setLoading(true); setError('');
    const { data, error } = await supabase.from('health_records').select('*').eq('user_id', user.id)
      .order('record_date', { ascending: false }).order('id', { ascending: false });
    if (error) { setError(error.message); setRecords([]); } else setRecords(data || []);
    setLoading(false);
  }
  useEffect(() => { loadHistory(); }, [user.id, refreshKey]);

  async function removeRecord(record) {
    if (!window.confirm(`Delete the health record for ${record.record_date}? This cannot be undone.`)) return;
    const { error } = await supabase.from('health_records').delete().eq('id', record.id).eq('user_id', user.id);
    if (error) setError(error.message); else loadHistory();
  }

  const filtered = records.filter(r => {
    const inDate = (!fromDate || r.record_date >= fromDate) && (!toDate || r.record_date <= toDate);
    const haystack = `${r.record_date} ${r.notes || ''} ${r.systolic ?? ''} ${r.diastolic ?? ''} ${r.heart_rate ?? ''}`.toLowerCase();
    return inDate && (!search.trim() || haystack.includes(search.trim().toLowerCase()));
  });

  return <section className="history">
    <div className="history-head"><div><small>HEALTH HISTORY</small><h2>Your previous records</h2><p>Search and filter your saved health records.</p></div>
      {!loading && !error && <span className="record-count">{filtered.length} of {records.length}</span>}</div>
    {!loading && !error && records.length > 0 && <div className="filter-bar">
      <input aria-label="Search records" placeholder="Search date, notes, heart rate…" value={search} onChange={e => setSearch(e.target.value)} />
      <label>From<input type="date" value={fromDate} onChange={e => setFromDate(e.target.value)} /></label>
      <label>To<input type="date" value={toDate} onChange={e => setToDate(e.target.value)} /></label>
      {(search || fromDate || toDate) && <button className="outline clear-filter" onClick={() => {setSearch('');setFromDate('');setToDate('');}}>Clear</button>}
    </div>}
    {loading && <div className="history-message">Loading your history…</div>}
    {error && <div className="error history-error">{error}</div>}
    {!loading && !error && records.length === 0 && <div className="history-message">No health records yet. Add your first record above.</div>}
    {!loading && !error && records.length > 0 && filtered.length === 0 && <div className="history-message">No records match your filters.</div>}
    {!loading && !error && filtered.length > 0 && <div className="table-wrap"><table><thead><tr>
      <th>Date</th><th>Blood pressure</th><th>Heart rate</th><th>Weight</th><th>Exercise</th><th>Sleep</th><th>Water</th><th>Notes</th><th>Actions</th>
    </tr></thead><tbody>{filtered.map(record => {
      const bp = record.systolic != null && record.diastolic != null ? `${record.systolic}/${record.diastolic}` : '—';
      return <tr key={record.id}><td>{record.record_date}</td><td>{bp}</td>
        <td>{record.heart_rate ?? '—'}{record.heart_rate != null ? ' BPM' : ''}</td><td>{record.weight ?? '—'}{record.weight != null ? ' kg' : ''}</td>
        <td>{record.exercise_minutes ?? '—'}{record.exercise_minutes != null ? ' min' : ''}</td><td>{record.sleep_hours ?? '—'}{record.sleep_hours != null ? ' h' : ''}</td>
        <td>{record.water_glasses ?? '—'}{record.water_glasses != null ? ' glasses' : ''}</td><td className="note-cell">{record.notes || '—'}</td>
        <td className="actions-cell"><button className="table-action edit" onClick={() => onEdit(record)}>Edit</button><button className="table-action delete" onClick={() => removeRecord(record)}>Delete</button></td>
      </tr>;
    })}</tbody></table></div>}
  </section>;
}

function ProfileModal({ user, onClose, onSaved }) {
  const metadata = user.user_metadata || {};
  const [name, setName] = useState(metadata.name || '');
  const [age, setAge] = useState(metadata.age || '');
  const [height, setHeight] = useState(metadata.height || '');
  const [gender, setGender] = useState(metadata.gender || '');
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState('');

  async function save(e) {
    e.preventDefault();
    setBusy(true);
    setMsg('');
    const { data, error } = await supabase.auth.updateUser({
      data: { name: name.trim(), age: age === '' ? null : Number(age), height: height === '' ? null : Number(height), gender: gender || null }
    });
    if (error) setMsg(error.message);
    else { onSaved(data.user); onClose(); }
    setBusy(false);
  }

  return (
    <div className="overlay" onMouseDown={e => e.target === e.currentTarget && onClose()}>
      <div className="modal profile-modal">
        <div className="modal-head">
          <div><small>YOUR PROFILE</small><h2>Personal details</h2></div>
          <button className="close" onClick={onClose}>×</button>
        </div>
        <form onSubmit={save}>
          <div className="form-grid">
            <label>Name<input value={name} onChange={e => setName(e.target.value)} placeholder="Your name" required /></label>
            <label>Age<input type="number" value={age} onChange={e => setAge(e.target.value)} placeholder="25" min="1" max="120" /></label>
            <label>Height (cm)<input type="number" value={height} onChange={e => setHeight(e.target.value)} placeholder="175" min="50" max="250" step="0.1" /></label>
            <label>Gender<select value={gender} onChange={e => setGender(e.target.value)}><option value="">Prefer not to say</option><option value="Male">Male</option><option value="Female">Female</option><option value="Other">Other</option></select></label>
            <label className="wide">Email<input value={user.email || ''} disabled /></label>
          </div>
          {msg && <div className="error">{msg}</div>}
          <div className="modal-actions"><button type="button" className="outline" onClick={onClose}>Cancel</button><button className="primary" disabled={busy}>{busy ? 'Saving…' : 'Save profile'}</button></div>
        </form>
      </div>
    </div>
  );
}

function Analytics({ user, refreshKey }) {
  const [records, setRecords] = useState([]); const [loading, setLoading] = useState(true); const [error, setError] = useState('');
  const [range, setRange] = useState('14'); const [fromDate, setFromDate] = useState(''); const [toDate, setToDate] = useState('');
  async function loadAnalytics() {
    setLoading(true); setError('');
    const { data, error } = await supabase.from('health_records').select('id, record_date, systolic, diastolic, heart_rate, weight, exercise_minutes, sleep_hours, water_glasses')
      .eq('user_id', user.id).order('record_date', { ascending: true }).order('id', { ascending: true });
    if (error) { setError(error.message); setRecords([]); } else setRecords(data || []); setLoading(false);
  }
  useEffect(() => { loadAnalytics(); }, [user.id, refreshKey]);
  const filtered = records.filter(r => (!fromDate || r.record_date >= fromDate) && (!toDate || r.record_date <= toDate));
  const recent = range === 'all' ? filtered : filtered.slice(-Number(range));
  const average = key => { const values = recent.map(r => Number(r[key])).filter(Number.isFinite); return values.length ? values.reduce((a,b)=>a+b,0)/values.length : null; };
  const averages = useMemo(() => ({ heart:average('heart_rate'), weight:average('weight'), exercise:average('exercise_minutes'), sleep:average('sleep_hours'), water:average('water_glasses') }), [recent]);
  if (loading) return <section className="analytics"><div className="history-message">Loading your analytics…</div></section>;
  if (error) return <section className="analytics"><div className="error history-error">{error}</div></section>;
  if (!records.length) return null;
  return <section className="analytics"><div className="analytics-head"><div><small>ANALYTICS</small><h2>Your health trends</h2><p>Use a date range or recent-record view to explore your data.</p></div>
    <div className="analytics-controls"><select value={range} onChange={e=>setRange(e.target.value)}><option value="7">Latest 7</option><option value="14">Latest 14</option><option value="30">Latest 30</option><option value="all">All filtered records</option></select><input type="date" value={fromDate} onChange={e=>setFromDate(e.target.value)} /><input type="date" value={toDate} onChange={e=>setToDate(e.target.value)} />
      {(fromDate||toDate) && <button className="outline" onClick={()=>{setFromDate('');setToDate('')}}>Clear dates</button>}</div></div>
    {!recent.length ? <div className="history-message">No records match this analytics range.</div> : <><div className="average-grid"><AverageCard label="Avg. heart rate" value={averages.heart} unit="BPM"/><AverageCard label="Avg. weight" value={averages.weight} unit="kg"/><AverageCard label="Avg. exercise" value={averages.exercise} unit="min"/><AverageCard label="Avg. sleep" value={averages.sleep} unit="hours"/><AverageCard label="Avg. water" value={averages.water} unit="glasses"/></div>
      <div className="chart-grid"><LineChart title="Blood pressure" unit="mmHg" records={recent} series={[{key:'systolic',label:'Systolic'},{key:'diastolic',label:'Diastolic'}]}/><LineChart title="Weight" unit="kg" records={recent} series={[{key:'weight',label:'Weight'}]}/><LineChart title="Exercise" unit="min" records={recent} series={[{key:'exercise_minutes',label:'Exercise'}]}/><LineChart title="Sleep" unit="hours" records={recent} series={[{key:'sleep_hours',label:'Sleep'}]}/></div></>}
  </section>;
}

function AverageCard({ label, value, unit }) {
  return (
    <div className="average-card">
      <span>{label}</span>
      <strong>{value == null ? '—' : Number(value).toFixed(1)}</strong>
      <small>{unit}</small>
    </div>
  );
}

function LineChart({ title, unit, records, series }) {
  const width = 640;
  const height = 250;
  const pad = { left: 48, right: 18, top: 25, bottom: 42 };
  const allValues = series.flatMap(s => records.map(r => Number(r[s.key])).filter(Number.isFinite));

  if (!allValues.length) {
    return <div className="chart-card"><div className="chart-title"><h3>{title}</h3><span>{unit}</span></div><div className="chart-empty">Not enough data for this chart yet.</div></div>;
  }

  let min = Math.min(...allValues);
  let max = Math.max(...allValues);
  const range = max - min || Math.max(1, Math.abs(max) * 0.12);
  min -= range * 0.15;
  max += range * 0.15;

  const x = index => records.length === 1
    ? (width - pad.left - pad.right) / 2 + pad.left
    : pad.left + index * ((width - pad.left - pad.right) / (records.length - 1));
  const y = value => pad.top + (max - value) / (max - min) * (height - pad.top - pad.bottom);
  const makePoints = key => records.map((r, i) => Number.isFinite(Number(r[key])) ? `${x(i)},${y(Number(r[key]))}` : null).filter(Boolean).join(' ');

  const tickValues = [max, min + (max - min) / 2, min];
  const labelEvery = Math.max(1, Math.ceil(records.length / 6));

  return (
    <div className="chart-card">
      <div className="chart-title"><div><h3>{title}</h3><span>{records.length} records</span></div><em>{unit}</em></div>
      <div className="legend">
        {series.map((s, i) => <span key={s.key}><i className={`legend-dot dot-${i}`}></i>{s.label}</span>)}
      </div>
      <div className="chart-scroll">
        <svg viewBox={`0 0 ${width} ${height}`} role="img" aria-label={`${title} chart`}>
          {tickValues.map((v, i) => {
            const yy = y(v);
            return <g key={i}><line x1={pad.left} x2={width - pad.right} y1={yy} y2={yy} className="grid-line" /><text x={pad.left - 9} y={yy + 4} textAnchor="end" className="axis-label">{Number(v).toFixed(v % 1 ? 1 : 0)}</text></g>;
          })}
          {records.map((r, i) => i % labelEvery === 0 ? <text key={r.id || i} x={x(i)} y={height - 15} textAnchor="middle" className="axis-label">{String(r.record_date).slice(5)}</text> : null)}
          {series.map((s, i) => <polyline key={s.key} points={makePoints(s.key)} className={`chart-line line-${i}`} fill="none" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />)}
          {series.map((s, si) => records.map((r, i) => Number.isFinite(Number(r[s.key])) ? <circle key={`${s.key}-${r.id || i}`} cx={x(i)} cy={y(Number(r[s.key]))} r="3.5" className={`chart-point point-${si}`} /> : null))}
        </svg>
      </div>
    </div>
  );
}

function Dashboard({ user }) {
  const [record, setRecord] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const [showProfile, setShowProfile] = useState(false);
  const [currentUser, setCurrentUser] = useState(user);
  const [loadingRecord, setLoadingRecord] = useState(true);
  const [historyRefresh, setHistoryRefresh] = useState(0);
  const [dark, setDark] = useDarkMode();
  const [reminder, setReminder] = useState(() => localStorage.getItem(`healthtrack-reminder-${user.id}`) || '');

  async function loadLatest() {
    setLoadingRecord(true);
    const { data, error } = await supabase
      .from('health_records')
      .select('*')
      .eq('user_id', user.id)
      .order('record_date', { ascending: false })
      .order('id', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (!error) setRecord(data);
    setLoadingRecord(false);
  }

  useEffect(() => { loadLatest(); }, [user.id, historyRefresh]);

  useEffect(() => { setCurrentUser(user); }, [user]);

  async function logout() {
    await supabase.auth.signOut();
  }

  const name = currentUser.user_metadata?.name || currentUser.email?.split('@')[0] || 'there';
  const bp = record?.systolic != null && record?.diastolic != null ? `${record.systolic}/${record.diastolic}` : '—';

  return (
    <>
      <nav><div className="brand">Health<span>Track</span></div><div className="nav-right"><span className="email">{currentUser.email}</span><button className="theme-btn" onClick={()=>setDark(v=>!v)} title="Toggle theme">{dark ? '☀️' : '🌙'}</button><button className="outline" onClick={() => setShowProfile(true)}>Profile</button><button className="outline" onClick={logout}>Log out</button></div></nav>

      <main>
        <div className="head">
          <div>
            <small>PERSONAL DASHBOARD</small>
            <h1>Good to see you, {name}.</h1>
            <p>Keep your daily health records in one place.</p>
          </div>
          <button className="primary" onClick={() => { setEditingRecord(null); setShowModal(true); }}>+ Add today's record</button>
        </div>

        <div className="record-date">
          {loadingRecord ? 'Loading latest record…' : record ? `Latest record: ${record.record_date}` : 'No records yet'}
        </div>

        <div className="grid">
          <Stat title="Blood pressure" value={bp} unit="mmHg" />
          <Stat title="Heart rate" value={record?.heart_rate ?? '—'} unit="BPM" />
          <Stat title="Weight" value={record?.weight ?? '—'} unit="kg" />
          <Stat title="Exercise" value={record?.exercise_minutes ?? '—'} unit="min" />
          <Stat title="Sleep" value={record?.sleep_hours ?? '—'} unit="hours" />
          <Stat title="Water" value={record?.water_glasses ?? '—'} unit="glasses" />
        </div>

        <section className="reminder"><div><small>DAILY REMINDER</small><h3>Choose a time to remind yourself to record today</h3><p>HealthTrack stores this reminder only in this browser.</p></div><div className="reminder-actions"><input type="time" value={reminder} onChange={e=>{setReminder(e.target.value); localStorage.setItem(`healthtrack-reminder-${user.id}`, e.target.value)}} />{reminder && <button className="outline" onClick={()=>{setReminder('');localStorage.removeItem(`healthtrack-reminder-${user.id}`)}}>Turn off</button>}</div></section>

        {record?.notes && <section className="notes"><small>LAST NOTE</small><p>{record.notes}</p></section>}

        <Analytics user={user} refreshKey={historyRefresh} />
        <HealthHistory user={user} refreshKey={historyRefresh} onEdit={recordToEdit => { setEditingRecord(recordToEdit); setShowModal(true); }} />

        {!record && !loadingRecord && (
          <section className="empty">
            <div>+</div>
            <h2>Your health history starts here</h2>
            <p>Add your first daily record and HealthTrack will keep it organized.</p>
            <button className="primary" onClick={() => { setEditingRecord(null); setShowModal(true); }}>Add first record</button>
          </section>
        )}
      </main>

      <footer><b>HealthTrack</b><span>Personal health tracking · Not medical advice</span></footer>
      {showModal && <RecordModal user={user} recordToEdit={editingRecord} onClose={() => { setShowModal(false); setEditingRecord(null); }} onSaved={saved => { setRecord(saved); setHistoryRefresh(v => v + 1); setEditingRecord(null); }} />}
      {showProfile && <ProfileModal user={currentUser} onClose={() => setShowProfile(false)} onSaved={updatedUser => { setCurrentUser(updatedUser); }} />}
    </>
  );
}

function Stat({ title, value, unit }) {
  return <div className="stat"><small>{title}</small><strong>{value}</strong><em>{unit}</em></div>;
}

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user || null);
      setLoading(false);
    });
    const { data } = supabase.auth.onAuthStateChange((_event, session) => setUser(session?.user || null));
    return () => data.subscription.unsubscribe();
  }, []);

  if (loading) return <div className="loading">Loading HealthTrack…</div>;
  return user ? <Dashboard user={user} /> : <Auth onLogin={setUser} />;
}

createRoot(document.getElementById('root')).render(<App />);
