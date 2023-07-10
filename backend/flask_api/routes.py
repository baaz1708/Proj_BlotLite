import os
import secrets
from PIL import Image
from flask import abort, render_template,url_for,flash,redirect,request
from flask_login import login_user,current_user,logout_user,login_required
from flask_api import app,bcrypt,db,mail
from flask_api.forms import RegistrationForm,LoginForm,UpdateAccountForm,PostForm,RequestResetForm,ResetPasswordForm
from flask_api.models import User,Post
from flask_mail import Message
import jwt,datetime
from flask import jsonify
from werkzeug.datastructures import ImmutableMultiDict
from functools import wraps

def token_required(f):
    @wraps(f)
    def decorated(*args,**kwargs):
        token = None
        if 'Authorization' in request.headers:
            token =  request.headers['Authorization'].split(' ')[1]
            print('came from authorization header',token)
        if not token:
            return jsonify({'message':'Token is missing!'}), 401
        try:
            data = jwt.decode(token,app.config['SECRET_KEY'],algorithms=['HS256'])
            print(data)
            token_user=User.query.filter_by(id=data['user_id']).first()
            print(token_user)
        except Exception as e:
            print(e)
            return jsonify({'message': 'Token is invalid!'}), 401
        return f(token_user,*args, **kwargs)
    return decorated


@app.route("/")
@app.route("/feeds")
@token_required
def home(token_user):
    perPage = request.args.get('limit', type=int)
    page = request.args.get('page', type=int)
    posts = Post.query.order_by(Post.timestamp.desc()).paginate(page=page, per_page=perPage).items
    response_data = [post.to_dict() for post in posts]
    return jsonify(response_data)

@app.route("/register", methods=['POST'])
def register():
    json_data = request.get_json()
    formdata = ImmutableMultiDict(json_data)
    form=RegistrationForm(formdata=formdata, meta={'csrf': False})
    if form.validate():
        hashed_password = bcrypt.generate_password_hash(form.password.data).decode('utf-8')
        user = User(username=form.username.data, email=form.email.data, password=hashed_password)
        db.session.add(user)
        db.session.commit()
        return jsonify(user.to_dict()), 201
    else:
        for field, errors in form.errors.items():
            for error in errors:
                return jsonify({'message':error,'error_in_field':field}), 400

@app.route("/login", methods=['POST'])
def login():
    json_data = request.get_json()
    formdata = ImmutableMultiDict(json_data)
    form=LoginForm(formdata=formdata, meta={'csrf': False})
    if form.validate():
        user=User.query.filter_by(email=form.email.data).first()
        if user and bcrypt.check_password_hash(user.password,form.password.data):
            exp_time = datetime.datetime.utcnow() + datetime.timedelta(hours=24)
            payload = {'user_id': user.id, 'exp':exp_time}
            token= jwt.encode(payload,app.config['SECRET_KEY'],algorithm='HS256')
            login_user(user,remember=form.remember.data)
            return jsonify({'userdata':current_user.to_dict(), 'token': token}), 200
        else:
            return jsonify({'message':'Login Unsuccessful. Please check email and password'}), 401
    else:
        for field, errors in form.errors.items():
            for error in errors:
                return jsonify({'message':error,'error_in_field':field}), 400
    
def save_profile_picture(form_picture):
    random_hex=secrets.token_hex(8)
    _,f_ext=os.path.splitext(form_picture.filename)
    picture_fn=random_hex+f_ext
    picture_path=os.path.join(app.root_path,'static/profile_pics',picture_fn)

    # output_size=(100,100)
    i=Image.open(form_picture)
    # i.thumbnail(output_size)

    i.save(picture_path)
    return picture_fn

@app.route("/user/<int:user_id>", methods=['GET','POST','PUT'])
@token_required
def user_account(token_user,user_id):
    if request.method=='PUT':
        form=UpdateAccountForm(meta={'csrf': False})
        form.username.data = request.form['username']
        form.email.data = request.form['email']
        if 'picture' in request.files:
            form.picture.data = request.files['picture']
        if form.validate():
            user=User.query.filter_by(id=user_id).first_or_404()
            user.username=form.username.data
            user.email=form.email.data
            if form.picture.data:
                picture_file=save_profile_picture(form.picture.data)
                user.image_file=picture_file
            db.session.commit()
            return jsonify(user.to_dict()), 200
        else:
            for field, errors in form.errors.items():
                for error in errors:
                    return jsonify({'message':error,'error_in_field':field}), 400
    elif request.method=='GET':
        user=User.query.filter_by(id=user_id).first_or_404()
        posts=Post.query.filter_by(author=user)\
        .order_by(Post.timestamp.desc())
        return jsonify({'user':user.to_dict(), 'user_posts':[post.to_dict() for post in posts]})

@app.route("/user_posts/<int:user_id>", methods=['GET'])
def user_posts(user_id):
    user=User.query.filter_by(id=user_id).first_or_404()
    posts=Post.query.filter_by(author=user)\
    .order_by(Post.timestamp.desc())
    return jsonify([post.to_dict() for post in posts])

def save_feed_picture(form_picture):
    random_hex=secrets.token_hex(8)
    _,f_ext=os.path.splitext(form_picture.filename)
    picture_fn=random_hex+f_ext
    picture_path=os.path.join(app.root_path,'static/post_pics',picture_fn)

    # output_size=(360,420)
    i=Image.open(form_picture)
    # i.thumbnail(output_size)

    i.save(picture_path)
    return picture_fn

