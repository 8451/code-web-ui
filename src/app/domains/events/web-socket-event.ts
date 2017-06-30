export class WebSocketEvent {
    timestamp: Date;
};

export class ConnectEvent extends WebSocketEvent {};
export class DisconnectEvent extends WebSocketEvent {};
export class EndAssessmentEvent extends WebSocketEvent {};

export class NewQuestionEvent extends WebSocketEvent {
    title: string;
    body: string;
    questionResponseId: string;
};

export class AnswerQuestionEvent extends WebSocketEvent {
    title: string;
    body: string;
    answer: string;
    questionResponseId: string;
};
