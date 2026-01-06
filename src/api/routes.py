"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import request, jsonify, Blueprint
from api.models import db, User
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity

api = Blueprint("api", __name__)


# Endpoint de prueba para confirmar que el backend responde.
# Añadimos OPTIONS para ayudar con el preflight del navegador.
@api.route("/hello", methods=["POST", "GET", "OPTIONS"])
def handle_hello():
    if request.method == "OPTIONS":
        return jsonify({"msg": "ok"}), 200

    return jsonify({"message": "Backend is alive!"}), 200


# Registro de usuario
@api.route("/signup", methods=["POST", "OPTIONS"])
def register_user():
    if request.method == "OPTIONS":
        return jsonify({"msg": "ok"}), 200

    data = request.get_json() or {}
    email = (data.get("email") or "").strip().lower()
    password = data.get("password") or ""

    if not email or not password:
        return jsonify({"msg": "Missing email or password"}), 400

    if User.query.filter_by(email=email).first():
        return jsonify({"msg": "User already exists"}), 409

    new_user = User(email=email, is_active=True)

    if hasattr(new_user, "set_password"):
        new_user.set_password(password)
    else:
        new_user.password = password  # fallback

    db.session.add(new_user)
    db.session.commit()

    return jsonify({"msg": "User created successfully"}), 201


# Devuelve un token si las credenciales son correctas
@api.route("/login", methods=["POST", "OPTIONS"])
def login_user():
    if request.method == "OPTIONS":
        return jsonify({"msg": "ok"}), 200

    data = request.get_json() or {}
    email = (data.get("email") or "").strip().lower()
    password = data.get("password") or ""

    if not email or not password:
        return jsonify({"msg": "Missing email or password"}), 400

    user = User.query.filter_by(email=email).first()

    # Si el modelo tiene check_password, valida hash.
    if not user:
        return jsonify({"msg": "Invalid credentials"}), 401

    if hasattr(user, "check_password"):
        if not user.check_password(password):
            return jsonify({"msg": "Invalid credentials"}), 401
    else:
        # fallback si se guarda en plano
        if user.password != password:
            return jsonify({"msg": "Invalid credentials"}), 401

    token = create_access_token(identity=str(user.id))
    return jsonify({"token": token, "user": user.serialize()}), 200


# Ruta privada: requiere autorización del token
@api.route("/private", methods=["GET"])
@jwt_required()
def private_route():
    current_user = get_jwt_identity()

    try:
        user_id = int(current_user)
    except (TypeError, ValueError):
        return jsonify({"msg": "Invalid token identity"}), 401

    user = User.query.get(user_id)
    if not user:
        return jsonify({"msg": "Usuario no encontrado"}), 404

    return jsonify({"msg": "Autorizado", "usuario": user.serialize()}), 200
