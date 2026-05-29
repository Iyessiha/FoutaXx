from __future__ import annotations

import json
from http import HTTPStatus
from http.server import BaseHTTPRequestHandler
from urllib.parse import parse_qs, urlparse


USER = {
    "name": "Awa",
    "profile": "Salariee debutante",
    "plan": "Gratuit",
    "xp": 1240,
    "level": 3,
    "levelName": "Epargnant",
    "nextLevelXp": 1500,
}


DASHBOARD = {
    "score": 74,
    "budgetRemaining": 185000,
    "currency": "FCFA",
    "monthlyIncome": 550000,
    "monthlySpent": 365000,
    "primaryGoal": {
        "name": "Fonds d'urgence",
        "saved": 320000,
        "target": 800000,
        "progress": 40,
    },
    "portfolio": {
        "value": 512000,
        "change": 2.8,
        "risk": "Modere",
    },
    "nextLesson": {
        "title": "Lire un bulletin de bourse sans se perdre",
        "duration": "7 min",
        "premium": False,
    },
    "dailyInsight": "Avant d'investir, verifie ton budget, ton epargne d'urgence et le risque de l'actif.",
}


BUDGET = {
    "categories": [
        {"name": "Logement", "spent": 120000, "limit": 150000, "tone": "ok"},
        {"name": "Nourriture", "spent": 82000, "limit": 100000, "tone": "ok"},
        {"name": "Transport", "spent": 42000, "limit": 45000, "tone": "warning"},
        {"name": "Mobile money", "spent": 18000, "limit": 25000, "tone": "ok"},
        {"name": "Soutien familial", "spent": 70000, "limit": 60000, "tone": "risk"},
        {"name": "Investissement", "spent": 33000, "limit": 60000, "tone": "ok"},
    ],
    "recent": [
        {"label": "Courses", "category": "Nourriture", "amount": 18500, "date": "Aujourd'hui"},
        {"label": "Transfert famille", "category": "Soutien familial", "amount": 30000, "date": "Hier"},
        {"label": "Transport semaine", "category": "Transport", "amount": 12000, "date": "Hier"},
    ],
}


COURSES = [
    {
        "id": "budget-101",
        "title": "Construire son premier budget",
        "level": "Debutant",
        "duration": "18 min",
        "progress": 80,
        "premium": False,
        "badge": "Premier Budget",
    },
    {
        "id": "stock-101",
        "title": "Comprendre une action",
        "level": "Debutant",
        "duration": "24 min",
        "progress": 35,
        "premium": False,
        "badge": "Base Bourse",
    },
    {
        "id": "africa-markets",
        "title": "Tour des bourses africaines",
        "level": "Intermediaire",
        "duration": "42 min",
        "progress": 12,
        "premium": True,
        "badge": "Explorateur Afrique",
    },
    {
        "id": "risk",
        "title": "Risque, rendement et discipline",
        "level": "Intermediaire",
        "duration": "31 min",
        "progress": 0,
        "premium": True,
        "badge": "Simulateur Prudent",
    },
]


MARKETS = [
    {
        "name": "BRVM",
        "region": "Afrique de l'Ouest",
        "country": "UEMOA",
        "currency": "XOF",
        "index": "BRVM Composite",
        "status": "Ouvert",
        "focus": "Actions, obligations, OPCVM",
        "premium": False,
    },
    {
        "name": "NGX",
        "region": "Afrique de l'Ouest",
        "country": "Nigeria",
        "currency": "NGN",
        "index": "NGX All-Share",
        "status": "Ouvert",
        "focus": "Banques, energie, industrie",
        "premium": True,
    },
    {
        "name": "JSE",
        "region": "Afrique australe",
        "country": "Afrique du Sud",
        "currency": "ZAR",
        "index": "JSE Top 40",
        "status": "Ferme",
        "focus": "Grandes capitalisations africaines",
        "premium": True,
    },
    {
        "name": "Nasdaq",
        "region": "International",
        "country": "Etats-Unis",
        "currency": "USD",
        "index": "Nasdaq 100",
        "status": "Preouverture",
        "focus": "Technologie, croissance",
        "premium": True,
    },
]


