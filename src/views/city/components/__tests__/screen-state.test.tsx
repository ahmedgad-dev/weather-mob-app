import { fireEvent, render, screen } from '@testing-library/react-native';

import { ScreenState } from '../screen-state';

describe('<ScreenState />', () => {
  it('hides the retry button while loading', async () => {
    await render(<ScreenState isBusy error={null} onRetry={jest.fn()} />);

    expect(screen.queryByText('Try again')).not.toBeOnTheScreen();
  });

  it('shows the error and retries when the button is pressed', async () => {
    const onRetry = jest.fn();

    await render(<ScreenState isBusy={false} error="Network request failed" onRetry={onRetry} />);

    expect(screen.getByText('Network request failed')).toBeOnTheScreen();

    await fireEvent.press(screen.getByText('Try again'));

    expect(onRetry).toHaveBeenCalledTimes(1);
  });
});
