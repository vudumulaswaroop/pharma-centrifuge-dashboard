import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';

import App from './App';
import { AppMain } from './App/AppMain';
import { Topbar } from './layout/Topbar';
import { Sidebar } from './layout/Sidebar';
import { NotifPanel } from './App/NotifPanel';
import { Login } from './login/Login';
import { AlertFeed } from './components/AlertFeed';
import { ChannelCard } from './components/ChannelCard';
import { Clock } from './components/Clock';
import { EmailPanel } from './components/EmailPanel';
import { MotorPanel } from './components/MotorPanel';
import { Tank } from './components/Tank';
import { Admin } from './admin/Admin';
import { LogsTab } from './admin/LogsTab';
import { MachinesTab } from './admin/MachinesTab';
import { RolesTab } from './admin/RolesTab';
import { SystemTab } from './admin/SystemTab';
import { Analytics } from './analytics/Analytics';
import { Machines } from './machines/Machines';
import { MachineDetail } from './machines/MachineDetail';
import { Maintenance } from './machines/Maintenance';
import { Overview } from './overview/Overview';
import { Reports } from './reports/Reports';
import { ArcGauge } from './ui/ArcGauge';
import { BarChart } from './ui/BarChart';
import { DonutChart } from './ui/DonutCart';
import { KV } from './ui/KV';
import { LiveTag } from './ui/LiveTag';
import { MultiLineChart } from './ui/MultiLineChart';
import { Panel } from './ui/Panel';
import { ProgressRow } from './ui/ProgressRow';
import { SDot } from './ui/SDot';
import { Sparkline } from './ui/SparkLine';
import { StatCard } from './ui/StatCard';
import { Tag } from './ui/Tag';
import { statusColor } from './ui/statusColor';
import { signJWT, parseJWT, verifyJWT } from './constants/Helpers';
import { USERS, MACHINES } from './constants';
import { generateMetrics, generateAlerts } from './constants';

beforeEach(() => {
  localStorage.clear();
  jest.useFakeTimers();
});

afterEach(() => {
  jest.runOnlyPendingTimers();
  jest.useRealTimers();
});

test('renders login when no token exists', () => {
  render(<App />);
  const loginTitle = screen.getByText(/Secure Access/i);
  expect(loginTitle).toBeInTheDocument();
});

test('helpers: sign, parse, verify and expiration behavior', () => {
  const user = USERS[1];
  const token = signJWT(user);

  const parsed = parseJWT(token);
  expect(parsed).toEqual(expect.objectContaining({ id: user.id, role: user.role, name: user.name }));

  expect(verifyJWT(token)).toEqual(expect.objectContaining({ id: user.id, role: user.role }));

  const expiredPayload = { ...parsed, exp: Date.now() - 1000 };
  const expiredToken = `x.${btoa(JSON.stringify(expiredPayload))}.z`;
  expect(parseJWT(expiredToken)).toEqual(expect.objectContaining({ id: user.id }));
  expect(verifyJWT(expiredToken)).toBeNull();
});

test('generateMetrics and generateAlerts produce expected shapes', () => {
  const metrics = generateMetrics(MACHINES[0], 123);
  expect(metrics).toEqual(expect.objectContaining({ id: MACHINES[0].id, temperature: expect.any(Number), status: expect.any(String) }));

  const alerts = generateAlerts();
  expect(alerts).toHaveLength(7);
  expect(alerts.filter(a => !a.ack)).toHaveLength(5);
});

test('Login: credential validation and callback on successful signin', async () => {
  const onLogin = jest.fn();
  render(<Login onLogin={onLogin} />);

  const authButton = screen.getByRole('button', { name: /AUTHENTICATE/i });
  userEvent.click(authButton);
  expect(await screen.findByText(/Please enter credentials\./i)).toBeInTheDocument();

  userEvent.type(screen.getByPlaceholderText(/user@pharma.com/i), 'wrong@pharma.com');
  userEvent.type(screen.getByPlaceholderText(/••••••••/i), 'wrongpass');
  userEvent.click(authButton);

  jest.advanceTimersByTime(600);
  await waitFor(() => expect(screen.getByText(/Invalid email or password\./i)).toBeInTheDocument());

  userEvent.click(screen.getByText(/PLANT/i));
  expect(screen.getByDisplayValue(/plant@pharma\.com/i)).toBeInTheDocument();
  expect(screen.getByDisplayValue(/plant123/i)).toBeInTheDocument();

  userEvent.click(authButton);
  jest.advanceTimersByTime(600);
  await waitFor(() => expect(onLogin).toHaveBeenCalled());
});

