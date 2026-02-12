import React, { useState, useRef, useEffect } from 'react';
import { Send, Plus, MessageSquare, Bot } from 'lucide-react';
import { useUnifiedContext } from '@/stores/unifiedContextStore';
import clsx from 'clsx';
import { nanoid } from 'nanoid';

interface Message {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    timestamp: number;
    isContext?: boolean; // If true, this message has been saved as context
}

export function BloomChat() {
    const [input, setInput] = useState('');
    const [messages, setMessages] = useState<Message[]>([
        {
            id: 'welcome',
            role: 'assistant',
            content: "Hello! I'm Bloom. I can help you organize your thoughts. Anything you say can be saved as context.",
            timestamp: Date.now()
        }
    ]);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const { addNode } = useUnifiedContext();

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = async () => {
        if (!input.trim()) return;

        const userMsg: Message = {
            id: nanoid(),
            role: 'user',
            content: input,
            timestamp: Date.now()
        };

        setMessages(prev => [...prev, userMsg]);
        setInput('');

        // Mock AI response
        setTimeout(() => {
            const aiMsg: Message = {
                id: nanoid(),
                role: 'assistant',
                content: "I've noted that. You can click the '+' icon on any message to save it as a context node.",
                timestamp: Date.now()
            };
            setMessages(prev => [...prev, aiMsg]);
        }, 1000);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    const saveAsContext = (msg: Message) => {
        if (msg.isContext) return;

        // Simple classification heuristic (mocked)
        const type = msg.role === 'user' ? 'Concept' : 'Note';

        addNode({
            id: `ctx-${msg.id}`,
            type: type,
            label: msg.content.length > 20 ? msg.content.substring(0, 20) + '...' : msg.content,
            relevance: 1.0,
            timestamp: Date.now(),
            layer: 'personal',
            source: 'chat',
            data: {
                fullText: msg.content,
                source: 'chat'
            }
        } as any); // Type assertion to bypass strict checks if needed, but adding props should fix it

        // Mark as saved
        setMessages(prev => prev.map(m =>
            m.id === msg.id ? { ...m, isContext: true } : m
        ));
    };

    return (
        <div className="flex flex-col h-full bg-white/60 backdrop-blur-xl rounded-2xl shadow-sm border border-white/50 overflow-hidden relative">
            {/* Header */}
            <div className="p-4 border-b border-gray-100/50 bg-white/40 flex items-center gap-3 backdrop-blur-md z-10">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-bloom-purple to-indigo-500 flex items-center justify-center shadow-lg shadow-bloom-purple/20 text-white">
                    <Bot size={16} />
                </div>
                <div>
                    <h2 className="font-bold text-gray-800 text-sm leading-tight">Bloom Assistant</h2>
                    <div className="flex items-center gap-1.5 opacity-60">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                        <span className="text-[10px] font-medium">Online</span>
                    </div>
                </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-6 scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent">
                {messages.map((msg) => (
                    <div
                        key={msg.id}
                        className={clsx(
                            "flex gap-3 max-w-[90%] group animate-in slide-in-from-bottom-2 duration-500 fill-mode-forwards",
                            msg.role === 'user' ? "ml-auto flex-row-reverse" : "mr-auto"
                        )}
                    >
                        {!msg.role || msg.role === 'assistant' ? (
                            <div className="w-8 h-8 rounded-full bg-white border border-gray-100 shadow-sm flex items-center justify-center shrink-0 text-bloom-purple mt-auto mb-1">
                                <Bot size={14} />
                            </div>
                        ) : null}

                        <div className="relative">
                            <div className={clsx(
                                "p-3.5 px-5 text-sm leading-relaxed shadow-sm backdrop-blur-sm transition-all duration-300",
                                msg.role === 'user'
                                    ? "bg-gradient-to-br from-bloom-blue to-indigo-600 text-white rounded-2xl rounded-tr-sm shadow-blue-500/10"
                                    : "bg-white/80 border border-white/50 text-gray-800 rounded-2xl rounded-tl-sm shadow-gray-200/50",
                                msg.isContext && "ring-2 ring-bloom-yellow ring-offset-2 ring-offset-white"
                            )}>
                                {msg.content}
                            </div>

                            {/* Context Action Button */}
                            {!msg.isContext && (
                                <button
                                    onClick={() => saveAsContext(msg)}
                                    className={clsx(
                                        "absolute top-1/2 -translate-y-1/2 p-1.5 rounded-full shadow-md border border-gray-100 bg-white hover:bg-bloom-yellow hover:text-white hover:border-bloom-yellow transition-all opacity-0 group-hover:opacity-100 scale-90 group-hover:scale-100 z-10",
                                        msg.role === 'user' ? "left-0 -translate-x-[120%]" : "right-0 translate-x-[120%]"
                                    )}
                                    title="Save as Context"
                                >
                                    <Plus size={14} className="text-current" />
                                </button>
                            )}

                            <div className={clsx(
                                "text-[10px] opacity-0 group-hover:opacity-40 transition-opacity absolute -bottom-4 min-w-[max-content]",
                                msg.role === 'user' ? "right-1 text-right" : "left-1"
                            )}>
                                {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </div>
                        </div>
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 bg-white/60 backdrop-blur-md border-t border-white/50">
                <div className="relative group max-w-3xl mx-auto">
                    <div className="absolute inset-0 bg-gradient-to-r from-bloom-purple/20 to-bloom-blue/20 rounded-2xl blur-md opacity-0 group-focus-within:opacity-100 transition-opacity duration-500" />
                    <div className="relative flex items-center bg-white shadow-sm border border-gray-200/80 rounded-2xl overflow-hidden focus-within:shadow-md focus-within:border-bloom-purple/30 transition-all">
                        <div className="pl-3 pr-2 text-gray-400">
                            <MessageSquare size={18} />
                        </div>
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="Type to Bloom..."
                            className="flex-1 py-3.5 bg-transparent border-none focus:ring-0 text-sm placeholder:text-gray-400 text-gray-700"
                        />
                        <button
                            onClick={handleSend}
                            disabled={!input.trim()}
                            className="mr-1.5 p-2 bg-gray-100 hover:bg-bloom-purple hover:text-white text-gray-500 rounded-xl transition-all disabled:opacity-50 disabled:bg-gray-50 disabled:cursor-not-allowed"
                        >
                            <Send size={16} />
                        </button>
                    </div>
                </div>
                <div className="mt-2 text-[10px] text-center text-gray-400 font-medium">
                    AI can make mistakes. Review generated context.
                </div>
            </div>
        </div>
    );
}
