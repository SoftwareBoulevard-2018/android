export class InstantProject {

  public id: string;
  public name: string;
  public rewarded_K: number;
  public numberOfDevelopingQuestionsPerAnalyst:number;
  public numberOfDevelopingQuestionsPerDeveloper:number;
  public numberOfDevelopingQuestionsPerTester:number;
  constructor(
    id?: string,
    name?: string, 
    numberOfDevelopingQuestionsPerAnalyst?:number, 
    numberOfDevelopingQuestionsPerDeveloper?:number, 
    numberOfDevelopingQuestionsPerTester?:number,
    rewarded_K?: number) {
    this.id = id;
    this.name = name;
    this.rewarded_K = rewarded_K;
    this.numberOfDevelopingQuestionsPerAnalyst = numberOfDevelopingQuestionsPerAnalyst;
    this.numberOfDevelopingQuestionsPerDeveloper = numberOfDevelopingQuestionsPerDeveloper;
    this.numberOfDevelopingQuestionsPerTester = numberOfDevelopingQuestionsPerTester;
  }
}
//This was the original class, its consistent with the database, it was created due to the fack that someone changed the model at the last minute 