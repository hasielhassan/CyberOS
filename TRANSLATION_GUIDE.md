# CyberOS Translation Guide

This guide outlines the internationalization (i18n) system used in CyberOS. We use a custom, lightweight i18n solution built around a `useLanguage` hook and a central registry.

## Core Concepts

1.  **Locale Files**: Translations are stored in `src/locales/en.ts` (English) and `src/locales/es.ts` (Spanish).
2.  **`useLanguage` Hook**: Components access the translation function `t` via this hook.
3.  **Dynamic Data**: Static data files (like JSON) that contain text to be translated are converted to TypeScript functions that accept the `t` translator.

## Adding Translations

### 1. Add Keys to Locale Files

Always add new keys to **both** `en.ts` and `es.ts`. Use a hierarchical naming convention (e.g., `module.component.key`).

**`src/locales/en.ts`**
```typescript
export const en = {
    // ... existing keys
    'my_module.title': 'My Module Title',
    'my_module.button.save': 'Save Changes',
    'my_module.error.failed': 'Operation failed: {reason}', // Supports simple interpolation
};
```

**`src/locales/es.ts`**
```typescript
export const es = {
    // ... existing keys
    'my_module.title': 'Título de Mi Módulo',
    'my_module.button.save': 'Guardar Cambios',
    'my_module.error.failed': 'Operación fallida: {reason}',
};
```

### 2. Use `t()` in Components

Import `useLanguage` from the core registry and destructure `t`.

```tsx
import { useLanguage } from '../../core/registry';

export const MyComponent = () => {
    const { t } = useLanguage();

    return (
        <div>
            <h1>{t('my_module.title')}</h1>
            <button>{t('my_module.button.save')}</button>
        </div>
    );
};
```

### 3. Handling Dynamic Data (The "Data-as-Code" Pattern)

For lists, configurations, or templates that were previously JSON files but contain translatable text, convert them to a TypeScript file that exports a function.

**Old (`data.json`)**:
```json
[
    { "id": 1, "name": "Item One", "description": "This is item one." }
]
```

**New (`data.ts`)**:
```typescript
export const getData = (t: (key: string) => string) => [
    {
        id: 1,
        name: t('my_module.item1.name'),
        description: t('my_module.item1.desc')
    }
];
```

**Usage in Component**:
```tsx
import { getData } from './data';
import { useLanguage } from '../../core/registry';

export const MyComponent = () => {
    const { t } = useLanguage();
    const data = getData(t);

    return (
        <ul>
            {data.map(item => (
                <li key={item.id}>
                    {item.name}: {item.description}
                </li>
            ))}
        </ul>
    );
};
```

## Best Practices

*   **Keys**: Use lowercase, dot-separated keys (e.g., `nav.home`, `error.network`).
*   **Grouping**: Group keys by module or feature in the locale files.
*   **Interpolation**: The `t` function supports simple string replacement. If your key is `Hello {name}`, calling `t('key', { name: 'World' })` will return "Hello World".
*   **No Hardcoding**: Never leave user-facing text hardcoded in components.
*   **Plugin Names**: Ensure plugin definitions in `index.ts` use translation keys for their `name` property.

## Troubleshooting

*   **Missing Key**: If a key is missing, the `t` function will return the key itself (e.g., `my_module.missing_key`).
*   **Duplicate Keys**: The linter will warn you if you define the same key twice in a locale file.
