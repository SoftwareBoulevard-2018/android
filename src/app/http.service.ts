import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer';
import { AlertController } from 'ionic-angular';

import {_throw} from 'rxjs/observable/throw';
import { catchError, /*retry*/ } from 'rxjs/operators';

import { User } from '../models/user';
import { TrainingAttempt } from '../models/trainingAttempt';
import { DevelopingAttempt } from '../models/developingAttempt';
import { Company } from '../models/company';
import { Email } from '../models/email';
import { Puzzle } from './../models/puzzle';
import { creationPuzzle } from './../models/creationPuzzle';
import { BiddingProject } from './../models/biddingProject';
import { Questions} from './../models/questions';
import { Assignment } from './../models/assignment';
import { InstantProject } from './../models/instantProject';
import { Invitation } from './../models/invitation';
import { Record } from './../models/record';
import { Estimation } from './../models/estimation';
import { Certification } from './../models/certification';
import { Answer } from './../models/answer';
//import { ThrowStmt } from '@angular/compiler';


/**
 * Provides communication with the api
 */

@Injectable()
export class HttpService {

  static httpOptions = {
    headers: new HttpHeaders({
      'Content-Type':  'application/json'
    })
  };

  constructor(public http: HttpClient,
    private transfer: FileTransfer,
    public alertCtrl: AlertController
  ) {
    window.addEventListener("offline", function() {
      const alert = alertCtrl.create({
        title: 'No connection',
        subTitle: 'You don\'t have internet connection, check it before using the app',
        buttons: ['OK']
      });
      alert.present();
    }, false); 
  }

  /**
   * defaul apiURL, can be changed in loginPage
   */
  static apiURL = 'http://35.196.111.251:3000';
  //static apiURL = 'http://localhost:3000';

  /**
   * routes must coincide with backend services
   */
  static usersURL = '/users';
  static updateGAURL = '/users/updateGA';
  static usersURL2 = '/username';
  static companiesURL = '/companies';
  static loginURL = '/login';
  static emailURL = '/emails';
  static reportsURL = '/reports';
  static certificationsURL = '/certification';

  static puzzlesURL = '/puzzles';
  static recordsURL = '/records';
  static puzzleURL = '/puzzles';
  
  static biddingProjectURL = '/biddingProjects';
  static questionURL = '/questions';
  static instantProjectURL = '/instantProjects'

  
  static getCurrentCompanyURL = '/getCurrentProject';
 
  static createBiddingProjectURL = '/createBiddingProject';
  static createInstantProjectURL = '/createInstantProject';
  static createQuestionURL = '/createQuestion';
  static updateQuestionURL = '/updateQuestion';


  static getBiddingProjectURL = '/getBiddingProject';
  static getInstantProjectURL = '/getInstantProject';
  static getQuestionURL = '/getQuestions';
  static getAssignmentURL = '/getAssignment';
  static certificationURL = '/certification';

  static updateInstantProjectURL = '/updateInstantProject';
  static updateBiddingProjectURL = '/updateBiddingProject';

  static trainingAttemptsURL = '/trainingAttempts';
  static developingAttemptsURL = '/developingAttempts';

  static invitationsURL = '/invitations';
  static estimationURL = '/estimations';
  static getCurrentProjectManagerURL = '/getCurrentPm';
  static getCurrentProjectManager2URL = '/getCurrentProjectM';
  static getEstimationByPMAndProjectURL = '/getEstimationByPMAndProject';
  static getEstimationsByPMAndStateURL = '/getEstimationsByProjectManagerUsernameAndState';
  

  static getCertificationsURL = '/getCertification';

