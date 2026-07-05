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

  setTimeout(() => {
    const lowerInput = input.toLowerCase();
    let response = "";

    // Sugar / Diabetes
    if (lowerInput.includes('sugar') || lowerInput.includes('diabetes') || lowerInput.includes('glucose')) {
      const numberMatch = input.match(/\d+/);
      const sugarValue = numberMatch ? parseInt(numberMatch[0]) : null;
      if (sugarValue) {
        if (sugarValue > 300) {
          response = `⚠️ Your sugar level of ${sugarValue} is VERY HIGH!\n\n🔴 URGENT:\n• Contact your doctor immediately\n• Go to emergency if needed\n• Do NOT exercise\n• Drink water\n• Check for ketones`;
        } else if (sugarValue > 180) {
          response = `Your sugar level of ${sugarValue} is high.\n\n✅ What to do:\n• Take medication as prescribed\n• Drink plenty of water\n• Light walk if able\n• Avoid sugary foods\n• Recheck in 2-4 hours`;
        } else if (sugarValue < 70) {
          response = `Your sugar level of ${sugarValue} is LOW!\n\n✅ Immediate steps:\n• Eat 15g fast carbs (juice, glucose tablets, honey)\n• Wait 15 minutes, recheck\n• Eat a small snack after recovery\n• Seek help if confused`;
        } else {
          response = `Your sugar level of ${sugarValue} is normal (70-180 mg/dL). ✅\n\n💪 Keep it up:\n• Continue medication\n• Balanced meals\n• Stay active`;
        }
      } else {
        response = "For blood sugar:\n\n📊 Normal range: 70-180 mg/dL\n• Monitor regularly\n• Take medications on time\n• Eat balanced meals\n\nShare your reading for specific advice e.g. 'my sugar is 250'";
      }
    }

    // Blood Pressure
    else if (lowerInput.includes('bp') || lowerInput.includes('blood pressure') || lowerInput.includes('hypertension')) {
      const numberMatch = input.match(/\d+/g);
      if (numberMatch && numberMatch.length >= 2) {
        const systolic = parseInt(numberMatch[0]);
        const diastolic = parseInt(numberMatch[1]);
        if (systolic > 180 || diastolic > 120) {
          response = `⚠️ BP ${systolic}/${diastolic} is DANGEROUSLY HIGH!\n\n🚨 EMERGENCY:\n• Call doctor immediately\n• Watch for chest pain, headache, vision changes\n• Do not exercise\n• Rest immediately`;
        } else if (systolic > 140 || diastolic > 90) {
          response = `BP ${systolic}/${diastolic} is high (Stage 2).\n\n✅ What to do:\n• Contact your doctor\n• Take medications as prescribed\n• Reduce salt intake\n• Manage stress\n• Avoid caffeine`;
        } else if (systolic > 120 || diastolic > 80) {
          response = `BP ${systolic}/${diastolic} is slightly elevated (Stage 1).\n\n✅ Tips:\n• Reduce salt and processed food\n• Exercise regularly\n• Manage stress\n• Monitor daily`;
        } else {
          response = `BP ${systolic}/${diastolic} is normal! ✅\n\n💪 Keep maintaining:\n• Healthy diet\n• Regular exercise\n• Less salt\n• Good sleep`;
        }
      } else {
        response = "Normal BP is below 120/80 mmHg.\n\nShare your reading for specific advice e.g. 'my BP is 140/90'";
      }
    }

    // Fever
    else if (lowerInput.includes('fever') || lowerInput.includes('bukhar') || lowerInput.includes('temperature')) {
      const numberMatch = input.match(/\d+(\.\d+)?/);
      const temp = numberMatch ? parseFloat(numberMatch[0]) : null;
      if (temp) {
        if (temp >= 104) {
          response = `⚠️ Temperature ${temp}°F is VERY HIGH!\n\n🚨 Go to emergency immediately!\n• This can cause seizures\n• Apply cold compress\n• Do not give aspirin to children`;
        } else if (temp >= 102) {
          response = `Temperature ${temp}°F is high fever.\n\n✅ What to do:\n• Take paracetamol/ibuprofen\n• Stay hydrated\n• Rest completely\n• Cool compress on forehead\n• See doctor if fever persists >2 days`;
        } else if (temp >= 99) {
          response = `Temperature ${temp}°F is mild fever.\n\n✅ Tips:\n• Rest and hydrate\n• Light clothing\n• Paracetamol if uncomfortable\n• Monitor every 4 hours`;
        } else {
          response = `Temperature ${temp}°F is normal. ✅\n\nNormal range: 97-99°F (36-37.2°C)`;
        }
      } else {
        response = "For fever management:\n\n🌡️ Normal: 97-99°F\n• Mild fever: 99-102°F → Rest, hydrate, paracetamol\n• High fever: 102-104°F → See doctor\n• Very high: 104°F+ → Emergency!\n\nShare your temperature for specific advice.";
      }
    }

    // Headache
    else if (lowerInput.includes('headache') || lowerInput.includes('sir dard') || lowerInput.includes('head pain') || lowerInput.includes('migraine')) {
      response = `For headache/migraine:\n\n✅ Immediate relief:\n• Rest in a dark, quiet room\n• Apply cold or warm compress\n• Stay hydrated — dehydration causes headaches\n• Take paracetamol if needed\n• Gentle neck stretches\n\n⚠️ See doctor if:\n• Sudden severe headache\n• Headache with fever and stiff neck\n• Vision changes\n• Headache after head injury\n• Persistent headaches daily`;
    }

    // Feeling tired / fatigue
    else if (lowerInput.includes('tired') || lowerInput.includes('fatigue') || lowerInput.includes('exhausted') || lowerInput.includes('weakness') || lowerInput.includes('kamzori') || lowerInput.includes('feeling low')) {
      response = `For fatigue and weakness:\n\n✅ Common causes:\n• Poor sleep (aim 7-8 hours)\n• Dehydration\n• Iron deficiency / anemia\n• Low vitamin D or B12\n• Stress or anxiety\n\n💊 Tips:\n• Drink 8-10 glasses of water daily\n• Eat iron-rich foods (spinach, meat, lentils)\n• Take vitamin supplements if needed\n• Light exercise boosts energy\n• Avoid excessive caffeine\n\n📞 See doctor if fatigue persists >2 weeks — could indicate thyroid, anemia, or diabetes.`;
    }

    // Cough
    else if (lowerInput.includes('cough') || lowerInput.includes('khansi') || lowerInput.includes('khasi')) {
      response = `For cough:\n\n✅ Home remedies:\n• Honey + warm water or ginger tea\n• Steam inhalation 2x daily\n• Stay hydrated\n• Avoid cold drinks and dust\n• Salt water gargle\n\n⚠️ See doctor if:\n• Cough with blood\n• Cough >3 weeks\n• High fever with cough\n• Difficulty breathing\n• Chest pain while coughing`;
    }

    // Sneezing / Cold
    else if (lowerInput.includes('sneezing') || lowerInput.includes('cold') || lowerInput.includes('runny nose') || lowerInput.includes('zukam') || lowerInput.includes('nasal')) {
      response = `For cold and sneezing:\n\n✅ Relief tips:\n• Steam inhalation\n• Warm soups and fluids\n• Honey + ginger + lemon tea\n• Rest well\n• Saline nasal drops\n• Vitamin C fruits (oranges, lemon)\n\n💊 Medications:\n• Antihistamines for sneezing\n• Decongestants for blocked nose\n\n⚠️ See doctor if symptoms >10 days or high fever develops.`;
    }

    // Heart disease / chest pain
    else if (lowerInput.includes('heart') || lowerInput.includes('chest pain') || lowerInput.includes('chest tightness') || lowerInput.includes('heart attack') || lowerInput.includes('cardiac') || lowerInput.includes('palpitation')) {
      response = `⚠️ HEART SYMPTOMS — Take seriously!\n\n🚨 Call emergency immediately if:\n• Chest pain or pressure\n• Pain spreading to arm, jaw, back\n• Shortness of breath\n• Sweating with chest discomfort\n• Irregular heartbeat\n\n✅ For mild palpitations:\n• Sit down and rest\n• Breathe slowly and deeply\n• Drink water\n• Avoid caffeine and stress\n\n📞 Always consult a cardiologist for any heart-related symptoms. Do not ignore!`;
    }

    // Diet / nutrition
    else if (lowerInput.includes('diet') || lowerInput.includes('food') || lowerInput.includes('nutrition') || lowerInput.includes('weight') || lowerInput.includes('khana')) {
      response = `Healthy diet tips:\n\n✅ Eat more:\n• Fresh fruits and vegetables\n• Whole grains (brown rice, oats)\n• Lean proteins (chicken, fish, lentils)\n• Nuts and seeds\n• Plenty of water\n\n🚫 Avoid:\n• Processed and fried foods\n• Sugary drinks\n• Excessive salt\n• Trans fats\n\n💡 Tip: Eat smaller portions 5x a day instead of 3 large meals.`;
    }

    // Exercise
    else if (lowerInput.includes('exercise') || lowerInput.includes('workout') || lowerInput.includes('walk') || lowerInput.includes('gym') || lowerInput.includes('physical activity')) {
      response = `Exercise recommendations:\n\n✅ For general health:\n• 30 minutes walking daily\n• Stretching morning and evening\n• Swimming or cycling 3x/week\n\n💪 Benefits:\n• Controls blood sugar and BP\n• Improves heart health\n• Boosts energy and mood\n• Better sleep\n\n⚠️ Start slow if you haven't exercised in a while. Consult doctor before starting if you have heart or joint issues.`;
    }

    // Sleep
    else if (lowerInput.includes('sleep') || lowerInput.includes('insomnia') || lowerInput.includes('neend') || lowerInput.includes('can\'t sleep')) {
      response = `For better sleep:\n\n✅ Tips:\n• Sleep same time every night\n• Avoid phone/screen 1 hour before bed\n• Keep room dark and cool\n• No caffeine after 4pm\n• Light walk in evening\n• Warm milk or chamomile tea\n\n⚠️ See doctor if:\n• Can't sleep >3 weeks\n• Snoring loudly (sleep apnea)\n• Extreme daytime sleepiness`;
    }

    // Greeting
    else if (lowerInput.includes('hello') || lowerInput.includes('hi') || lowerInput.includes('hey') || lowerInput.includes('salam') || lowerInput.includes('assalam')) {
      response = `Hello! 👋 I'm HealthMate AI assistant.\n\nI can help you with:\n• 🩸 Blood Sugar & Diabetes\n• 💓 Blood Pressure\n• 🌡️ Fever & Temperature\n• 🤒 Headache & Migraine\n• 😴 Fatigue & Weakness\n• 😤 Cough & Cold\n• ❤️ Heart Symptoms\n• 🥗 Diet & Nutrition\n• 💪 Exercise Tips\n• 😴 Sleep Problems\n\nWhat can I help you with today?`;
    }

    // Default
    else {
      response = `I'm here to help with your health questions! 🏥\n\nYou can ask me about:\n• Blood sugar or BP readings\n• Fever and temperature\n• Headache or migraine\n• Fatigue or weakness\n• Cough, cold, sneezing\n• Heart symptoms\n• Diet and nutrition\n• Exercise tips\n• Sleep problems\n\nExample: "My sugar is 280, what should I do?" or "I have a headache, help me"`;
    }

    const aiMessage = {
      text: response + "\n\n⚠️ AI-generated info only. Always consult a doctor for medical advice.",
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