import { Component, OnInit, Input } from '@angular/core';
import { Question } from '../domains/question';
import { Router } from '@angular/router';

@Component({
  selector: 'app-question-list-item',
  templateUrl: './question-list-item.component.html',
  styleUrls: ['./question-list-item.component.css']
})
export class QuestionListItemComponent implements OnInit {
  @Input() question: Question;  

  constructor(private router: Router) { }

  ngOnInit() {
  }
  goToQuestionDetails(): void {
    this.router.navigate(['/question', this.question.id])
  }

}
