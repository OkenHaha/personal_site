import { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { okaidia } from 'react-syntax-highlighter/dist/esm/styles/prism';
import 'katex/dist/katex.min.css';
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
import { models } from "../data/modelsData";

const ChatInterface = () => {
  const SYSTEM_PROMPT = import.meta.env.VITE_PROMPT;

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
  const textareaRef = useRef(null);

  // Custom components for ReactMarkdown
  const MarkdownComponents = {
    code({ node, inline, className, children, ...props }) {
      const match = /language-(\w+)/.exec(className || '');
      const language = match ? match[1] : null; // Use null if no language

      if (!inline && language) {
        // CRITICAL: Ensure `children` is flattened to a string for SyntaxHighlighter
        let codeString = '';
        if (Array.isArray(children)) {
          codeString = children.map(child => {
            if (typeof child === 'string') {
              return child;
            }
            // If child is a React element (e.g., from nested markdown), try to get its text content.
            // This is a simplification. For complex cases, a more robust text extraction might be needed.
            if (typeof child === 'object' && child !== null && child.props && child.props.children) {
              // Recursively process children if it's also an array, or just stringify
              if (Array.isArray(child.props.children)) {
                return child.props.children.map(c => String(c)).join('');
              }
              return String(child.props.children);
            }
            return ''; // Return empty string for non-string/non-simple-element children
          }).join('');
        } else {
          codeString = String(children);
        }
        
        codeString = codeString.replace(/\n$/, ''); // Remove trailing newline

        try {
          return (
            <div className="code-block-container">
              <div className="code-block-header">
                <span className="code-language">{language}</span>
                <button
                  className="copy-code-btn"
                  onClick={() => copyToClipboard(codeString)}
                >
                  <FontAwesomeIcon icon={faCopy} />
                </button>
              </div>
              <div className="code-block-wrapper">
                <SyntaxHighlighter
                  style={okaidia}
                  language={language}
                  PreTag="div"
                  // Do NOT spread {...props} from ReactMarkdown here
                >
                  {codeString}
                </SyntaxHighlighter>
              </div>
            </div>
          );
        } catch (error) {
          console.error('ERROR rendering SyntaxHighlighter:', error);
          console.error('Props that caused error:', { language, codeString });
          // Fallback rendering in case SyntaxHighlighter fails
          return <pre><code className={`language-${language}`}>{codeString}</code></pre>;
        }
      }

      // Fallback for inline code or code blocks without a language
      // or if SyntaxHighlighter fails for some reason
      const { node: unusedNode, ...restCodeProps } = props; // Exclude 'node'
      return (
        <code className={className || (inline ? 'inline-code' : 'block-code')} {...restCodeProps}>
          {children}
        </code>
      );
    },
    p({ children }) {
      // Ensure children is processed to a string for regex match
      let textContent = '';
      if (typeof children === 'string') {
        textContent = children;
      } else if (Array.isArray(children)) {
        // Attempt to join if it's an array of strings/simple nodes
        textContent = children.map(child => {
          if (typeof child === 'string' || typeof child === 'number') {
            return child;
          }
          // Basic handling for simple React elements, might need refinement for complex children
          if (typeof child === 'object' && child !== null && child.props && child.props.children) {
            return String(child.props.children);
          }
          return '';
        }).join('');
      } else if (children !== null && children !== undefined) {
        textContent = String(children);
      }
      
      if (textContent.match(/^<think>[\s\S]*<\/think>$/)) {
        return null;
      }
      return <p>{children}</p>;
    },
    div({ children, ...props }) {
      // Exclude 'node' and other internal ReactMarkdown props if not standard HTML attributes
      const { node, ...restDivProps } = props;
      return <div className="markdown-block" {...restDivProps}>{children}</div>;
    }
  };


  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      // Optionally, provide user feedback (e.g., a small toast notification)
      // console.log('Copied to clipboard!');
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const cleanResponseContent = (content) => {
    if (!content) return '';
    
    let cleaned = content.replace(/<think>[\s\S]*?<\/think>/g, '');
    cleaned = cleaned.replace(/\\boxed\{([^}]+)\}/g, '$1'); // For math
    cleaned = cleaned.replace(/^\s*\\\w+\{([^}]+)\}\s*$/gm, '$1'); // Remove simple LaTeX commands if they are the only content
    cleaned = cleaned.replace(/\$\$\s*\$\$/g, ''); // Remove empty math blocks
    cleaned = cleaned.replace(/\n\s*\n\s*\n/g, '\n\n'); // Normalize multiple newlines
    
    // This logic might be too aggressive for code, consider if needed
    // if (cleaned.match(/^[\d\s\+\-\*\/\=\.]+$/) || cleaned.length < 10) {
    //   if (cleaned.match(/^\d+(\.\d+)?$/)) {
    //     cleaned = `The answer is ${cleaned}.`;
    //   }
    // }
    
    return cleaned.trim();
  };

  const adjustTextareaHeight = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto'; // Reset height
      textarea.style.height = Math.min(textarea.scrollHeight, 200) + 'px'; // Set to scrollHeight or max height
    }
  };

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

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

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setIsSidebarOpen(false);
      } else {
        setIsSidebarOpen(true); // Or maintain its current state if preferred
      }
    };
    window.addEventListener('resize', handleResize);
    handleResize(); // Initial check
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleSendMessage = async (e) => {
    e?.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = { role: 'user', content: input };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    updateActiveConversation(updatedMessages, input); // Update preview early

    setInput('');
    adjustTextareaHeight();
    setIsLoading(true);

    try {
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
      console.log('API Response Data:', data);

      if (!data.choices || data.choices.length === 0 || !data.choices[0].message) {
        console.error('Invalid API response structure:', data);
        throw new Error('No response from model or invalid structure - the model may be unavailable or returned an unexpected format.');
      }

      const messageContent = data.choices[0].message.content;
      if (messageContent === null || messageContent === undefined) {
        console.error('No message content in response (null or undefined):', data.choices[0]);
        throw new Error('Empty response content from model');
      }
      console.log('Raw model response content:', messageContent);

      const cleanedContent = cleanResponseContent(messageContent);
      console.log('Cleaned model response content:', cleanedContent);


      const assistantMessage = {
        role: 'assistant',
        content: cleanedContent
      };

      const finalMessages = [...updatedMessages, assistantMessage];
      setMessages(finalMessages);
      updateActiveConversation(finalMessages);

    } catch (error) {
      console.error('Full error in handleSendMessage:', error);
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

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleModelChange = (modelId) => {
    setCurrentModel(modelId);
    setIsModelMenuOpen(false);
    const modelName = models.find(m => m.id === modelId)?.name || modelId;
    const systemMessage = {
      role: 'system',
      content: `Switched to ${modelName}`
    };
    const updatedMessages = [...messages, systemMessage];
    setMessages(updatedMessages);
    updateActiveConversation(updatedMessages);
  };

  const updateActiveConversation = (newMessages, lastUserMessageContent = null) => {
    setConversations(prev =>
      prev.map(convo => {
        if (convo.active) {
          let previewContent = '';
          if (newMessages.length > 0) {
            // Try to find the last non-system message
            const lastMeaningfulMessage = [...newMessages].reverse().find(m => m.role !== 'system');
            if (lastMeaningfulMessage) {
              previewContent = lastMeaningfulMessage.content;
            } else if (lastUserMessageContent) { // Fallback if only system messages were added
              previewContent = lastUserMessageContent;
            } else if (convo.messages.length > 0) { // Fallback to existing messages
              const lastExistingMeaningful = [...convo.messages].reverse().find(m => m.role !== 'system');
              previewContent = lastExistingMeaningful ? lastExistingMeaningful.content : 'Chat updated';
            } else {
              previewContent = 'Chat updated';
            }
          } else {
            previewContent = convo.preview || 'Empty chat';
          }
          
          return {
            ...convo,
            messages: [...newMessages], // Ensure it's a new array reference
            preview: truncateText(previewContent, 40)
          };
        }
        return convo;
      })
    );
  };


  const createNewChat = () => {
    const newChatId = `chat-${Date.now()}`;
    const initialMessages = [
      {
        role: 'assistant',
        content: 'Hello! I\'m Oken\'s AI assistant. How can I help you today?'
      }
    ];
    const newChat = {
      id: newChatId,
      title: `New Chat ${conversations.filter(c => c.title.startsWith("New Chat")).length + 1}`,
      preview: 'Start a new conversation...',
      active: true,
      messages: initialMessages
    };

    setConversations(prev =>
      [newChat, ...prev.map(c => ({ ...c, active: false }))]
    );
    setMessages([...initialMessages]); // Set current messages to the new chat's messages
  };

  const switchConversation = (conversationId) => {
    const selectedConvo = conversations.find(c => c.id === conversationId);
    if (selectedConvo) {
      setConversations(prev =>
        prev.map(convo => ({
          ...convo,
          active: convo.id === conversationId
        }))
      );
      setMessages([...selectedConvo.messages]); // Set messages from the selected conversation
    }
    if (window.innerWidth < 768) {
      setIsSidebarOpen(false);
    }
  };

  const deleteConversation = (e, conversationIdToDelete) => {
    e.stopPropagation(); // Prevent switching to the conversation when clicking delete

    setConversations(prev => {
      const convoToDelete = prev.find(c => c.id === conversationIdToDelete);
      const remainingConversations = prev.filter(c => c.id !== conversationIdToDelete);

      if (remainingConversations.length === 0) {
        // If all conversations are deleted, create a new default one
        const newChatId = `chat-${Date.now()}`;
        const initialMessages = [{ role: 'assistant', content: 'Hello! How can I help?' }];
        const newDefaultChat = {
          id: newChatId,
          title: 'New Chat 1',
          preview: 'Start a new conversation...',
          active: true,
          messages: initialMessages
        };
        setMessages([...initialMessages]);
        return [newDefaultChat];
      } else if (convoToDelete && convoToDelete.active) {
        // If the active conversation was deleted, make the first one active
        const newActiveConversations = remainingConversations.map((c, index) => ({
          ...c,
          active: index === 0
        }));
        setMessages([...newActiveConversations[0].messages]);
        return newActiveConversations;
      }
      return remainingConversations;
    });
  };


  const truncateText = (text, maxLength) => {
    if (!text) return '';
    return text.length > maxLength
      ? text.substring(0, maxLength) + '...'
      : text;
  };

  // Update 'Current Chat' messages when main messages state changes AND 'current' is active
  // This is to keep the initial 'current' chat in sync if it's the one being used.
  useEffect(() => {
    const activeConvo = conversations.find(c => c.active);
    if (activeConvo && activeConvo.id === 'current') {
        setConversations(prev => prev.map(c => 
            c.id === 'current' ? { ...c, messages: messages, preview: truncateText(messages[messages.length-1]?.content || c.preview, 40) } : c
        ));
    }
  }, [messages]);


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
              {models.find(m => m.id === currentModel)?.name || 'Select Model'}
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
          <button
            className="sidebar-toggle-mobile"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          >
            <FontAwesomeIcon icon={isSidebarOpen ? faXmark : faBars} />
          </button>

          <button
            className={`sidebar-toggle-desktop ${isSidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          >
            <FontAwesomeIcon icon={isSidebarOpen ? faChevronLeft : faChevronRight} />
          </button>

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
                    <FontAwesomeIcon icon={faRobot} /> {/* Or a more dynamic icon */}
                  </div>
                  <div className="conversation-info">
                    <div className="conversation-title">{truncateText(convo.title, 25)}</div>
                    <div className="conversation-preview">{convo.preview}</div>
                  </div>
                  {/* Only show delete if more than one convo or if it's not the 'current' and only one (edge case) */}
                  { (conversations.length > 1 || (conversations.length === 1 && convo.id !== 'current')) && (
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
                  key={`${message.role}-${index}-${message.content.slice(0,10)}`} // More unique key
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
              <textarea
                ref={textareaRef}
                value={input}
                onChange={(e) => {
                  setInput(e.target.value);
                  adjustTextareaHeight();
                }}
                onKeyDown={handleKeyDown}
                placeholder="Ask me anything... (Shift+Enter for new line)"
                className="message-input"
                rows="1"
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