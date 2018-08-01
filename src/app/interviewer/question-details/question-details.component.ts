import { Observable } from 'rxjs/Observable';
import { Question } from '../../domains/question';
import { Component, OnInit, NgModule, ViewChild, AfterViewInit, ViewChildren } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { QuestionService, editorTranslator } from '../../services/question/question.service';
import { AlertService } from '../../services/alert/alert.service';
import { FormsModule, ReactiveFormsModule, Validators, NgForm, FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material';
import 'rxjs/add/operator/switchMap';


import 'rxjs/add/operator/startWith';
import 'rxjs/add/operator/map';
import { valueIn } from 'app/validators';



@Component({
  selector: 'app-question-details',
  templateUrl: './question-details.component.html',
  styleUrls: ['./question-details.component.scss']
})

export class QuestionDetailsComponent implements OnInit {

  private id: string;
  isNew: boolean;
  form: FormGroup;
  languages: string[];
  filteredLanguages: Observable<string[]>;
  mode = 'java';
  editorOptions = {
    showPrintMargin: false,
    wrap: true
  };


  constructor(
    private formBuilder: FormBuilder,
    private questionService: QuestionService,
    private route: ActivatedRoute,
    private router: Router,
    private location: Location,
    private alertService: AlertService,
  ) { }

  ngOnInit(): void {
    this.questionService.getLanguages().subscribe(languages => {
      this.languages = languages;

      this.initForm();

      this.filteredLanguages = this.form.get('language').valueChanges
        .startWith(null)
        .map(name => this.filterLanguages(name));

    });
  }

  private initForm() {
    this.form = this.formBuilder.group({
      id: [null, [
      ]],
      title: ['', [
        Validators.required,
      ]],
      body: ['', [
        Validators.required
      ]],
      suggestedAnswer: ['', [
      ]],
      difficulty: ['', [
        Validators.required,
        Validators.pattern('^[1-5]$')
      ]],
      language: ['', [
        Validators.required,
        valueIn(this.languages)
      ]],
      createdBy: ['', []],
      createdDate: ['', []],
      modifiedBy: ['', []],
      modifiedDate: ['', []],
    });

    this.fillForm();
  }

  fillForm() {
    this.route.url.subscribe(segments => this.isNew = segments[segments.length - 1].path === 'new');
    if (!this.isNew) {
      this.route.params
        .switchMap((params: Params) => this.questionService.getQuestion(params['id']))
        .subscribe(question => {
          this.form.setValue({
            id: question.id,
            title: question.title,
            body: question.body,
            suggestedAnswer: question.suggestedAnswer,
            difficulty: question.difficulty,
            language: question.language,
            createdBy: question.createdBy,
            createdDate: question.createdDate,
            modifiedBy: question.modifiedBy,
            modifiedDate: question.modifiedDate
          });
        });
    }
  }

  navigateBack(): void {
    this.router.navigate(['../../questions'], { relativeTo: this.route });
  }

  submitQuestion(): void {
    if (!this.form.valid) {
      return;
    }
    const question = this.form.value as Question;
    if (this.isNew) {
      this.questionService.createQuestion(question).subscribe(res => {
        this.alertService.info('Question Created!');
        this.navigateBack();
      });
    } else {
      this.questionService.updateQuestion(question).subscribe(res => {
        this.alertService.info('Question Saved!');
        this.navigateBack();
      });
    }
  }

  deleteQuestion(): void {
    const subs = this.alertService.confirmation('Are you sure you want to delete?').subscribe(result => {
      if (subs) {
        subs.unsubscribe();
      }

      if (result) {
        this.questionService.deleteQuestion(this.form.controls['id'].value).subscribe(res => {
          this.navigateBack();
        });
      }
    });
  }

  filterLanguages(val: string) {
    this.onLanguageChange();
    return val ? this.languages.filter(s => s.toLowerCase().indexOf(val.toLowerCase()) === 0)
      : this.languages;
  }

  onLanguageChange() {
    const language = this.form.get('language').value;
    const editorLanguage = editorTranslator(language);
    if (editorLanguage) {
      this.mode = editorLanguage;
    }
  }
}
