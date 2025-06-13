from flask import Flask, render_template, request, jsonify, send_file
import json
import os
from datetime import datetime, timedelta
import random
import io
import base64

app = Flask(__name__)

# Mock data storage (in production, use a proper database)
DATA_FILE = 'data.json'

def load_data():
    if os.path.exists(DATA_FILE):
        with open(DATA_FILE, 'r') as f:
            return json.load(f)
    return {
        'messages': [],
        'tasks': [],
        'notes': '',
        'theme': 'dark'
    }

def save_data(data):
    with open(DATA_FILE, 'w') as f:
        json.dump(data, f, indent=2)

# Routes
@app.route('/')
def index():
    return render_template('index.html')

@app.route('/api/chat', methods=['POST'])
def chat():
    data = request.json
    message = data.get('message', '')
    role = data.get('role', 'developer')
    
    # Mock AI responses based on role
    responses = {
        'developer': f"As a developer assistant, I can help you with: {message}. Let me provide some coding insights and best practices.",
        'therapist': f"I understand you're sharing: {message}. It's important to acknowledge your feelings. How does this make you feel?",
        'finance': f"Regarding your financial query: {message}. Let me provide some market insights and investment strategies.",
        'student': f"Great question about: {message}. Let me break this down into easy-to-understand concepts.",
        'custom': f"I'll help you with: {message}. Let me provide a comprehensive response."
    }
    
    response = responses.get(role, responses['custom'])
    
    # Save message to data
    app_data = load_data()
    app_data['messages'].append({
        'id': str(len(app_data['messages']) + 1),
        'role': 'user',
        'content': message,
        'timestamp': datetime.now().isoformat()
    })
    app_data['messages'].append({
        'id': str(len(app_data['messages']) + 1),
        'role': 'assistant',
        'content': response,
        'timestamp': datetime.now().isoformat()
    })
    save_data(app_data)
    
    return jsonify({'response': response})

@app.route('/api/tasks', methods=['GET', 'POST', 'PUT', 'DELETE'])
def tasks():
    app_data = load_data()
    
    if request.method == 'GET':
        return jsonify(app_data['tasks'])
    
    elif request.method == 'POST':
        task_data = request.json
        new_task = {
            'id': str(len(app_data['tasks']) + 1),
            'title': task_data['title'],
            'description': task_data.get('description', ''),
            'tag': task_data.get('tag', 'Work'),
            'priority': len(app_data['tasks']),
            'completed': False,
            'date': task_data.get('date', datetime.now().strftime('%Y-%m-%d')),
            'time': task_data.get('time', '09:00')
        }
        app_data['tasks'].append(new_task)
        save_data(app_data)
        return jsonify(new_task)
    
    elif request.method == 'PUT':
        task_data = request.json
        task_id = task_data['id']
        for i, task in enumerate(app_data['tasks']):
            if task['id'] == task_id:
                app_data['tasks'][i] = task_data
                break
        save_data(app_data)
        return jsonify(task_data)
    
    elif request.method == 'DELETE':
        task_id = request.json['id']
        app_data['tasks'] = [t for t in app_data['tasks'] if t['id'] != task_id]
        save_data(app_data)
        return jsonify({'success': True})

