import { Component, Input, OnInit } from '@angular/core';
import { languageColor } from '../services/question/question.service';

@Component({
  selector: 'app-language-chip',
  templateUrl: './language-chip.component.html',
  styleUrls: ['./language-chip.component.css']
})
export class LanguageChipComponent implements OnInit {

  @Input() language: string;

  constructor() { }

  ngOnInit() {
  }

  getColor() {
    return languageColor(this.language);
  }
}
