# Leave Calendar - Figma Specifications Implementation

## Day Box Specifications (from Figma)

### Individual Day Tile
```
Width: 139px
Height: 64px
Border: 1px solid #DADADA
Background: White (default)
```

### Day Number Positioning
- Centered horizontally and vertically inside the box
- Font size: 16px
- Font weight: 500
- Color: #1E293B (default)

## Calendar Grid Layout

### Weekday Headers
```
Width: 139px each
Height: 26px
Border: 1px solid #DADADA
Grid: 7 columns (7 days)
Total width: 973px (139px × 7)
```

### Day Tiles Grid
```
Columns: 7 (Sunday to Saturday)
Rows: 6 (max weeks in a month)
Tile size: 139px × 64px
Gap: 0px (tiles touch each other)
Total width: 973px
```

## Color Scheme

### Leave Status Colors
| Status | Color | Hex Code |
|--------|-------|----------|
| Approved | Green | #347E45 |
| Pending | Yellow | #EFBE12 |
| Rejected | Red | #F45B69 |
| Default | White | #FFFFFF |

### Text Colors
| State | Color | Hex Code |
|-------|-------|----------|
| Default text | Dark Slate | #1E293B |
| Approved text | White | #FFFFFF |
| Pending text | Dark Slate | #1E293B |
| Rejected text | White | #FFFFFF |

## CSS Classes Applied

### Tile Classes
```css
.react-calendar__tile              /* Base tile styling */
.leave-tile                        /* Leave-specific styling */
.leave-tile.leave-approved         /* Green background */
.leave-tile.leave-pending          /* Yellow background */
.leave-tile.leave-rejected         /* Red background */
```

### Header Classes
```css
.react-calendar__month-view__weekdays__weekday  /* Day headers */
```

## Implementation Details

### Files Modified
1. **LeaveCalendar.js**
   - Manages calendar state
   - Maps dates to leave statuses
   - Applies custom CSS classes

2. **LeaveCalendar.css**
   - Grid layout (139px × 64px tiles)
   - Color styling for each status
   - Responsive design
   - Legend styling

### Sample Leave Data Format
```javascript
const leaveData = {
  '2024-12-05': 'approved',   // Green
  '2024-12-10': 'pending',    // Yellow
  '2024-12-15': 'rejected',   // Red
  '2024-12-20': 'approved',   // Green
};
```

## Visual Layout

```
┌─────────────────────────────────────────────────────────────────┐
│ Leave Management                                                │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─────────┬─────────┬─────────┬─────────┬─────────┬─────────┬─────────┐
│  │ Sunday  │ Monday  │ Tuesday │ Wednesday│Thursday │ Friday  │Saturday │
│  │ (26px)  │ (26px)  │ (26px)  │ (26px)  │ (26px)  │ (26px)  │ (26px)  │
│  ├─────────┼─────────┼─────────┼─────────┼─────────┼─────────┼─────────┤
│  │         │         │         │         │         │         │    1    │
│  │ (64px)  │ (64px)  │ (64px)  │ (64px)  │ (64px)  │ (64px)  │ (64px)  │
│  ├─────────┼─────────┼─────────┼─────────┼─────────┼─────────┼─────────┤
│  │    2    │    3    │    4    │    5    │    6    │    7    │    8    │
│  │ (64px)  │ (64px)  │ (64px)  │ (64px)  │ (64px)  │ (64px)  │ (64px)  │
│  └─────────┴─────────┴─────────┴─────────┴─────────┴─────────┴─────────┘
│
│  ● Approved    ● Pending    ● Rejected
│
└─────────────────────────────────────────────────────────────────┘
```

## Responsive Behavior

### Desktop (> 768px)
- Full 139px × 64px tiles
- 7-column grid
- Normal font sizes

### Mobile (≤ 768px)
- Tiles scale down
- Font sizes reduced
- Legend stacks vertically

## Next Steps

1. **Connect to Backend API**
   - Fetch leave data from `/api/leaves`
   - Update leaveData state

2. **Add Interactivity**
   - Click handler for date selection
   - Show leave details modal
   - Add leave request form

3. **Add Filters**
   - Filter by leave type
   - Filter by status
   - Date range selection

4. **Add More Features**
   - Drag-and-drop to reschedule
   - Bulk actions
   - Export calendar

