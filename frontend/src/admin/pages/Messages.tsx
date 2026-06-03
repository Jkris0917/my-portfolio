import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { FaTrash, FaEnvelope, FaEnvelopeOpen, FaReply } from 'react-icons/fa';
import api from '../../api/axios';
import type { ContactMessage } from '../../types';
import Swal from 'sweetalert2';

export default function Messages() {
    const [messages, setMessages] = useState<ContactMessage[]>([]);
    const [loading, setLoading] = useState(true);
    const [selected, setSelected] = useState<ContactMessage | null>(null);
    const [deleting, setDeleting] = useState<number | null>(null);

    useEffect(() => {
        api.get<ContactMessage[]>('/messages/')
            .then(res => setMessages(res.data))
            .finally(() => setLoading(false));
    }, []);

    const markAsRead = async (msg: ContactMessage) => {
        if (msg.is_read) return;
        try {
            await api.patch(`/messages/${msg.id}/`, { is_read: true });
            setMessages(prev => prev.map(m => m.id === msg.id ? { ...m, is_read: true } : m));
            setSelected(prev => prev?.id === msg.id ? { ...prev, is_read: true } : prev);
        } catch {
            // fail silently
        }
    };

    const handleSelect = (msg: ContactMessage) => {
        setSelected(msg);
        markAsRead(msg);
    };

    const handleDelete = async (id: number) => {
        const result = await Swal.fire({
            title: 'Delete Message?',
            text: 'This action cannot be undone.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, delete it',
            cancelButtonText: 'Cancel',
            background: '#161B22',
            color: '#E6EDF3',
            confirmButtonColor: '#ef4444',
            cancelButtonColor: '#21262D',
            iconColor: '#f59e0b',
        });

        if (!result.isConfirmed) return;
        setDeleting(id);
        try {
            await api.delete(`/messages/${id}/`);
            setMessages(prev => prev.filter(m => m.id !== id));
            if (selected?.id === id) setSelected(null);
            toast.success('Message deleted.');
        } catch {
            toast.error('Failed to delete message.');
        } finally {
            setDeleting(null);
        }
    };

    const unreadCount = messages.filter(m => !m.is_read).length;

    return (
        <div className="h-[calc(100vh-8rem)] flex flex-col space-y-4">

            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <p className="section-subtitle">Inbox</p>
                    <h2 className="section-title">Messages</h2>
                </div>
                {unreadCount > 0 && (
                    <span className="font-mono text-xs px-3 py-1.5 bg-accent/10 text-accent border border-accent/20 rounded-full">
                        {unreadCount} unread
                    </span>
                )}
            </div>

            {/* Panel */}
            <div className="flex-1 grid grid-cols-1 lg:grid-cols-5 gap-4 min-h-0">

                {/* Left — Message List */}
                <div className="lg:col-span-2 flex flex-col bg-surface border border-border rounded-xl overflow-hidden">

                    {/* List Header */}
                    <div className="px-4 py-3 border-b border-border flex items-center justify-between">
                        <span className="font-mono text-xs text-text-secondary uppercase tracking-wider">
                            All Messages ({messages.length})
                        </span>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto">
                        {loading && (
                            <div className="space-y-1 p-2">
                                {[1, 2, 3].map(i => (
                                    <div key={i} className="h-16 bg-border/50 rounded-lg animate-pulse" />
                                ))}
                            </div>
                        )}

                        {!loading && messages.length === 0 && (
                            <div className="flex flex-col items-center justify-center h-full text-center p-6">
                                <FaEnvelope size={32} className="text-border mb-3" />
                                <p className="font-mono text-text-secondary text-sm">No messages yet.</p>
                            </div>
                        )}

                        {!loading && messages.map(msg => (
                            <button
                                key={msg.id}
                                onClick={() => handleSelect(msg)}
                                className={`w-full text-left px-4 py-3 border-b border-border/50 transition-colors hover:bg-border/30 ${selected?.id === msg.id ? 'bg-accent/5 border-l-2 border-l-accent' : ''
                                    }`}
                            >
                                <div className="flex items-center justify-between gap-2 mb-1">
                                    <div className="flex items-center gap-2">
                                        {msg.is_read
                                            ? <FaEnvelopeOpen size={11} className="text-text-secondary shrink-0" />
                                            : <FaEnvelope size={11} className="text-accent shrink-0" />
                                        }
                                        <span className={`font-mono text-sm truncate ${msg.is_read ? 'text-text-secondary' : 'text-text-primary font-semibold'}`}>
                                            {msg.name}
                                        </span>
                                    </div>
                                    {!msg.is_read && (
                                        <span className="w-2 h-2 rounded-full bg-accent shrink-0" />
                                    )}
                                </div>
                                <p className="font-mono text-xs text-text-secondary truncate pl-5">
                                    {msg.message || '(no message)'}
                                </p>
                                <p className="font-mono text-xs text-text-secondary/50 mt-1 pl-5">
                                    {new Date(msg.created_at).toLocaleDateString('en-US', {
                                        month: 'short', day: 'numeric', year: 'numeric'
                                    })}
                                </p>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Right — Message Detail */}
                <div className="lg:col-span-3 bg-surface border border-border rounded-xl overflow-hidden flex flex-col">
                    <AnimatePresence mode="wait">
                        {!selected ? (
                            <motion.div
                                key="empty"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="flex-1 flex flex-col items-center justify-center text-center p-8"
                            >
                                <FaEnvelope size={48} className="text-border mb-4" />
                                <p className="font-display font-semibold text-text-primary mb-1">
                                    Select a message
                                </p>
                                <p className="font-mono text-xs text-text-secondary">
                                    Choose a message from the list to read it
                                </p>
                            </motion.div>
                        ) : (
                            <motion.div
                                key={selected.id}
                                initial={{ opacity: 0, x: 10 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -10 }}
                                className="flex-1 flex flex-col"
                            >
                                {/* Message Header */}
                                <div className="px-6 py-4 border-b border-border flex items-start justify-between gap-4">
                                    <div>
                                        <h3 className="font-display font-semibold text-text-primary text-lg">
                                            {selected.name}
                                        </h3>

                                        <a
                                            href={`mailto:${selected.email}`}
                                            className="font-mono text-xs text-accent hover:underline"
                                        >
                                            {selected.email}
                                        </a>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="font-mono text-xs text-text-secondary">
                                            {new Date(selected.created_at).toLocaleDateString('en-US', {
                                                month: 'short', day: 'numeric', year: 'numeric',
                                                hour: '2-digit', minute: '2-digit',
                                            })}
                                        </span>
                                        <button
                                            onClick={() => handleDelete(selected.id)}
                                            disabled={deleting === selected.id}
                                            className="p-2 text-text-secondary hover:text-red-400 hover:bg-red-400/10 rounded transition-colors disabled:opacity-50"
                                        >
                                            <FaTrash size={13} />
                                        </button>
                                    </div>
                                </div>

                                {/* Message Body */}
                                <div className="flex-1 px-6 py-6 overflow-y-auto">
                                    <p className="font-mono text-xs text-text-secondary uppercase tracking-wider mb-4">
                                        Message
                                    </p>
                                    <div className="bg-ink border border-border rounded-xl p-5">
                                        <p className="text-text-primary leading-relaxed whitespace-pre-wrap">
                                            {selected?.message || '(empty message)'}
                                        </p>
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="px-6 py-4 border-t border-border flex gap-3">

                                    <a href={`mailto:${selected.email}?subject=Re: Your message on my portfolio`}
                                        className="btn-primary py-2 text-sm"
                                    >
                                        <FaReply size={12} />
                                        Reply via Email
                                    </a>
                                    <button
                                        onClick={() => handleDelete(selected.id)}
                                        disabled={deleting === selected.id}
                                        className="btn-outline py-2 text-sm text-red-400 border-red-400/30 hover:bg-red-400/10 disabled:opacity-50"
                                    >
                                        <FaTrash size={12} />
                                        Delete
                                    </button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div >
            </div >
        </div >
    );
}