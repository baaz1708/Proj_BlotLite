from flask import url_for
from flask_api import db, login_manager, app
from datetime import datetime
from flask_login import UserMixin
from itsdangerous import TimedJSONWebSignatureSerializer as Serializer

@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))

followers = db.Table(
    'followers',
    db.Column('follower_id', db.Integer, db.ForeignKey('user.id'), primary_key=True),
    db.Column('followed_id', db.Integer, db.ForeignKey('user.id'), primary_key=True)
)

post_likes = db.Table(
    'post_likes',
    db.Column('user_id', db.Integer, db.ForeignKey('user.id'), primary_key=True),
    db.Column('post_id', db.Integer, db.ForeignKey('post.id'), primary_key=True)
) 

class User(db.Model, UserMixin):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(20), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    image_file = db.Column(db.String(20), nullable=False, default='default.jpg')
    password = db.Column(db.String(60), nullable=False)
    posts = db.relationship('Post', backref='author', lazy=True)
    liked_posts = db.relationship(
        'Post',
        secondary='post_likes',
        backref=db.backref('liked_by', lazy='dynamic'),
        lazy='dynamic'
    )
    followers = db.relationship(
        'User',
        secondary=followers,
        primaryjoin=(followers.c.followed_id == id),
        secondaryjoin=(followers.c.follower_id == id),
        backref=db.backref('following', lazy='dynamic'),
        lazy='dynamic'
    )

    
    def get_reset_token(self, expires_sec=1800):
        s = Serializer(app.config['SECRET_KEY'], expires_sec)
        return s.dumps({'user_id': self.id}).decode('utf-8')

    @staticmethod
    def verify_reset_token(token):
        s = Serializer(app.config['SECRET_KEY'])
        try:
            user_id = s.loads(token)['user_id']
        except:
            return None
        return User.query.get(user_id)

    def to_dict(self):
        return {
            'id': self.id,
            'username': self.username,
            'email': self.email,
            'image_file': url_for('static', filename='profile_pics/' + self.image_file, _external=True),
            'password': self.password,
            'followers': [follower.username for follower in self.followers],
            'following': [followed.username for followed in self.following]
        }

    def __repr__(self):
        return f"User('{self.username}', '{self.email}', '{self.image_file}')"


class Post(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100), nullable=False)
    timestamp = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
    description = db.Column(db.Text, nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    feed_image = db.Column(db.String(20), nullable=False, default='default.jpg')
    likes = db.Column(db.Integer, nullable=False, default=0)

    def to_dict(self):
        return {
            'id': self.id,
            'title': self.title,
            'timestamp': self.timestamp.strftime('%Y-%m-%d %H:%M:%S'),
            'description': self.description,
            'user_id': self.user_id,
            'feed_image': url_for('static', filename='post_pics/' + self.feed_image, _external=True),
            'likes': self.likes,
            'liked_by': [user.id for user in self.liked_by],
            'author': {
                'id': self.author.id,
                'username': self.author.username,
                'image_file': url_for('static', filename='profile_pics/' + self.author.image_file, _external=True)
            }
        }
    def __repr__(self):
        return f"Post('{self.title}', '{self.timestamp}')"