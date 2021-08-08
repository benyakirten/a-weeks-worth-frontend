import { User } from './user';

describe('User', () => {
  it('should create an instance', () => {
    expect(new User('A','B','C','D',true)).toBeTruthy();
  });
});
