# Paris à 5 balles

Les adresses où l'on mange à Paris pour 5 € (centimes compris, jusqu'à 5,99 €), testées sur place.
Site statique : un seul `index.html`, une carte (Leaflet + OpenStreetMap), en français et en anglais, installable sur téléphone.

- Instagram : [@paris_a_5_balles](https://www.instagram.com/paris_a_5_balles/)
- Soutenir le projet : [ko-fi.com/parisa5balles_](https://ko-fi.com/parisa5balles_)

## Ajouter une adresse

Dans `index.html`, complète le tableau `RESTOS` (nom, style, arrondissement, adresse, prix, plat, `plat_en`, tags, photos).
Les photos vont dans `photos/` (1200 px de large suffisent).

## Mettre en ligne

Glisser le dossier sur Netlify, ou relier ce dépôt à Netlify (aucune commande de build, dossier de publication : la racine).
Après une mise à jour, change `VERSION` dans `sw.js` pour que l'app installée récupère la nouvelle version.

## Fichiers

- `index.html` : le site
- `manifest.webmanifest`, `sw.js`, `icons/` : ce qui rend le site installable comme une app
- `photos/` : les photos des adresses
