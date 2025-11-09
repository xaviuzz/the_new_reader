# Modal Pattern

## Shared Modal Components

Extract common structural components into `shared/` folder:

- `ModalHeader.tsx` - Consistent title rendering
- `ModalBackdrop.tsx` - Click-to-close backdrop
- `index.ts` - Re-export for cleaner imports

Benefits: Eliminates duplication, consistent structure, single source of truth for styling.

## DaisyUI Modal Composition

All modals follow the same structural pattern:

```
<div className="modal modal-open">
  <div className="modal-box">
    <ModalHeader title="..." />
    <ModalContent />
    <ModalActions />
  </div>
  <ModalBackdrop onClick={onClose} />
</div>
```

Benefits: Consistent appearance, familiar structure, DaisyUI handles responsive sizing.

## Explicit Callback Naming

- Use `onDeleteRequest` or `onConfirmRequest` to signal callback opens a modal
- Use `onDelete` or `onConfirm` for the callback that executes the action

Benefits: Clarifies component contracts, prevents confusion, easier refactoring.

## Loading State Management

- Modals manage their own operation state (`isDeleting`, `isSubmitting`)
- Parents only manage modal visibility
- Modal operations don't leak into parent state management

## Folder Structure Consistency

```
modal-name/
├── ModalName.tsx              // Container: state + event handling
├── index.ts                   // Re-export for cleaner imports
└── components/
    ├── SpecificComponent.tsx   // Modal-specific components
    └── ModalActions.tsx        // Action buttons
```

Container Component: Manages modal visibility, operation state, async operations, error handling, callbacks.
Modal-Specific Components: UI concerns specific to this modal, receive data/callbacks from container.

## Component Cleanup

Delete unused duplicate files that remain from previous implementations. Use `shared/` folder as single source of truth.
