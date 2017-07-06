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
}

export enum AssessmentStates {
    NOT_STARTED,
    AWAIT_EMAIL,
    IN_PROGRESS,
    NOTES,
    CLOSED
};
