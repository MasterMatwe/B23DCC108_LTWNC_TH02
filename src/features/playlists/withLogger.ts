export function withLogger<State, Action extends { type: string }>(
  reducer: (state: State, action: Action) => State,
): (state: State, action: Action) => State {
  return (state, action) => {
    const nextState = reducer(state, action);

    if (import.meta.env.DEV) {
      console.log('Action:', action.type);
      console.log('State trước:', state);
      console.log('State sau:', nextState);
    }

    return nextState;
  };
}