import React, { useState, useRef, useEffect } from 'react'
import { Send, Brain, User, Sparkles, Loader2 } from 'lucide-react'
import { generateChatResponse } from '../utils/analysis'

export default function ChatInterface({ data, analysis }) {
  const [messages, setMessages] = useState([
    {
      role: 'ai',
      content: 'مرحباً! أنا BizBrain AI، مساعدك الذكي لتحليل البيانات.\n\nيمكنك سؤالي عن:\n• تحليل الإيرادات والأرباح\n• تقييم أداء المنتجات والعملاء\n• مقارنة الفروع\n• توصيات تنفيذية\n\nما الذي تريد معرفته عن بياناتك؟',
    }
  ])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef(null)
  const inputRef = useRef(null)

  const suggestions = [
    'كيف هو أداء الشركة هذا الشهر؟',
    'ما هي المنتجات الأعلى ربحية؟',
    'من هم أفضل العملاء؟',
    'ما هي التوصيات التنفيذية لتحسين الأرباح؟',
    'قارن بين الإيرادات والتكاليف',
    'كيف أداء الفروع؟',
  ]

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSend = async () => {
    if (!input.trim()) return

    const userMessage = input.trim()
    setInput('')
    setMessages(prev => [...prev, { role: 'user', content: userMessage }])
    setIsTyping(true)

    // Simulate AI processing
    setTimeout(() => {
      const response = generateChatResponse(userMessage, data, analysis)
      setMessages(prev => [...prev, { role: 'ai', content: response }])
      setIsTyping(false)
    }, 800)
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleSuggestionClick = (suggestion) => {
    setInput(suggestion)
    inputRef.current?.focus()
  }

  return (
    <div className="animate-fade-in h-[calc(100vh-180px)] flex flex-col">
      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto space-y-4 mb-4 pr-2">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex gap-3 ${msg.role === 'user' ? 'flex-row' : 'flex-row-reverse'}`}
          >
            <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
              msg.role === 'user' 
                ? 'bg-primary-100' 
                : 'bg-gradient-to-br from-primary-500 to-accent-500'
            }`}>
              {msg.role === 'user' ? (
                <User className="w-4 h-4 text-primary-600" />
              ) : (
                <Brain className="w-4 h-4 text-white" />
              )}
            </div>
            <div className={`max-w-[80%] rounded-2xl px-5 py-3 text-sm leading-relaxed ${
              msg.role === 'user'
                ? 'bg-primary-500 text-white rounded-tr-sm'
                : 'bg-white border border-slate-200 text-slate-700 rounded-tl-sm shadow-sm'
            }`}>
              {msg.content.split('\n').map((line, i) => (
                <p key={i} className={i > 0 ? 'mt-1' : ''}>{line}</p>
              ))}
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex gap-3 flex-row-reverse">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center flex-shrink-0">
              <Brain className="w-4 h-4 text-white animate-pulse" />
            </div>
            <div className="bg-white border border-slate-200 rounded-2xl rounded-tl-sm px-5 py-3 shadow-sm">
              <div className="flex items-center gap-2 text-slate-400 text-sm">
                <Loader2 className="w-4 h-4 animate-spin" />
                يفكر...
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Suggestions */}
      {messages.length === 1 && (
        <div className="mb-4">
          <p className="text-xs text-slate-400 mb-2 flex items-center gap-1">
            <Sparkles className="w-3 h-3" />
            اقتراحات سريعة
          </p>
          <div className="flex flex-wrap gap-2">
            {suggestions.map((suggestion, index) => (
              <button
                key={index}
                onClick={() => handleSuggestionClick(suggestion)}
                className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs text-slate-600 hover:bg-primary-50 hover:border-primary-200 hover:text-primary-700 transition-all"
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <div className="bg-white border border-slate-200 rounded-2xl p-2 shadow-sm">
        <div className="flex items-end gap-2">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="اسأل BizBrain AI عن بياناتك..."
            className="flex-1 resize-none border-0 bg-transparent px-3 py-2.5 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-0 max-h-32"
            rows={1}
            style={{ minHeight: '44px' }}
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isTyping}
            className="p-2.5 bg-gradient-to-l from-primary-500 to-primary-600 text-white rounded-xl hover:from-primary-600 hover:to-primary-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  )
}
