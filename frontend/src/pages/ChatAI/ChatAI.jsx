import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import Container from '@/components/ui/Container';
import './chatai.scss';
import { Send } from 'lucide-react';

function ChatAI() {
    const [message, setMessage] = useState('');
    const [chat, setChat] = useState([]);
    const [resizeCount, setResizeCount] = useState(0);
    const [loading, setLoading] = useState(false); // State to track loading
    const textareaRef = useRef(null);

    const sendMessage = async () => {
        if (message.trim() === '') return;

        const userMessage = { role: 'user', content: message };
        setChat([...chat, userMessage]);

        // Show loading indicator in chat
        const loadingMessage = { role: 'assistant', content: <span className="loading loading-dots loading-md"></span> };
        setChat((prevChat) => [...prevChat, loadingMessage]);

        setLoading(true); // Set loading to true
        setMessage(''); // Clear the input after sending
        setResizeCount(0); // Reset resize count after sending

        try {
            const response = await axios.post('/api/chat/chat', { message });
            const botMessage = { role: 'assistant', content: response.data.reply };
            setChat((prevChat) => {
                const updatedChat = prevChat.slice(0, -1); // Remove the loading indicator
                return [...updatedChat, botMessage]; // Add bot message to chat
            });
        } catch (error) {
            console.error('Error sending message:', error);
        } finally {
            setLoading(false); // Reset loading state
        }
    };

    const handleInputChange = (e) => {
        const { value } = e.target;
        setMessage(value);
        autoResize();
    };

    const autoResize = () => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto'; // Reset height
            textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`; // Set new height
            if (textareaRef.current.scrollHeight > 100 && resizeCount < 5) {
                setResizeCount((prevCount) => prevCount + 1);
            } else if (resizeCount >= 5) {
                textareaRef.current.style.overflowY = 'auto'; // Allow scrolling
            }
        }
    };

    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto'; // Reset height
            textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`; // Set new height
        }
    }, [message]); // Adjust height on message change

    return (
        <Container>
            <div className="chat-container mt-5">
                <div className="messages">
                    {chat.map((msg, index) => (
                        <div key={index} className={`chat ${msg.role === 'user' ? 'chat-end' : 'chat-start'}`}>
                            <div className={`chat-bubble ${msg.role === 'user' ? 'chat-bubble-success' : ''}`}>
                                {typeof msg.content === 'string' ? msg.content.split('\n').map((line, i) => (
                                    <div key={i}>{line}</div>
                                )) : msg.content}
                            </div>
                        </div>
                    ))}
                </div>

                <div className="message-box">
                    <textarea
                        ref={textareaRef}
                        className="message-input"
                        type="text"
                        placeholder="Введите вопрос..."
                        value={message}
                        onChange={handleInputChange}
                        style={{ overflowY: resizeCount >= 5 ? 'auto' : 'hidden' }}
                        disabled={loading} // Disable textarea while loading
                    />
                    <button
                        className="message-submit"
                        type="button"
                        onClick={sendMessage}
                        disabled={loading} // Disable button while loading
                    >
                        {loading ? <span className="loading loading-spinner loading-sm"></span>
                            : <Send />} {/* Button text changes while loading */}
                    </button>
                </div>
            </div>
        </Container>
    );
}

export default ChatAI;
