import requests
import json
import json

BASE_URL = "http://127.0.0.1:8000/api"

def test_registration():
    """Test user registration"""
    print("\n=== Testing Registration ===")
    response = requests.post(
        f"{BASE_URL}/accounts/register/",
        json={
            "email": "newuser@example.com",
            "password": "securepass123",
            "first_name": "Jane",
            "last_name": "Smith",
            "birth_date": "1995-03-15"
        }
    )
    print(f"Status: {response.status_code}")
    print(f"Response: {json.dumps(response.json(), indent=2)}")
    return response.json().get('token')

def test_login():
    """Test user login"""
    print("\n=== Testing Login ===")
    response = requests.post(
        f"{BASE_URL}/accounts/login/",
        json={
            "email": "newuser@example.com",
            "password": "securepass123"
        }
    )
    print(f"Status: {response.status_code}")
    print(f"Response: {json.dumps(response.json(), indent=2)}")
    return response.json().get('token')

def test_create_event(token):
    """Test event creation"""
    print("\n=== Testing Event Creation ===")
    response = requests.post(
        f"{BASE_URL}/events/",
        headers={"Authorization": f"Token {token}"},
        json={
            "title": "Workshop Python",
            "description": "Apprendre Python de A à Z",
            "date": "2026-06-15T14:00:00Z",
            "location": "Lyon",
            "category": "workshop",
            "capacity": 50,
            "status": "published"
        }
    )
    print(f"Status: {response.status_code}")
    print(f"Response: {json.dumps(response.json(), indent=2)}")
    return response.json().get('id')

def test_list_events():
    """Test listing events"""
    print("\n=== Testing Event List ===")
    response = requests.get(f"{BASE_URL}/events/")
    print(f"Status: {response.status_code}")
    print(f"Events count: {len(response.json())}")
    print(f"Response: {json.dumps(response.json(), indent=2)}")

def test_register_to_event(token, event_id):
    """Test event registration"""
    print("\n=== Testing Event Registration ===")
    response = requests.post(
        f"{BASE_URL}/events/{event_id}/register/",
        headers={"Authorization": f"Token {token}"},
        json={}
    )
    print(f"Status: {response.status_code}")
    print(f"Response: {json.dumps(response.json(), indent=2)}")

def test_dashboard_stats(token):
    """Test dashboard statistics"""
    print("\n=== Testing Dashboard Stats ===")
    response = requests.get(
        f"{BASE_URL}/dashboard/stats/",
        headers={"Authorization": f"Token {token}"}
    )
    print(f"Status: {response.status_code}")
    print(f"Response: {json.dumps(response.json(), indent=2)}")

if __name__ == "__main__":
    # Run all tests
    token = test_registration()
    if not token:
        token = test_login()
    
    if token:
        event_id = test_create_event(token)
        test_list_events()
        
        if event_id:
            test_register_to_event(token, event_id)
        
        test_dashboard_stats(token)
    
    print("\n=== Tests completed ===")
