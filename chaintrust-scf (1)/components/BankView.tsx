import React, { useState, useEffect } from 'react';
import { ApplicationStatus, FinancingApplication } from '../types';
import { Icons } from './Icons';

export const BankView: React.FC = () => {
  const [applications, setApplications] = useState<FinancingApplication[]>([]);

  useEffect(() => {
    const storedData = localStorage.getItem('chaintrust_data');
    if (storedData) {
      setApplications(JSON.parse(storedData));
    }
  }, []);

  const updateStatus = (id: string, newStatus: ApplicationStatus) => {
    const updatedApps = applications.map(app => {
      if (app.id === id) {
        return { 
            ...app, 
            status: newStatus,
            riskScore: newStatus === ApplicationStatus.APPROVED ? Math.floor(Math.random() * (95 - 80) + 80) : app.riskScore 
        };
      }
      return app;
    });
    setApplications(updatedApps);
    localStorage.setItem('chaintrust_data', JSON.stringify(updatedApps));
    
    if (newStatus === ApplicationStatus.APPROVED) {
        alert("审批通过！智能合约已自动触发放款指令。");
        // Simulate immediate disbursement for demo effect
        setTimeout(() => {
            updateStatus(id, ApplicationStatus.LOAN_DISBURSED);
        }, 2000);
    }
  };

  const actionableApps = applications.filter(app => app.status === ApplicationStatus.RISK_ASSESSMENT);
  const processedApps = applications.filter(app => app.status === ApplicationStatus.APPROVED || app.status === ApplicationStatus.REJECTED || app.status === ApplicationStatus.LOAN_DISBURSED);

  return (
    <div className="space-y-6">
      {/* 仪表盘 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <p className="text-slate-500 text-sm font-medium">待处理审批</p>
          <h3 className="text-2xl font-bold text-slate-900 mt-2">{actionableApps.length}</h3>
          <div className="mt-2 text-xs text-orange-600 font-medium">实时任务队列</div>
        </div>
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <p className="text-slate-500 text-sm font-medium">累计放款金额</p>
          <h3 className="text-2xl font-bold text-slate-900 mt-2">¥420.5万</h3>
          <div className="mt-2 text-xs text-green-600 font-medium">资金池充足</div>
        </div>
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <p className="text-slate-500 text-sm font-medium">平均风控得分</p>
          <h3 className="text-2xl font-bold text-slate-900 mt-2">78.5</h3>
          <div className="mt-2 text-xs text-blue-600 font-medium">风险可控</div>
        </div>
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <p className="text-slate-500 text-sm font-medium">坏账率</p>
          <h3 className="text-2xl font-bold text-slate-900 mt-2">0.02%</h3>
          <div className="mt-2 text-xs text-slate-500 font-medium">优于行业平均</div>
        </div>
      </div>

      {/* 审批列表 */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-200 flex justify-between items-center">
          <h3 className="text-lg font-bold text-slate-900">融资审批队列</h3>
          <button className="flex items-center space-x-2 text-sm text-blue-600 font-medium hover:text-blue-700">
            <Icons.Chart className="w-4 h-4" />
            <span>查看风控模型</span>
          </button>
        </div>
        
        {actionableApps.length === 0 ? (
           <div className="p-10 text-center text-slate-500">
               <Icons.Check className="w-10 h-10 mx-auto mb-2 text-slate-300" />
               暂无需要处理的申请
           </div>
        ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-200">
              <tr>
                <th className="px-6 py-4">申请编号</th>
                <th className="px-6 py-4">供应商企业</th>
                <th className="px-6 py-4">核心企业 (已确权)</th>
                <th className="px-6 py-4">申请金额</th>
                <th className="px-6 py-4">系统建议</th>
                <th className="px-6 py-4 text-right">决策</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {actionableApps.map((app) => (
                <tr key={app.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 font-mono text-slate-600">{app.id}</td>
                  <td className="px-6 py-4 font-medium text-slate-900">{app.companyName}</td>
                  <td className="px-6 py-4 text-slate-600 flex items-center">
                    {/* Icons.Security is mapped to ShieldCheck in Icons.tsx */}
                    <Icons.Security className="w-4 h-4 text-emerald-500 mr-1" />
                    {app.coreEnterprise}
                  </td>
                  <td className="px-6 py-4 font-bold">¥{app.amount.toLocaleString()}</td>
                  <td className="px-6 py-4">
                     <span className="text-green-600 text-xs font-bold bg-green-50 px-2 py-1 rounded">建议通过 (AI评分: 85)</span>
                  </td>
                  <td className="px-6 py-4 text-right space-x-2">
                    <button 
                        onClick={() => updateStatus(app.id, ApplicationStatus.REJECTED)}
                        className="px-3 py-1.5 text-red-600 hover:bg-red-50 rounded border border-transparent hover:border-red-200 text-xs font-bold transition-all"
                    >
                        驳回
                    </button>
                    <button 
                        onClick={() => updateStatus(app.id, ApplicationStatus.APPROVED)}
                        className="px-3 py-1.5 bg-blue-600 text-white rounded shadow-sm hover:bg-blue-700 text-xs font-bold transition-all"
                    >
                        批准放款
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        )}
      </div>

      {/* 已处理历史 */}
       <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden opacity-80">
        <div className="p-4 border-b border-slate-200 bg-slate-50">
          <h3 className="text-sm font-bold text-slate-700">最近处理记录</h3>
        </div>
        <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <tbody className="divide-y divide-slate-100">
                {processedApps.slice(0, 5).map((app) => (
                  <tr key={app.id}>
                    <td className="px-6 py-3 font-mono text-slate-500">{app.id}</td>
                    <td className="px-6 py-3 text-slate-700">{app.companyName}</td>
                    <td className="px-6 py-3 text-slate-700">¥{app.amount.toLocaleString()}</td>
                    <td className="px-6 py-3">
                       <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                           app.status === ApplicationStatus.LOAN_DISBURSED ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                       }`}>
                          {app.status}
                       </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
        </div>
      </div>
    </div>
  );
};