# Employee Management API Examples

## 1. Create Employee - Personal Information

**Endpoint**: POST `/api/employees/personal`

**Headers**:

```
Authorization: Bearer <admin_token>
Content-Type: application/json
```

**Body**:

```json
{
  "first_name": "John",
  "last_name": "Doe",
  "email": "john.doe@example.com",
  "emp_id": "EMP001",
  "gender": "male",
  "dob": "1990-01-01",
  "phone": "+1234567890",
  "address": "123 Main St, City, Country",
  "password": "securePassword123"
}
```

## 2. Add Education Information

**Endpoint**: POST `/api/employees/{user_id}/education`

**Headers**:

```
Authorization: Bearer <admin_token>
Content-Type: application/json
```

**Body**:

```json
{
  "qualification": "Bachelor of Science in Computer Science",
  "institution": "University of Technology",
  "year_of_completion": 2015
}
```

## 3. Add Professional Experience

**Endpoint**: POST `/api/employees/{user_id}/professional`

**Headers**:

```
Authorization: Bearer <admin_token>
Content-Type: application/json
```

**Body**:

```json
{
  "position": "Software Engineer",
  "company_name": "Tech Solutions Inc.",
  "years_of_experience": 5.5
}
```

## 4. Upload Document

**Endpoint**: POST `/api/employees/{user_id}/documents`

**Headers**:

```
Authorization: Bearer <admin_token>
Content-Type: multipart/form-data
```

**Body**:

```
document_type: nic
document: [PDF file]
```

## 5. Set Work Information

**Endpoint**: POST `/api/employees/{user_id}/work-info`

**Headers**:

```
Authorization: Bearer <admin_token>
Content-Type: application/json
```

**Body**:

```json
{
  "joined_date": "2023-01-15",
  "designation": "Senior Software Engineer",
  "department_id": 1,
  "management_role": "Team Lead",
  "report_to": 2
}
```

## 6. Get Employee Overview

**Endpoint**: GET `/api/employees/{user_id}`

**Headers**:

```
Authorization: Bearer <admin_token>
```

## 7. Get All Employees

**Endpoint**: GET `/api/employees?page=1&limit=10`

**Headers**:

```
Authorization: Bearer <admin_token>
```

## 8. Update Employee Personal Information

**Endpoint**: PUT `/api/employees/{user_id}/personal`

**Headers**:

```
Authorization: Bearer <admin_token>
Content-Type: application/json
```

**Body**:

```json
{
  "first_name": "John",
  "last_name": "Doe-Smith",
  "email": "john.doe-smith@example.com",
  "emp_id": "EMP001",
  "gender": "male",
  "dob": "1990-01-01",
  "phone": "+1234567890",
  "address": "456 New Street, City, Country",
  "password": "newSecurePassword123"
}
```
