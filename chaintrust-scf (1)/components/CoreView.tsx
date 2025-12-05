import React, { useEffect, useState } from 'react';
import { ApplicationStatus, FinancingApplication, Notification, AuditLog, Supplier } from '../types';
import { Icons } from './Icons';

export const CoreView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'confirm' | 'suppliers'>('confirm');
  const [applications, setApplications] = useState<FinancingApplication[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  
  // Confirmation State
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const [confirmSteps, setConfirmSteps] = useState<string[]>([]);

  useEffect(() => {
    const storedData = localStorage.getItem('chaintrust_data');
    if (storedData) setApplications(JSON.parse(storedData));

    // Seed suppliers if not exist
    const storedSuppliers = localStorage.getItem('chaintrust_suppliers');
    if (storedSuppliers) {
        setSuppliers(JSON.parse(storedSuppliers));
    } else {
        const seedSuppliers: Supplier[] = [
            { id: 'SUP-001', name: '精诚精密制造有限公司', creditCode: '91310115MA1H...', level: 'Tier-1', status: 'Active', limit: 5000000 },
            { id: 'SUP-002', name: '日升电子元件厂', creditCode: '91440300MA5F...', level: 'Tier-2', status: 'Active', limit: 2000000 },
            { id: 'SUP-003', name: '绿源食品加工', creditCode: '91110105MA01...', level: 'Tier-1', status: 'Active', limit: 3500000 },
        ];
        setSuppliers(seedSuppliers);
        localStorage.setItem('chaintrust_suppliers', JSON.stringify(seedSuppliers));
    }
  }, []);

  const addLog = (action: string) => {
    const newLog: AuditLog = {
      id: Date.now().toString(),
      action: action,
      operator: 'Core Admin',
      role: 'CORE',
      timestamp: new Date().toLocaleString('zh-CN'),
      ip: '192.168.1.10',
      result: 'Success'
    };
    const logs = JSON.parse(localStorage.getItem('chaintrust_logs') || '[]');
    localStorage.setItem('chaintrust_logs', JSON.stringify([...logs, newLog]));
  };

  const addNotification = (title: string, msg: string) => {
    const newNotif: Notification = {
        id: Date.now().toString(),
        title: title,
        message: msg,
        type: 'success',
        read: false,
        timestamp: new Date().toLocaleString('zh-CN')
    };
    const notifs = JSON.parse(localStorage.getItem('chaintrust_notifs') || '[]');
    localStorage.setItem('chaintrust_notifs', JSON.stringify([newNotif, ...notifs]));
  }

  const startSmartConfirmation = (id: string) => {
      setProcessingId(id);
      setModalOpen(true);
      setConfirmSteps([]);
      setProgress(0);

      const steps = [
          "正在连接 Fabric 节点...",
          "验证链上资产哈希一致性...",
          "自动比对 ERP 采购订单数据...",
          "检查供应商信用额度...",
          "生成确权智能合约..."
      ];

      let currentStep = 0;
      const interval = setInterval(() => {
          if (currentStep < steps.length) {
              setConfirmSteps(prev => [...prev, steps[currentStep]]);
              setProgress(prev => prev + 20);
              currentStep++;
          } else {
              clearInterval(interval);
              finishConfirmation(id);
          }
      }, 800);
  };

  const finishConfirmation = (id: string) => {
    const updatedApps = applications.map(app => {
      if (app.id === id) {
        return { ...app, status: ApplicationStatus.RISK_ASSESSMENT };
      }
      return app;
    });
    setApplications(updatedApps);
    localStorage.setItem('chaintrust_data', JSON.stringify(updatedApps));
    
    addLog(`确权申请单 ${id}`);
    addNotification('确权成功', `申请单 ${id} 已完成确权并同步至银行。`);

    setTimeout(() => {
        setModalOpen(false);
        setProcessingId(null);
    }, 1000);
  };

  const pendingApps = applications.filter(app => app.status === ApplicationStatus.PENDING_CONFIRMATION);

  const renderConfirmationModal = () => (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-8 w-[500px] shadow-2xl">
              <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-slate-900 flex items-center">
                      <Icons.Database className="w-6 h-6 mr-2 text-blue-600" />
                      智能合约自动确权中
                  </h3>
              </div>
              
              <div className="space-y-4 mb-6">
                  {confirmSteps.map((step, idx) => (
                      <div key={idx} className="flex items-center text-sm text-slate-600 animate-fade-in">
                          <Icons.Check className="w-4 h-4 text-emerald-500 mr-2" />
                          {step}
                      </div>
                  ))}
                  {confirmSteps.length < 5 && (
                      <div className="flex items-center text-sm text-slate-400">
                          <div className="w-4 h-4 border-2 border-slate-300 border-t-blue-600 rounded-full animate-spin mr-2"></div>
                          处理中...
                      </div>
                  )}
              </div>

              <div className="w-full bg-slate-100 rounded-full h-2.5 mb-2">
                  <div className="bg-blue-600 h-2.5 rounded-full transition-all duration-300" style={{ width: `${progress}%` }}></div>
              </div>
              <p className="text-xs text-right text-slate-500">{progress}% 完成</p>
          </div>
      </div>
  );

  return (
    <div className="space-y-6">
      {modalOpen && renderConfirmationModal()}
      
      <div className="flex items-center space-x-4 border-b border-slate-200 pb-4">
        <button 
          onClick={() => setActiveTab('confirm')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === 'confirm' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'}`}
        >
          待办任务
        </button>
        <button 
          onClick={() => setActiveTab('suppliers')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === 'suppliers' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'}`}
        >
          供应商管理
        </button>
      </div>

      {activeTab === 'confirm' && (
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-200">
          <h3 className="text-lg font-bold text-slate-900 flex items-center">
            <Icons.Contract className="w-5 h-5 mr-2 text-blue-600" />
            待确权应收账款 (Smart Confirmation)
          </h3>
        </div>
        
        {pendingApps.length === 0 ? (
          <div className="p-12 text-center text-slate-500">
            <Icons.Check className="w-12 h-12 mx-auto text-slate-300 mb-3" />
            <p>暂无待确权的申请</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4">申请单号</th>
                  <th className="px-6 py-4">供应商名称</th>
                  <th className="px-6 py-4">资产类型</th>
                  <th className="px-6 py-4">融资金额</th>
                  <th className="px-6 py-4">链上凭证</th>
                  <th className="px-6 py-4 text-right">操作</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {pendingApps.map((app) => (
                  <tr key={app.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 font-mono text-slate-600">{app.id}</td>
                    <td className="px-6 py-4 font-medium text-slate-900">{app.companyName}</td>
                    <td className="px-6 py-4">
                        <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs border border-blue-100">
                            {app.fileType || '发票'}
                        </span>
                    </td>
                    <td className="px-6 py-4 font-bold text-slate-900">¥{app.amount.toLocaleString()}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded max-w-[120px] truncate" title={app.chainHash}>
                        <Icons.Chain className="w-3 h-3 mr-1 flex-shrink-0" />
                        {app.chainHash.substring(0, 10)}...
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button 
                        onClick={() => startSmartConfirmation(app.id)}
                        className="px-4 py-2 bg-blue-600 text-white text-xs font-bold rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
                      >
                        确认债权
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      )}

      {activeTab === 'suppliers' && (
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
             <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                    <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-200">
                        <tr>
                            <th className="px-6 py-4">供应商ID</th>
                            <th className="px-6 py-4">企业名称</th>
                            <th className="px-6 py-4">信用层级</th>
                            <th className="px-6 py-4">可用额度</th>
                            <th className="px-6 py-4">状态</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {suppliers.map(sup => (
                            <tr key={sup.id}>
                                <td className="px-6 py-4 font-mono text-slate-500">{sup.id}</td>
                                <td className="px-6 py-4 font-medium">{sup.name} <br/> <span className="text-xs text-slate-400">{sup.creditCode}</span></td>
                                <td className="px-6 py-4">
                                    <span className={`px-2 py-1 rounded text-xs ${sup.level === 'Tier-1' ? 'bg-indigo-100 text-indigo-700' : 'bg-slate-100 text-slate-600'}`}>
                                        {sup.level}
                                    </span>
                                </td>
                                <td className="px-6 py-4 font-mono">¥{sup.limit.toLocaleString()}</td>
                                <td className="px-6 py-4">
                                    <span className="text-emerald-600 flex items-center text-xs font-medium">
                                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-2"></div>
                                        {sup.status}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
             </div>
          </div>
      )}
    </div>
  );
};