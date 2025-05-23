import { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { okaidia } from 'react-syntax-highlighter/dist/esm/styles/prism';
import 'katex/dist/katex.min.css'; // Import KaTeX CSS for LaTeX rendering
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faPaperPlane, 
  faRobot, 
  faUser, 
  faSpinner, 
  faChevronDown,
  faBars,
  faPlus,
  faTrash,
  faChevronLeft,
  faChevronRight,
  faXmark,
  faCopy
} from '@fortawesome/free-solid-svg-icons';
import './ChatInterface.scss';

const ChatInterface = () => {
  const SYSTEM_PROMPT = "You are Oken's AI assistant. You are helpful, creative, and friendly. Always provide complete, conversational responses. For mathematical questions, explain your reasoning and provide the answer in plain text. Avoid using LaTeX boxed notation or raw mathematical expressions. When providing code, use Markdown code blocks with the language specified. Keep your responses natural and easy to read.";

  const [messages, setMessages] = useState([
    { 
      role: 'assistant',
      content: 'Hello! I\'m Oken\'s AI assistant. How can I help you today?'
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentModel, setCurrentModel] = useState('deepseek/deepseek-chat-v3-0324:free');
  const [isModelMenuOpen, setIsModelMenuOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [conversations, setConversations] = useState([
    { id: 'current', title: 'Current Chat', preview: 'Hello! I\'m Oken\'s AI assistant...', active: true, messages: messages },
    { id: 'chat1', title: 'Website Development', preview: 'How do I optimize React performance?', active: false, messages: [
      { role: 'user', content: 'How do I optimize React performance?' },
      { role: 'assistant', content: 'To optimize React performance, you can use: memo, useCallback, useMemo, and virtual DOM optimization techniques...' }
    ]},
    { id: 'chat2', title: 'Portfolio Ideas', preview: 'What should I include in my portfolio?', active: false, messages: [
      { role: 'user', content: 'What should I include in my portfolio?' },
      { role: 'assistant', content: 'A good developer portfolio should showcase your best projects, skills, and experience...' }
    ]}
  ]);

  const messagesEndRef = useRef(null);
  const modelMenuRef = useRef(null);

  const models = [
    { id: 'deepseek/deepseek-chat-v3-0324:free', name: 'DeepSeek Chat V3', description: 'Conversational model - recommended' },
    { id: 'deepseek/deepseek-r1-zero:free', name: 'DeepSeek R1-Zero', description: 'Advanced reasoning model' },
    { id: 'deepseek/deepseek-prover-v2:free', name: 'DeepSeek Prover', description: 'Mathematical reasoning focused' },
    { id: 'qwen/qwen3-235b-a22b:free', name: 'Qwen3 235B', description: 'Wide-context reasoning model' },
    { id: 'tngtech/deepseek-r1t-chimera:free', name: 'DeepSeek Chimera', description: 'Multimodal analysis model' },
    { id: 'agentica-org/deepcoder-14b-preview:free', name: 'DeepCoder 14B', description: 'Coding specialist (preview)' }
  ];

  // Custom components for ReactMarkdown
  const MarkdownComponents = {
    code({ node, inline, className, children, ...props }) {
      const match = /language-(\w+)/.exec(className || '');
      const language = match ? match[1] : '';
      
      if (!inline && language) {
        return (
          <div className="code-block-container">
            <div className="code-block-header">
              <span className="code-language">{language}</span>
              <button 
                className="copy-code-btn"
                onClick={() => copyToClipboard(String(children).replace(/\n$/, ''))}
              >
                <FontAwesomeIcon icon={faCopy} />
              </button>
            </div>
            <SyntaxHighlighter
              style={okaidia}
              language={language}
              PreTag="div"
              {...props}
            >
              {String(children).replace(/\n$/, '')}
            </SyntaxHighlighter>
          </div>
        );
      }
      
      return (
        <code className={className} {...props}>
          {children}
        </code>
      );
    },
    // Handle potential LaTeX formatting issues
    p({ children }) {
      // Check if the paragraph contains only LaTeX-like content
      const text = String(children);
      if (text.match(/^<think>[\s\S]*<\/think>$/)) {
        return null; // Hide thinking blocks
      }
      return <p>{children}</p>;
    }
  };

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      // You could add a toast notification here
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  // Function to clean response content
  const cleanResponseContent = (content) => {
    if (!content) return '';
    
    // Remove thinking blocks that some models like R1 might include
    let cleaned = content.replace(/<think>[\s\S]*?<\/think>/g, '');
    
    // Handle LaTeX boxed answers (convert \boxed{answer} to just the answer)
    cleaned = cleaned.replace(/\\boxed\{([^}]+)\}/g, '$1');
    
    // Handle standalone LaTeX expressions and convert them to proper markdown
    cleaned = cleaned.replace(/^\s*\\\w+\{([^}]+)\}\s*$/gm, '$1');
    
    // Remove excessive LaTeX formatting that might break rendering
    cleaned = cleaned.replace(/\$\$\s*\$\$/g, '');
    
    // Clean up any double spaces or newlines
    cleaned = cleaned.replace(/\n\s*\n\s*\n/g, '\n\n');
    
    // If the response is still just LaTeX or very short, make it more conversational
    if (cleaned.match(/^[\d\s\+\-\*\/\=\.]+$/) || cleaned.length < 10) {
      // For simple math answers, add context
      if (cleaned.match(/^\d+(\.\d+)?$/)) {
        cleaned = `The answer is ${cleaned}.`;
      }
    }
    
    return cleaned.trim();
  };

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Close model menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modelMenuRef.current && !modelMenuRef.current.contains(event.target)) {
        setIsModelMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Auto-hide sidebar on mobile
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setIsSidebarOpen(false);
      }
    };
    
    window.addEventListener('resize', handleResize);
    handleResize(); // Initial check
    
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleSendMessage = async (e) => {
    e?.preventDefault();
    
    if (!input.trim()) return;
    
    // Add user message to chat
    const userMessage = { role: 'user', content: input };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    
    setInput('');
    setIsLoading(true);
    
    try {
      // Create messages array with system prompt
      const messagesToSend = [
        { role: 'system', content: SYSTEM_PROMPT },
        ...updatedMessages.map(msg => ({
          role: msg.role,
          content: msg.content
        }))
      ];

      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${import.meta.env.VITE_OPEN_ROUTER}`,
          "HTTP-Referer": import.meta.env.VITE_SITE_URL,
          "X-Title": import.meta.env.VITE_SITE_NAME,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          "model": currentModel,
          "messages": messagesToSend,
          "temperature": 0.7,
          "max_tokens": 4000,
          "top_p": 0.9,
          "frequency_penalty": 0.1,
          "presence_penalty": 0.1,
          "stream": false
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('API Error Response:', errorText);
        throw new Error(`API Error: ${response.status} ${response.statusText}. ${errorText}`);
      }

      const data = await response.json();
      
      // Debug log for troubleshooting
      console.log('API Response:', data);
      
      if (!data.choices || data.choices.length === 0) {
        console.error('Invalid API response structure:', data);
        throw new Error('No response from model - the model may be unavailable');
      }

      // Check if the response has content
      const messageContent = data.choices[0]?.message?.content;
      if (!messageContent) {
        console.error('No message content in response:', data.choices[0]);
        throw new Error('Empty response from model');
      }

      // Clean the response content
      const cleanedContent = cleanResponseContent(messageContent);

      const assistantMessage = {
        role: 'assistant',
        content: cleanedContent
      };

      const finalMessages = [...updatedMessages, assistantMessage];
      setMessages(finalMessages);
      updateActiveConversation(finalMessages);

    } catch (error) {
      console.error('Full error:', error);
      const errorMessage = {
        role: 'assistant',
        content: `I apologize, but I encountered an error: ${error.message}. Please try again or switch to a different model.`
      };
      const finalMessages = [...updatedMessages, errorMessage];
      setMessages(finalMessages);
      updateActiveConversation(finalMessages);
    } finally {
      setIsLoading(false);
    }
  };

  const handleModelChange = (modelId) => {
    setCurrentModel(modelId);
    setIsModelMenuOpen(false);
    
    // Add a system message about the model change
    const systemMessage = { 
      role: 'system', 
      content: `Switched to ${models.find(m => m.id === modelId).name}` 
    };
    
    const updatedMessages = [...messages, systemMessage];
    setMessages(updatedMessages);
    updateActiveConversation(updatedMessages);
  };
  
  const updateActiveConversation = (updatedMessages) => {
    setConversations(prev => {
      return prev.map(convo => {
        if (convo.active) {
          // Get the last non-system message for the preview
          const lastMessage = [...updatedMessages].reverse().find(m => m.role !== 'system');
          const preview = lastMessage ? truncateText(lastMessage.content, 40) : '';
          
          return {
            ...convo,
            messages: updatedMessages,
            preview
          };
        }
        return convo;
      });
    });
  };

  const createNewChat = () => {
    const newChat = {
      id: `chat-${Date.now()}`,
      title: `New Chat ${conversations.length}`,
      preview: 'Start a new conversation',
      active: true,
      messages: [
        { 
          role: 'assistant',
          content: 'Hello! I\'m Oken\'s AI assistant. How can I help you today?'
        }
      ]
    };
    
    // Deactivate current conversation and add new one
    setConversations(prev => 
      [newChat, ...prev.map(c => ({...c, active: false}))]
    );
    
    // Set the messages to the new conversation's messages
    setMessages(newChat.messages);
  };

  const switchConversation = (conversationId) => {
    setConversations(prev => 
      prev.map(convo => ({
        ...convo,
        active: convo.id === conversationId
      }))
    );
    
    // Find and set the messages from the selected conversation
    const selectedConvo = conversations.find(c => c.id === conversationId);
    if (selectedConvo) {
      setMessages(selectedConvo.messages);
    }
    
    // Auto-close sidebar on mobile after selection
    if (window.innerWidth < 768) {
      setIsSidebarOpen(false);
    }
  };

  const deleteConversation = (e, conversationId) => {
    e.stopPropagation(); // Prevent triggering the switchConversation
    
    // Check if we're deleting the active conversation
    const isActive = conversations.find(c => c.id === conversationId)?.active;
    
    // Filter out the deleted conversation
    const updatedConversations = conversations.filter(c => c.id !== conversationId);
    
    // If we deleted the active conversation, activate the first one
    if (isActive && updatedConversations.length > 0) {
      updatedConversations[0].active = true;
      setMessages(updatedConversations[0].messages);
    }
    
    setConversations(updatedConversations);
  };

  const truncateText = (text, maxLength) => {
    return text.length > maxLength 
      ? text.substring(0, maxLength) + '...' 
      : text;
  };

  
  const sidebarVariants = {
    open: {
      x: 0,  //Slide in to the left
      transition: {
        duration: 0.3,
        ease: "easeOut", // Smooth easing
      },
    },
    closed: {
      x: -250, //Slide out to the left
      transition: {
        duration: 0.3,
        ease: "easeOut", // Smooth easing
      },
    },
  };
  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };  

  return (
    <div className="section">
      <div className="section-container chat-interface-container">
        <div className="section-title">
          <span className="section-number">05</span>
          <h2>Chat Assistant</h2>
        </div>
        
        <div className="model-selector-container" ref={modelMenuRef}>
          <button 
            className="model-selector-button" 
            onClick={() => setIsModelMenuOpen(!isModelMenuOpen)}
          >
            <span className="current-model">
              <FontAwesomeIcon icon={faRobot} className="model-icon" />
              {models.find(m => m.id === currentModel).name}
            </span>
            <FontAwesomeIcon icon={faChevronDown} className={`dropdown-icon ${isModelMenuOpen ? 'open' : ''}`} />
          </button>
          
          {isModelMenuOpen && (
            <div className="model-dropdown">
              {models.map(model => (
                <div 
                  key={model.id} 
                  className={`model-option ${model.id === currentModel ? 'active' : ''}`}
                  onClick={() => handleModelChange(model.id)}
                >
                  <div className="model-option-name">{model.name}</div>
                  <div className="model-option-description">{model.description}</div>
                </div>
              ))}
            </div>
          )}
        </div>
        
        <div className="chat-container">
          {/* Sidebar Toggle Button (Mobile) */}
          <button
            className="sidebar-toggle-mobile"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          >
            <FontAwesomeIcon icon={isSidebarOpen ? faXmark : faBars} />
          </button>
          
          {/* Desktop Sidebar Toggle - moves with sidebar */}
          <button 
            className={`sidebar-toggle-desktop ${isSidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          >
            <FontAwesomeIcon icon={isSidebarOpen ? faChevronLeft : faChevronRight} />
          </button>

          {/* Conversation Sidebar */}
          <div className={`conversation-sidebar ${isSidebarOpen ? 'open' : 'closed'}`}>
            <div className="sidebar-header">
              <h3>Conversations</h3>
              <button className="new-chat-btn" onClick={createNewChat}>
                <FontAwesomeIcon icon={faPlus} /> New Chat
              </button>
            </div>
            
            <div className="conversation-list">
              {conversations.map(convo => (
                <div 
                  key={convo.id} 
                  className={`conversation-item ${convo.active ? 'active' : ''}`}
                  onClick={() => switchConversation(convo.id)}
                >
                  <div className="conversation-icon">
                    <FontAwesomeIcon icon={faRobot} />
                  </div>
                  <div className="conversation-info">
                    <div className="conversation-title">{convo.title}</div>
                    <div className="conversation-preview">{convo.preview}</div>
                  </div>
                  {conversations.length > 1 && (
                    <button 
                      className="delete-conversation" 
                      onClick={(e) => deleteConversation(e, convo.id)}
                    >
                      <FontAwesomeIcon icon={faTrash} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
          
          <div className="chat-window">
            <div className="messages-container">
              {messages.map((message, index) => (
                <div 
                  key={index} 
                  className={`message ${message.role === 'user' ? 'user-message' : message.role === 'system' ? 'system-message' : 'assistant-message'}`}
                >
                  {message.role !== 'system' && (
                    <div className="message-avatar">
                      <FontAwesomeIcon 
                        icon={message.role === 'user' ? faUser : faRobot} 
                        className="avatar-icon"
                      />
                    </div>
                  )}
                  <div className="message-content">
                    <ReactMarkdown
                      remarkPlugins={[remarkGfm, remarkMath]}
                      rehypePlugins={[rehypeKatex]}
                      components={MarkdownComponents}
                    >
                      {message.content}
                    </ReactMarkdown>
                  </div>
                </div>
              ))}
              
              {isLoading && (
                <div className="message assistant-message">
                  <div className="message-avatar">
                    <FontAwesomeIcon icon={faRobot} className="avatar-icon" />
                  </div>
                  <div className="message-content loading">
                    <FontAwesomeIcon icon={faSpinner} className="loading-icon" spin />
                    <span>Thinking...</span>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>
            
            <form className="input-container" onSubmit={handleSendMessage}>
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask me anything..."
                className="message-input"
              />
              <button 
                type="submit" 
                className="send-button"
                disabled={!input.trim() || isLoading}
              >
                <FontAwesomeIcon icon={faPaperPlane} />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;