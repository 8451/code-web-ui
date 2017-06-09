import { Injectable } from '@angular/core';
import { Headers, Http } from '@angular/http';
import { Question } from '../question';

import 'rxjs/add/operator/toPromise';

@Injectable()
export class MockQuestionService {

  private questionsUrl = 'http://localhost:8090/api/v1/questions';

  constructor(private http: Http) { }

  getQuestions(): Promise<Question[]> {
   let test: any[] = [
       {
           "id": "id1",
           "title": "Title1",
           "body": "Body1",
           "suggestedAnswer": "SuggestedAnswer1",
           "createdBy": "createdBy1",
           "createdDate" : new Date(),
           "modifiedBy": "modifiedBy1",
           "modifiedDate": new Date()
        },
        {
            "id": "id2",
           "title": "Title2",
           "body": "Body2",
           "suggestedAnswer": "SuggestedAnswer2",
           "createdBy": "createdBy2",
           "createdDate" : new Date(),
           "modifiedBy": "modifiedBy2",
           "modifiedDate": new Date()
        },
        {   
            "id": "id3",
           "title": "Title3",
           "body": "Body3",
           "suggestedAnswer": "SuggestedAnswer3",
           "createdBy": "createdBy3",
           "createdDate" : new Date(),
           "modifiedBy": "modifiedBy3",
           "modifiedDate": new Date()
        }
        
   ];
   return new Promise<Question[]>( (resolve, reject) =>{
       resolve(test);
   });
  }
}
