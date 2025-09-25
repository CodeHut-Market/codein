# RippleThemeToggle Component

A beautiful, interactive theme toggle component with a slow ripple effect animation that provides visual feedback when switching between light, dark, and system themes.

## Features

- **Slow Ripple Animation**: Creates expanding ripple effects from the click point with a 1.2s animation duration
- **Multiple Ripple Layers**: Uses three ripple layers with different opacities and timing for depth
- **Theme Cycling**: Smoothly transitions between Light → Dark → System → Light themes
- **Responsive Design**: Available in three sizes (sm, md, lg) for different use cases
- **Accessibility**: Full keyboard navigation, screen reader support, and proper focus management
- **Visual Feedback**: Hover effects, border glow, and background animations
- **next-themes Integration**: Uses the standard next-themes provider for consistent theme management

## Installation

The component is already installed and ready to use. It requires:
- `next-themes` for theme management
- `lucide-react` for icons
- Tailwind CSS for styling

## Usage

### Basic Usage

```tsx
import RippleThemeToggle from "../../client/components/RippleThemeToggle";

function MyComponent() {
  return <RippleThemeToggle />;
}
```

### With Custom Size

```tsx
<RippleThemeToggle size="lg" />
```

### With Custom Styling

```tsx
<RippleThemeToggle 
  size="md" 
  className="shadow-lg border-primary/20" 
/>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `className` | `string` | `undefined` | Additional CSS classes to apply |
| `size` | `"sm" \| "md" \| "lg"` | `"md"` | Button size variant |

## Sizes

- **Small (`sm`)**: 32×32px - Perfect for compact UIs, mobile interfaces
- **Medium (`md`)**: 48×48px - Standard size for most use cases  
- **Large (`lg`)**: 64×64px - Great for prominent placement or accessibility

## Animation Details

The ripple effect consists of three layers:

1. **Primary Ripple**: Expands over 1.2s with higher opacity
2. **Secondary Ripple**: Starts 0.1s later, expands over 1.4s
3. **Tertiary Ripple**: Starts 0.2s later, expands over 1.6s for subtle depth

Each ripple expands from 0×0px to 200×200px with a smooth opacity fade.

## CSS Classes Used

The component uses these key Tailwind classes:
- `overflow-hidden` - Contains ripple effects within button bounds
- `rounded-full` - Circular button shape
- `active:scale-95` - Subtle press animation
- `group` - Enables hover state coordination
- `transition-all duration-200` - Smooth state transitions

## Ripple Animation CSS

The ripple animation is defined in `client/global.css`:

```css
@keyframes ripple-expand {
  0% {
    width: 0;
    height: 0;
    opacity: 0.8;
  }
  50% {
    opacity: 0.4;
  }
  100% {
    width: 200px;
    height: 200px;
    opacity: 0;
  }
}
```

## Theme Integration

Works seamlessly with the next-themes provider configured in the app layout:

```tsx
<ThemeProvider attribute="class" defaultTheme="system" enableSystem>
  <YourApp />
</ThemeProvider>
```

## Accessibility Features

- **Keyboard Navigation**: Full support for Enter and Space key activation
- **Screen Reader Support**: Descriptive aria-label with current theme state
- **Focus Management**: Proper focus ring and outline handling
- **High Contrast**: Works with system high contrast modes
- **Reduced Motion**: Respects user's motion preferences

## Examples in Use

### Navigation Bar
```tsx
<nav className="flex justify-between items-center">
  <Logo />
  <RippleThemeToggle size="md" />
</nav>
```

### Settings Panel
```tsx
<div className="settings-row">
  <span>Theme</span>
  <RippleThemeToggle size="sm" />
</div>
```

### Hero Section
```tsx
<header className="hero">
  <h1>Welcome</h1>
  <RippleThemeToggle size="lg" className="absolute top-4 right-4" />
</header>
```

## Performance Notes

- **Efficient Ripple Management**: Ripples are automatically cleaned up after animation completion
- **No Memory Leaks**: Uses React refs and proper cleanup for event handling
- **Minimal Re-renders**: Optimized state management with useRef for ripple counter
- **Lightweight**: No additional dependencies beyond what's already in the project

## Browser Support

Works in all modern browsers that support:
- CSS animations and transforms
- CSS custom properties (CSS variables)
- Modern JavaScript (ES6+)

## Demo

Visit `/demo` to see the RippleThemeToggle component in action with different sizes and contexts.

## Integration Points

Currently integrated in:
- `/signup` - Header navigation
- `/` - Main navigation (Navigation.tsx)
- `/demo` - Showcase page with examples

The component can be easily added to any page that needs theme switching functionality.