@app.route("/post/new", methods=['POST'])
@token_required
def new_post(token_user):
    form=PostForm(meta={'csrf': False})
    form.curr_user.data = request.form['curr_user']
    form.user_id.data = request.form['user_id']
    form.title.data = request.form['title']
    form.description.data = request.form['description']
    if 'feed_image' in request.files:
        form.feed_image.data = request.files['feed_image']
    if form.validate():
        user=User.query.get(form.user_id.data)
        if form.feed_image.data:
            picture_file=save_feed_picture(form.feed_image.data)
            post = Post(title=form.title.data, description=form.description.data, author=user, feed_image=picture_file)
        else:
            post = Post(title=form.title.data, description=form.description.data, author=user)
        db.session.add(post)
        db.session.commit()
        return jsonify(post.to_dict()), 201

@app.route("/post/<int:post_id>")
def post(post_id):
    post=Post.query.get_or_404(post_id)
    return jsonify(post.to_dict())

@app.route('/like_post/', methods=['PUT'])
def like_post():
    payload=request.get_json()
    post_id=payload['postId']
    user_id=payload['userId']
    post = Post.query.get_or_404(post_id)
    user = User.query.get_or_404(user_id)
    post.likes += 1
    user.liked_posts.append(post)
    db.session.commit()
    return jsonify(post.to_dict())

@app.route('/unlike_post/', methods=['PUT'])
def unlike_post():
    payload=request.get_json()
    post_id=payload['postId']
    user_id=payload['userId']
    post = Post.query.get_or_404(post_id)
    user = User.query.get_or_404(user_id)
    post.likes -= 1
    user.liked_posts.remove(post)
    db.session.commit()
    return jsonify(post.to_dict())

@app.route("/follow_user/", methods=['PUT'])
def follow_user():
    payload=request.get_json()
    user_id=payload['userId']
    followed_id=payload['authorId']
    user = User.query.get_or_404(user_id)
    followed = User.query.get_or_404(followed_id)
    user.following.append(followed)
    db.session.commit()
    return jsonify(user.to_dict())

@app.route("/unfollow_user/", methods=['PUT'])
def unfollow_user():
    payload=request.get_json()
    user_id=payload['userId']
    unfollowed_id=payload['authorId']
    user = User.query.get_or_404(user_id)
    unfollowed=User.query.get_or_404(unfollowed_id)
    user.following.remove(unfollowed)
    db.session.commit()
    return jsonify(user.to_dict())


@app.route("/update_post/<int:post_id>", methods=['GET','POST','PUT'])
@token_required
def update_post(token_user,post_id):
    post=Post.query.get_or_404(post_id)
    form=PostForm(meta={'csrf': False})
    form.title.data = request.form['title']
    form.description.data = request.form['description']
    if 'feed_image' in request.files:
        form.feed_image.data = request.files['feed_image']
        print("form.feed_image is present")
    print(form.feed_image.data, form.title.data, form.description.data)
    if form.validate():
        if form.feed_image.data:
            picture_file=save_feed_picture(form.feed_image.data)
            post.feed_image=picture_file
        post.title=form.title.data
        post.description=form.description.data
        print(post.feed_image, post.title, post.description)
        db.session.commit()
        return jsonify(post.to_dict()), 204
    else:
        for field, errors in form.errors.items():
            for error in errors:
                return jsonify({'message':error,'error_in_field':field}), 400
            

@app.route("/delete_post/<int:post_id>", methods=['DELETE'])
@token_required
def delete_post(token_user,post_id):
    post=Post.query.get_or_404(post_id)
    # if post.author != current_user:
    #     abort(403)
    db.session.delete(post)
    db.session.commit()
    return jsonify({'message':'Post deleted'})

def send_reset_email(user):
    token=user.get_reset_token()
    msg=Message('Password Reset Request',sender='baazsingh1708@gmail.com',recipients=[user.email])
    msg.body=f'''To reset your password, visit the following link:
{url_for('reset_token',token=token,_external=True)}

If you did not make this request then simply ignore this email and no changes will be made.
'''
    mail.send(msg)

@app.route("/user_list", methods=['GET'])
@token_required
def user_list(token_user):
    users=User.query.all()
    response_data= [user.to_dict() for user in users]
    return jsonify(response_data)

@app.route("/reset_password", methods=['GET','POST'])
def reset_request():
    if current_user.is_authenticated:
        return redirect(url_for('home'))
    form=RequestResetForm()
    if form.validate_on_submit():
        user=User.query.filter_by(email=form.email.data).first()
        send_reset_email(user)
        flash('An email has been sent with instructions to reset your password.','info')
        return redirect(url_for('login'))
    return render_template('reset_request.html',title='Reset Password',form=form)

@app.route("/reset_password/<token>", methods=['GET','POST'])
def reset_token(token):
    if current_user.is_authenticated:
        return redirect(url_for('home'))
    user=User.verify_reset_token(token)
    if user is None:
        flash('That is an invalid or expired token','warning')
        return redirect(url_for('reset_request'))
    form=ResetPasswordForm()
    if form.validate_on_submit():
        hashed_password=bcrypt.generate_password_hash(form.password.data).decode('utf-8')
        user.password=hashed_password
        db.session.commit()
        flash(f'Your password has been updated! You can now log in','success')
        return redirect(url_for('login'))
    return render_template('reset_token.html',title='Reset Password',form=form)