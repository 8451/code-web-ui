import { CandidatesModule } from './candidates.module';

describe('CandidatesModule', () => {
  let candidatesModule: CandidatesModule;

  beforeEach(() => {
    candidatesModule = new CandidatesModule();
  });

  it('should create an instance', () => {
    expect(candidatesModule).toBeTruthy();
  });
});
