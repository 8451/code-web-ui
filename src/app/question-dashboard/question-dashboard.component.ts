import { Component, OnInit } from '@angular/core';
import { QuestionService } from '../services/question.service';
import { Question } from '../question'

@Component({
  selector: 'app-question-dashboard',
  templateUrl: './question-dashboard.component.html',
  styleUrls: ['./question-dashboard.component.css']
})
export class QuestionDashboardComponent implements OnInit {

  private questions: Promise<Question[]>;

  constructor(private questionService: QuestionService) { }

  ngOnInit() {
    this.questions = this.questionService.getQuestions();
  }

}
