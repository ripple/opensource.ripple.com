import React, { useState } from 'react';
import styled from 'styled-components';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import remarkGfm from 'remark-gfm';

const ChatContainer = styled.div`
  width: 900px;
  height: 700px;
  max-width: 98vw;
  max-height: 90vh;
  min-width: 320px;
  min-height: 320px;
  border: 1px solid #ccc;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  background: #fff;
  box-sizing: border-box;
`;

const MessagesArea = styled.div`
  flex: 1;
  padding: 16px;
  overflow-y: auto;
  background: #f9f9f9;
`;

const Message = styled.div<{ isUser: boolean }>`
  margin-bottom: 10px;
  text-align: ${({ isUser }) => (isUser ? 'right' : 'left')};
  color: ${({ isUser }) => (isUser ? '#007aff' : '#333')};
`;

const InputArea = styled.form`
  display: flex;
  padding: 12px;
  border-top: 1px solid #eee;
`;

const Input = styled.input`
  flex: 1;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
  margin-right: 8px;
`;

const SendButton = styled.button`
  padding: 8px 16px;
  background: #007aff;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
`;

const MarkdownTable = styled.table`
  border-collapse: collapse;
  width: 100%;
  margin: 1em 0;
`;
const MarkdownTh = styled.th`
  border: 1px solid #ccc;
  padding: 8px;
  background: #f4f4f4;
  font-weight: bold;
`;
const MarkdownTd = styled.td`
  border: 1px solid #ccc;
  padding: 8px;
  background: #fff;
`;

const Disclaimer = styled.div`
  margin: 8px 0 0 0;
  font-size: 0.92rem;
  color: #888fa1;
  background: #f7f9fb;
  border-radius: 4px;
  padding: 6px 12px;
  text-align: center;
`;

export const ChatWindow: React.FC = () => {
  const [messages, setMessages] = useState<{ text: string; isUser: boolean }[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [showDisclaimer, setShowDisclaimer] = useState(true);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessages((msgs) => [...msgs, { text: input, isUser: true }]);
    setInput('');
    setLoading(true);
    if (showDisclaimer) setShowDisclaimer(false);
    const response = await fetch('https://0f2ejwtb03.execute-api.us-west-2.amazonaws.com/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: input }),
    });
    const data = await response.json();
    console.log(data.completion)
    setMessages((msgs) => [...msgs, { text: data.completion || 'No response', isUser: false }]);
    setLoading(false);
  };

  return (
    <ChatContainer>
      <MessagesArea>
        {messages.map((msg, idx) => (
          <Message key={idx} isUser={msg.isUser}>
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                code({ node, className, children, ...props }) {
                  const match = /language-(\w+)/.exec(className || '');
                  return className && match ? (
                    <SyntaxHighlighter
                      style={vscDarkPlus}
                      language={match[1]}
                      PreTag="div"
                      customStyle={{ borderRadius: 6, margin: '1em 0' }}
                    >
                      {String(children).replace(/\n$/, '')}
                    </SyntaxHighlighter>
                  ) : (
                    <code
                      style={{
                        background: '#f4f4f4',
                        borderRadius: '4px',
                        padding: '2px 4px',
                        fontSize: '95%',
                      }}
                      {...props}
                    >
                      {children}
                    </code>
                  );
                },
                table({ children }) {
                  return <MarkdownTable>{children}</MarkdownTable>;
                },
                th({ children }) {
                  return <MarkdownTh>{children}</MarkdownTh>;
                },
                td({ children }) {
                  return <MarkdownTd>{children}</MarkdownTd>;
                },
              }}
            >
              {msg.text}
            </ReactMarkdown>
          </Message>
        ))}
        {loading && <Message isUser={false}>Agent is thinking...</Message>}
      </MessagesArea>
      {/* Show disclaimer only if showDisclaimer is true */}
      {showDisclaimer && (
        <Disclaimer style={{
          background: '#fff3cd',
          color: '#856404',
          border: '1.5px solid #ffe082',
          fontWeight: 600,
          fontSize: '1.08rem',
          margin: '32px auto 16px auto',
          maxWidth: '80%',
          textAlign: 'center',
          boxShadow: '0 2px 8px 0 rgba(0,0,0,0.04)',
        }}>
          The Agent might provide incomplete or incorrect results.<br />
          <span style={{ fontWeight: 400 }}>Verify important information for production environments.</span>
        </Disclaimer>
      )}
      <InputArea onSubmit={sendMessage}>
        <Input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
          disabled={loading}
        />
        <SendButton type="submit" disabled={loading}>
          Send
        </SendButton>
      </InputArea>
    </ChatContainer>
  );
};
