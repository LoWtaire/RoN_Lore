# Audit visuel — Ready or Not Lore

Date : 24 juillet 2026

## Périmètre

Page d'accueil locale, évaluée à 1440 × 1000, 768 × 1024 et 390 × 844. L'audit porte sur la hiérarchie, la cohérence visuelle, la lisibilité, la mise en page responsive et les risques d'accessibilité visibles.

## Verdict

Direction artistique forte et immédiatement identifiable, cartes cohérentes et images de mission bien choisies. Le principal défaut structurel est la grille desktop : les colonnes de hauteurs différentes laissent un très grand vide avant la chronologie. Sur petit écran, la page devient très longue et la chronologie horizontale manque d'indication claire.

## Étapes et état

1. Desktop — état moyen : identité forte, mais composition déséquilibrée et espace perdu important.
2. Tablette — bon état : grille à deux colonnes lisible, avec une chronologie partiellement masquée.
3. Mobile — état moyen : cartes confortables, mais défilement très long, commandes serrées et chronologie peu découvrable.

## Points forts

- Univers visuel cohérent : noir, rouge, accents par campagne et typographie technique.
- Hero mémorable, avec un bon fondu vers le contenu.
- Cartes simples à scanner grâce aux images, titres et regroupements colorés.
- Responsive cohérent : cinq colonnes, puis deux, puis une sans casse majeure.
- États de focus visibles définis et contrôles globalement homogènes.

## Problèmes prioritaires

### 1. Grille desktop déséquilibrée — priorité haute

Les six groupes sont distribués dans une grille classique. Le groupe « Others » passe sous la première colonne tandis que les autres colonnes restent vides, ce qui repousse la chronologie très loin et produit une grande zone noire inutile.

Recommandation : utiliser une grille explicitement composée sur desktop — cinq campagnes sur la première rangée et « Others » sur une rangée compacte pleine largeur — ou une disposition masonry maîtrisée. Éviter une masonry pure si l'ordre logique doit rester strict.

### 2. Chronologie horizontale peu compréhensible — priorité haute

À 768 px et 390 px, seules les premières dates sont visibles. La suite existe horizontalement, mais le bas de la capture ne montre aucun repère évident indiquant qu'il faut glisser.

Recommandation : ajouter un masque de débordement à droite, un court libellé « Glisser pour explorer » et/ou des boutons précédent/suivant. Garder la barre de défilement visible sur tactile.

### 3. Densité verticale mobile — priorité moyenne

La succession des six groupes donne une page extrêmement longue avant d'atteindre la chronologie. Le bouton « Afficher 15 missions » n'existe que pour le premier groupe, ce qui rend la logique de réduction incohérente.

Recommandation : rendre tous les groupes repliables sur mobile, avec 1 à 2 cartes d'aperçu et un compteur clair. Conserver ouverts les groupes récemment consultés.

### 4. Lisibilité secondaire fragile — priorité moyenne

Plusieurs textes utilisent 10 à 12 px avec une couleur grise atténuée sur fond presque noir. Le style est élégant, mais les sous-titres, dates et libellés deviennent difficiles à lire sur mobile ou écran peu lumineux.

Recommandation : viser 12 px minimum pour les métadonnées et 14 px pour les commandes, augmenter légèrement la luminosité de `--text3`, puis mesurer les contrastes réels.

### 5. Barre de recherche et commandes — priorité moyenne

Le placeholder reste en anglais alors que l'interface est française. Sur mobile, recherche, filtre et engrenage partagent une ligne très serrée ; le bouton engrenage mesure environ 38 × 35 px, sous la cible tactile recommandée de 44 × 44 px.

Recommandation : traduire en « Rechercher une mission… », donner un libellé persistant ou accessible à la recherche et porter les commandes tactiles à au moins 44 × 44 px.

### 6. Hiérarchie du hero — priorité basse

Le hero fonctionne bien, mais il occupe 270 px en desktop sans apporter de navigation ni de proposition de valeur. Pour un visiteur qui ne connaît pas le projet, « Lore » seul explique peu ce que le site permet de faire.

Recommandation : tester une micro-description discrète sous le logo, ou réduire le hero desktop d'environ 30 à 50 px pour rapprocher le contenu utile.

## Limites

Les captures permettent d'évaluer le rendu statique et le responsive. Elles ne suffisent pas à valider complètement le contraste WCAG, la navigation clavier, l'ordre de lecture, les lecteurs d'écran, les animations, ni les états ouverts des filtres et fiches mission.
