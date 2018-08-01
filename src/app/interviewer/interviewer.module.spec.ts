import { InterviewerModule } from './interviewer.module';

describe('InterviewerModule', () => {
  let interviewerModule: InterviewerModule;

  beforeEach(() => {
    interviewerModule = new InterviewerModule();
  });

  it('should create an instance', () => {
    expect(interviewerModule).toBeTruthy();
  });
});
