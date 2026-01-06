"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User
from api.utils import generate_sitemap, APIException
from flask_cors import CORS
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from werkzeug.security import generate_password_hash, check_password_hash

api = Blueprint('api', __name__)

# Allow CORS requests to this API
CORS(api)


@api.route('/hello', methods=['POST', 'GET'])
def handle_hello():

    response_body = {
        "message": "Hello! I'm a message that came from the backend, check the network tab on the google inspector and you will see the GET request"
    }

    return jsonify(response_body), 200


@api.route('/signup', methods=['POST'])
def register_user():
    data = request.get_json()
    email = data.get("email")
    password = data.get("password")

    if not email or not password:
        return jsonify({"msg": "Missing email or password"}), 400

    if User.query.filter_by(email=email).first():
        return jsonify({"msg": "User already exists"}), 409

    new_user = User(email=email, is_active=True)
    new_user.set_password(password)

    db.session.add(new_user)
    db.session.commit()

    return jsonify({"msg": "User created successfully"}), 201



@api.route('/login', methods=['POST'])
def login_user():
    data = request.get_json()
    email = data.get("email")
    password = data.get("password")

    # Consulta en la BD el nombre de usuario y contraseña
    user = User.query.filter_by(email=email).first()

    if not user or not user.check_password(password):
        return jsonify({"msg": "Invalid credentials"}), 401

    # Crea un nuevo token con el id de usuario
    token = create_access_token(identity=str(user.id))
    return jsonify({
        "token": token,
        "user": user.serialize()
    }), 200


@api.route('/private', methods=['GET'])
@jwt_required()
def get_protec():

    current_user = get_jwt_identity()

    user = User.query.get(current_user)

    if not user:
        return jsonify({"msg": "Usuario no encontrado"})

    return jsonify({"msg": "Usuario encontrado", "usuario": user.serialize()}), 200
