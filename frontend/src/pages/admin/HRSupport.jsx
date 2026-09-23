import React, { useState, useEffect } from 'react';
import { Search, MessageSquare, CheckCircle, Clock, Send, X, Filter } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import api from '../../utils/api';

const HRSupport = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [replyMessage, setReplyMessage] = useState('');
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchTickets = async () => {
    try {
      const { data } = await api.get('/tickets');
      setTickets(data.data);
    } catch (err) {
      console.error('Error fetching tickets:', err);
      toast.error('Failed to load tickets');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  const handleResolve = async (id) => {
    try {
      const { data } = await api.patch(`/tickets/${id}/resolve`);
      setTickets(tickets.map(t => t._id === id ? data.data : t));
      if (selectedTicket && selectedTicket._id === id) {
        setSelectedTicket(data.data);
      }
      toast.success('Ticket marked as resolved!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to resolve ticket');
    }
  };

  const handleSendReply = async () => {
    if (!replyMessage.trim()) return;
    try {
      const { data } = await api.post(`/tickets/${selectedTicket._id}/reply`, {
        message: replyMessage
      });
      // Update ticket in state
      setTickets(tickets.map(t => t._id === selectedTicket._id ? data.data : t));
      setSelectedTicket(data.data);
      setReplyMessage('');
      toast.success('Reply sent successfully!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to send reply');
    }
  };

  const filteredTickets = tickets.filter(t => {
    const studentName = t.student?.name || '';
    const subject = t.subject || '';
    return studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
           subject.toLowerCase().includes(searchQuery.toLowerCase());
  });

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
              className="pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm w-full md:w-80 outline-none text-slate-800 dark:text-slate-100"
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-xl border border-slate-100 dark:border-slate-700 text-xs font-bold uppercase">
             <Filter size={16} /> Filter
          </button>
        </div>

        {loading ? (
          <div className="p-12 text-center text-slate-500">Loading support tickets...</div>
        ) : (
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
                {filteredTickets.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-8 text-center text-sm text-slate-500">
                      No support tickets found.
                    </td>
                  </tr>
                ) : (
                  filteredTickets.map((ticket) => (
                    <tr key={ticket._id} className="hover:bg-slate-50 dark:hover:bg-slate-800/20 transition">
                      <td className="px-6 py-4 text-sm font-bold text-slate-900 dark:text-white">
                        {ticket.student?.name || 'Unknown Student'}
                        <div className="text-xs font-normal text-slate-400">
                          {ticket.student?.studentId ? `Reg No: ${ticket.student.studentId}` : ''}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-slate-800 dark:text-slate-200">
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
                             className="flex items-center gap-2 px-4 py-2 bg-sky-50 dark:bg-sky-950/40 text-sky-600 dark:text-sky-400 rounded-xl text-xs font-bold hover:bg-sky-600 hover:text-white dark:hover:bg-sky-600 dark:hover:text-white transition"
                           >
                             💬 View & Reply
                           </button>
                           {ticket.status === 'Open' && (
                             <button 
                               onClick={() => handleResolve(ticket._id)}
                               className="p-2 text-slate-400 hover:text-green-600 transition" 
                               title="Mark as Resolved"
                             >
                               <CheckCircle size={18} />
                             </button>
                           )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
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
                  <p className="text-sm text-slate-500">From: {selectedTicket.student?.name}</p>
                </div>
                <button onClick={() => setSelectedTicket(null)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"><X size={20}/></button>
              </div>

              {/* Chat Thread */}
              <div className="p-6 bg-slate-50 dark:bg-slate-800/30 space-y-4 max-h-[350px] overflow-y-auto">
                 {/* Original Message */}
                 <div className="bg-white dark:bg-[#1e293b] p-4 rounded-2xl border border-slate-200 dark:border-slate-700 text-sm text-slate-700 dark:text-slate-300">
                    <p className="font-bold text-[10px] text-blue-600 dark:text-blue-400 uppercase tracking-wider mb-1">
                      {selectedTicket.student?.name} (Original Query)
                    </p>
                    <p className="whitespace-pre-wrap">{selectedTicket.message}</p>
                    <span className="text-[9px] text-slate-400 block mt-2">
                      {new Date(selectedTicket.createdAt).toLocaleString()}
                    </span>
                 </div>

                 {/* Replies */}
                 {selectedTicket.replies && selectedTicket.replies.map((reply, index) => {
                    const isStaff = reply.sender?.role !== 'student';
                    return (
                      <div 
                        key={reply._id || index} 
                        className={`p-4 rounded-2xl border text-sm max-w-[85%] ${
                          isStaff 
                            ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-100 dark:border-blue-800/50 text-slate-800 dark:text-slate-200 ml-auto' 
                            : 'bg-white dark:bg-[#1e293b] border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 mr-auto'
                        }`}
                      >
                         <p className={`font-bold text-[10px] uppercase tracking-wider mb-1 ${
                           isStaff ? 'text-amber-600 dark:text-amber-400' : 'text-blue-600 dark:text-blue-400'
                         }`}>
                           {reply.sender?.name} ({reply.sender?.role || 'user'})
                         </p>
                         <p className="whitespace-pre-wrap">{reply.message}</p>
                         <span className="text-[9px] text-slate-400 block mt-2">
                           {new Date(reply.createdAt).toLocaleString()}
                         </span>
                      </div>
                    );
                 })}
              </div>

              {selectedTicket.status === 'Open' ? (
                <div className="p-6 border-t border-slate-200 dark:border-slate-800 space-y-4 bg-white dark:bg-[#0f172a]">
                   <textarea 
                     value={replyMessage}
                     onChange={(e) => setReplyMessage(e.target.value)}
                     placeholder="Type your reply..."
                     className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm h-24 outline-none focus:ring-2 focus:ring-sky-400/50 resize-none text-slate-800 dark:text-slate-100"
                   />
                   <div className="flex gap-2">
                     <button 
                       onClick={() => handleResolve(selectedTicket._id)}
                       className="flex-1 py-3 bg-emerald-500 text-white font-bold rounded-2xl shadow-lg shadow-emerald-500/20 hover:bg-emerald-600 transition flex items-center justify-center gap-2 text-sm"
                     >
                       <CheckCircle size={16} /> Resolve
                     </button>
                     <button 
                       onClick={handleSendReply}
                       className="flex-1 py-3 bg-sky-600 text-white font-bold rounded-2xl shadow-lg shadow-sky-600/20 hover:bg-sky-700 transition flex items-center justify-center gap-2 text-sm"
                     >
                       <Send size={16} /> Send Reply
                     </button>
                   </div>
                </div>
              ) : (
                <div className="p-6 bg-slate-100 dark:bg-slate-800/50 text-center text-sm font-bold text-green-600 dark:text-green-400 border-t border-slate-200 dark:border-slate-800">
                  ✓ This ticket has been marked as Resolved.
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default HRSupport;
