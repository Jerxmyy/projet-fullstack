# Projet :

- Reproduire une interface type <a href="https://www.instant-gaming.com/fr/"> instant gaming </a> dans le cadre d'un projet full-stack a <a href="https://ecole-du-digital.com/">l'ESD Paris </a>

# Les techno utilisée sont :

##### Pour le Front-END :

- React.js
- Bootstrap

##### Pour le Back-end

- SUPABASE

### Initialiser le projet :

    npm install
    npm run dev

# Exporter les données

    pg_dump -h db.qvonhyxawuzkqaaihsbs.supabase.co -U postgres -d   Fullstack-project > export.sql
    const supaUrl = "SUPA_URL";
    const supaKey =
    "SUPA_KEY";
    postgresql://postgres:[YOUR-PASSWORD]@db.qvonhyxawuzkqaaihsbs.supabase.co:5432/postgres