  login(username, password) {
    return this.http.post<User>(HttpService.apiURL + HttpService.loginURL,
      JSON.stringify({ username: username, password: password }), HttpService.httpOptions)
      .pipe(
        catchError((error) => {
          let msg;
          if (error.status==0) {
            // A client-side or network error occurred..
            msg = 'Can\'t connect, maybe server is down, retry later';
          } else {
            // The response contains the error in the backend
            msg = error.error.errors;
          }
          // return an observable with a user-facing error message
          return _throw(msg);
        })
      );;
    }
  // All services related to Users
  getAllUsers() {
    return this.http.get<User[]>(HttpService.apiURL + HttpService.usersURL);
  }
  getUserById(userId: string) {
    return this.http.get<User>(HttpService.apiURL + HttpService.usersURL + '/' + userId);
  }
  getUserByUsername(username: string) {
    return this.http.get<User>(HttpService.apiURL + HttpService.usersURL + HttpService.usersURL2 + '/' + username);
  }
  createUser(user: User) {
    return this.http.post<User>(HttpService.apiURL + HttpService.usersURL,
      JSON.stringify(user), HttpService.httpOptions);
  }
  updateUser(user, userId) {
    return this.http.put<Object>(HttpService.apiURL + HttpService.usersURL + '/' + userId,
      JSON.stringify(user), HttpService.httpOptions);
  }

  updateParameter(user,id) {
    return this.http.put<Object>(HttpService.apiURL + HttpService.usersURL + HttpService.updateGAURL+'/' +id,
      JSON.stringify(user), HttpService.httpOptions);
  }

  updateInstantProject(instantProject: InstantProject, id :string ){
    console.log(instantProject);
    console.log(instantProject.id);
    return this.http.put<Object>(HttpService.apiURL + HttpService.instantProjectURL + HttpService.updateInstantProjectURL +'/'+ id,
    JSON.stringify(instantProject), HttpService.httpOptions);
    
  }

  getUserByRoleCompany(role, companyId) {
    return this.http.post<User[]>(HttpService.apiURL + HttpService.usersURL + HttpService.usersURL2,
      JSON.stringify({ role: role, companyId: companyId }), HttpService.httpOptions);
  }
  getUsersByCompany(companyId){
    return this.http.get<User[]>(HttpService.apiURL + HttpService.usersURL + '/company/' + companyId);
  }

  // All services related to companies
  getAllCompanies() {
    return this.http.get<Company[]>(HttpService.apiURL + HttpService.companiesURL);
  }
  getCompanyById(companyId: string) {
    return this.http.get<Company>(HttpService.apiURL + HttpService.companiesURL + '/' + companyId);
  }
  createCompany(company: Company) {
    return this.http.post<Company>(HttpService.apiURL + HttpService.companiesURL,
      JSON.stringify(company), HttpService.httpOptions);
  }
  updateCompany(company, companyId) {
    return this.http.put<Object>(HttpService.apiURL + HttpService.companiesURL + '/' + companyId,
      JSON.stringify(company), HttpService.httpOptions);
  }


  // uploads the image to the server before a company is created or updated
  uploadCompanyImage(imageURI){
    const fileTransfer: FileTransferObject = this.transfer.create();
  
    let options: FileUploadOptions = {
      fileKey: 'image',
      chunkedMode: false,
      mimeType: 'multipart/form-data',
      headers: {}
    }

    return fileTransfer.upload(imageURI, HttpService.apiURL+HttpService.companiesURL+"/image", options);
  }

  uploadPuzzleImage(imageURI){
    const fileTransfer: FileTransferObject = this.transfer.create();
  
    let options: FileUploadOptions = {
      fileKey: 'image',
      chunkedMode: false,
      mimeType: 'multipart/form-data',
      headers: {}
    }

    return fileTransfer.upload(imageURI, HttpService.apiURL + '/puzzles' + '/uploadImage', options);
  }

  // All services related to email
  read(idUsuario) {
     return this.http.get<Email[]>(HttpService.apiURL + HttpService.emailURL + '/read/' + idUsuario);
  }
  send(email: Email){
    return this.http.post<Email>(HttpService.apiURL + HttpService.emailURL + '/send/',
      JSON.stringify(email), HttpService.httpOptions);
  }

  sent(idUsuario) {
     return this.http.get<Email[]>(HttpService.apiURL + HttpService.emailURL + '/sent/' + idUsuario);
  }  

  updateState(idEmail, email){
    return this.http.put<Email>(HttpService.apiURL + HttpService.emailURL + '/updateState/'+idEmail,
      JSON.stringify(email), HttpService.httpOptions);
  }

  // All services related to reports
  //this gets the number of users and companies
  getReports(){
    return this.http.get(HttpService.apiURL + HttpService.reportsURL);
  }

