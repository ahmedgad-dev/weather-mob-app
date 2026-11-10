import { authenticate } from '../fake-auth';

beforeEach(() => {
  jest.useFakeTimers();
});

afterEach(() => {
  jest.useRealTimers();
});

async function settle<T>(promise: Promise<T>) {
  await jest.runAllTimersAsync();

  return promise;
}

describe('authenticate', () => {
  it('signs in with a normalised email and a name taken from it', async () => {
    const session = await settle(
      authenticate({ email: '  Jane.Doe@Example.com ', password: 'weather123' })
    );

    expect(session.user).toEqual({ email: 'jane.doe@example.com', name: 'Jane Doe' });
    expect(session.token).toMatch(/^fake\./);
  });

  it('answers only after a network-like delay', async () => {
    const onDone = jest.fn();
    authenticate({ email: 'a@b.co', password: 'weather123' }).then(onDone);

    await jest.advanceTimersByTimeAsync(500);
    expect(onDone).not.toHaveBeenCalled();

    await jest.advanceTimersByTimeAsync(500);
    expect(onDone).toHaveBeenCalled();
  });

  it('rejects an email without a domain', async () => {
    const attempt = authenticate({ email: 'jane@', password: 'weather123' });
    const assertion = expect(attempt).rejects.toThrow('Enter a valid email address.');

    await jest.runAllTimersAsync();
    await assertion;
  });

  it('rejects a short password', async () => {
    const attempt = authenticate({ email: 'jane@example.com', password: 'short' });
    const assertion = expect(attempt).rejects.toThrow('at least 8 characters');

    await jest.runAllTimersAsync();
    await assertion;
  });
});
