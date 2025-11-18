# Leave Calendar Component Guide

## Overview
The LeaveCalendar component displays a monthly calendar with leave status indicators (Approved, Pending, Rejected) using the `react-calendar` package.

## Features
✅ Monthly calendar view with day grid
✅ Color-coded leave status indicators
✅ Legend showing status meanings
✅ Responsive design
✅ Easy to customize

## Color Scheme (from Figma)
- **Approved**: #347E45 (Green)
- **Pending**: #EFBE12 (Yellow)
- **Rejected**: #F45B69 (Red)

## Component Structure

### LeaveCalendar.js
Main component that:
- Manages calendar state
- Stores leave data
- Maps dates to leave statuses
- Renders calendar with custom styling

### LeaveCalendar.css
Styling that:
- Overrides react-calendar default styles
- Applies Figma design specifications
- Handles responsive layout
- Styles legend indicators

## How to Use

### 1. Basic Usage
```jsx
import LeaveCalendar from '../sections/leaves/LeaveCalendar';

export default function LeavesPage() {
  return <LeaveCalendar />;
}
```

### 2. Update Leave Data
Replace the `leaveData` object in LeaveCalendar.js with your API data:

```javascript
const leaveData = {
  '2024-12-05': 'approved',
  '2024-12-10': 'pending',
  '2024-12-15': 'rejected',
  // Add more dates...
};
```

### 3. Connect to API
Fetch leave data from your backend:

```javascript
const [leaveData, setLeaveData] = useState({});

useEffect(() => {
  // Fetch from API
  fetchLeaveData().then(data => setLeaveData(data));
}, []);
```

## Customization

### Change Colors
Edit the CSS classes in LeaveCalendar.css:
```css
.leave-tile.leave-approved {
  background: #347E45; /* Change this */
}
```

### Add More Status Types
1. Add to leaveData: `'2024-12-01': 'custom-status'`
2. Add CSS class: `.leave-tile.leave-custom-status { ... }`

### Modify Calendar Behavior
Props available in react-calendar:
- `value`: Selected date
- `onChange`: Date change handler
- `tileClassName`: Custom class for tiles
- `calendarType`: 'gregory' or 'hebrew'

## Data Format
Leave data should be in this format:
```javascript
{
  'YYYY-MM-DD': 'status',
  '2024-12-05': 'approved',
  '2024-12-10': 'pending',
  '2024-12-15': 'rejected'
}
```

## Next Steps
1. Connect to your backend API
2. Fetch real leave data
3. Add click handlers for date selection
4. Implement leave details modal
5. Add filters for different leave types

## Dependencies
- `react-calendar`: ^1.7.0 (installed)
- `react`: ^18.2.0 (already installed)

## Files Modified
- `frontend/src/sections/leaves/LeaveCalendar.js` - Main component
- `frontend/src/sections/leaves/LeaveCalendar.css` - Styling
- `frontend/src/pages/Leaves.js` - Integrated component

