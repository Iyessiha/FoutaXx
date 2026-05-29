# FoutaX MVP

Premiere base full-stack pour FoutaX :

- backend API Python sans dependance externe ;
- frontend mobile-first en HTML, CSS et JavaScript ;
- donnees MVP pour dashboard, budget, cours, marches, portefeuille et abonnements.

## Lancer

```powershell
python app/server.py
```

Puis ouvrir :

```text
http://127.0.0.1:8000
```

## Routes API

- `GET /api/health`
- `GET /api/dashboard`
- `GET /api/budget`
- `GET /api/courses`
- `GET /api/markets`
- `GET /api/portfolio`
- `GET /api/subscriptions`
- `POST /api/simulations`

## Deployer sur Vercel

Le projet est prepare pour Vercel avec :

- `public/` pour le frontend statique ;
- `api/index.py` pour les fonctions Python serverless ;
- `vercel.json` pour les rewrites `/api/*`.

### Option recommandee : GitHub + Vercel

1. Creer un repository GitHub.
2. Envoyer ce dossier sur GitHub.
3. Dans Vercel, choisir **Add New Project**.
4. Importer le repository.
5. Laisser le framework sur **Other** si Vercel ne detecte pas de framework.
6. Build Command : vide.
7. Output Directory : vide.
8. Deploy.

### Option CLI

Si Vercel CLI est installe :

```powershell
vercel
vercel --prod
```

Apres deploiement, verifier :

```text
https://ton-projet.vercel.app
https://ton-projet.vercel.app/api/health
```

## Prochaines evolutions

- persistance SQLite puis PostgreSQL ;
- authentification ;
- paiement et gestion d'abonnement ;
- admin des cours et fiches encyclopediques ;
- donnees de marche semi-automatisees ;
- coach educatif avec garde-fous.
