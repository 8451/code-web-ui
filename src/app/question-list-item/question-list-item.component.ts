import { Component, OnInit, Input } from '@angular/core';
import { Question } from '../domains/question';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-question-list-item',
  templateUrl: './question-list-item.component.html',
  styleUrls: ['./question-list-item.component.scss']
})
export class QuestionListItemComponent implements OnInit {
  @Input() question: Question;

  constructor(private router: Router, private route: ActivatedRoute) { }

  ngOnInit() {
  }
  goToQuestionDetails(): void {
    this.router.navigate(['../question', this.question.id], {relativeTo: this.route});
  }

}
