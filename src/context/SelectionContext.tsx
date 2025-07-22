import React, { createContext, useReducer, type ReactNode } from 'react';
type State = { selectedIds: Set<number> };
type Action =
    | { type: 'TOGGLE_ID'; id: number }
    | { type: 'ADD_IDS'; ids: number[] }
    | { type: 'REMOVE_ID'; id: number };

const initialState: State = { selectedIds: new Set() };

function reducer(state: State, action: Action): State {
    const selected = new Set(state.selectedIds);
    switch (action.type) {
        case 'TOGGLE_ID':
            // eslint-disable-next-line @typescript-eslint/no-unused-expressions
            selected.has(action.id) ? selected.delete(action.id) : selected.add(action.id);
            return { selectedIds: selected };
        case 'ADD_IDS':
            action.ids.forEach(id => selected.add(id));
            return { selectedIds: selected };
        case 'REMOVE_ID':
            selected.delete(action.id);
            return { selectedIds: selected };
        default:
            return state;
    }
}

interface SelectionProviderProps { children: ReactNode }

// eslint-disable-next-line react-refresh/only-export-components
export const SelectionContext = createContext<{
    state: State;
    dispatch: React.Dispatch<Action>;
}>({ state: initialState, dispatch: () => null });

export const SelectionProvider = ({ children }: SelectionProviderProps) => {
    const [state, dispatch] = useReducer(reducer, initialState);
    return (
        <SelectionContext.Provider value={{ state, dispatch }}>
            {children}
        </SelectionContext.Provider>
    );
};