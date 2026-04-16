from flask import Flask, render_template, request, redirect, url_for
from flask_socketio import SocketIO, emit
from flask_login import LoginManager, UserMixin, login_user, login_required, logout_user, current_user
from pymongo import MongoClient
from werkzeug.security import generate_password_hash, check_password_hash


app = Flask(__name__)
app.secret_key = 'supersecretkey'
socketio = SocketIO(app)

client = MongoClient('mongodb+srv://Vegul:YqsoW7yxhIHfhCEt@cluster0.kpkovh3.mongodb.net/?appName=Cluster0', tlsAllowInvalidCertificates=True)
db = client['chat_db']
message_collection = db['messages']
users_collection = db['users']

login_manager = LoginManager()
login_manager.init_app(app)
login_manager.login_view = 'login'

class User(UserMixin):
    def __init__(self, user_data):
        self.id = str(user_data['_id'])
        self.username = user_data['username']


@login_manager.user_loader
def load_user(user_id):
    from bson.objectid import ObjectId
    user_data = users_collection.find_one({'_id': ObjectId(user_id)})
    if user_data:
        return User(user_data)
    return None

@app.route('/')
@login_required
def index():
    past_messages = list(message_collection.find({}, {'_id': 0}).sort('_id', 1))
    return render_template('index.html', messages=past_messages)

@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']
        user_data = users_collection.find_one({'username': username})
        if user_data and check_password_hash(user_data['password'], password):
            login_user(User(user_data))
            return redirect(url_for('index'))
        return render_template('login.html', error='ユーザー名かパスワードが違います')
    return render_template('login.html')

@app.route('/register', methods=['GET', 'POST'])
def register():
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']
        if users_collection.find_one({'username': username}):
            return render_template('register.html', error='そのユーザー名は使われてます')
        users_collection.insert_one({
            'username': username,
            'password': generate_password_hash(password)
        })
        return redirect(url_for('login'))
    return render_template('register.html')

@app.route('/logout')
@login_required
def logout():
    logout_user()
    return redirect(url_for('login'))

@app.route('/users')
@login_required
def get_users():
    from flask import jsonify
    users = list(users_collection.find({}, {'_id': 0, 'password': 0}))
    return jsonify(users)

@app.route('/dm/<username>')
@login_required
def get_dm(username):
    from flask import jsonify
    dm_messages = list(db['dm_messages'].find({
        '$or':[
            {'from': current_user.username, 'to': username},
            {'from': username, 'to': current_user.username}
        ]
    },{'_id': 0}).sort('_id', 1))
    return jsonify(dm_messages)

@socketio.on('message')
def handle_message(data):
    message_collection.insert_one({'text': data, 'username': current_user.username})
    emit('message', {'text': data, 'username': current_user.username}, broadcast=True)

@socketio.on('dm')
def handle_dm(data):
    db['dm_messages'].insert_one({
        'from': current_user.username,
        'to': data['to'],
        'text': data['text'],
        'username': current_user.username
    })
    emit('dm', {
        'from': current_user.username,
        'to':data['to'],
        'text': data['text'],
        'username': current_user.username
    }, broadcast=True)


if __name__ == '__main__':
    socketio.run(app, debug=True)