@app.route('/api/news')
def news():
    category = request.args.get('category', 'world')
    
    # Mock news data
    mock_news = {
        'world': [
            {
                'title': 'Global Climate Summit Reaches Historic Agreement',
                'description': 'World leaders unite on comprehensive climate action plan with binding commitments.',
                'url': 'https://example.com/news1',
                'urlToImage': 'https://images.pexels.com/photos/3183132/pexels-photo-3183132.jpeg',
                'publishedAt': datetime.now().isoformat(),
                'source': {'name': 'Global News'}
            },
            {
                'title': 'Breakthrough in Renewable Energy Technology',
                'description': 'Scientists develop new solar panel technology with 40% efficiency rate.',
                'url': 'https://example.com/news2',
                'urlToImage': 'https://images.pexels.com/photos/356036/pexels-photo-356036.jpeg',
                'publishedAt': (datetime.now() - timedelta(hours=2)).isoformat(),
                'source': {'name': 'Tech Today'}
            }
        ],
        'finance': [
            {
                'title': 'Stock Markets Hit Record Highs',
                'description': 'Major indices surge on positive economic data and corporate earnings.',
                'url': 'https://example.com/finance1',
                'urlToImage': 'https://images.pexels.com/photos/590041/pexels-photo-590041.jpg',
                'publishedAt': datetime.now().isoformat(),
                'source': {'name': 'Finance Daily'}
            }
        ],
        'india': [
            {
                'title': 'India Launches Digital Infrastructure Initiative',
                'description': 'Government announces massive investment in digital connectivity across rural areas.',
                'url': 'https://example.com/india1',
                'urlToImage': 'https://images.pexels.com/photos/1098982/pexels-photo-1098982.jpeg',
                'publishedAt': datetime.now().isoformat(),
                'source': {'name': 'India Today'}
            }
        ],
        'crypto': [
            {
                'title': 'Bitcoin Adoption Accelerates Globally',
                'description': 'Major corporations and countries embrace cryptocurrency for international trade.',
                'url': 'https://example.com/crypto1',
                'urlToImage': 'https://images.pexels.com/photos/844124/pexels-photo-844124.jpeg',
                'publishedAt': datetime.now().isoformat(),
                'source': {'name': 'Crypto Weekly'}
            }
        ],
        'tech': [
            {
                'title': 'AI Revolution Transforms Healthcare',
                'description': 'Machine learning algorithms show 95% accuracy in early disease detection.',
                'url': 'https://example.com/tech1',
                'urlToImage': 'https://images.pexels.com/photos/3183153/pexels-photo-3183153.jpeg',
                'publishedAt': datetime.now().isoformat(),
                'source': {'name': 'Tech Review'}
            }
        ]
    }
    
    return jsonify(mock_news.get(category, []))

@app.route('/api/market')
def market():
    # Generate mock market data
    stocks = [
        {'symbol': 'NIFTY50', 'name': 'Nifty 50', 'basePrice': 19500},
        {'symbol': 'SENSEX', 'name': 'BSE Sensex', 'basePrice': 65000},
        {'symbol': 'NASDAQ', 'name': 'NASDAQ', 'basePrice': 15000},
        {'symbol': 'DJI', 'name': 'Dow Jones', 'basePrice': 34000},
        {'symbol': 'USDINR', 'name': 'USD-INR', 'basePrice': 83.2},
        {'symbol': 'BTC', 'name': 'Bitcoin', 'basePrice': 42000},
        {'symbol': 'ETH', 'name': 'Ethereum', 'basePrice': 2500}
    ]
    
    market_data = []
    for stock in stocks:
        # Generate random price movement
        change_percent = random.uniform(-5, 5)
        current_price = stock['basePrice'] * (1 + change_percent / 100)
        change = current_price - stock['basePrice']
        
        # Generate mock chart data
        chart_data = []
        price = stock['basePrice']
        for i in range(30):
            price += random.uniform(-price * 0.02, price * 0.02)
            chart_data.append(round(price, 2))
        
        market_data.append({
            'symbol': stock['symbol'],
            'name': stock['name'],
            'price': round(current_price, 2),
            'change': round(change, 2),
            'changePercent': round(change_percent, 2),
            'data': chart_data
        })
    
    return jsonify(market_data)

@app.route('/api/currency')
def currency():
    # Mock exchange rates
    rates = {
        'USD': {'INR': 83.2, 'EUR': 0.92, 'GBP': 0.79, 'JPY': 149.5},
        'EUR': {'USD': 1.08, 'INR': 90.1, 'GBP': 0.86, 'JPY': 162.0},
        'GBP': {'USD': 1.26, 'INR': 104.8, 'EUR': 1.16, 'JPY': 188.4},
        'INR': {'USD': 0.012, 'EUR': 0.011, 'GBP': 0.0095, 'JPY': 1.8}
    }
    
    from_currency = request.args.get('from', 'USD')
    to_currency = request.args.get('to', 'INR')
    amount = float(request.args.get('amount', 1))
    
    if from_currency == to_currency:
        rate = 1
    else:
        rate = rates.get(from_currency, {}).get(to_currency, 1)
    
    result = amount * rate
    
    return jsonify({
        'from': from_currency,
        'to': to_currency,
        'amount': amount,
        'result': round(result, 2),
        'rate': rate
    })

