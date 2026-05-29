# FoutaX - Dossier de deploiement Vercel

Ce dossier contient uniquement les fichiers necessaires pour deployer le MVP FoutaX sur Vercel.

## Contenu

- `public/` : frontend statique.
- `api/` : fonctions serverless Python.
- `vercel.json` : configuration Vercel.
- `.python-version` : version Python demandee.
- `.gitignore` : fichiers a ignorer.
- `README.md` : documentation du projet.

## Deploiement via GitHub

Depuis ce dossier :

```powershell
git init
git add .
git commit -m "Deploy FoutaX MVP"
git branch -M main
git remote add origin TON_URL_GITHUB
git push -u origin main
```

Ensuite :

1. Aller sur Vercel.
2. Cliquer sur **Add New Project**.
3. Importer le repository GitHub.
4. Framework Preset : **Other**.
5. Build Command : laisser vide.
6. Output Directory : laisser vide.
7. Deploy.

## Tests apres deploiement

Verifier :

```text
https://ton-projet.vercel.app
https://ton-projet.vercel.app/api/health
```

