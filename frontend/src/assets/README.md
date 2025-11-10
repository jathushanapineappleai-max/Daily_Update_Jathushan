# Assets

This folder stores static files such as images and icons used across the application.

## Structure

```
assets/
├── images/
│   ├── logo.png                    # Company/application logo
│   └── default_avatar.png          # Default user avatar
│
└── icons/
    ├── logout.svg                  # Logout icon
    ├── delete-icon.svg             # Delete icon
    ├── success-icon.svg            # Success icon
    ├── dashboard.svg               # Dashboard icon
    ├── employee.svg                # Employees icon
    ├── attendance.svg              # Attendance icon
    ├── leave.svg                   # Leave icon
    ├── recruitment.svg             # Recruitment icon
    ├── reports.svg                 # Reports icon
    ├── search.svg                  # Search icon
    ├── add.svg                     # Add icon
    ├── edit.svg                    # Edit icon
    └── upload.svg                  # Upload icon
```

## Usage

```javascript
import logo from './assets/images/logo.png';
import dashboardIcon from './assets/icons/dashboard.svg';
```

## Notes

- Add your images and icons to the respective folders
- Use SVG format for icons when possible for better scalability
- Optimize images before adding them to the project