@app.route('/api/ideas', methods=['POST'])
def generate_ideas():
    keyword = request.json.get('keyword', '')
    
    # Mock idea generation
    business_ideas = [
        f"AI-powered {keyword} optimization platform that uses machine learning to enhance efficiency",
        f"Sustainable {keyword} marketplace connecting eco-conscious consumers with green alternatives",
        f"Social {keyword} community app fostering collaboration and knowledge sharing",
        f"{keyword} analytics dashboard providing real-time insights and predictive analytics",
        f"Mobile {keyword} assistant with voice commands and smart automation"
    ]
    
    domains = [
        f"{keyword.lower()}.ai",
        f"smart{keyword.lower()}.com",
        f"{keyword.lower()}hub.io",
        f"next{keyword.lower()}.app",
        f"{keyword.lower()}pro.net"
    ]
    
    competitors = [
        f"{keyword}Corp",
        f"Smart{keyword}",
        f"{keyword}Labs",
        f"Future{keyword}",
        f"{keyword}Tech"
    ]
    
    color_palettes = [
        ['#667eea', '#764ba2', '#f093fb'],
        ['#4facfe', '#00f2fe', '#43e97b'],
        ['#fa709a', '#fee140', '#f093fb'],
        ['#a8edea', '#fed6e3', '#ffecd2'],
        ['#667eea', '#764ba2', '#f093fb']
    ]
    
    return jsonify({
        'businessIdea': random.choice(business_ideas),
        'domains': domains,
        'competitors': competitors,
        'colorPalette': random.choice(color_palettes)
    })

@app.route('/api/analyze', methods=['POST'])
def analyze_file():
    content = request.json.get('content', '')
    
    # Simple text analysis
    words = content.split()
    word_count = len(words)
    
    # Basic sentiment analysis
    positive_words = ['good', 'great', 'excellent', 'amazing', 'wonderful', 'fantastic', 'love', 'best']
    negative_words = ['bad', 'terrible', 'awful', 'horrible', 'worst', 'hate', 'poor', 'disappointing']
    
    positive_count = sum(1 for word in words if word.lower() in positive_words)
    negative_count = sum(1 for word in words if word.lower() in negative_words)
    
    if positive_count > negative_count:
        sentiment = 'positive'
    elif negative_count > positive_count:
        sentiment = 'negative'
    else:
        sentiment = 'neutral'
    
    # Extract keywords (simple frequency analysis)
    word_freq = {}
    for word in words:
        clean_word = word.lower().strip('.,!?";')
        if len(clean_word) > 4:
            word_freq[clean_word] = word_freq.get(clean_word, 0) + 1
    
    keywords = sorted(word_freq.items(), key=lambda x: x[1], reverse=True)[:10]
    keywords = [word for word, freq in keywords]
    
    # Generate summary (first 3 sentences)
    sentences = content.split('.')
    summary = '. '.join(sentences[:3]) + '.' if len(sentences) > 3 else content
    
    return jsonify({
        'summary': summary,
        'sentiment': sentiment,
        'wordCount': word_count,
        'keywords': keywords,
        'insights': [
            f"Document contains {word_count} words",
            f"Overall sentiment: {sentiment}",
            f"Key themes: {', '.join(keywords[:3])}" if keywords else "No significant themes detected"
        ]
    })

@app.route('/api/notes', methods=['GET', 'POST'])
def notes():
    app_data = load_data()
    
    if request.method == 'GET':
        return jsonify({'notes': app_data.get('notes', '')})
    
    elif request.method == 'POST':
        app_data['notes'] = request.json.get('notes', '')
        save_data(app_data)
        return jsonify({'success': True})

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)