import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
	IonHeader,
	IonToolbar,
	IonTitle,
	IonContent,
	IonDatetime,
	IonModal,
	IonFab,
	IonFabButton,
	IonIcon,
	IonButtons,
	IonButton,
	IonInput,
	IonList,
	IonItem,
	IonPopover,
	IonLabel } from '@ionic/angular/standalone';
import { SleepService } from '../services/sleep.service';
import { SleepData } from '../data/sleep-data';
import { OvernightSleepData } from '../data/overnight-sleep-data';
import { StanfordSleepinessData } from '../data/stanford-sleepiness-data';
import { OverlayEventDetail } from '@ionic/core/components';

import { addIcons } from 'ionicons';
import { add } from 'ionicons/icons';
import { SelectorContext } from '@angular/compiler';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  imports: [CommonModule,
			FormsModule,
			IonHeader,
			IonToolbar,
			IonTitle,
			IonContent,
			IonDatetime,
			IonModal,
			IonFab,
			IonFabButton,
			IonIcon,
			IonButtons,
			IonButton,
			IonInput,
			IonList,
			IonItem,
			IonPopover,
			IonLabel],
})
export class HomePage {
	private formatForIonDatetime(d: Date) {
		const pad = (n: number) => n.toString().padStart(2, '0');
		return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
	}

	private getStartingSleptAt() {
		const d = new Date();
		d.setDate(d.getDate() - 1);
		d.setHours(22, 0, 0, 0);
		return this.formatForIonDatetime(d);
	}

	private getStartingWokeAt() {
		const d = new Date();
		d.setHours(6, 0, 0, 0);
		return this.formatForIonDatetime(d);
	}
	
	sleepTime = {
		sleptAt: this.getStartingSleptAt(),
		wokeAt: this.getStartingWokeAt()
	};

	constructor(public sleepService:SleepService) {
		addIcons({ add });
	}

	ngOnInit() {
		console.log(this.allOvernightData);
	}

	/* Ionic doesn't allow bindings to static variables, so this getter can be used instead. */
	get allOvernightData() {
		return SleepService.AllOvernightData.sort((a, b) => b.loggedAt.getTime() - a.loggedAt.getTime());
	}

	onSleptAtChanged(value: string) {
		const d = new Date(value);

		const hours = d.getHours();
		const today = new Date();

		const current = new Date(this.sleepTime.sleptAt);

		if (hours < 12) {
			const isYesterday =
				current.getDate() === today.getDate() - 1 &&
				current.getMonth() === today.getMonth() &&
				current.getFullYear() === today.getFullYear();

			if (isYesterday) {
				current.setDate(current.getDate() + 1);
				current.setHours(hours, d.getMinutes(), 0, 0);

				this.sleepTime.sleptAt = this.formatForIonDatetime(current);
			}
		}
	}

	onWillDismiss(event: CustomEvent<OverlayEventDetail>) {
		this.sleepTime.sleptAt = this.getStartingSleptAt();
		this.sleepTime.wokeAt = this.getStartingWokeAt();
		
		if (event.detail.role === 'confirm') {
			const data = event.detail.data;
			const sleptAt = new Date(data.sleptAt);
			const wokeAt = new Date(data.wokeAt);

			var nightSleepData = new OvernightSleepData(sleptAt, wokeAt);
			this.sleepService.logOvernightData(nightSleepData);
		}
	}
}
