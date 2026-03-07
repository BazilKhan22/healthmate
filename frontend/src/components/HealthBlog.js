import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.js';
import { Link } from 'react-router-dom';
import axios from 'axios';

const HealthBlog = () => {
  const { user, logout } = useAuth();
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Sample articles data
  const allArticles = [
    {
      id: 1,
      title: "10 Tips for Better Sleep",
      category: "wellness",
      image: "https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?w=400",
      summary: "Quality sleep is essential for good health. Learn how to improve your sleep hygiene.",
      content: "Getting enough quality sleep is crucial for your physical and mental health. Here are 10 tips to help you sleep better: 1. Stick to a schedule, 2. Create a relaxing bedtime routine, 3. Make your bedroom comfortable, 4. Limit daytime naps, 5. Include physical activity in your daily routine, 6. Manage worries, 7. Avoid large meals before bedtime, 8. Reduce caffeine and alcohol, 9. Turn off electronics, 10. Get some sunlight each day.",
      author: "Dr. Sarah Khan",
      date: "2024-03-15",
      readTime: "5 min",
      icon: "😴"
    },
    {
      id: 2,
      title: "Understanding Blood Pressure",
      category: "heart",
      image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=400",
      summary: "Everything you need to know about blood pressure readings and what they mean.",
      content: "Blood pressure is the force of blood pushing against the walls of your arteries. It's measured in millimeters of mercury (mmHg) and recorded as two numbers: systolic pressure (when heart beats) and diastolic pressure (when heart rests between beats). Normal blood pressure is below 120/80 mmHg. High blood pressure (hypertension) is 130/80 mmHg or higher. Lifestyle changes like reducing salt intake, exercising regularly, and managing stress can help control blood pressure.",
      author: "Dr. Ahmed Raza",
      date: "2024-03-10",
      readTime: "4 min",
      icon: "❤️"
    },
    {
      id: 3,
      title: "Mental Health Matters",
      category: "mental",
      image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400",
      summary: "Simple practices to maintain good mental health in daily life.",
      content: "Mental health is just as important as physical health. Simple daily practices can make a big difference: 1. Practice mindfulness and meditation, 2. Stay connected with loved ones, 3. Exercise regularly, 4. Get enough sleep, 5. Eat a balanced diet, 6. Take breaks from screens, 7. Do things you enjoy, 8. Seek help when needed. Remember, it's okay to not be okay, and reaching out for support is a sign of strength.",
      author: "Dr. Fatima Ali",
      date: "2024-03-05",
      readTime: "6 min",
      icon: "🧠"
    },
    {
      id: 4,
      title: "Diabetes Prevention Guide",
      category: "diabetes",
      image: "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=400",
      summary: "How to reduce your risk of type 2 diabetes through lifestyle changes.",
      content: "Type 2 diabetes can often be prevented or delayed through lifestyle changes. Key strategies include: maintaining a healthy weight, staying physically active (at least 150 minutes per week), eating a balanced diet rich in fiber and low in sugar, avoiding sugary drinks, and getting regular check-ups. Small changes can lead to big results in reducing your diabetes risk.",
      author: "Dr. Imran Hussain",
      date: "2024-02-28",
      readTime: "7 min",
      icon: "🩸"
    },
    {
      id: 5,
      title: "Immune Boosting Foods",
      category: "nutrition",
      image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400",
      summary: "Top foods that can help strengthen your immune system naturally.",
      content: "A strong immune system is your body's best defense. Include these immune-boosting foods in your diet: citrus fruits (vitamin C), red bell peppers, broccoli, garlic, ginger, spinach, yogurt, almonds, turmeric, green tea, and papaya. Also stay hydrated, get enough sleep, and manage stress for optimal immune function.",
      author: "Nutritionist Ayesha Khan",
      date: "2024-02-20",
      readTime: "5 min",
      icon: "🍊"
    },
    {
      id: 6,
      title: "Exercise for Seniors",
      category: "fitness",
      image: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400",
      summary: "Safe and effective exercises for older adults to stay active.",
      content: "Regular exercise is crucial for seniors to maintain mobility, strength, and independence. Safe exercises include: walking, swimming, tai chi, chair yoga, light strength training with resistance bands, and balance exercises. Always start slowly, listen to your body, and consult with a doctor before starting any new exercise program.",
      author: "Physiotherapist Omar Farooq",
      date: "2024-02-15",
      readTime: "6 min",
      icon: "🏃"
    }
  ];

  useEffect(() => {
    // Simulate API fetch
    setTimeout(() => {
      setArticles(allArticles);
      setLoading(false);
    }, 1000);
  }, []);

  const categories = [
    { id: 'all', name: 'All Articles', icon: '📚' },
    { id: 'wellness', name: 'Wellness', icon: '🧘' },
    { id: 'heart', name: 'Heart Health', icon: '❤️' },
    { id: 'mental', name: 'Mental Health', icon: '🧠' },
    { id: 'diabetes', name: 'Diabetes', icon: '🩸' },
    { id: 'nutrition', name: 'Nutrition', icon: '🍎' },
    { id: 'fitness', name: 'Fitness', icon: '💪' }
  ];

  const filteredArticles = articles.filter(article => {
    const matchesCategory = selectedCategory === 'all' || article.category === selectedCategory;
    const matchesSearch = article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         article.summary.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const [selectedArticle, setSelectedArticle] = useState(null);

  return (
    <div>
      <nav className="navbar">
        <Link to="/dashboard" className="nav-brand">
          🏥 <span style={{ fontWeight: 700 }}>HealthMate</span>
        </Link>
        <div className="nav-links">
          <Link to="/dashboard" className="nav-link">Dashboard</Link>
          <Link to="/reports" className="nav-link">Reports</Link>
          <Link to="/vitals" className="nav-link">Vitals</Link>
          <Link to="/health-tips" className="nav-link">Health Tips</Link>
          <Link to="/reminders" className="nav-link">Reminders</Link>
          <Link to="/progress-report" className="nav-link">Progress</Link>
          <Link to="/settings" className="nav-link">Settings</Link>
          <Link to="/health-blog" className="nav-link active">📚 Health Blog</Link>
        </div>
        <div className="user-menu">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginRight: '15px' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#2563eb', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '600' }}>
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <span className="user-greeting">{user?.name}</span>
          </div>
          <button onClick={logout} className="btn btn-outline" style={{ padding: '8px 16px', fontSize: '14px' }}>
            Logout
          </button>
        </div>
      </nav>

      <div className="reports-container">
        {/* Header */}
        <div className="reports-header">
          <div>
            <h1 className="dashboard-title">Health Blog</h1>
            <p className="dashboard-subtitle">Latest articles, tips, and insights for a healthier life</p>
          </div>
        </div>

        {/* Search Bar */}
        <div style={{ marginBottom: '25px' }}>
          <div style={{ position: 'relative' }}>
            <span style={{ position: 'absolute', left: '12px', top: '12px', color: '#64748b' }}>🔍</span>
            <input
              type="text"
              placeholder="Search articles..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: '100%',
                padding: '12px 12px 12px 40px',
                border: '2px solid #e2e8f0',
                borderRadius: '10px',
                fontSize: '14px'
              }}
            />
          </div>
        </div>

        {/* Categories */}
        <div style={{ display: 'flex', gap: '10px', marginBottom: '25px', flexWrap: 'wrap' }}>
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              style={{
                padding: '8px 16px',
                background: selectedCategory === cat.id ? '#2563eb' : 'white',
                color: selectedCategory === cat.id ? 'white' : '#374151',
                border: '1px solid #e2e8f0',
                borderRadius: '20px',
                cursor: 'pointer',
                fontSize: '13px',
                display: 'flex',
                alignItems: 'center',
                gap: '5px'
              }}
            >
              <span>{cat.icon}</span>
              {cat.name}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="loading-screen">
            <div className="spinner"></div>
            <p>Loading articles...</p>
          </div>
        ) : (
          <>
            {/* Featured Article */}
            {filteredArticles.length > 0 && !selectedArticle && (
              <div className="chart-card fade-in" style={{ marginBottom: '25px', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
                <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                  <div style={{ fontSize: '60px' }}>{filteredArticles[0].icon}</div>
                  <div>
                    <h2 style={{ marginBottom: '10px' }}>Featured: {filteredArticles[0].title}</h2>
                    <p style={{ opacity: 0.9, marginBottom: '15px' }}>{filteredArticles[0].summary}</p>
                    <button
                      onClick={() => setSelectedArticle(filteredArticles[0])}
                      style={{
                        background: 'white',
                        color: '#2563eb',
                        border: 'none',
                        padding: '8px 16px',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontWeight: '600'
                      }}
                    >
                      Read Article →
                    </button>
                  </div>
                </div>
              </div>
            )}

            {selectedArticle ? (
              /* Article Detail View */
              <div className="chart-card fade-in">
                <button
                  onClick={() => setSelectedArticle(null)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#2563eb',
                    cursor: 'pointer',
                    fontSize: '14px',
                    marginBottom: '20px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px'
                  }}
                >
                  ← Back to all articles
                </button>

                <div style={{ marginBottom: '20px' }}>
                  <div style={{ fontSize: '48px', marginBottom: '10px' }}>{selectedArticle.icon}</div>
                  <h1 style={{ fontSize: '28px', marginBottom: '10px' }}>{selectedArticle.title}</h1>
                  
                  <div style={{ display: 'flex', gap: '20px', color: '#64748b', fontSize: '14px', marginBottom: '15px' }}>
                    <span>✍️ {selectedArticle.author}</span>
                    <span>📅 {new Date(selectedArticle.date).toLocaleDateString()}</span>
                    <span>⏱️ {selectedArticle.readTime} read</span>
                  </div>

                  <img 
                    src={selectedArticle.image} 
                    alt={selectedArticle.title}
                    style={{ width: '100%', maxHeight: '400px', objectFit: 'cover', borderRadius: '10px', marginBottom: '20px' }}
                  />

                  <p style={{ fontSize: '16px', lineHeight: '1.8', color: '#374151' }}>
                    {selectedArticle.content}
                  </p>
                </div>

                <div style={{ marginTop: '30px', padding: '20px', background: '#f8fafc', borderRadius: '10px' }}>
                  <h4 style={{ marginBottom: '10px' }}>About the Author</h4>
                  <p style={{ color: '#64748b' }}>{selectedArticle.author} is a healthcare professional dedicated to providing accurate and helpful health information.</p>
                </div>
              </div>
            ) : (
              /* Article Grid */
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '20px' }}>
                {filteredArticles.map(article => (
                  <div key={article.id} className="report-card fade-in" style={{ cursor: 'pointer' }} onClick={() => setSelectedArticle(article)}>
                    <img 
                      src={article.image} 
                      alt={article.title}
                      style={{ width: '100%', height: '180px', objectFit: 'cover', borderRadius: '8px 8px 0 0', marginBottom: '15px' }}
                    />
                    
                    <div style={{ padding: '0 15px 15px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                        <span style={{ fontSize: '24px' }}>{article.icon}</span>
                        <span style={{ fontSize: '12px', color: '#64748b' }}>{article.readTime} • {article.category}</span>
                      </div>
                      
                      <h3 style={{ fontSize: '18px', marginBottom: '8px' }}>{article.title}</h3>
                      <p style={{ fontSize: '13px', color: '#64748b', marginBottom: '10px' }}>{article.summary}</p>
                      
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '12px', color: '#2563eb' }}>Read more →</span>
                        <span style={{ fontSize: '11px', color: '#9ca3af' }}>{new Date(article.date).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default HealthBlog;