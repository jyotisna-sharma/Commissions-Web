import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AuthenticationUrlService } from '../../../authentication/authentication-url.service';
import { IdleTimeoutService } from '../../idle-timeout.service'
import { Subject, BehaviorSubject } from 'rxjs';
export interface PopUpData {
  minutes: string;
}
@Component({
  selector: 'app-show-session-popup',
  templateUrl: './show-session-popup.component.html',
  styleUrls: ['./show-session-popup.component.scss']
})
export class ShowSessionPopupComponent implements OnInit {
  timeoutHandle: any;
  timer: any;
  timeOut: boolean;
  public gettime = new BehaviorSubject<boolean>(false);
  countdown = (minutes): void => {
    const that = this;
    let seconds = 60;
    if ((minutes * 60) < 60) {
      seconds = (minutes * 60);
      minutes = 1;
    }
    const mins = minutes;
    function tick() {
      const current_minutes = mins - 1;
      seconds--;
      that.timer = current_minutes.toString() + ':' + (seconds < 10 ? '0' : '') + String(seconds);
      if (seconds > 0) {
        that.timeoutHandle = setTimeout(tick, 1000);
      } else {
        if (mins > 1) {
          setTimeout(function () {
            that.countdown(mins - 1);
          }, 1000);
        } else if (that.timer === '0:00') {
         that.dialogRef.close(false);
        }
      }
    }
    tick();
  }
  Restoresession() {
    if (this.timer === '0:00') {
      this.router.navigate([this.authenticateURL.PageRoute.loginPageRoute]);
      localStorage.clear();
    }
  }
  constructor(
    public dialogRef: MatDialogRef<ShowSessionPopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: PopUpData,
    private router: Router,
    private authenticateURL: AuthenticationUrlService,
    // private abc: IdleTimeoutService
  ) {
    this.countdown(data.minutes || 5)
  }

  ngOnInit() {
  }
}