test('SDot: renders status class for warning and fallback colors', () => {
  const warningDot = render(<SDot status="warning" />);
  expect(warningDot.container.querySelector('.sdot.r')).toBeInTheDocument();

  const noneDot = render(<SDot status="unknown" />);
  expect(noneDot.container.querySelector('.sdot.n')).toBeInTheDocument();
});

test('AppMain: invalid token redirects to login and clears storage', async () => {
  localStorage.setItem('cm_token', 'invalid.token.value');
  render(<AppMain />);

  expect(await screen.findByText(/Secure Access/i)).toBeInTheDocument();
  expect(localStorage.getItem('cm_token')).toBeNull();
});

test('AppMain: valid token flow, notifications, ack and logout', async () => {
  const token = signJWT(USERS[0]);
  localStorage.setItem('cm_token', token);

  render(<AppMain />);

  // initially shows dashboard
  expect(await screen.findByText(/Pharma Dashboard/i)).toBeInTheDocument();
  expect(screen.getAllByText(/Fleet Overview/i).length).toBeGreaterThanOrEqual(1);

  // dashboard core components are visible
  expect(screen.getByText(/UTILITY WATER MANAGEMENT SYSTEM/i)).toBeInTheDocument();
  expect(document.querySelector('.app-wrap')).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /Sign Out/i })).toBeInTheDocument();

  // notifications bell should show unack count (topbar) and corresponds to expected unack count
  const notifCount = document.querySelector('.notif-count');
  expect(notifCount).toBeInTheDocument();
  expect(notifCount).toHaveTextContent('5');

  // open notification panel and ack one alert
  const bell = document.querySelector('.topbar-notif');
  expect(bell).toBeInTheDocument();
  userEvent.click(bell);
  expect(await screen.findByText(/🔔 Notifications/i)).toBeInTheDocument();

  const ackButtons = screen.getAllByRole('button', { name: /Ack/i });
  expect(ackButtons.length).toBeGreaterThan(0);
  userEvent.click(ackButtons[0]);

  await waitFor(() => {
    expect(screen.getAllByText('✓').length).toBeGreaterThanOrEqual(1);
  });

  // logout
  userEvent.click(screen.getByText(/Sign Out/i));
  expect(await screen.findByText(/Secure Access/i)).toBeInTheDocument();
});

test('Topbar renders title, time and notifications count', () => {
  render(<Topbar title="overview" time="12:00:00" alertCount={3} onNotif={() => {}} />);
  expect(screen.getByText(/Fleet Overview/i)).toBeInTheDocument();
  expect(screen.getByText('12:00:00')).toBeInTheDocument();
  expect(screen.getByText('3')).toBeInTheDocument();
});

test('Sidebar renders user info and allowed nav entries', () => {
  const user = { name: 'Test', role: 'admin', avatar: 'TU', plant: 'Plant A', dept: 'IT' };
  render(<Sidebar user={user} view="overview" onNav={() => {}} onLogout={() => {}} alertCount={2} warningCount={1} />);
  expect(screen.getByText(/Pharma Dashboard/i)).toBeInTheDocument();
  expect(screen.getByText(/System Admin/i)).toBeInTheDocument();
  const adminNav = screen.getAllByText(/Admin/i).find(el => el.closest('.nav-item'));
  expect(adminNav).toBeDefined();
});

test('NotifPanel displays correct status and close callback', () => {
  const alerts = generateAlerts();
  const onAck = jest.fn();
  const onClose = jest.fn();

  render(<NotifPanel alerts={alerts} onAck={onAck} onClose={onClose} />);
  expect(screen.getByText(/🔔 Notifications/i)).toBeInTheDocument();
  userEvent.click(screen.getByText(/✕ Close/i));
  expect(onClose).toHaveBeenCalled();

  userEvent.click(screen.getAllByText(/Ack/i)[0]);
  expect(onAck).toHaveBeenCalled();
});

test('renders core utility child components for coverage', () => {
  const { container } = render(<AlertFeed alerts={[{ icon: '⚠', msg: 'Test', time: 'now', type:'info'}]} />);
  expect(container.querySelector('.alert-feed')).toBeInTheDocument();

  const ch = {
    outlet: { flow: 10, temp: 25 },
    inflow: { flow: 9.8, temp: 24.7 },
    flowDiffPct: 3.2,
    tempDiff: 0.3,
    flowAlert: false,
    tempAlert: false,
  };
  const channel = render(<ChannelCard ch={ch} label="A" />);
  expect(channel.getByText(/Outlet Flow/i)).toBeInTheDocument();

  const clock = render(<Clock />);
  expect(clock.container.querySelector('.clock')).toBeInTheDocument();
  jest.advanceTimersByTime(1100);

  const emailPanel = render(
    <EmailPanel
      channels={{}}
      emailTo="operator@pharma.com"
      setEmailTo={() => {}}
      emailCc="manager@pharma.com"
      setEmailCc={() => {}}
      onSendTest={() => {}}
      onSendReport={() => {}}
      emailLog=""
    />
  );
  expect(emailPanel.getByText(/Active Triggers/i)).toBeInTheDocument();

  const motorPanel = render(<MotorPanel motorOn={false} motorMode="auto" runSeconds={1200} startsToday={1} tankPct={45} onSetMotor={() => {}} />);
  expect(motorPanel.getByText(/PUMP-01/i)).toBeInTheDocument();
  const autoButton = motorPanel.getByRole('button', { name: /^AUTO$/i });
  expect(autoButton).toBeInTheDocument();
  userEvent.click(autoButton);

  const tank = render(<Tank level={7000} motorOn={true} />);
  const statusItem = tank.getByText(/NORMAL|CRITICAL LOW|OVERFLOW RISK/i);
  expect(statusItem).toBeInTheDocument();
});

