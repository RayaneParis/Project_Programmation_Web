# EvenHub - Event and Participant Management System

A full-stack web appplication for managing events and participants, built with **React** for frontend and **Django REST Framework** for backend.

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React, React Router, Axios |
| Backend | Django REST Framework |
| Auth | token-based authentification |
| Styling | Custom CSS |

---

# Project Strcture 

```
project-web/
|- evenhub-frontend/
|   |- src/
|   |   |-api/
|   |   |-components/
|   |   |-pages/
|   |   |-store/
|   |   |-styles/
|   |
|   |- App.js
|
|-evenhubweb_backend/
    |-accounts/
    |-eventhub/
    |-events/

```

## Functional Requirements

## Event Management 
- Create, update, delete, list events
- Filter by category, status, date, search

# Participant Management
- Create, update, delete, list participants (admin only)
- Participants are independent entities (not user accounts)

# Registration (Many-to-Many)
- One participant -> multiple events
- One event -> multiple participants
- No duplicate registration (enforced by Django)
- Admin inscribes a participant to an event via EventDetail

### Authentification & Roles
| Role | Permissions |
|------|-------------|
| `admin` | Full CRUD on events and participants |
| `user` | Full CRUD on events and participants |

---
## Getting Started 

### Backend (Django)

```bash
cd evenhub-backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python3 manage.py migrate
python3 manage.py runserver
```

### Frontend (React)
```bash
cd event-frontend
npm install
npm start
```
---

## Many branches

```bash
main : React Frontend
```

```bash
Django : Django Backend
```

```bash
nima : Node.js Express - Backend
```

---
## Creating an Admin Account
 
```bash
# 1. Register via curl
curl -X POST http://127.0.0.1:8000/api/accounts/register/ \
  -H "Content-Type: application/json" \
  -d '{"email": "rayane@example.com", "password": "rayane123", "first_name": "Rayane", "last_name": "User", "birth_date": "2001-01-01"}'
 
# 2. Promote to admin via Django shell
cd eventhub-backend
source venv/bin/activate
python3 manage.py shell
```
 
```python
from accounts.models import User
user = User.objects.get(email='admin@example.com')
user.role = 'admin'
user.save()
exit()
```
---


## Authors
- **Rayane KHATIM** - React Frontend + Deployment
- **Student B** - Django Backend
- **Student B** - Node.js Backend 




