# GreenFlow — Smart Irrigation Client

Application React de contrôle d'irrigation intelligente avec simulation de capteurs en temps réel et analyse IA via Gemini.

## Fonctionnalités

- **Dashboard** : Capteurs live (humidité sol, température, humidité air, niveau d'eau, pluie) avec statuts dynamiques et graphique en temps réel
- **Contrôle** : Mode Auto / Manuel avec pompe sécurisée (désactivée si pluie)
- **Historique** : Logs des données capteurs
- **Alertes** : Notifications système
- **IA Insight** : Analyse Gemini des données capteurs avec fallback local intelligent

## Lancer localement

**Prérequis :** Node.js

1. Installer les dépendances :
   ```
   npm install
   ```

2. Copier `.env.example` en `.env.local` et ajouter votre clé Gemini :
   ```
   cp .env.example .env.local
   ```
   Obtenir une clé : https://aistudio.google.com/app/apikey

3. Lancer l'app :
   ```
   npm run dev
   ```

> **Note :** Sans clé API, l'app fonctionne en mode simulation avec une analyse IA locale basée sur des règles.

## Corrections apportées (v2)

- ✅ Badges de statut dynamiques (Dry/Optimal/Wet, Hot/Normal/Cold, etc.)
- ✅ Graphique d'humidité en temps réel (données live au lieu de données statiques)
- ✅ Simulation de l'humidité air corrigée (varie avec la pluie)
- ✅ Logique locale IA corrigée (ordre de priorités : niveau d'eau critique > pluie > humidité sol)
- ✅ Null-check sur `response.text` de l'API Gemini
- ✅ Indicateur "données obsolètes" sur l'insight IA quand les capteurs changent significativement
- ✅ Timestamp affiché sur l'analyse IA
- ✅ Fichier `.env.example` ajouté
