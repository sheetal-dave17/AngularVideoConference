import {Component, OnInit, Inject} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {DOCUMENT} from '@angular/common';

import {ZoomMtg} from '@zoomus/websdk';

ZoomMtg.preLoadWasm();
ZoomMtg.prepareJssdk();

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit {

  // setup your signature endpoint here: https://github.com/zoom/websdk-sample-signature-node.js
  API = 'http://gospelaliveministry.letsassist.biz/api/webinar';
  // API = 'http://localhost:3000/api/webinar';
  signatureEndpoint = `${this.API}/generateSignature`;
  apiKey = 'RDARoSITS8WAoPXgjo89ww';
  meetingNumber = 2555350037;
  role = 1;
  leaveUrl = 'http://104.198.247.176/gospel-webinar/';
  userName = 'Test';
  userEmail = '';
  passWord = '3Mk2Ki';
  meetings: [];

  constructor(public httpClient: HttpClient, @Inject(DOCUMENT) document) {
  }

  ngOnInit(): void {
    this.getMeetings();
  }

  getSignature(meetingId, role): void {
    this.httpClient.post(this.signatureEndpoint, {
      meetingNumber: this.meetingNumber,
      role: this.role
    }).toPromise().then((data: any) => {
      if (data.signature) {
        console.log(data.signature);
        this.startMeeting(data.signature);
      } else {
        console.log(data);
      }
    }).catch((error) => {
      console.log(error);
    });
  }

  startMeeting(signature): void {
    document.getElementById('zmmtg-root').style.display = 'block';
    ZoomMtg.init({
      leaveUrl: this.leaveUrl,
      isSupportAV: true,
      success: (success) => {
        console.log(success);
        ZoomMtg.join({
          signature,
          meetingNumber: this.meetingNumber,
          userName: this.userName,
          apiKey: this.apiKey,
          userEmail: this.userEmail,
          passWord: this.passWord,
          // tslint:disable-next-line:no-shadowed-variable
          success: (success) => {
            console.log(success);
          },
          error: (error) => {
            console.log(error);
          }
        });

      },
      error: (error) => {
        console.log(error);
      }
    });
  }

  createMeeting(meetingPayload): void {
    this.httpClient.post(`${this.API}/schedule-meeting`, meetingPayload
    ).toPromise().then((data: any) => {
      this.getMeetings();
    }).catch((error) => {
      console.log(error);
    });
  }

  getMeetings(): void {
    this.httpClient.get(`${this.API}/list-meetings`)
      .toPromise().then((data: any) => {
      this.meetings = data.meetings.meetings;
    }).catch((error) => {
      console.log(error);
    });
  }
}

