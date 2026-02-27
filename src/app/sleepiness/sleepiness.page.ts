import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent,
         IonHeader,
         IonTitle,
         IonToolbar,
         IonRadio,
         IonRadioGroup,
         IonDatetime,
         IonFab,
         IonFabButton,
         IonButtons,
         IonButton,
         IonIcon,
         IonModal,
         RadioGroupChangeEventDetail,
         IonItem,
         IonList,
         IonLabel } from '@ionic/angular/standalone';

import { addIcons } from 'ionicons';
import { add } from 'ionicons/icons';

import { OverlayEventDetail } from '@ionic/core/components';
import { SleepService } from '../services/sleep.service';
import { StanfordSleepinessData } from '../data/stanford-sleepiness-data';

@Component({
  selector: 'app-sleepiness',
  templateUrl: './sleepiness.page.html',
  styleUrls: ['./sleepiness.page.scss'],
  standalone: true,
  imports: [IonContent,
            IonHeader,
            IonTitle,
            IonToolbar,
            CommonModule,
            FormsModule,
            IonRadio,
            IonRadioGroup,
            IonDatetime,
            IonFab,
            IonFabButton,
            IonButtons,
            IonButton,
            IonIcon,
            IonModal,
            IonItem,
            IonList,
            IonLabel]
})
export class SleepinessPage implements OnInit {
  private formatForIonDatetime(d: Date) {
		const pad = (n: number) => n.toString().padStart(2, '0');
		return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
	}

  private getCurrentDatetimeString() {
    const now = new Date();
    return this.formatForIonDatetime(now);
  }

  hasSelected = false;

  sleepinessStats = {
    time: this.getCurrentDatetimeString(),
    score: undefined
  }

  constructor(public sleepService:SleepService) {
    addIcons({ add });
  }

  ngOnInit() {
    console.log(this.allSleepinessData);
  }

  get allSleepinessData() {
    return SleepService.AllSleepinessData.sort((a, b) => b.loggedAt.getTime() - a.loggedAt.getTime());
  }

  onWillDismiss(event: CustomEvent<OverlayEventDetail>) {
    this.sleepinessStats.time = this.getCurrentDatetimeString();
    this.sleepinessStats.score = undefined;
    
    if (event.detail.role === 'confirm') {
      const data = event.detail.data;
      const time = new Date(data.time);

      var sleepinessData = new StanfordSleepinessData(Number(data.score), time);
      this.sleepService.logSleepinessData(sleepinessData);
    }
  }

  onRadioSelected(event: CustomEvent<RadioGroupChangeEventDetail>) {
    this.hasSelected = event.detail.value != undefined;
  }

}
