import React, { useState, useRef, useEffect } from 'react';

const AIChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
  if (!input.trim()) return;

  const userMessage = { text: input, sender: 'user', timestamp: new Date() };
  setMessages(prev => [...prev, userMessage]);
  setInput('');
  setLoading(true);

  // Simulate AI thinking
  setTimeout(() => {
    const lowerInput = input.toLowerCase();
    let response = "";

    // Better pattern matching for sugar related queries
    if (lowerInput.includes('sugar') || lowerInput.includes('diabetes') || lowerInput.includes('glucose')) {
      
      // Extract number from the message
      const numberMatch = input.match(/\d+/);
      const sugarValue = numberMatch ? parseInt(numberMatch[0]) : null;

      if (sugarValue) {
        if (sugarValue > 300) {
          response = `⚠️ Your sugar level of ${sugarValue} is VERY HIGH and requires immediate attention!

🔴 **URGENT:**
• Contact your doctor immediately
• If you can't reach your doctor, go to the emergency room
• Do NOT exercise as it can make it worse
• Drink water to stay hydrated
• Check for ketones if you have a meter

📞 This is a medical emergency. Please seek professional help right away.`;
        } 
        else if (sugarValue > 180) {
          response = `Your sugar level of ${sugarValue} is high (hyperglycemia).

✅ **What to do:**
• Take your medication as prescribed
• Drink plenty of water
• Go for a light walk if you feel able
• Avoid sugary foods and drinks
• Monitor your sugar again in 2-4 hours

📞 Contact your doctor if levels don't come down.`;
        }
        else if (sugarValue < 70) {
          response = `Your sugar level of ${sugarValue} is low (hypoglycemia).

✅ **Immediate steps:**
• Eat 15g fast-acting carbs (4 glucose tablets, 1/2 cup juice, 1 tbsp honey)
• Wait 15 minutes and recheck
• If still low, repeat
• Once normal, eat a small snack

📞 Seek help if you can't swallow or feel confused.`;
        }
        else {
          response = `Your sugar level of ${sugarValue} is within a good range (70-180 mg/dL).

✅ **Keep it up:**
• Continue your regular medication
• Maintain balanced meals
• Stay active
• Monitor regularly

💪 Great job managing your health!`;
        }
      } else {
        response = "For blood sugar management:\n\n✅ **General tips:**\n• Monitor regularly\n• Take medications on time\n• Eat balanced meals\n• Stay hydrated\n• Exercise regularly\n\n📊 Normal range: 70-180 mg/dL\n\n⚠️ If your sugar is very high (>300) or very low (<70), seek immediate medical help.";
      }
    }
    else if (lowerInput.includes('bp') || lowerInput.includes('blood pressure')) {
      const numberMatch = input.match(/\d+/g);
      if (numberMatch && numberMatch.length >= 2) {
        const systolic = parseInt(numberMatch[0]);
        const diastolic = parseInt(numberMatch[1]);
        
        if (systolic > 180 || diastolic > 120) {
          response = `⚠️ Your BP of ${systolic}/${diastolic} is VERY HIGH - This is a hypertensive crisis!

🚨 **EMERGENCY - CALL 911 NOW!**
• Chest pain
• Shortness of breath
• Severe headache
• Vision changes

📞 **IMMEDIATE MEDICAL ATTENTION REQUIRED**`;
        }
        else if (systolic > 140 || diastolic > 90) {
          response = `Your BP of ${systolic}/${diastolic} is high (Stage 2 hypertension).

✅ **What to do:**
• Contact your doctor
• Take medications as prescribed
• Reduce salt intake
• Manage stress
• Avoid caffeine/alcohol

📞 Schedule a doctor's appointment soon.`;
        }
        else {
          response = `Your BP of ${systolic}/${diastolic} is good! Keep maintaining healthy habits.`;
        }
      } else {
        response = "Normal blood pressure is below 120/80 mmHg. For accurate advice, please share your readings (e.g., 'my BP is 140/90').";
      }
    }
    else if (lowerInput.includes('hello') || lowerInput.includes('hi') || lowerInput.includes('hey')) {
      response = "Hello! 👋 I'm your HealthMate AI assistant. How can I help you today?\n\nYou can ask me about:\n• Blood sugar levels\n• Blood pressure\n• Diet & nutrition\n• Exercise\n• Symptoms\n• Medications";
    }
    else {
      response = "I understand you're asking about health. To give you the best advice, please tell me:\n\n• What specific health concern do you have?\n• What are your readings (if any)?\n• Are you on any medications?\n\nFor example: 'My sugar is 323, what should I do?'";
    }

    const aiMessage = { 
      text: response + "\n\n⚠️ This is AI-generated health information. For medical emergencies, please seek immediate professional help.", 
      sender: 'ai', 
      timestamp: new Date() 
    };
    
    setMessages(prev => [...prev, aiMessage]);
    setLoading(false);
  }, 1000);
};

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const clearChat = () => {
    setMessages([]);
  };

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          width: '60px',
          height: '60px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          border: 'none',
          cursor: 'pointer',
          boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
          fontSize: '24px',
          zIndex: 1000,
          transition: 'transform 0.3s ease, box-shadow 0.3s ease'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'scale(1.1)';
          e.currentTarget.style.boxShadow = '0 6px 20px rgba(0,0,0,0.3)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'scale(1)';
          e.currentTarget.style.boxShadow = '0 4px 15px rgba(0,0,0,0.2)';
        }}
      >
        {isOpen ? '✕' : '🤖'}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div
          style={{
            position: 'fixed',
            bottom: '90px',
            right: '20px',
            width: '350px',
            height: '500px',
            background: 'white',
            borderRadius: '12px',
            boxShadow: '0 5px 25px rgba(0,0,0,0.2)',
            display: 'flex',
            flexDirection: 'column',
            zIndex: 1000,
            overflow: 'hidden',
            animation: 'slideIn 0.3s ease'
          }}
        >
          {/* Header */}
          <div style={{
            padding: '15px',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontSize: '20px' }}>🤖</span>
              <div>
                <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '600' }}>HealthMate AI</h3>
                <p style={{ margin: 0, fontSize: '11px', opacity: 0.8 }}>Your Health Assistant</p>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                onClick={clearChat}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: 'white',
                  fontSize: '16px',
                  cursor: 'pointer',
                  opacity: 0.8
                }}
                title="Clear chat"
              >
                🗑️
              </button>
              <button
                onClick={() => setIsOpen(false)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: 'white',
                  fontSize: '18px',
                  cursor: 'pointer'
                }}
              >
                ✕
              </button>
            </div>
          </div>

          {/* Messages */}
          <div style={{
            flex: 1,
            padding: '15px',
            overflowY: 'auto',
            background: '#f8fafc'
          }}>
            {messages.length === 0 && (
              <div style={{
                textAlign: 'center',
                padding: '20px',
                color: '#64748b',
                fontSize: '14px'
              }}>
                <span style={{ fontSize: '48px', display: 'block', marginBottom: '15px' }}>👋</span>
                <h4 style={{ color: '#374151', marginBottom: '10px' }}>Hi! I'm HealthMate AI</h4>
                <p style={{ marginBottom: '15px' }}>Ask me anything about:</p>
                <div style={{ 
                  display: 'grid', 
                  gridTemplateColumns: '1fr 1fr', 
                  gap: '10px',
                  marginBottom: '20px',
                  fontSize: '12px'
                }}>
                  <div style={{ padding: '8px', background: 'white', borderRadius: '8px' }}>🩸 Blood Pressure</div>
                  <div style={{ padding: '8px', background: 'white', borderRadius: '8px' }}>🩺 Diabetes</div>
                  <div style={{ padding: '8px', background: 'white', borderRadius: '8px' }}>🥗 Diet & Nutrition</div>
                  <div style={{ padding: '8px', background: 'white', borderRadius: '8px' }}>💪 Exercise</div>
                  <div style={{ padding: '8px', background: 'white', borderRadius: '8px' }}>🤒 Symptoms</div>
                  <div style={{ padding: '8px', background: 'white', borderRadius: '8px' }}>💊 Vitamins</div>
                </div>
                <p style={{ fontSize: '11px', color: '#ef4444', marginTop: '10px' }}>
                  ⚠️ AI advice only - always consult a doctor
                </p>
              </div>
            )}
            
            {messages.map((msg, index) => (
              <div
                key={index}
                style={{
                  display: 'flex',
                  justifyContent: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                  marginBottom: '10px'
                }}
              >
                <div
                  style={{
                    maxWidth: '80%',
                    padding: '10px 15px',
                    borderRadius: '15px',
                    background: msg.sender === 'user' ? '#2563eb' : 'white',
                    color: msg.sender === 'user' ? 'white' : '#374151',
                    boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
                    fontSize: '13px',
                    lineHeight: '1.5',
                    borderBottomRightRadius: msg.sender === 'user' ? '5px' : '15px',
                    borderBottomLeftRadius: msg.sender === 'user' ? '15px' : '5px',
                  }}
                >
                  {msg.text.split('\n').map((line, i) => (
                    <React.Fragment key={i}>
                      {line}
                      {i < msg.text.split('\n').length - 1 && <br />}
                    </React.Fragment>
                  ))}
                  <div style={{
                    fontSize: '9px',
                    marginTop: '5px',
                    color: msg.sender === 'user' ? 'rgba(255,255,255,0.7)' : '#9ca3af',
                    textAlign: 'right'
                  }}>
                    {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              </div>
            ))}
            {loading && (
              <div style={{ display: 'flex', justifyContent: 'flex-start', marginBottom: '10px' }}>
                <div style={{
                  padding: '10px 15px',
                  borderRadius: '15px',
                  background: 'white',
                  color: '#374151',
                  fontSize: '13px'
                }}>
                  <div style={{ display: 'flex', gap: '5px' }}>
                    <span style={{ animation: 'pulse 1s infinite' }}>•</span>
                    <span style={{ animation: 'pulse 1s infinite 0.2s' }}>•</span>
                    <span style={{ animation: 'pulse 1s infinite 0.4s' }}>•</span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div style={{
            padding: '15px',
            borderTop: '1px solid #e2e8f0',
            background: 'white',
            display: 'flex',
            gap: '10px'
          }}>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask a health question..."
              style={{
                flex: 1,
                padding: '10px',
                border: '2px solid #e2e8f0',
                borderRadius: '8px',
                fontSize: '13px',
                outline: 'none',
                transition: 'border-color 0.3s ease'
              }}
              onFocus={(e) => e.target.style.borderColor = '#667eea'}
              onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
              disabled={loading}
            />
            <button
              onClick={handleSend}
              disabled={loading || !input.trim()}
              style={{
                padding: '10px 15px',
                background: loading || !input.trim() ? '#ccc' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: loading || !input.trim() ? 'not-allowed' : 'pointer',
                fontSize: '13px',
                transition: 'opacity 0.3s ease'
              }}
            >
              Send
            </button>
          </div>
        </div>
      )}

      {/* Add animations */}
      <style>
        {`
          @keyframes pulse {
            0%, 100% { opacity: 0.3; }
            50% { opacity: 1; }
          }
          
          @keyframes slideIn {
            from {
              opacity: 0;
              transform: translateY(20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
        `}
      </style>
    </>
  );
};

export default AIChatbot;