  //All services related to Puzzles
  getAllPuzzles() {
    return this.http.get<Puzzle[]>(HttpService.apiURL + HttpService.puzzleURL);
  }
  createPuzzle(puzzle: creationPuzzle) {
    return this.http.post<creationPuzzle>(HttpService.apiURL + '/puzzles' + '/createPuzzleAndroid',
      JSON.stringify(puzzle), HttpService.httpOptions);
  }
  //All services related to Projects
  getBiddingProjectById(id: String) {
    return this.http.get<BiddingProject>(HttpService.apiURL +'/biddingProjects'+ '/' + id);
  }
  getAllBiddingProjects() {
    return this.http.get<BiddingProject[]>(HttpService.apiURL + HttpService.biddingProjectURL + '/' + 'getBiddingProject');
  }

  getInstantProjectById(id: String) {
    return this.http.get<InstantProject>(HttpService.apiURL + HttpService.instantProjectURL + '/' + id);
  }
  getAllInstantProjects() {
    return this.http.get<InstantProject[]>(HttpService.apiURL + HttpService.instantProjectURL + '/' + 'getInstantProject');
  }
  createBiddingProject(biddingProject: BiddingProject) {
	  console.log( JSON.stringify(biddingProject));
	  console.log(HttpService.apiURL + HttpService.biddingProjectURL,
      JSON.stringify(biddingProject), HttpService.httpOptions);
    return this.http.post<BiddingProject>(HttpService.apiURL + HttpService.biddingProjectURL + HttpService.createBiddingProjectURL,
      JSON.stringify(biddingProject), HttpService.httpOptions);
  }

  createInstantProject(instantProject: InstantProject) {
	  console.log( JSON.stringify(instantProject));
	  console.log(HttpService.apiURL + HttpService.instantProjectURL,
      JSON.stringify(instantProject), HttpService.httpOptions);
    return this.http.post<InstantProject>(HttpService.apiURL + HttpService.instantProjectURL + HttpService.createInstantProjectURL,
      JSON.stringify(instantProject), HttpService.httpOptions);
  }

  createQuestion(questions: Questions, answers : Answer[]) {
    questions.answers=answers;
    console.log( JSON.stringify(questions));
    console.log("puto el que lo lea");
	  console.log(HttpService.apiURL + HttpService.questionURL,
      JSON.stringify(questions), HttpService.httpOptions);


    return this.http.post<Questions>(HttpService.apiURL + HttpService.questionURL + HttpService.createQuestionURL,
      JSON.stringify(questions), HttpService.httpOptions);
  }
  updateQuestion(questions: Questions, answers : Answer[],questId:string) {
    questions.answers=answers;
	  console.log( JSON.stringify(questions));
	  console.log(HttpService.apiURL + HttpService.questionURL,
      JSON.stringify(questions), HttpService.httpOptions);


    return this.http.put<Questions>(HttpService.apiURL + HttpService.questionURL + HttpService.updateQuestionURL+'/'+questId,
      JSON.stringify(questions), HttpService.httpOptions);
  }
  
  updateBiddingProject(biddingProject: BiddingProject, id :string ){
    console.log(biddingProject);
    console.log(biddingProject.id);
    return this.http.put<Object>(HttpService.apiURL + HttpService.biddingProjectURL + HttpService.updateBiddingProjectURL +'/'+ id,
    JSON.stringify(biddingProject), HttpService.httpOptions);
    
  }

  getQuestionsById(id: String) {
    return this.http.get<Questions>(HttpService.apiURL + '/questions/getQuestionById/' + id);
  }
  getAllQuestions() {
    return this.http.get<Questions[]>(HttpService.apiURL + HttpService.questionURL);
  }
  getAssignmentById(id: String) {
    return this.http.get<Assignment[]>(HttpService.apiURL + '/assignments/' + id);
  }
  getAllAssignments() {
    return this.http.get<Assignment[]>(HttpService.apiURL + HttpService.getAssignmentURL);
  }

  getTrainingAttemptsByState(state) {
    return this.http.post<TrainingAttempt[]>(HttpService.apiURL + HttpService.trainingAttemptsURL,
      JSON.stringify({ state1: state }), HttpService.httpOptions);
  }

