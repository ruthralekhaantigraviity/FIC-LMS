import React, { useState } from 'react';
import { Search, MessageSquare, CheckCircle, Clock, Send, X, MoreVertical, Filter } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

const HRSupport = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [replyMessage, setReplyMessage] = useState('');
  
  const [tickets, setTickets] = useState([
    { id: 1, studentName: "Rahul Sharma", subject: "Course Access Issue", message: "I cannot access the MERN Stack module 3 videos. It says 'Video restricted'.", status: "Open", date: "2 hours ago" },
    { id: 2, studentName: "Sneha Patil", subject: "Certificate Correction", message: "My name is misspelled on the certificate. It should be 'Sneha A. Patil'.", status: "Closed", date: "1 day ago" },
    { id: 3, studentName: "Amit Verma", subject: "Payment Query", message: "I paid the installment but it's still showing as pending in my dashboard.", status: "Open", date: "3 hours ago" },
  ]);

  const handleResolve = (id) => {
    setTickets(tickets.map(t => t.id === id ? { ...t, status: 'Closed' } : t));
    toast.success('Ticket marked as resolved!');
  };

  const handleSendReply = () => {
    if (!replyMessage.trim()) return;
    toast.success('Reply sent successfully!');
    setReplyMessage('');
    setSelectedTicket(null);
  };

  const filteredTickets = tickets.filter(t => 
    t.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.subject.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8 pb-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white font-display">Support / Queries</h1>
          <p className="text-slate-500 dark:text-slate-400">Handle student doubts and technical tickets.</p>
        </div>
      </div>

      <div className="bg-white dark:bg-[#0f172a] rounded-[32px] border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
        <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="text"
              placeholder="Search tickets..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm w-full md:w-80 outline-none"
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-xl border border-slate-100 dark:border-slate-700 text-xs font-bold uppercase">
             <Filter size={16} /> Filter
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/30 text-xs font-bold text-slate-400 uppercase tracking-wider">
                <th className="px-6 py-4">Student Name</th>
                <th className="px-6 py-4">Subject</th>
                <th className="px-6 py-4">Message Preview</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
              {filteredTickets.map((ticket) => (
                <tr key={ticket.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/20 transition">
                  <td className="px-6 py-4 text-sm font-bold text-slate-900 dark:text-white">
                    {ticket.studentName}
                  </td>
                  <td className="px-6 py-4 text-sm font-medium">
                    {ticket.subject}
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm text-slate-500 truncate max-w-[200px]">{ticket.message}</p>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase border ${
                      ticket.status === 'Open' ? 'bg-orange-50 text-orange-600 border-orange-200' : 'bg-green-50 text-green-600 border-green-200'
                    }`}>
                      {ticket.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                       <button 
                         onClick={() => setSelectedTicket(ticket)}
                         className="flex items-center gap-2 px-4 py-2 bg-sky-50 text-sky-600 rounded-xl text-xs font-bold hover:bg-sky-600 hover:text-white transition"
                       >
                         💬 Reply
                       </button>
                       {ticket.status === 'Open' && (
                         <button 
                           onClick={() => handleResolve(ticket.id)}
                           className="p-2 text-slate-400 hover:text-green-600 transition" 
                           title="Mark as Resolved"
                         >
                           <CheckCircle size={18} />
                         </button>
                       )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <AnimatePresence>
        {selectedTicket && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedTicket(null)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-lg bg-white dark:bg-[#0f172a] rounded-[32px] shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden"
            >
              <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">{selectedTicket.subject}</h3>
                  <p className="text-sm text-slate-500">From: {selectedTicket.studentName}</p>
                </div>
                <button onClick={() => setSelectedTicket(null)} className="p-2 hover:bg-slate-100 rounded-xl"><X size={20}/></button>
              </div>
              <div className="p-6 bg-slate-50 dark:bg-slate-800/30">
                 <div className="bg-white dark:bg-[#1e293b] p-4 rounded-2xl border border-slate-200 dark:border-slate-700 text-sm text-slate-700 dark:text-slate-300">
                    {selectedTicket.message}
                 </div>
              </div>
              <div className="p-6 space-y-4">
                 <textarea 
                   value={replyMessage}
                   onChange={(e) => setReplyMessage(e.target.value)}
                   placeholder="Type your reply..."
                   className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm h-32 outline-none focus:ring-2 focus:ring-sky-400/50 resize-none"
                 />
                 <button 
                   onClick={handleSendReply}
                   className="w-full py-4 bg-sky-600 text-white font-bold rounded-2xl shadow-lg shadow-sky-600/20 hover:bg-sky-700 transition flex items-center justify-center gap-2"
                 >
                   <Send size={18} /> Send Reply
                 </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default HRSupport;
