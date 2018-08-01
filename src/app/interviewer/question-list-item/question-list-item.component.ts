import { Component, OnInit, Input } from '@angular/core';
import { Question } from '../../domains/question';
import { Router, ActivatedRoute } from '@angular/router';
import { languageColor } from '../../services/question/question.service';

@Component({
  selector: 'app-question-list-item',
  templateUrl: './question-list-item.component.html',
  styleUrls: ['./question-list-item.component.scss']
})
export class QuestionListItemComponent implements OnInit {
  @Input() question: Question;

  constructor() { }

  ngOnInit() {
  }
}