  getDevelopingAttemptsByState(state) {
    return this.http.post<DevelopingAttempt[]>(HttpService.apiURL + HttpService.developingAttemptsURL,
      JSON.stringify({ state1: state }), HttpService.httpOptions);
  }

  createTrainingAttempt(trainingAttempt: TrainingAttempt) {
    return this.http.post<TrainingAttempt[]>(HttpService.apiURL + HttpService.trainingAttemptsURL,
      JSON.stringify(trainingAttempt), HttpService.httpOptions);
  }

  createDevelopingAttempt(developingAttempt: DevelopingAttempt) {
    return this.http.post<DevelopingAttempt[]>(HttpService.apiURL + HttpService.developingAttemptsURL,
      JSON.stringify(developingAttempt), HttpService.httpOptions);
  }

  getInvitationByUserAndState(id, state) {
    return this.http.post<Invitation[]>(HttpService.apiURL + HttpService.invitationsURL + '/getCurrentInvitation',
      JSON.stringify({ user: id, state: state}), HttpService.httpOptions);
  }

  updateInvitation(invitation, id: String){
    return this.http.put<Invitation>(HttpService.apiURL + HttpService.invitationsURL + '/' + id,
      JSON.stringify(invitation), HttpService.httpOptions);
  }

  getCertifications() {
    return this.http.get<Certification[]>(HttpService.apiURL + HttpService.certificationsURL + HttpService.getCertificationsURL);
  }

   //All services related to records
  createRecord(record: Record) {
    return this.http.post<any>(HttpService.apiURL + HttpService.recordsURL,
      JSON.stringify(record), HttpService.httpOptions);
  }

  getAllRecords() {
    return this.http.get<Record[]>(HttpService.apiURL + HttpService.recordsURL);
  }
  getRecordsByCompany(company: string) {
    return this.http.get<Record[]>(HttpService.apiURL + HttpService.recordsURL + '/' + company);
  }
  getRecordsByProject(project: string) {
    return this.http.get<Record[]>(HttpService.apiURL + HttpService.recordsURL + '/' + project);
  }
  getRecordsByFinishDateAndCompany(finishDate, company) {
    return this.http.post<Record>(HttpService.apiURL + HttpService.recordsURL + HttpService.getCurrentCompanyURL,
      JSON.stringify({company: company , finishDate: finishDate}), HttpService.httpOptions);
  }

  updateRecord(record, id: String){
    return this.http.post<Record>(HttpService.apiURL + HttpService.recordsURL + '/update/' + id,
      JSON.stringify(record), HttpService.httpOptions);
  }

  //All services related to Estimation
  createEstimation(estimation: Estimation) {
    return this.http.post<any>(HttpService.apiURL + HttpService.estimationURL,
      JSON.stringify(estimation), HttpService.httpOptions);
  }
  getEstimationByPMAndProject(projectManagerUsername, projectName) {
    return this.http.post<Estimation[]>(HttpService.apiURL + HttpService.estimationURL + HttpService.getEstimationByPMAndProjectURL,
      JSON.stringify({projectManagerUsername: projectManagerUsername , projectName: projectName}), HttpService.httpOptions);
  }
  getEstimationByProjectManagerUsernameAndState(projectManagerUsername, state) {
    return this.http.post<Estimation>(HttpService.apiURL + HttpService.estimationURL + HttpService.getEstimationsByPMAndStateURL,
      JSON.stringify({projectManagerUsername: projectManagerUsername , state: state}), HttpService.httpOptions);
  }

    // All services related to Invitations
    getinvitations() {
      return this.http.get<Invitation[]>(HttpService.apiURL + HttpService.invitationsURL);
    }
    createinvitations(invitation: Invitation) {
      return this.http.post<Invitation>(HttpService.apiURL + HttpService.invitationsURL ,
        JSON.stringify(invitation), HttpService.httpOptions);
    }
    getinvitationsByUserAndCompany(user, company){
      return this.http.post<Invitation>(HttpService.apiURL + HttpService.certificationURL + '/getCurrentInvitationCom/' ,
        JSON.stringify(user,company), HttpService.httpOptions);
    }
}
