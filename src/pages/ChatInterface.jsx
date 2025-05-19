import { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
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
  faXmark
} from '@fortawesome/free-solid-svg-icons';
import './ChatInterface.scss';
import axios from 'axios';

const ChatInterface = () => {
  const [messages, setMessages] = useState([
    { 
      role: 'assistant',
      content: 'Hello! I\'m Oken\'s AI assistant. How can I help you today?'
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentModel, setCurrentModel] = useState('gpt-4');
  const [isModelMenuOpen, setIsModelMenuOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [conversations, setConversations] = useState([
    { id: 'current', title: 'Current Chat', preview: 'Hello! I\'m Keith\'s AI assistant...', active: true, messages: messages },
    { id: 'chat1', title: 'Website Development', preview: 'How do I optimize React performance?', active: false, messages: [
      { role: 'user', content: 'How do I optimize React performance?' },
      { role: 'assistant', content: 'To optimize React performance, you can use: memo, useCallback, useMemo, and virtual DOM optimization techniques...' }
    ]},
    { id: 'chat2', title: 'Portfolio Ideas', preview: 'What should I include in my portfolio?', active: false, messages: [
      { role: 'user', content: 'What should I include in my portfolio?' },
      { role: 'assistant', content: 'A good developer portfolio should showcase your best projects, skills, and experience...' }
    ]},
    { id: 'chat3', title: 'AI Integration', preview: 'How can I integrate AI into my website?', active: false, messages: [
      { role: 'user', content: 'How can I integrate AI into my website?' },
      { role: 'assistant', content: 'You can integrate AI into your website using APIs like OpenAI, HuggingFace, or by implementing...' }
    ]}
  ]);

  const messagesEndRef = useRef(null);
  const modelMenuRef = useRef(null);

  const models = [
    { id: 'gpt-4', name: 'GPT-4', description: 'Most capable model, best for complex tasks' },
    { id: 'gpt-3.5', name: 'GPT-3.5', description: 'Fast and efficient for standard queries' },
    { id: 'claude-3', name: 'Claude 3', description: 'Strong reasoning and comprehension' },
    { id: 'llama-3', name: 'Llama 3', description: 'Open-source alternative model' }
  ];

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
    
    // Update the active conversation with the new message
    updateActiveConversation(updatedMessages);
    
    setInput('');
    setIsLoading(true);
    
    try {
      const response = await axios.post(
        'https://openrouter.ai/api/v1/chat/completions',
        {
          model: models.find(m => m.id === currentModel).id,
          messages: updatedMessages.filter(m => m.role !== 'system'),
        },
        {
          headers: {
            'Authorization': `Bearer ${process.env.OPEN_ROUTER_KEY}`,
            'HTTP-Referer': process.env.SITE,
            'X-Title': process.env.SITE_NAME,
            'Content-Type': 'application/json'
          }
        }
      );
      
      const assistantMessage = {
        role: 'assistant',
        content: response.data.choices[0].message.content
      };
      
      const updatedWithResponse = [...updatedMessages, assistantMessage];
      setMessages(updatedWithResponse);
      updateActiveConversation(updatedWithResponse);
    } catch (error) {
      const errorMessage = {
        role: 'assistant',
        content: `Error: ${error.message}${error.response ? ` - ${error.response.data.error.message}` : ''}`
      };
      
      const updatedWithResponse = [...updatedMessages, errorMessage];
      setMessages(updatedWithResponse);
      updateActiveConversation(updatedWithResponse);
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
          content: 'Hello! I\'m Keith\'s AI assistant. How can I help you today?'
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
          {/* Sidebar Toggle Button (Mobile) */}
          <button
            className="sidebar-toggle-mobile"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          >
            <FontAwesomeIcon icon={isSidebarOpen ? faXmark : faBars} />
          </button>
          <button 
              className="sidebar-toggle" 
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
                    <ReactMarkdown>{message.content}</ReactMarkdown>
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