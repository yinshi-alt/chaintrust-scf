import React, { useState, useEffect } from 'react';
import { UserRole, ApplicationStatus, FinancingApplication, Notification } from './types';
import { Icons } from './components/Icons';
import { SmeView } from './components/SmeView';
import { BankView } from './components/BankView';
import { RegulatorView } from './components/RegulatorView';
import { CoreView } from './components/CoreView';
import { AdminView } from './components/AdminView';

// Initial Seed Data to make the app look alive immediately
const SEED_DATA: FinancingApplication[] = [
  {
    id: 'APP-2023-891',
    companyName: '精诚精密制造有限公司',
    coreEnterprise: 'TechGiant Corp.',
    amount: 120000,
    status: ApplicationStatus.RISK_ASSESSMENT,
    riskScore: 85,
    chainHash: '0x3a2b1c...',
    date: '2023-11-10',
    fileName: 'invoice_891.pdf',
    fileType: '发票' as any,
    contractNo: 'HT-2023-099',
    signed: true
  },
  {
    id: 'APP-2023-892',
    companyName: '日升电子元件厂',
    coreEnterprise: 'Global Logistics Ltd.',
    amount: 450000,
    status: ApplicationStatus.PENDING_CONFIRMATION,
    riskScore: 0,
    chainHash: '0x9d8e7f...',
    date: '2023-11-12',
    fileName: 'invoice_892.pdf',
    fileType: '采购订单' as any,
    contractNo: 'HT-2023-102',
    signed: true
  },
  {
    id: 'APP-2023-893',
    companyName: '绿源食品加工',
    coreEnterprise: 'MegaCorp Industries',
    amount: 85000,
    status: ApplicationStatus.APPROVED,
    riskScore: 92,
    chainHash: '0x1z2x3c...',
    date: '2023-11-08',
    fileName: 'contract_893.pdf',
    fileType: '物流凭证' as any,
    contractNo: 'HT-2023-055',
    signed: true
  }
];

