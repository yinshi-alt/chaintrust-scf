import React, { useState, useEffect } from 'react';
import { AuditLog, UserRole } from '../types';
import { Icons } from './Icons';

export const AdminView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'users' | 'logs' | 'config'>('logs');
  const [logs, setLogs] = useState<AuditLog[]>([]);

  useEffect(() => {
    const storedLogs = localStorage.getItem('chaintrust_logs');
    if (storedLogs) {
      setLogs(JSON.parse(storedLogs).reverse()); // Show newest first
    }
  }, []);

  const renderLogs = () => (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="p-6 border-b border-slate-200 flex justify-between items-center">
        <h3 className="text-lg font-bold text-slate-900 flex items-center">
          <Icons.History className="w-5 h-5 mr-2 text-slate-500" />
          系统操作审计日志 (Audit Trails)
        </h3>
        <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">导出 CSV</button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-200">
            <tr>
              <th className="px-6 py-4">时间戳</th>
              <th className="px-6 py-4">操作人</th>
              <th className="px-6 py-4">角色</th>
              <th className="px-6 py-4">操作行为</th>
              <th className="px-6 py-4">IP来源</th>
              <th className="px-6 py-4">结果</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {logs.length === 0 ? (
              <tr><td colSpan={6} className="px-6 py-8 text-center text-slate-500">暂无审计记录</td></tr>
            ) : (
              logs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-3 font-mono text-slate-500">{log.timestamp}</td>
                  <td className="px-6 py-3 text-slate-900 font-medium">{log.operator}</td>
                  <td className="px-6 py-3">
                    <span className="px-2 py-1 rounded-full bg-slate-100 text-xs text-slate-600 border border-slate-200">
                      {log.role}
                    </span>
                  </td>
                  <td className="px-6 py-3 text-slate-700">{log.action}</td>
                  <td className="px-6 py-3 font-mono text-xs text-slate-400">{log.ip}</td>
                  <td className="px-6 py-3">
                    <span className="text-emerald-600 flex items-center text-xs font-bold">
                      <Icons.Check className="w-3 h-3 mr-1" />
                      {log.result}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderConfig = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
       <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center">
            <Icons.Server className="w-5 h-5 mr-2 text-blue-600" />
            区块链节点状态 (Hyperledger Fabric)
          </h3>
          <div className="space-y-4">
             <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                <div className="flex items-center space-x-3">
                   <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                   <span className="font-medium text-slate-700">Orderer Node 1</span>
                </div>
                <span className="text-xs text-slate-500 font-mono">Running (Uptime: 14d)</span>
             </div>
             <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                <div className="flex items-center space-x-3">
                   <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                   <span className="font-medium text-slate-700">Peer Node (Org1)</span>
                </div>
                <span className="text-xs text-slate-500 font-mono">Synced (Block #12938)</span>
             </div>
             <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                <div className="flex items-center space-x-3">
                   <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                   <span className="font-medium text-slate-700">Chaincode: Financing</span>
                </div>
                <span className="text-xs text-slate-500 font-mono">v2.4.1 (Active)</span>
             </div>
          </div>
          <div className="mt-6 pt-6 border-t border-slate-100">
             <button className="w-full py-2 border border-slate-300 rounded-lg text-slate-600 font-medium hover:bg-slate-50 text-sm">
                重启节点服务
             </button>
          </div>
       </div>

       <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center">
            <Icons.Settings className="w-5 h-5 mr-2 text-slate-600" />
            系统参数配置
          </h3>
          <div className="space-y-4">
             <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">默认风控阈值 (Credit Score)</label>
                <input type="number" defaultValue={60} className="w-full px-3 py-2 border border-slate-300 rounded-lg" />
             </div>
             <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">自动确权超时时间 (Hours)</label>
                <input type="number" defaultValue={24} className="w-full px-3 py-2 border border-slate-300 rounded-lg" />
             </div>
             <div className="flex items-center justify-between pt-2">
                <span className="text-sm text-slate-700 font-medium">启用强制多因子认证 (MFA)</span>
                <div className="w-11 h-6 bg-blue-600 rounded-full relative cursor-pointer">
                   <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full"></div>
                </div>
             </div>
          </div>
          <div className="mt-6 pt-6 border-t border-slate-100 flex justify-end">
             <button className="px-4 py-2 bg-slate-900 text-white rounded-lg text-sm font-medium hover:bg-slate-800">
                保存配置
             </button>
          </div>
       </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4 border-b border-slate-200 pb-4">
        <button 
          onClick={() => setActiveTab('logs')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === 'logs' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'}`}
        >
          操作审计
        </button>
        <button 
          onClick={() => setActiveTab('config')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === 'config' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'}`}
        >
          系统配置
        </button>
      </div>

      {activeTab === 'logs' && renderLogs()}
      {activeTab === 'config' && renderConfig()}
    </div>
  );
};