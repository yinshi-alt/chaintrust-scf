import React from 'react';
import { Icons } from './Icons';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';

const data = [
  { name: 'Q1', SME: 4000, Core: 2400, amt: 2400 },
  { name: 'Q2', SME: 3000, Core: 1398, amt: 2210 },
  { name: 'Q3', SME: 2000, Core: 9800, amt: 2290 },
  { name: 'Q4', SME: 2780, Core: 3908, amt: 2000 },
];

export const RegulatorView: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="bg-slate-900 text-white p-6 rounded-xl shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold">区块链网络健康状态</h2>
            <p className="text-slate-400 text-sm mt-1">Hyperledger Fabric 联盟链网络</p>
          </div>
          <div className="flex items-center space-x-6">
             <div className="text-center">
                <div className="text-2xl font-mono font-bold text-emerald-400">12.5M</div>
                <div className="text-xs text-slate-400">区块高度</div>
             </div>
             <div className="text-center">
                <div className="text-2xl font-mono font-bold text-emerald-400">5</div>
                <div className="text-xs text-slate-400">共识节点</div>
             </div>
             <div className="text-center">
                <div className="text-2xl font-mono font-bold text-emerald-400">24ms</div>
                <div className="text-xs text-slate-400">平均延迟</div>
             </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h3 className="text-lg font-bold text-slate-900 mb-6">行业融资规模分布 (单位: 万元)</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar name="中小企业" dataKey="SME" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                <Bar name="核心企业确权" dataKey="Core" fill="#0f172a" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h3 className="text-lg font-bold text-slate-900 mb-6">系统风险预警趋势</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line name="风险事件" type="monotone" dataKey="amt" stroke="#ef4444" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200">
        <div className="p-6 border-b border-slate-200">
          <h3 className="text-lg font-bold text-slate-900">最新智能合约调用记录</h3>
        </div>
        <div className="p-6">
           <div className="space-y-4">
              {[1,2,3].map((i) => (
                <div key={i} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-100">
                   <div className="flex items-center space-x-3">
                      <div className="p-2 bg-blue-100 rounded text-blue-600">
                        <Icons.Contract className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-slate-900">合约调用: InvoiceFactoring::Verify</div>
                        <div className="text-xs text-slate-500 font-mono">TxHash: 0x829...ae92</div>
                      </div>
                   </div>
                   <div className="text-right">
                      <div className="text-sm font-medium text-emerald-600">调用成功</div>
                      <div className="text-xs text-slate-500">2023-11-15 10:42:{i}0</div>
                   </div>
                </div>
              ))}
           </div>
        </div>
      </div>
    </div>
  );
};
