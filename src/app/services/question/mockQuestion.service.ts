import { Question } from './../../domains/question';
import { Injectable } from '@angular/core';


import { QuestionService } from './question.service'

import 'rxjs/add/operator/toPromise';

@Injectable()
export class MockQuestionService {
  
   private test: any[] = [
       {
           "id": "id1",
           "title": "Title1",
           "body": "Body1",
           "difficulty": 1,
           "suggestedAnswer": "SuggestedAnswer1",
           "createdBy": "createdBy1",
           "createdDate" : new Date(1),
           "modifiedBy": "modifiedBy1",
           "modifiedDate": new Date(1)
        },
        {
            "id": "id2",
           "title": "Title2",
           "body": "Body2",
           "difficulty": 2,
           "suggestedAnswer": "SuggestedAnswer2",
           "createdBy": "createdBy2",
           "createdDate" : new Date(1),
           "modifiedBy": "modifiedBy2",
           "modifiedDate": new Date(1)
        },
        {   
            "id": "id3",
           "title": "Title3",
           "body": "Body3",
           "difficulty": 3,
           "suggestedAnswer": "SuggestedAnswer3",
           "createdBy": "createdBy3",
           "createdDate" : new Date(1),
           "modifiedBy": "modifiedBy3",
           "modifiedDate": new Date(1)
        }
        
   ];

  constructor() { }
 

  getQuestions(): Promise<Question[]> {
   return new Promise<Question[]>( (resolve, reject) =>{
       resolve(this.test);
   });
  }

  getQuestion(id: string): Promise<Question> {

      return new Promise<Question>((resolve, reject) => {
          resolve(this.test.find(q => {
              return q.id === id;
          }));
      });
  }


}
