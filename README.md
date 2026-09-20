Plan Rack 2D — déploiement et chaîne de licence
Ce que contient ce dossier
```
index.html        redirection vers la version courante
.nojekyll         évite que GitHub Pages ignore certains fichiers
v1/index.html     l'application, version 1, avec le contrôle de licence
README.md         ce fichier
```
1. Publier sur GitHub Pages
```bash
cd rackplan
git init
git add .
git commit -m "RackPlan 2D v1"
git branch -M main
git remote add origin https://github.com/<votre-compte>/rackplan.git
git push -u origin main
```
Puis dans le dépôt : Settings → Pages → Source : Deploy from a branch → main / (root).
L'application sera servie sur `https://<votre-compte>.github.io/rackplan/v1/`.
Deux points à ne pas négliger :
Gardez vos sources ailleurs. Ce dépôt est public et tout son contenu est
lisible. N'y mettez jamais de tarif, de référence fournisseur confidentielle
ni de clé : l'historique git conserve tout, même après suppression.
Mettez un domaine perso (`Settings → Pages → Custom domain`, par exemple
`app.rackplan.fr`). Sans ça vous serez prisonnier de l'URL `github.io` le jour
où vous voudrez changer d'hébergeur, et toutes les licences des revendeurs
sont liées à l'origine autorisée.
2. Comment fonctionne le contrôle
Au démarrage, et avant chaque export, l'application envoie la clé au webhook Make.
Make cherche la clé dans Airtable, vérifie trois choses et répond en JSON :
Vérification	Refus renvoyé
Statut = Active	`KO_STATUT`
Version max ≥ version du dossier déployé	`KO_VERSION`
Origine de la requête autorisée	`KO_ORIGINE`
Sans licence valide, l'application bascule en démonstration : 12 travées
maximum, nomenclature CSV et impression désactivées. Le dessin reste libre.
Chaque export porte la clé et la raison sociale du titulaire, en pied du plan
imprimé et en dernière ligne du CSV. Une copie diffusée continue donc de
tamponner le nom de celui qui l'a diffusée.
3. Vendre une licence
Dans la base Airtable RackPlan — Licences, table `Licences`, créez une ligne :
Clé : format `RKP-XXXX-XXXX-XXXX`, tirée au hasard (par exemple
`openssl rand -hex 6 | tr 'a-f' 'A-F'` découpé en blocs de 4)
Revendeur et Nom export : la raison sociale
Statut : `Active`
Version max : `1`
Domaines autorisés : l'origine exacte depuis laquelle la clé peut servir,
par exemple `https://app.rackplan.fr`. Plusieurs origines se séparent par des
virgules. `*` autorise tout : à réserver aux tests.
Pour suspendre un client, passez Statut à `Suspendue` ou `Révoquée` :
l'effet est immédiat au prochain démarrage, et au plus tard 15 minutes après
pour une session déjà ouverte.
4. Vendre une mise à jour
Dupliquez `v1/` en `v2/`.
Dans `v2/index.html`, passez `version: 1` à `version: 2` dans le bloc `RKP`.
Poussez. `v2/` est en ligne mais inutilisable par les licences restées en
version 1 : elles reçoivent `KO_VERSION` et retombent en démonstration.
Quand un revendeur paie la mise à jour, passez son champ Version max à 2.
Les anciens clients gardent `v1/` en état de marche, ce qui est exactement la
promesse d'une licence perpétuelle.
5. Journal et RGPD
La table `Journal` enregistre chaque appel : clé, origine, adresse IP, résultat.
Elle sert à repérer un partage de clé (beaucoup d'origines ou d'IP distinctes
pour une même licence), pas à bloquer automatiquement : les IP sont dynamiques
et vos clients seront en 4G, en VPN ou sur plusieurs sites.
L'adresse IP est une donnée personnelle. Mentionnez cette journalisation dans
vos CGU et purgez la table au-delà de 12 mois.
6. Limite à connaître
L'application est un fichier HTML servi en clair : n'importe qui peut
l'enregistrer et lire son code. Ce qui est protégé, ce sont les livrables
(nomenclature, plan imprimé), parce qu'ils dépendent d'une réponse serveur que
vous contrôlez. Le reste relève du contrat, pas de la technique.
