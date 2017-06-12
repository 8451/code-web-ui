import { Component, OnInit } from '@angular/core';
import { QuestionService } from '../services/question.service';
import { Question } from '../question'
import { MockQuestionService } from '../services/mockQuestion.service';

@Component({
  selector: 'app-question-dashboard',
  templateUrl: './question-dashboard.component.html',
  styleUrls: ['./question-dashboard.component.css']
})
export class QuestionDashboardComponent implements OnInit {

  questions: Question[];

  constructor(private questionService: MockQuestionService) {

   }

  ngOnInit() {
    this.getQuestions();
  }

  getQuestions(): void {
    this.questionService.getQuestions().then(
      questions => this.questions = questions,
      error => {
        console.error("An error occurred in the question component", error);
      }
    );
  }


}
