'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import ReactMarkdown from 'react-markdown';

interface Message {
  id: number;
  text: string;
  isUser: boolean;
  timestamp: Date;
  type?: 'text' | 'damage-analysis';
  damageAnalysis?: string;
  preventionInstructions?: string;
  imageUrl?: string;
}

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [activeTab, setActiveTab] = useState<'chat' | 'damage'>('chat');

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Don't render anything until mounted to prevent hydration mismatch
  if (!isMounted) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-purple-50 to-pink-100 dark:from-gray-900 dark:to-gray-800">
        <div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now(),
      text: input,
      isUser: true,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: input }),
      });

      const data = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      const aiMessage: Message = {
        id: Date.now() + 1,
        text: data.response,
        isUser: false,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Error:', error);
      const errorMessage: Message = {
        id: Date.now() + 1,
        text: 'Sorry, I encountered an error. Please make sure your Gemini API key is configured correctly.',
        isUser: false,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const analyzeImage = async () => {
    if (!selectedImage) return;

    setIsAnalyzing(true);
    
    try {
      const formData = new FormData();
      formData.append('image', selectedImage);

      const response = await fetch('/api/analyze-damage', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      // Create user message with image
      const userMessage: Message = {
        id: Date.now(),
        text: `Uploaded image for damage analysis: ${selectedImage.name}`,
        isUser: true,
        timestamp: new Date(),
        type: 'damage-analysis',
        imageUrl: imagePreview || undefined,
      };

      // Create AI response message
      const aiMessage: Message = {
        id: Date.now() + 1,
        text: 'Image Analysis Complete',
        isUser: false,
        timestamp: new Date(),
        type: 'damage-analysis',
        damageAnalysis: data.damageAnalysis,
        preventionInstructions: data.preventionInstructions,
      };

      setMessages(prev => [...prev, userMessage, aiMessage]);
      
      // Clear the image selection
      setSelectedImage(null);
      setImagePreview(null);
      
      // Reset file input
      const fileInput = document.getElementById('image-upload') as HTMLInputElement;
      if (fileInput) fileInput.value = '';

    } catch (error) {
      console.error('Error:', error);
      const errorMessage: Message = {
        id: Date.now() + 1,
        text: 'Sorry, I encountered an error while analyzing the image. Please make sure your Gemini API key is configured correctly.',
        isUser: false,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const clearImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
    const fileInput = document.getElementById('image-upload') as HTMLInputElement;
    if (fileInput) fileInput.value = '';
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-purple-50 to-pink-100 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-lg border-b border-gray-200 dark:border-gray-700 p-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white flex items-center gap-4 mb-4">
            <Image 
              src="/log-removebg-preview.png" 
              alt="Hasitha.AI Logo" 
              width={48}
              height={48}
              className="object-contain"
            />
            AI-Chat Bot
          </h1>
          <p className="text-gray-600 dark:text-gray-300 text-base mb-6">
            Your Personal AI Assistant powered by Google Gemini
          </p>
          
          {/* Navigation Tabs */}
          <div className="flex space-x-1 bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
            <button
              onClick={() => setActiveTab('chat')}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all duration-200 ${
                activeTab === 'chat'
                  ? 'bg-white dark:bg-gray-600 text-purple-600 dark:text-purple-400 shadow-sm'
                  : 'text-gray-600 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400'
              }`}
            >
              💬 Chat Assistant
            </button>
            <button
              onClick={() => setActiveTab('damage')}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all duration-200 ${
                activeTab === 'damage'
                  ? 'bg-white dark:bg-gray-600 text-purple-600 dark:text-purple-400 shadow-sm'
                  : 'text-gray-600 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400'
              }`}
            >
              🔍 Damage Analysis
            </button>
          </div>
        </div>
      </header>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-4xl mx-auto space-y-6">
          {activeTab === 'chat' && (
            <>
              {messages.filter(msg => msg.type !== 'damage-analysis').length === 0 && (
                <div className="text-center py-16">
                  <Image 
                    src="/log-removebg-preview.png" 
                    alt="Hasitha.AI Logo" 
                    width={100}
                    height={100}
                    className="object-contain mx-auto mb-6"
                  />
                  <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-3">
                    Welcome to AI-Chat Bot!
                  </h2>
                  <p className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed max-w-md mx-auto">
                    Your intelligent AI assistant powered by Google Gemini. Ask questions, get help, or just chat!
                  </p>
                </div>
              )}

              {messages.filter(msg => msg.type !== 'damage-analysis').map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[75%] rounded-2xl px-6 py-4 shadow-sm ${
                      message.isUser
                        ? 'bg-gradient-to-r from-purple-500 to-purple-600 text-white ml-4'
                        : 'bg-white dark:bg-gray-700 text-gray-800 dark:text-white mr-4 border border-gray-100 dark:border-gray-600'
                    }`}
                  >
                    {message.isUser ? (
                      <p className="text-base leading-relaxed whitespace-pre-wrap">
                        {message.text}
                      </p>
                    ) : (
                      <div className="text-base leading-relaxed">
                        <ReactMarkdown
                          components={{
                            ul: ({children}) => <ul className="list-disc ml-5 space-y-2 mb-4">{children}</ul>,
                            ol: ({children}) => <ol className="list-decimal ml-5 space-y-2 mb-4">{children}</ol>,
                            li: ({children}) => <li className="leading-relaxed text-base">{children}</li>,
                            p: ({children}) => <p className="mb-3 last:mb-0 text-base leading-7">{children}</p>,
                            strong: ({children}) => <strong className="font-semibold text-gray-900 dark:text-white">{children}</strong>,
                            h1: ({children}) => <h1 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">{children}</h1>,
                            h2: ({children}) => <h2 className="text-lg font-bold mb-3 text-gray-900 dark:text-white">{children}</h2>,
                            h3: ({children}) => <h3 className="text-base font-bold mb-2 text-gray-900 dark:text-white">{children}</h3>,
                            code: ({children}) => <code className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded text-sm font-mono">{children}</code>,
                          }}
                        >
                          {message.text}
                        </ReactMarkdown>
                      </div>
                    )}
                    <p
                      className={`text-sm mt-3 ${
                        message.isUser
                          ? 'text-purple-100'
                          : 'text-gray-500 dark:text-gray-400'
                      }`}
                    >
                      {message.timestamp.toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                </div>
              ))}

              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-white dark:bg-gray-700 rounded-2xl px-6 py-4 mr-4 shadow-sm border border-gray-100 dark:border-gray-600">
                    <div className="flex items-center space-x-3">
                      <div className="flex space-x-1">
                        <div className="w-3 h-3 bg-purple-400 rounded-full animate-bounce"></div>
                        <div className="w-3 h-3 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-3 h-3 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                      <p className="text-gray-600 dark:text-gray-400 text-base">Thinking...</p>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}

          {activeTab === 'damage' && (
            <>
              {messages.filter(msg => msg.type === 'damage-analysis').length === 0 && (
                <div className="text-center py-16">
                  <div className="text-6xl mb-6">🔍</div>
                  <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-3">
                    Damage Analysis
                  </h2>
                  <p className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed max-w-md mx-auto">
                    Upload an image of wall damage and get AI-powered analysis with prevention instructions.
                  </p>
                </div>
              )}

              {messages.filter(msg => msg.type === 'damage-analysis').map((message) => (
                <div key={message.id} className="space-y-4">
                  {message.isUser && (
                    <div className="flex justify-end">
                      <div className="max-w-[75%] bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-2xl px-6 py-4 shadow-sm ml-4">
                        <p className="text-base leading-relaxed mb-3">{message.text}</p>
                        {message.imageUrl && (
                          <div className="rounded-lg overflow-hidden">
                            <Image 
                              src={message.imageUrl} 
                              alt="Uploaded for analysis" 
                              width={400}
                              height={300}
                              className="max-w-full h-auto rounded-lg object-cover"
                            />
                          </div>
                        )}
                        <p className="text-purple-100 text-sm mt-3">
                          {message.timestamp.toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </p>
                      </div>
                    </div>
                  )}

                  {!message.isUser && (
                    <div className="flex justify-start">
                      <div className="max-w-[90%] bg-white dark:bg-gray-700 text-gray-800 dark:text-white rounded-2xl px-6 py-4 shadow-sm mr-4 border border-gray-100 dark:border-gray-600">
                        <h3 className="text-lg font-bold mb-4 text-purple-600 dark:text-purple-400">
                          🔍 Damage Analysis Results
                        </h3>
                        
                        {message.damageAnalysis && (
                          <div className="mb-6">
                            <h4 className="text-base font-semibold mb-3 text-gray-900 dark:text-white">
                              📋 Analysis Report
                            </h4>
                            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                              <ReactMarkdown
                                components={{
                                  ul: ({children}) => <ul className="list-disc ml-5 space-y-2 mb-4">{children}</ul>,
                                  ol: ({children}) => <ol className="list-decimal ml-5 space-y-2 mb-4">{children}</ol>,
                                  li: ({children}) => <li className="leading-relaxed text-sm">{children}</li>,
                                  p: ({children}) => <p className="mb-3 last:mb-0 text-sm leading-6">{children}</p>,
                                  strong: ({children}) => <strong className="font-semibold text-gray-900 dark:text-white">{children}</strong>,
                                  h1: ({children}) => <h1 className="text-lg font-bold mb-3 text-gray-900 dark:text-white">{children}</h1>,
                                  h2: ({children}) => <h2 className="text-base font-bold mb-3 text-gray-900 dark:text-white">{children}</h2>,
                                  h3: ({children}) => <h3 className="text-sm font-bold mb-2 text-gray-900 dark:text-white">{children}</h3>,
                                }}
                              >
                                {message.damageAnalysis}
                              </ReactMarkdown>
                            </div>
                          </div>
                        )}

                        {message.preventionInstructions && (
                          <div className="mb-4">
                            <h4 className="text-base font-semibold mb-3 text-gray-900 dark:text-white">
                              🛠️ Prevention Instructions
                            </h4>
                            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                              <ReactMarkdown
                                components={{
                                  ul: ({children}) => <ul className="list-disc ml-5 space-y-2 mb-4">{children}</ul>,
                                  ol: ({children}) => <ol className="list-decimal ml-5 space-y-2 mb-4">{children}</ol>,
                                  li: ({children}) => <li className="leading-relaxed text-sm">{children}</li>,
                                  p: ({children}) => <p className="mb-3 last:mb-0 text-sm leading-6">{children}</p>,
                                  strong: ({children}) => <strong className="font-semibold text-blue-900 dark:text-blue-100">{children}</strong>,
                                  h1: ({children}) => <h1 className="text-lg font-bold mb-3 text-blue-900 dark:text-blue-100">{children}</h1>,
                                  h2: ({children}) => <h2 className="text-base font-bold mb-3 text-blue-900 dark:text-blue-100">{children}</h2>,
                                  h3: ({children}) => <h3 className="text-sm font-bold mb-2 text-blue-900 dark:text-blue-100">{children}</h3>,
                                }}
                              >
                                {message.preventionInstructions}
                              </ReactMarkdown>
                            </div>
                          </div>
                        )}

                        <p className="text-gray-500 dark:text-gray-400 text-sm mt-3">
                          {message.timestamp.toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              ))}

              {isAnalyzing && (
                <div className="flex justify-start">
                  <div className="bg-white dark:bg-gray-700 rounded-2xl px-6 py-4 mr-4 shadow-sm border border-gray-100 dark:border-gray-600">
                    <div className="flex items-center space-x-3">
                      <div className="flex space-x-1">
                        <div className="w-3 h-3 bg-purple-400 rounded-full animate-bounce"></div>
                        <div className="w-3 h-3 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-3 h-3 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                      <p className="text-gray-600 dark:text-gray-400 text-base">Analyzing image...</p>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Input Area */}
      <div className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 p-6 shadow-lg">
        <div className="max-w-4xl mx-auto">
          {activeTab === 'chat' && (
            <>
              <div className="flex gap-4">
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type your message here..."
                  className="flex-1 resize-none rounded-xl border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-5 py-4 text-base text-gray-800 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20 max-h-40 transition-all duration-200"
                  rows={1}
                  disabled={isLoading}
                />
                <button
                  onClick={sendMessage}
                  disabled={!input.trim() || isLoading}
                  className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 disabled:from-gray-300 disabled:to-gray-400 dark:disabled:from-gray-600 dark:disabled:to-gray-700 text-white rounded-xl px-8 py-4 text-base font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500/20 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:scale-105 disabled:transform-none"
                >
                  {isLoading ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Sending</span>
                    </div>
                  ) : (
                    'Send'
                  )}
                </button>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-3 text-center">
                Press Enter to send • Shift+Enter for new line
              </p>
            </>
          )}

          {activeTab === 'damage' && (
            <div className="space-y-4">
              {/* Image Upload Section */}
              <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-6 border-2 border-dashed border-gray-300 dark:border-gray-600">
                <div className="text-center">
                  <div className="text-4xl mb-4">📷</div>
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
                    Upload Damage Image
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    Take a photo or upload an image of wall damage for AI analysis
                  </p>
                  
                  <input
                    id="image-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleImageSelect}
                    className="hidden"
                  />
                  
                  <button
                    onClick={() => document.getElementById('image-upload')?.click()}
                    className="bg-purple-500 hover:bg-purple-600 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
                  >
                    Choose Image
                  </button>
                </div>
              </div>

              {/* Image Preview and Analysis */}
              {imagePreview && (
                <div className="bg-white dark:bg-gray-700 rounded-xl p-6 border border-gray-200 dark:border-gray-600 shadow-sm">
                  <h4 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
                    Image Preview
                  </h4>
                  
                  <div className="flex gap-4">
                    <div className="flex-1">
                      <div className="rounded-lg overflow-hidden mb-4">
                        <Image 
                          src={imagePreview} 
                          alt="Preview" 
                          width={400}
                          height={300}
                          className="w-full h-auto max-h-64 object-cover rounded-lg"
                        />
                      </div>
                      
                      <div className="flex gap-3">
                        <button
                          onClick={analyzeImage}
                          disabled={isAnalyzing}
                          className="flex-1 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 disabled:from-gray-300 disabled:to-gray-400 text-white rounded-lg px-6 py-3 font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-green-500/20 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:scale-105 disabled:transform-none"
                        >
                          {isAnalyzing ? (
                            <div className="flex items-center justify-center space-x-2">
                              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                              <span>Analyzing...</span>
                            </div>
                          ) : (
                            <div className="flex items-center justify-center space-x-2">
                              <span>🔍</span>
                              <span>Analyze Damage</span>
                            </div>
                          )}
                        </button>
                        
                        <button
                          onClick={clearImage}
                          disabled={isAnalyzing}
                          className="bg-gray-500 hover:bg-gray-600 disabled:bg-gray-300 text-white rounded-lg px-6 py-3 font-medium transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:transform-none"
                        >
                          Clear
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className="text-center">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Supported formats: JPG, PNG, GIF • Maximum size: 10MB
                </p>
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                  AI will analyze damage type, severity, and provide prevention instructions
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