test('App admin and other core pages have routes and actions', () => {
  const user = USERS[0];
  const sampleMetric = generateMetrics(MACHINES[0], 0);
  const metrics = [{ ...sampleMetric, trend: sampleMetric.trend.slice(0, 20) }];
  const alerts = generateAlerts();

  const adminTree = render(<Admin />);
  expect(adminTree.getByText(/Admin Panel/i)).toBeInTheDocument();
  userEvent.click(adminTree.getByText(/⚙ Machines/i));

  const analyticsTree = render(<Analytics metrics={metrics.map(m => ({ ...m, efficiency:90, power:2.1, status:'running', rpm: 2500}))} />);
  expect(analyticsTree.getByText(/Production Analytics/i)).toBeInTheDocument();

  const machinesTree = render(<Machines metrics={[{ ...metrics[0], trend:[1,2,3] }]} user={user} />);
  expect(machinesTree.getByText(/Centrifuge Machines/i)).toBeInTheDocument();

  const maintenanceTree = render(<Maintenance metrics={[metrics[0]]} alerts={alerts} onAck={() => {}} user={user} />);
  expect(maintenanceTree.getByText(/Maintenance Center/i)).toBeInTheDocument();

  const overviewTree = render(<Overview metrics={[metrics[0]]} alerts={alerts} user={user} onAck={() => {}} />);
  expect(overviewTree.getByText(/Fleet Overview/i)).toBeInTheDocument();

  const reportsTree = render(<Reports />);
  expect(reportsTree.getByText(/Executive Reports/i)).toBeInTheDocument();

  const arc = render(<ArcGauge value={2} max={10} label="Test" />);
  expect(arc.getByText('Test')).toBeInTheDocument();

  const bar = render(<BarChart data={[{name:'a', value:10}]} width={200} height={150} />);
  const donut = render(<DonutChart size={80} segments={[{value:1,color:'#f00',label:'a'}]} />);
  const kv = render(<KV k="X" v="Y" />);
  const liveTag = render(<LiveTag status="good" label="Ok" />);
  const mlc = render(<MultiLineChart height={50} datasets={[{data:[1,2,3], color:'#00f'}]} />);
  const panel = render(<Panel title="P" />);
  const pr = render(<ProgressRow label="P" value={50} />);
  const sp = render(<Sparkline data={[1,2,3]} />);
  const sc = render(<StatCard label="S" value={42} />);
  const tg = render(<Tag label="T" type="blue" />);

  expect(statusColor('warning')).toBe('var(--red)');
  expect(kv.getByText(/X/)).toBeInTheDocument();
  expect(liveTag.getByText(/LIVE/i)).toBeInTheDocument();
  expect(sc.container.querySelector('.stat-card')).toBeInTheDocument();
});

test('MachineDetail and additional admin tabs render and interact', () => {
  const sampleMetric = generateMetrics(MACHINES[1], 0);
  const onBack = jest.fn();
  const detail = render(<MachineDetail m={sampleMetric} onBack={onBack} />);
  const heading = detail.getAllByRole('heading', { level: 2 }).find(h => h.textContent.includes('Centrifuge Beta'));
  expect(heading).toBeDefined();
  userEvent.click(detail.getByText(/^Machines$/i));
  expect(onBack).toHaveBeenCalled();

  const logs = render(<LogsTab />);
  expect(logs.getByText(/Audit Trail/i)).toBeInTheDocument();

  const roles = render(<RolesTab />);
  expect(roles.getByText(/Role & Permission Matrix/i)).toBeInTheDocument();

  const system = render(<SystemTab />);
  expect(system.getByText(/JWT Configuration/i)).toBeInTheDocument();

  // SDot is not exported by default in source, so we test statusColor mapping instead
  expect(statusColor('warning')).toBe('var(--red)');
});

