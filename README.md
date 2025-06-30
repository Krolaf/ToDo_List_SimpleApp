# 📝 To-Do List Moderne

Une application web de To-Do List minimaliste, responsive et animée, réalisée en HTML, CSS et JavaScript vanilla.

## ✨ Fonctionnalités

### 🎯 Fonctionnalités principales
- **Ajout, édition, suppression de tâches**
- **Menu circulaire animé** autour de chaque tâche (actions : valider, modifier, supprimer, monter/descendre)
- **Sous-tâches (checklist interne)** avec progression, validation automatique, et bouton "Valider la tâche"
- **Compteur de tâches et progression globale**
- **Sauvegarde automatique dans le localStorage**
- **Design moderne** :
  - Police Inter, couleurs douces, ombres, animations CSS
  - Dark/Light mode (adaptatif)
  - Layout responsive (mobile/tablette/desktop)
  - Séparation claire entre zone d'ajout et liste
  - Formulaire d'ajout vertical, bouton + en bas à droite
  - **Alignement horizontal** : la checkbox, le titre et la progression sont désormais sur la même ligne, bien espacés et centrés verticalement pour un rendu moderne et lisible
  - La progression des sous-tâches est alignée à droite de la carte, discrète

### 🎨 Design moderne
- **Interface minimaliste** : Design épuré et professionnel
- **Animations fluides** : Transitions douces et feedback visuel
- **Palette de couleurs harmonieuse** : Dégradé violet moderne
- **Typographie soignée** : Police Inter pour une excellente lisibilité
- **Ombres et effets** : Profondeur visuelle avec des ombres subtiles

### 🎮 Menu circulaire interactif
Le point fort de l'application : un menu circulaire animé qui apparaît autour de chaque tâche avec :
- ✅ **Marquer comme fait/non fait**
- 📝 **Modifier** la tâche
- 🗑️ **Supprimer** la tâche
- 🔼 **Monter** dans la liste
- 🔽 **Descendre** dans la liste

## 🚀 Installation et utilisation

### Prérequis
- Un navigateur web moderne (Chrome, Firefox, Safari, Edge)
- Aucune installation requise

### Lancement
1. Téléchargez ou clonez le projet
2. Ouvrez le fichier `index.html` dans votre navigateur
3. L'application est prête à utiliser !

### Utilisation
1. **Ajouter une tâche** : Tapez dans le champ de saisie et appuyez sur Entrée ou cliquez sur le bouton +
2. **Gérer une tâche** : Cliquez sur une tâche pour ouvrir le menu circulaire
3. **Marquer comme fait** : Cliquez sur la case à cocher ou utilisez le menu circulaire
4. **Modifier** : Utilisez l'icône 📝 dans le menu circulaire
5. **Supprimer** : Utilisez l'icône 🗑️ dans le menu circulaire
6. **Réorganiser** : Utilisez les icônes 🔼 et 🔽 dans le menu circulaire
7. **Ajouter des sous-tâches** : Cliquez sur le bouton "Ajouter des sous-tâches" dans le menu circulaire
8. **Valider la tâche** : Cliquez sur le bouton "Valider la tâche" dans le menu circulaire

## 🛠️ Structure du projet

```
ToDo_List_SimpleApp/
├── index.html          # Structure HTML principale
├── style.css           # Styles CSS avec animations
├── script.js           # Logique JavaScript
└── README.md           # Documentation
```

## 🎨 Spécifications techniques

### Technologies utilisées
- **HTML5** : Structure sémantique et accessible
- **CSS3** : Styles modernes avec variables CSS, Flexbox, Grid
- **JavaScript ES6+** : Programmation orientée objet, modules

### Fonctionnalités techniques
- **localStorage** : Persistance des données côté client
- **Animations CSS** : Keyframes et transitions pour les interactions
- **Responsive Design** : Adaptation automatique aux différentes tailles d'écran
- **Accessibilité** : Support des raccourcis clavier (Echap pour fermer)
- **Sécurité** : Échappement HTML pour éviter les injections

### Animations incluses
- **Menu circulaire** : Apparition en rotation avec délais échelonnés
- **Tâches** : Slide-in à l'ajout, slide-out à la suppression
- **Feedback** : Notifications toast pour les actions
- **Hover effects** : Interactions visuelles sur tous les éléments
- **Pulse** : Animation continue sur le centre du menu circulaire

## 📱 Compatibilité

- ✅ Chrome 60+
- ✅ Firefox 55+
- ✅ Safari 12+
- ✅ Edge 79+
- ✅ Mobile browsers

## 🎯 Fonctionnalités avancées

### Gestion des données
- **Sauvegarde automatique** : Chaque modification est immédiatement sauvegardée
- **Récupération** : Les données sont restaurées au rechargement de la page
- **Validation** : Empêche l'ajout de tâches vides

### Interface utilisateur
- **État vide** : Message encourageant quand aucune tâche n'existe
- **Statistiques en temps réel** : Mise à jour instantanée des compteurs
- **Feedback visuel** : Confirmation des actions avec des notifications
- **Navigation clavier** : Support complet des raccourcis

### Performance
- **Rendu optimisé** : Mise à jour ciblée des éléments DOM
- **Animations fluides** : Utilisation de `transform` et `opacity` pour les performances
- **Gestion mémoire** : Nettoyage automatique des événements

## 🔧 Personnalisation

L'application utilise des variables CSS pour faciliter la personnalisation :

```css
:root {
    --primary-color: #6366f1;    /* Couleur principale */
    --accent-color: #10b981;     /* Couleur d'accent */
    --bg-primary: #ffffff;       /* Fond principal */
    /* ... autres variables */
}
```

## 📄 Licence

Ce projet est open source et disponible sous licence MIT.

## 🤝 Contribution

Les contributions sont les bienvenues ! N'hésitez pas à :
- Signaler des bugs
- Proposer des améliorations
- Ajouter de nouvelles fonctionnalités

---

**Développé avec ❤️ en HTML/CSS/JavaScript vanilla** 

## Captures d'écran
![Exemple UI](screenshot.png)

## Auteurs
- Design & code : [Votre nom]

---

N'hésitez pas à proposer des améliorations ou à signaler des bugs ! 