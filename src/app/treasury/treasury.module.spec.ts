import { TreasuryModule } from './treasury.module';

describe('TreasuryModule', () => {
  let treasuryModule: TreasuryModule;

  beforeEach(() => {
    treasuryModule = new TreasuryModule();
  });

  it('should create an instance', () => {
    expect(treasuryModule).toBeTruthy();
  });
});