PORTFOLIO = {
    "total": 512000,
    "currency": "FCFA",
    "change": 2.8,
    "riskScore": 58,
    "assets": [
        {"name": "Cash", "type": "Liquidite", "weight": 30, "value": 153600},
        {"name": "Actions BRVM", "type": "Actions", "weight": 25, "value": 128000},
        {"name": "Obligations", "type": "Revenu fixe", "weight": 20, "value": 102400},
        {"name": "Fonds", "type": "OPCVM", "weight": 15, "value": 76800},
        {"name": "Crypto", "type": "Actif risque", "weight": 10, "value": 51200},
    ],
}


SUBSCRIPTIONS = [
    {
        "name": "Gratuit",
        "price": "0 FCFA",
        "summary": "Decouvrir, apprendre les bases et suivre un budget simple.",
        "features": ["Cours debutants", "Budget simple", "1 objectif", "Badges de base"],
    },
    {
        "name": "Plus",
        "price": "3 000 FCFA/mois",
        "summary": "Apprendre serieusement et organiser ses finances.",
        "features": ["Cours intermediaires", "Budget illimite", "Mode offline", "Rapports simples"],
    },
    {
        "name": "Premium",
        "price": "6 500 FCFA/mois",
        "summary": "Explorer les marches et suivre son portefeuille.",
        "features": ["Encyclopedie complete", "Videos enrichies", "Simulateurs avances", "Portefeuille virtuel"],
    },
    {
        "name": "Pro",
        "price": "12 000 FCFA/mois",
        "summary": "Coach educatif, scenarios et analyse avancee.",
        "features": ["Coach IA", "Exports", "Alertes avancees", "Clubs et masterclass"],
    },
]


def route_payload(path: str, query: dict[str, list[str]]) -> tuple[object, int]:
    if path in {"/api", "/api/", "/api/health"}:
        return {"status": "ok", "service": "foutax", "runtime": "vercel"}, 200
    if path == "/api/dashboard":
        return {"user": USER, "dashboard": DASHBOARD}, 200
    if path == "/api/budget":
        return BUDGET, 200
    if path == "/api/courses":
        return {"courses": COURSES}, 200
    if path == "/api/markets":
        region = query.get("region", [""])[0].lower()
        markets = MARKETS
        if region:
            markets = [market for market in MARKETS if region in market["region"].lower()]
        return {"markets": markets}, 200
    if path == "/api/portfolio":
        return PORTFOLIO, 200
    if path == "/api/subscriptions":
        return {"plans": SUBSCRIPTIONS}, 200
    return {"error": "Route introuvable", "path": path}, HTTPStatus.NOT_FOUND


def simulate(payload: dict) -> dict:
    monthly = float(payload.get("monthly", 25000))
    months = int(payload.get("months", 12))
    annual_rate = float(payload.get("annualRate", 5))
    monthly_rate = annual_rate / 100 / 12
    balance = 0.0
    for _ in range(months):
        balance = (balance + monthly) * (1 + monthly_rate)
    return {
        "monthly": monthly,
        "months": months,
        "annualRate": annual_rate,
        "estimated": round(balance),
        "message": "Simulation educative, pas une promesse de rendement.",
    }


class handler(BaseHTTPRequestHandler):
    def do_GET(self) -> None:
        parsed = urlparse(self.path)
        payload, status = route_payload(parsed.path, parse_qs(parsed.query))
        self.send_json(payload, status)

    def do_POST(self) -> None:
        parsed = urlparse(self.path)
        if parsed.path == "/api/simulations":
            self.send_json(simulate(self.read_json()))
            return
        self.send_json({"error": "Route introuvable", "path": parsed.path}, HTTPStatus.NOT_FOUND)

    def do_OPTIONS(self) -> None:
        self.send_response(HTTPStatus.NO_CONTENT)
        self.send_cors_headers()
        self.end_headers()

    def read_json(self) -> dict:
        content_length = int(self.headers.get("Content-Length", "0"))
        if content_length <= 0:
            return {}
        raw = self.rfile.read(content_length)
        try:
            return json.loads(raw.decode("utf-8"))
        except json.JSONDecodeError:
            return {}

    def send_json(self, payload: object, status: int = 200) -> None:
        body = json.dumps(payload, ensure_ascii=False).encode("utf-8")
        self.send_response(status)
        self.send_cors_headers()
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Cache-Control", "no-store")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def send_cors_headers(self) -> None:
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
