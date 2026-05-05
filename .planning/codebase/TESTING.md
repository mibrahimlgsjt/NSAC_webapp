# Testing Patterns

**Analysis Date:** 2024-05-23

## Test Framework

**Runner:**
- `pytest` 8.1.1
- Config: None explicit (relies on default Pytest discovery).

**Assertion Library:**
- Standard Python `assert` statements.

**Run Commands:**
```bash
pytest                 # Run all tests
```

## Test File Organization

**Location:**
- Separated into a dedicated `tests/` directory at the project root.

**Naming:**
- Files: `test_*.py` (e.g., `test_basic.py`)
- Functions: `test_*` (e.g., `test_home_page`, `test_admin_login`)

## Test Structure

**Suite Organization:**
```python
@pytest.fixture
def client():
    # Setup app config for testing
    # Setup in-memory DB
    # Yield test client
    # Teardown DB

def test_specific_feature(client):
    # Use client to make request
    # Assert response
```

**Patterns:**
- **Setup/Teardown:** Uses Pytest fixtures (`@pytest.fixture`) to set up a clean, in-memory SQLite database before yielding the test client. It cleans up (`db.drop_all()`) afterward.
- **Assertion:** Directly checks HTTP status codes (`assert rv.status_code == 200`) and parses byte strings in responses (`assert b'Success' in rv.data`).

## Mocking

**Framework:** None explicitly used (e.g., `unittest.mock`).

**Patterns:**
- Instead of mocking the database, the tests switch to an in-memory SQLite DB (`app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///:memory:'`).
- Image uploads are mocked by generating a real tiny image in memory using `PIL.Image` and passing it to the test client via `BytesIO`.

```python
img_io = BytesIO()
img = Image.new('RGB', (100, 100), color='red')
img.save(img_io, 'JPEG')
img_io.seek(0)

data = {
    'animal_id': aid,
    'location': 'SEECS',
    'sighting_image': (img_io, 'valid.jpg')
}
```

## Fixtures and Factories

**Test Data:**
- Data is seeded directly within the test setup or within the test case using standard SQLAlchemy model instantiations. No factory libraries (like FactoryBoy) are used.

```python
with app.app_context():
    a = Animal(name='TestCat', current_sector='NBS')
    db.session.add(a)
    db.session.commit()
```

## Coverage

**Requirements:** None enforced natively.

**View Coverage:**
(Requires `pytest-cov` to be installed manually)
```bash
pytest --cov=.
```

## Test Types

**Unit Tests:**
- Not strictly isolated; functions test the full stack (Route -> Logic -> Database).

**Integration Tests:**
- Most tests in `test_basic.py` are integration tests, exercising the Flask request lifecycle, database interactions, and response generation together.

## Common Patterns

**Authentication Testing:**
- The test client directly POSTs to the `/login` route with seeded admin credentials to establish an authenticated session for subsequent tests.

**File Upload Testing:**
- Uses `content_type='multipart/form-data'` in the test client's `.post()` method, passing a tuple of `(BytesIO_object, filename)` in the data dictionary.

---

*Testing analysis: 2024-05-23*