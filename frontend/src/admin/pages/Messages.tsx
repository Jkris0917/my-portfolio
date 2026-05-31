import { useEffect, useState } from 'react';
import api from '../../api/axios';
import type { ContactMessage } from '../../types';

export default function Messages() {
    const [messages, setMessages] = useState<ContactMessage[]>([]);
    const [loading, setLoading] = useState(true);
    const [selected, setSelected] = useState<ContactMessage | null>(null);

    const token = localStorage.getItem('access_token');
    const headers = { Authorization: `Bearer ${token}` };

    useEffect(() => {
        api.get<ContactMessage[]>('/messages/', { headers })
            .then(res => setMessages(res.data))
            .finally(() => setLoading(false));
    }, []);

    const markAsRead = async (msg: ContactMessage) => {
        if (msg.is_read) return;
        try {
            await api.patch(`/messages/${msg.id}/`, { is_read: true }, { headers });
            setMessages(prev =>
                prev.map(m => m.id === msg.id ? { ...m, is_read: true } : m)
            );
            setSelected(prev => prev?.id === msg.id ? { ...prev, is_read: true } : prev);
        } catch {
            // fail silently
        }
    };

    const handleSelect = (msg: ContactMessage) => {
        setSelected(msg);
        markAsRead(msg);
    };

    const unreadCount = messages.filter(m => !m.is_read).length;

    return (
        <div className="space-y-6">

            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <p className="section-subtitle">Inbox</p>
                    <h2 className="section-title">Messages</h2>
                </div>
                {unreadCount > 0 && (
                    <span className="font-mono text-xs px-3 py-1.5 bg-accent/10 text-accent border border-accent/20 rounded">
                        {unreadCount} unread
                    </span>
                )}
            </div>

            {/* Loading */}
            {loading && (
                <div className="space-y-3">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="card animate-pulse">
                            <div className="h-3 bg-border rounded w-1/4 mb-2" />
                            <div className="h-3 bg-border rounded w-3/4" />
                        </div>
                    ))}
                </div>
            )}

            {/* Empty */}
            {!loading && messages.length === 0 && (
                <div className="card text-center py-12">
                    <p className="font-mono text-text-secondary text-sm">
                        No messages yet.
                    </p>
                </div>
            )}

            {/* Layout */}
            {!loading && messages.length > 0 && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                    {/* Message List */}
                    <div className="lg:col-span-1 space-y-2">
                        {messages.map(msg => (
                            <button
                                key={msg.id}
                                onClick={() => handleSelect(msg)}
                                className={`w-full text-left card py-4 px-4 transition-all ${selected?.id === msg.id
                                    ? 'border-accent/60 bg-accent/5'
                                    : 'hover:border-accent/30'
                                    }`}
                            >
                                <div className="flex items-center justify-between gap-2 mb-1">
                                    <span className="font-mono text-sm text-text-primary font-medium truncate">
                                        {msg.name}
                                    </span>
                                    {!msg.is_read && (
                                        <span className="w-2 h-2 rounded-full bg-accent shrink-0" />
                                    )}
                                </div>
                                <p className="font-mono text-xs text-text-secondary truncate">
                                    {msg.message}
                                </p>
                                <p className="font-mono text-xs text-text-secondary/50 mt-1">
                                    {new Date(msg.created_at).toLocaleDateString()}
                                </p>
                            </button>
                        ))}
                    </div>

                    {/* Message Detail */}
                    <div className="lg:col-span-2">
                        {!selected ? (
                            <div className="card h-full flex items-center justify-center py-24">
                                <p className="font-mono text-text-secondary text-sm">
                                    Select a message to read
                                </p>
                            </div>
                        ) : (
                            <div className="card space-y-6">

                                {/* Sender Info */}
                                <div className="flex items-start justify-between gap-4 pb-4 border-b border-border">
                                    <div>
                                        <h3 className="font-display font-semibold text-text-primary text-lg">
                                            {selected.name}
                                        </h3>

                                        <a href={`mailto:${selected.email}`}
                                            className="font-mono text-xs text-accent hover:underline"
                                        >
                                            {selected.email}
                                        </a>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-mono text-xs text-text-secondary">
                                            {new Date(selected.created_at).toLocaleDateString()}
                                        </p>
                                        <p className="font-mono text-xs text-text-secondary">
                                            {new Date(selected.created_at).toLocaleTimeString()}
                                        </p>
                                    </div>
                                </div>

                                {/* Message Body */}
                                <div>
                                    <p className="font-mono text-xs text-text-secondary uppercase tracking-wider mb-3">
                                        Message
                                    </p>
                                    <p className="text-text-primary leading-relaxed whitespace-pre-wrap">
                                        {selected.message}
                                    </p>
                                </div>

                                {/* Reply Button */}
                                <div className="pt-4 border-t border-border">

                                    <a href={`mailto:${selected.email}?subject=Re: Your message on my portfolio`}
                                        className="btn-primary"
                                    >
                                        Reply via Email →
                                    </a>
                                </div>

                            </div>
                        )}
                    </div>
                </div >
            )
            }
        </div >
    );
}