const App: React.FC = () => {
  const [currentUserRole, setCurrentUserRole] = useState<UserRole>(UserRole.SME);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showNotifPanel, setShowNotifPanel] = useState(false);

  useEffect(() => {
    // Seed data if empty
    const data = localStorage.getItem('chaintrust_data');
    if (!data) {
      localStorage.setItem('chaintrust_data', JSON.stringify(SEED_DATA));
    }

    // Polling for notifications (simulated real-time)
    const interval = setInterval(() => {
        const storedNotifs = localStorage.getItem('chaintrust_notifs');
        if (storedNotifs) {
            setNotifications(JSON.parse(storedNotifs));
        }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const renderContent = () => {
    switch (currentUserRole) {
      case UserRole.SME:
        return <SmeView />;
      case UserRole.BANK:
        return <BankView />;
      case UserRole.REGULATOR:
        return <RegulatorView />;
      case UserRole.CORE:
        return <CoreView />;
      case UserRole.ADMIN:
        return <AdminView />;
      default:
        return <SmeView />;
    }
  };

  const getRoleName = (role: UserRole) => {
      switch(role) {
          case UserRole.SME: return "中小企业";
          case UserRole.CORE: return "核心企业";
          case UserRole.BANK: return "合作银行";
          case UserRole.REGULATOR: return "监管机构";
          case UserRole.ADMIN: return "系统管理员";
          default: return "";
      }
  }

  const getCompanyName = (role: UserRole) => {
      switch(role) {
          case UserRole.SME: return "TechParts Ltd. (您)";
          case UserRole.CORE: return "TechGiant Corp.";
          case UserRole.BANK: return "全球信托银行";
          case UserRole.REGULATOR: return "金融管理局";
          case UserRole.ADMIN: return "IT 运维中心";
          default: return "";
      }
  }

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAllRead = () => {
      const updated = notifications.map(n => ({...n, read: true}));
      setNotifications(updated);
      localStorage.setItem('chaintrust_notifs', JSON.stringify(updated));
  }

  return (
    <div className="flex h-screen bg-slate-50">
      {/* Sidebar */}
      <aside 
        className={`${
          isSidebarOpen ? 'w-64' : 'w-20'
        } bg-slate-900 text-white transition-all duration-300 flex flex-col fixed h-full z-20`}
      >
        <div className="h-16 flex items-center justify-center border-b border-slate-800">
          {isSidebarOpen ? (
            <div className="flex items-center space-x-2 font-bold text-xl tracking-tight">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <Icons.Chain className="w-5 h-5 text-white" />
              </div>
              <span>ChainTrust</span>
            </div>
          ) : (
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
               <Icons.Chain className="w-5 h-5 text-white" />
            </div>
          )}
        </div>

        <nav className="flex-1 py-6 px-3 space-y-2">
          <button 
            className={`w-full flex items-center space-x-3 px-3 py-3 rounded-lg transition-colors ${currentUserRole === UserRole.SME ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}
            onClick={() => setCurrentUserRole(UserRole.SME)}
            title="SME Portal"
          >
            <Icons.Users className="w-5 h-5 flex-shrink-0" />
            {isSidebarOpen && <span>中小企业门户</span>}
          </button>

          <button 
            className={`w-full flex items-center space-x-3 px-3 py-3 rounded-lg transition-colors ${currentUserRole === UserRole.CORE ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}
            onClick={() => setCurrentUserRole(UserRole.CORE)}
            title="Core Enterprise"
          >
            <Icons.Security className="w-5 h-5 flex-shrink-0" />
            {isSidebarOpen && <span>核心企业确权</span>}
          </button>

          <button 
            className={`w-full flex items-center space-x-3 px-3 py-3 rounded-lg transition-colors ${currentUserRole === UserRole.BANK ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}
            onClick={() => setCurrentUserRole(UserRole.BANK)}
            title="Bank Dashboard"
          >
            <Icons.Bank className="w-5 h-5 flex-shrink-0" />
            {isSidebarOpen && <span>银行风控中心</span>}
          </button>

          <button 
            className={`w-full flex items-center space-x-3 px-3 py-3 rounded-lg transition-colors ${currentUserRole === UserRole.REGULATOR ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}
            onClick={() => setCurrentUserRole(UserRole.REGULATOR)}
            title="Regulator View"
          >
            <Icons.Chart className="w-5 h-5 flex-shrink-0" />
            {isSidebarOpen && <span>监管驾驶舱</span>}
          </button>
          
          <div className="pt-4 mt-4 border-t border-slate-800">
             <button 
                className={`w-full flex items-center space-x-3 px-3 py-3 rounded-lg transition-colors ${currentUserRole === UserRole.ADMIN ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}
                onClick={() => setCurrentUserRole(UserRole.ADMIN)}
                title="Admin"
              >
                <Icons.Admin className="w-5 h-5 flex-shrink-0" />
                {isSidebarOpen && <span>系统管理</span>}
              </button>
          </div>
        </nav>

        <div className="p-4 border-t border-slate-800">
          <button className="flex items-center space-x-3 text-slate-400 hover:text-white transition-colors w-full">
            <Icons.Logout className="w-5 h-5" />
            {isSidebarOpen && <span>退出登录</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className={`flex-1 flex flex-col transition-all duration-300 ${isSidebarOpen ? 'ml-64' : 'ml-20'}`}>
        {/* Header */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 sticky top-0 z-10 shadow-sm relative">
          <div className="flex items-center space-x-4">
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 hover:bg-slate-100 rounded-lg text-slate-600"
            >
              <Icons.Menu className="w-5 h-5" />
            </button>
            <div className="flex items-center text-slate-500 bg-slate-100 px-3 py-1.5 rounded-md text-sm">
              <Icons.Search className="w-4 h-4 mr-2" />
              <input type="text" placeholder="搜索 交易哈希 / 申请单号..." className="bg-transparent border-none outline-none w-64" />
            </div>
          </div>

          <div className="flex items-center space-x-6">
            <div className="relative">
                <button 
                    onClick={() => setShowNotifPanel(!showNotifPanel)}
                    className="relative p-2 hover:bg-slate-100 rounded-full text-slate-500 transition-colors"
                >
                <Icons.Notification className="w-5 h-5" />
                {unreadCount > 0 && (
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                )}
                </button>
                
                {showNotifPanel && (
                    <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-xl shadow-xl border border-slate-100 z-50 overflow-hidden">
                        <div className="p-3 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                            <span className="text-sm font-bold text-slate-700">通知中心</span>
                            <button onClick={markAllRead} className="text-xs text-blue-600 hover:underline">全部已读</button>
                        </div>
                        <div className="max-h-64 overflow-y-auto">
                            {notifications.length === 0 ? (
                                <div className="p-4 text-center text-slate-400 text-sm">暂无新通知</div>
                            ) : (
                                notifications.map(notif => (
                                    <div key={notif.id} className={`p-3 border-b border-slate-50 hover:bg-slate-50 ${!notif.read ? 'bg-blue-50/50' : ''}`}>
                                        <div className="flex justify-between items-start">
                                            <h4 className="text-sm font-medium text-slate-800">{notif.title}</h4>
                                            <span className="text-[10px] text-slate-400">{notif.timestamp.split(' ')[1]}</span>
                                        </div>
                                        <p className="text-xs text-slate-500 mt-1">{notif.message}</p>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                )}
            </div>
            
            <div className="flex items-center space-x-3 border-l border-slate-200 pl-6">
              <div className="text-right hidden md:block">
                <p className="text-sm font-bold text-slate-900">
                  {getCompanyName(currentUserRole)}
                </p>
                <p className="text-xs text-slate-500 font-medium">{getRoleName(currentUserRole)}</p>
              </div>
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold shadow-md">
                {getRoleName(currentUserRole)[0]}
              </div>
            </div>
          </div>
        </header>

        {/* Scrollable Main Area */}
        <main className="flex-1 overflow-y-auto p-8">
           <div className="max-w-7xl mx-auto">
             <div className="mb-8">
               <h1 className="text-2xl font-bold text-slate-900">
                 {currentUserRole === UserRole.SME ? '供应链金融服务台' : 
                  currentUserRole === UserRole.BANK ? '信贷审批控制台' :
                  currentUserRole === UserRole.CORE ? '核心企业确权中心' :
                  currentUserRole === UserRole.ADMIN ? '系统运维管理后台' :
                  '金融监管大数据平台'}
               </h1>
               <p className="text-slate-500 mt-1">
                 {currentUserRole === UserRole.SME ? '上传应收账款凭证，快速发起融资申请' : 
                  currentUserRole === UserRole.BANK ? '基于区块链可信数据进行风险评估与放款' :
                  currentUserRole === UserRole.CORE ? '确认供应商应收账款真实性，助力供应链生态' :
                  currentUserRole === UserRole.ADMIN ? '监控区块链节点状态与审计系统日志' :
                  '实时监控全网金融活动与风险指标'}
               </p>
             </div>
             
             {renderContent()}
           </div>
        </main>
      </div>
    </div>
  );
};

export default App;