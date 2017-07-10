import { Question } from './question';

export class QuestionResponse {
    questions: Question[];
    paginationTotalElements: number;
};