import { QuestionAnswer } from './question-answer';
export class Assessment {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    modifiedBy: string;
    modifiedDate: Date;
    interviewGuid: string;
    state: AssessmentStates;
    notes: string;
    questionAnswers: QuestionAnswer[];
}

export enum AssessmentStates {
    NOT_STARTED,
    AWAIT_EMAIL,
    IN_PROGRESS,
    NOTES,
    CLOSED
};

export class AssessmentStateResponse {
    state: AssessmentStates;
}
