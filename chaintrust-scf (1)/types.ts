export enum UserRole {
  SME = 'SME', // 中小企业
  CORE = 'CORE', // 核心企业
  BANK = 'BANK', // 银行/资金方
  REGULATOR = 'REGULATOR', // 监管机构
  ADMIN = 'ADMIN' // 系统管理员
}

export enum ApplicationStatus {
  PENDING_CONFIRMATION = '待确权',
  CONFIRMED = '已确权',
  RISK_ASSESSMENT = '风控审核中',
  APPROVED = '审核通过',
  REJECTED = '已驳回',
  LOAN_DISBURSED = '已放款'
}

export enum AssetType {
  INVOICE = '发票',
  ORDER = '采购订单',
  LOGISTICS = '物流凭证'
}

export interface FinancingApplication {
  id: string;
  companyName: string;      // 申请企业
  coreEnterprise: string;   // 关联核心企业
  amount: number;           // 融资金额
  date: string;             // 申请日期
  status: ApplicationStatus;
  riskScore: number;        // 动态计算的风控分
  chainHash: string;        // 链上哈希
  fileName: string;         // 上传的凭证文件名
  fileType: AssetType;      // 凭证类型
  contractNo: string;       // 合同编号
  signed: boolean;          // 是否已电子签约
}

export interface ChainRecord {
  id: string;
  type: 'INVOICE' | 'CONTRACT' | 'LOGISTICS';
  hash: string;
  timestamp: string;
  owner: string;
  verified: boolean;
}

export interface AuditLog {
  id: string;
  action: string;
  operator: string;
  role: string;
  timestamp: string;
  ip: string;
  result: 'Success' | 'Failure';
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  read: boolean;
  timestamp: string;
}

export interface Supplier {
  id: string;
  name: string;
  creditCode: string; // 统一社会信用代码
  level: 'Tier-1' | 'Tier-2' | 'Tier-N';
  status: 'Active' | 'Blacklisted';
  limit: number;
}