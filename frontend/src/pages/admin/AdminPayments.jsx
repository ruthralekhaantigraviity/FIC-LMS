import React, { useState, useEffect } from 'react';
import { 
  Search, CheckCircle, Clock, XCircle, FileText, 
  Download, IndianRupee, Filter
} from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../utils/api';

const AdminPayments = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    // For now we'll mock the data if the endpoint isn't ready
    try {
      // Uncomment when endpoint is ready
      // const { data } = await api.get('/payments');
      // setPayments(data.data);
      
      // Mock data
      setTimeout(() => {
        setPayments([
          { _id: '1', student: { name: 'Rahul Sharma' }, course: { title: 'React Fullstack' }, amount: 15000, status: 'completed', paidAt: new Date(), transactionId: 'TXN123456' },
          { _id: '2', student: { name: 'Sneha Patil' }, course: { title: 'UI/UX Design' }, amount: 12000, status: 'pending', createdAt: new Date() },
          { _id: '3', student: { name: 'Amit Verma' }, course: { title: 'Data Science' }, amount: 25000, status: 'completed', paidAt: new Date(Date.now() - 86400000), transactionId: 'TXN789012' },
          { _id: '4', student: { name: 'Priya Das' }, course: { title: 'Digital Marketing' }, amount: 10000, status: 'failed', createdAt: new Date(Date.now() - 172800000) },
        ]);
        setLoading(false);
      }, 500);
      
    } catch (err) {
      console.error("Error fetching payments:", err);
      toast.error("Failed to load payments");
      setLoading(false);
    }
  };

  const handleExportPaidStudents = () => {
    const paidPayments = payments.filter(p => p.status === 'completed');
    if (paidPayments.length === 0) {
      return toast.error("No paid student records available to export");
    }

    // CSV header
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "Student Name,Course Title,Transaction ID,Amount (INR),Payment Date,Status\n";

    // CSV rows
    paidPayments.forEach(p => {
      const studentName = `"${p.student?.name || ''}"`;
      const courseTitle = `"${p.course?.title || ''}"`;
      const txnId = `"${p.transactionId || ''}"`;
      const amount = p.amount || 0;
      const date = `"${new Date(p.paidAt || p.createdAt).toLocaleDateString()}"`;
      const status = `"${p.status}"`;
      
      csvContent += `${studentName},${courseTitle},${txnId},${amount},${date},${status}\n`;
    });

    // Download trigger
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Paid_Students_Fee_Report_${new Date().toLocaleDateString().replace(/\//g, '-')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast.success("Paid students report downloaded successfully!");
  };

  const handleDownloadReceipt = (payment) => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      return toast.error("Pop-up blocker is preventing receipt download. Please enable pop-ups.");
    }
    
    const receiptHtml = `
      <html>
        <head>
          <title>Payment Receipt - ${payment.student?.name}</title>
          <style>
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; color: #333; margin: 40px; background-color: #f8fafc; }
            .receipt-container { border: 1px solid #e2e8f0; border-radius: 24px; padding: 40px; max-width: 600px; margin: 0 auto; background: #ffffff; box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.05); }
            .header { display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #2563eb; padding-bottom: 20px; margin-bottom: 30px; }
            .logo-text { font-size: 26px; font-weight: 800; color: #1e3a8a; letter-spacing: -0.5px; }
            .receipt-title { font-size: 13px; text-transform: uppercase; letter-spacing: 1px; font-weight: 800; color: #2563eb; background: #eff6ff; padding: 6px 12px; border-radius: 8px; }
            .details-table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
            .details-table td { padding: 14px 0; border-bottom: 1px solid #f1f5f9; }
            .details-table td.label { font-weight: 600; color: #64748b; width: 40%; font-size: 14px; }
            .details-table td.value { font-weight: 700; color: #0f172a; text-align: right; font-size: 14px; }
            .total-row { background: #eff6ff; }
            .total-row td { padding: 18px 16px; border-bottom: none; border-radius: 12px; }
            .total-row td.label { color: #1e3a8a; font-size: 16px; font-weight: 800; }
            .total-row td.value { color: #2563eb; font-size: 20px; font-weight: 800; }
            .footer { text-align: center; margin-top: 40px; color: #94a3b8; font-size: 12px; line-height: 1.6; }
            .watermark { text-align: center; color: #10b981; font-weight: 800; border: 2px dashed #10b981; border-radius: 12px; padding: 6px 16px; width: fit-content; margin: 25px auto 0 auto; text-transform: uppercase; font-size: 14px; letter-spacing: 1.5px; transform: rotate(-3deg); }
          </style>
        </head>
        <body>
          <div class="receipt-container">
            <div class="header">
              <span class="logo-text">FIC Learning</span>
              <span class="receipt-title">Official Receipt</span>
            </div>
            
            <table class="details-table">
              <tr>
                <td class="label">Receipt Number</td>
                <td class="value">REC-${payment._id}-${Math.floor(1000 + Math.random() * 9000)}</td>
              </tr>
              <tr>
                <td class="label">Transaction ID</td>
                <td class="value">${payment.transactionId || 'N/A'}</td>
              </tr>
              <tr>
                <td class="label">Student Name</td>
                <td class="value">${payment.student?.name}</td>
              </tr>
              <tr>
                <td class="label">Course Enrolled</td>
                <td class="value">${payment.course?.title}</td>
              </tr>
              <tr>
                <td class="label">Payment Date</td>
                <td class="value">${new Date(payment.paidAt || payment.createdAt).toLocaleDateString()}</td>
              </tr>
              <tr>
                <td class="label">Payment Status</td>
                <td class="value" style="color: #10b981;">SUCCESSFUL</td>
              </tr>
              <tr class="total-row">
                <td class="label">Amount Paid</td>
                <td class="value">INR ${payment.amount?.toLocaleString()}.00</td>
              </tr>
            </table>
            
            <div class="watermark">PAID & VERIFIED</div>
            
            <div class="footer">
              Thank you for learning with us!<br>
              This is an electronically generated receipt and does not require a physical signature.
            </div>
          </div>
          <script>
            window.onload = function() {
              window.print();
              setTimeout(function() { window.close(); }, 500);
            }
          </script>
        </body>
      </html>
    `;
    
    printWindow.document.write(receiptHtml);
    printWindow.document.close();
    toast.success("Receipt downloaded successfully!");
  };

  const filteredPayments = payments.filter(
    (payment) => {
      const matchesSearch = payment.student?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        payment.course?.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (payment.transactionId || '').toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = filterStatus === "all" || payment.status === filterStatus;
      return matchesSearch && matchesStatus;
    }
  );

  const getStatusBadge = (status) => {
    switch (status) {
      case 'completed':
        return <span className="flex items-center gap-1.5 text-emerald-500 text-[10px] font-bold uppercase px-2 py-1 bg-emerald-500/10 rounded-lg w-fit border border-emerald-500/20"><CheckCircle size={12} /> Paid</span>;
      case 'pending':
        return <span className="flex items-center gap-1.5 text-orange-500 text-[10px] font-bold uppercase px-2 py-1 bg-orange-500/10 rounded-lg w-fit border border-orange-500/20"><Clock size={12} /> Pending</span>;
      case 'failed':
        return <span className="flex items-center gap-1.5 text-red-500 text-[10px] font-bold uppercase px-2 py-1 bg-red-500/10 rounded-lg w-fit border border-red-500/20"><XCircle size={12} /> Failed</span>;
      case 'refunded':
        return <span className="flex items-center gap-1.5 text-slate-500 text-[10px] font-bold uppercase px-2 py-1 bg-slate-500/10 rounded-lg w-fit border border-slate-500/20"><FileText size={12} /> Refunded</span>;
      default:
        return <span className="text-slate-500 text-[10px] uppercase">{status}</span>;
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">Payments & Fees</h1>
          <p className="text-slate-500 mt-1">Track fee collections, pending payments, and transaction history.</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={handleExportPaidStudents}
            className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition active:scale-95 shadow-md shadow-blue-500/10 cursor-pointer"
          >
            <Download size={18} /> Export Paid Students
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-[#0f172a] rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm dark:shadow-none">
        <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
            <input
              type="text"
              placeholder="Search by student, course or TXN ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2.5 bg-slate-100 dark:bg-slate-800/50 border border-slate-300 dark:border-slate-700 rounded-xl text-sm w-full md:w-80 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500/50 outline-none transition-all"
            />
          </div>
          <div className="flex items-center gap-3">
             <select
               value={filterStatus}
               onChange={(e) => setFilterStatus(e.target.value)}
               className="flex items-center gap-2 px-4 py-2.5 bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-xl text-sm font-semibold outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
             >
               <option value="all">🎯 Filter: Status (All)</option>
               <option value="completed">Paid</option>
               <option value="pending">Pending</option>
               <option value="failed">Failed</option>
               <option value="refunded">Refunded</option>
             </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/30 text-xs font-bold text-slate-500 uppercase tracking-wider">
                <th className="px-6 py-4">Transaction Details</th>
                <th className="px-6 py-4">Student</th>
                <th className="px-6 py-4">Amount</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4 text-right">Receipt</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
              {loading ? (
                <tr>
                  <td colSpan="6" className="text-center py-20">
                    <div className="flex flex-col items-center gap-3">
                       <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                       <span className="text-slate-500 font-medium">Loading payments...</span>
                    </div>
                  </td>
                </tr>
              ) : filteredPayments.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-20 text-slate-500">
                    No payments found matching your search.
                  </td>
                </tr>
              ) : (
                filteredPayments.map((payment) => (
                  <tr key={payment._id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group">
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-sm font-bold text-slate-600 dark:text-slate-300">{payment.course?.title}</p>
                        <p className="text-[11px] text-slate-500 uppercase tracking-wider">{payment.transactionId || 'No TXN ID'}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-bold text-slate-900 dark:text-white">{payment.student?.name}</p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1 font-bold text-slate-900 dark:text-white">
                        <IndianRupee size={14} className="text-slate-500" />
                        {payment.amount?.toLocaleString()}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {getStatusBadge(payment.status)}
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-500">
                      {new Date(payment.paidAt || payment.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                      {payment.status === 'completed' ? (
                        <button 
                          onClick={() => handleDownloadReceipt(payment)}
                          className="p-2 text-slate-500 hover:text-blue-500 hover:bg-blue-500/10 rounded-lg transition-all" title="Download Receipt"
                        >
                          <Download size={18} />
                        </button>
                      ) : (
                        <span className="text-slate-600 text-xs">-</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminPayments;
