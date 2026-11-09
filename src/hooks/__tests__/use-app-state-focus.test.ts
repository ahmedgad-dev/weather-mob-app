import { focusManager } from '@tanstack/react-query';
import { renderHook } from '@testing-library/react-native';
import { AppState, type AppStateStatus } from 'react-native';

import { useAppStateFocus } from '../use-app-state-focus';

afterEach(() => {
  focusManager.setFocused(undefined);
  jest.restoreAllMocks();
});

describe('useAppStateFocus', () => {
  it('tells TanStack Query when the app leaves and returns to the foreground', async () => {
    let onChange: (status: AppStateStatus) => void = () => {};
    const remove = jest.fn();

    jest.spyOn(AppState, 'addEventListener').mockImplementation((_type, listener) => {
      onChange = listener;

      return { remove };
    });

    const { unmount } = await renderHook(() => useAppStateFocus());

    onChange('background');
    expect(focusManager.isFocused()).toBe(false);

    onChange('active');
    expect(focusManager.isFocused()).toBe(true);

    await unmount();
    expect(remove).toHaveBeenCalled();
  });
});
