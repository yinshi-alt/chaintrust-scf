import React, { useState, useEffect } from 'react';
import { ApplicationStatus, FinancingApplication, AssetType, AuditLog, Notification } from '../types';
import { Icons } from './Icons';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const mockChartData = [
  { name: '1月', value: 4000 },
  { name: '2月', value: 3000 },
  { name: '3月', value: 2000 },
  { name: '4月', value: 2780 },
  { name: '5月', value: 1890 },
  { name: '6月', value: 2390 },
];

export const SmeView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'apply'>('overview');
  const [uploadStep, setUploadStep] = useState(1);
  const [file, setFile] = useState<File | null>(null);
  const [applications, setApplications] = useState<FinancingApplication[]>([]);
  
  // Form State
  const [amount, setAmount] = useState(50000);
  const [coreEnterprise, setCoreEnterprise] = useState('TechGiant Corp.');
  const [contractNo, setContractNo] = useState('HT-2023-001');
  const [assetType, setAssetType] = useState<AssetType>(AssetType.INVOICE);
  
  // Signing State
  const [signing, setSigning] = useState(false);

  useEffect(() => {
    const storedData = localStorage.getItem('chaintrust_data');
    if (storedData) {
      setApplications(JSON.parse(storedData));
    }
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const addLog = (action: string) => {
    const newLog: AuditLog = {
      id: Date.now().toString(),
      action: action,
      operator: 'SME Admin',
      role: 'SME',
      timestamp: new Date().toLocaleString('zh-CN'),
      ip: '192.168.1.5',
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
        type: 'info',
        read: false,
        timestamp: new Date().toLocaleString('zh-CN')
    };
    const notifs = JSON.parse(localStorage.getItem('chaintrust_notifs') || '[]');
    localStorage.setItem('chaintrust_notifs', JSON.stringify([newNotif, ...notifs]));
  }

  const handleSignAndSubmit = () => {
      setSigning(true);
      setTimeout(() => {
          setSigning(false);
          submitApplication();
      }, 2000);
  };

  const submitApplication = () => {
    const newApp: FinancingApplication = {
      id: `APP-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
      companyName: 'TechParts Ltd. (当前用户)',
      coreEnterprise: coreEnterprise,
      amount: Number(amount),
      date: new Date().toLocaleDateString('zh-CN'),
      status: ApplicationStatus.PENDING_CONFIRMATION,
      riskScore: 0, 
      chainHash: '0x' + Math.random().toString(16).substr(2, 64),
      fileName: file ? file.name : 'unknown.pdf',
      fileType: assetType,
      contractNo: contractNo,
      signed: true
    };

    const updatedApps = [newApp, ...applications];
    setApplications(updatedApps);
    localStorage.setItem('chaintrust_data', JSON.stringify(updatedApps));
    
    addLog(`提交融资申请 ${newApp.id} (${assetType})`);
    addNotification('申请已提交', `融资申请 ${newApp.id} 已完成电子签约并上链。`);

    alert("电子签约成功！申请数据已加密上链。");
    setUploadStep(1);
    setFile(null);
    setActiveTab('overview');
  };

  const renderOverview = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-slate-500">可用融资额度</p>
              <h3 className="text-2xl font-bold text-slate-900 mt-1">¥1,500,000.00</h3>
            </div>
            <div className="p-2 bg-blue-50 rounded-lg">
              <Icons.Bank className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm text-green-600">
            <Icons.Check className="w-4 h-4 mr-1" />
            <span>年化利率 4.5% 起</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-slate-500">进行中的申请</p>
              <h3 className="text-2xl font-bold text-slate-900 mt-1">
                {applications.filter(a => a.status !== ApplicationStatus.LOAN_DISBURSED && a.status !== ApplicationStatus.REJECTED).length}
              </h3>
            </div>
            <div className="p-2 bg-indigo-50 rounded-lg">
              <Icons.Document className="w-6 h-6 text-indigo-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm text-indigo-600">
            <span>待处理总额: ¥{applications.reduce((acc, curr) => (curr.status !== ApplicationStatus.LOAN_DISBURSED ? acc + curr.amount : acc), 0).toLocaleString()}</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-slate-500">链上数字资产</p>
              <h3 className="text-2xl font-bold text-slate-900 mt-1">已验证</h3>
            </div>
            <div className="p-2 bg-emerald-50 rounded-lg">
              <Icons.Chain className="w-6 h-6 text-emerald-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm text-slate-500">
            <span>数据同步正常</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-bold text-slate-900 mb-4">现金流分析</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={mockChartData}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip />
                <Area type="monotone" dataKey="value" stroke="#3b82f6" fillOpacity={1} fill="url(#colorValue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 overflow-y-auto max-h-[350px]">
           <h3 className="text-lg font-bold text-slate-900 mb-4">最近申请记录</h3>
           <div className="space-y-3">
             {applications.length === 0 ? (
               <p className="text-slate-500 text-sm">暂无申请记录</p>
             ) : (
               applications.map((app) => (
                 <div key={app.id} className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                   <div className="flex justify-between items-center mb-1">
                     <span className="font-bold text-slate-900">¥{app.amount.toLocaleString()}</span>
                     <span className={`text-xs px-2 py-0.5 rounded-full ${
                       app.status === ApplicationStatus.APPROVED || app.status === ApplicationStatus.LOAN_DISBURSED ? 'bg-green-100 text-green-700' :
                       app.status === ApplicationStatus.REJECTED ? 'bg-red-100 text-red-700' :
                       'bg-blue-100 text-blue-700'
                     }`}>
                       {app.status}
                     </span>
                   </div>
                   <div className="text-xs text-slate-500 flex justify-between">
                     <span>{app.coreEnterprise}</span>
                     <span>{app.fileType || '发票'}</span>
                   </div>
                 </div>
               ))
             )}
           </div>
        </div>
      </div>
    </div>
  );

  const renderApplicationWizard = () => (
    <div className="max-w-2xl mx-auto bg-white p-8 rounded-xl shadow-sm border border-slate-100 relative">
      {signing && (
          <div className="absolute inset-0 bg-white/90 z-20 flex flex-col items-center justify-center rounded-xl">
              <Icons.Signature className="w-16 h-16 text-blue-600 mb-4 animate-bounce" />
              <h3 className="text-xl font-bold text-slate-900">正在进行 CA 电子签名...</h3>
              <p className="text-slate-500 mt-2">调用第三方 CFCA 接口中</p>
          </div>
      )}

      <div className="flex items-center justify-between mb-8">
        <h2 className="text-xl font-bold text-slate-900">发起融资申请</h2>
        <div className="flex items-center space-x-2 text-sm">
          <span className={`w-8 h-8 rounded-full flex items-center justify-center ${uploadStep >= 1 ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-500'}`}>1</span>
          <div className="w-8 h-0.5 bg-slate-200"></div>
          <span className={`w-8 h-8 rounded-full flex items-center justify-center ${uploadStep >= 2 ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-500'}`}>2</span>
          <div className="w-8 h-0.5 bg-slate-200"></div>
          <span className={`w-8 h-8 rounded-full flex items-center justify-center ${uploadStep >= 3 ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-500'}`}>3</span>
        </div>
      </div>

      {uploadStep === 1 && (
        <div className="space-y-6">
          <div className="grid grid-cols-3 gap-4">
              {[AssetType.INVOICE, AssetType.ORDER, AssetType.LOGISTICS].map(type => (
                  <button 
                    key={type}
                    onClick={() => setAssetType(type)}
                    className={`p-4 rounded-lg border text-center transition-all ${assetType === type ? 'border-blue-600 bg-blue-50 text-blue-700' : 'border-slate-200 hover:bg-slate-50'}`}
                  >
                      {type === AssetType.INVOICE && <Icons.Document className="w-6 h-6 mx-auto mb-2" />}
                      {type === AssetType.ORDER && <Icons.Contract className="w-6 h-6 mx-auto mb-2" />}
                      {type === AssetType.LOGISTICS && <Icons.Truck className="w-6 h-6 mx-auto mb-2" />}
                      <span className="text-sm font-medium">{type}</span>
                  </button>
              ))}
          </div>

          <div className="border-2 border-dashed border-slate-300 rounded-xl p-8 text-center hover:bg-slate-50 transition-colors">
            <Icons.Upload className="w-12 h-12 text-slate-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-slate-900">上传{assetType}文件</h3>
            <p className="text-slate-500 text-sm mt-2 mb-6">支持 PDF, JPG, PNG (最大 10MB)</p>
            <input 
              type="file" 
              className="hidden" 
              id="file-upload"
              onChange={handleFileChange}
            />
            <label 
              htmlFor="file-upload"
              className="px-6 py-2.5 bg-white border border-slate-300 text-slate-700 font-medium rounded-lg hover:bg-slate-50 cursor-pointer inline-block"
            >
              {file ? '更换文件' : '选择文件'}
            </label>
            {file && (
              <div className="mt-4 flex items-center justify-center text-sm text-green-600 font-medium">
                <Icons.Check className="w-4 h-4 mr-1" />
                {file.name}
              </div>
            )}
          </div>
          <div className="flex justify-end">
            <button 
              onClick={() => setUploadStep(2)}
              disabled={!file}
              className="px-6 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              下一步：生成链上指纹
            </button>
          </div>
        </div>
      )}

      {uploadStep === 2 && (
        <div className="space-y-6">
          <div className="bg-slate-50 p-6 rounded-lg border border-slate-200">
            <h3 className="font-medium text-slate-900 mb-4">区块链存证生成中...</h3>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">凭证类型:</span>
                <span className="font-medium text-slate-900">{assetType}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">文件名:</span>
                <span className="font-mono text-slate-900">{file?.name}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">文件大小:</span>
                <span className="font-mono text-slate-900">{(file?.size ? file.size / 1024 : 0).toFixed(2)} KB</span>
              </div>
              <div className="flex flex-col space-y-1 mt-4">
                <span className="text-xs uppercase tracking-wider text-slate-500">SHA-256 哈希值 (唯一标识)</span>
                <div className="bg-white p-3 rounded border border-slate-200 font-mono text-xs text-blue-600 break-all shadow-sm">
                  0x7f23b1892e8a71239c0d12e9128371298371298a7s98d7f987s9d8f79s8d7f98s7d9f87s
                </div>
              </div>
            </div>
          </div>
          <div className="flex justify-between">
            <button 
              onClick={() => setUploadStep(1)}
              className="px-6 py-2.5 text-slate-600 font-medium hover:text-slate-900"
            >
              返回上一步
            </button>
            <button 
              onClick={() => setUploadStep(3)}
              className="px-6 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 shadow-sm"
            >
              下一步：确认融资信息
            </button>
          </div>
        </div>
      )}

      {uploadStep === 3 && (
        <div className="space-y-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">融资金额 (CNY)</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-slate-500">¥</span>
                </div>
                <input 
                  type="number" 
                  value={amount}
                  onChange={(e) => setAmount(Number(e.target.value))}
                  className="block w-full pl-7 pr-12 py-2.5 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
             <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">关联商务合同编号</label>
              <input 
                  type="text" 
                  value={contractNo}
                  onChange={(e) => setContractNo(e.target.value)}
                  className="block w-full px-3 py-2.5 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">关联核心企业 (付款方)</label>
              <select 
                value={coreEnterprise}
                onChange={(e) => setCoreEnterprise(e.target.value)}
                className="block w-full py-2.5 px-3 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="TechGiant Corp.">TechGiant Corp. (科技巨头股份有限公司)</option>
                <option value="Global Logistics Ltd.">Global Logistics Ltd. (全球物流集团)</option>
                <option value="MegaCorp Industries">MegaCorp Industries (宏大实业)</option>
              </select>
            </div>
          </div>
          <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200 flex items-start">
            <Icons.Alert className="w-5 h-5 text-yellow-600 mt-0.5 mr-3 flex-shrink-0" />
            <p className="text-sm text-yellow-700">
              点击提交即代表签署电子合同，系统将自动校验您的数字证书。
            </p>
          </div>
          <div className="flex justify-between pt-4">
            <button 
              onClick={() => setUploadStep(2)}
              className="px-6 py-2.5 text-slate-600 font-medium hover:text-slate-900"
            >
              返回
            </button>
            <button 
              onClick={handleSignAndSubmit}
              className="flex items-center px-6 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 shadow-lg shadow-blue-500/30"
            >
              <Icons.Signature className="w-4 h-4 mr-2" />
              电子签约并提交
            </button>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4 border-b border-slate-200 pb-4">
        <button 
          onClick={() => setActiveTab('overview')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === 'overview' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'}`}
        >
          概览
        </button>
        <button 
          onClick={() => setActiveTab('apply')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === 'apply' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'}`}
        >
          融资申请
        </button>
      </div>

      {activeTab === 'overview' && renderOverview()}
      {activeTab === 'apply' && renderApplicationWizard()}
    </div>
  );
};