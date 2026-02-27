import { Injectable } from '@angular/core';
import { SleepData } from '../data/sleep-data';
import { OvernightSleepData } from '../data/overnight-sleep-data';
import { StanfordSleepinessData } from '../data/stanford-sleepiness-data';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class SleepService {
	private static LoadDefaultData:boolean = false;
	public static AllSleepData:SleepData[] = [];
	public static AllOvernightData:OvernightSleepData[] = [];
	public static AllSleepinessData:StanfordSleepinessData[] = [];

	constructor(private storage: StorageService) {
		if(SleepService.LoadDefaultData) {
			this.addDefaultData();
			SleepService.LoadDefaultData = false;
		}
		this.loadFromStorage();
	}

	async loadFromStorage() {
		const rawSleep = await this.storage.get('sleep', 'all') || [];
		const rawOvernight = await this.storage.get('overnight', 'data') || [];
		const rawSleepiness = await this.storage.get('sleepiness', 'data') || [];

		SleepService.AllOvernightData = rawOvernight.map((o: any) => OvernightSleepData.fromJSON(o));
		SleepService.AllSleepinessData = rawSleepiness.map((o: any) => StanfordSleepinessData.fromJSON(o));

		SleepService.AllSleepData = [
			...SleepService.AllOvernightData,
			...SleepService.AllSleepinessData
		];
	}

	private addDefaultData() {
		var goToBed = new Date();
		goToBed.setDate(goToBed.getDate() - 1); //set to yesterday
		goToBed.setHours(1, 3, 0); //1:03am
		var wakeUp = new Date();
		wakeUp.setTime(goToBed.getTime() + 8 * 60 * 60 * 1000); //Sleep for exactly eight hours, waking up at 9:03am
		this.logOvernightData(new OvernightSleepData(goToBed, wakeUp)); // add that person was asleep 1am-9am yesterday
		var sleepinessDate = new Date();
		sleepinessDate.setDate(sleepinessDate.getDate() - 1); //set to yesterday
		sleepinessDate.setHours(14, 38, 0); //2:38pm
		this.logSleepinessData(new StanfordSleepinessData(4, sleepinessDate)); // add sleepiness at 2pm
		goToBed = new Date();
		goToBed.setDate(goToBed.getDate() - 1); //set to yesterday
		goToBed.setHours(23, 11, 0); //11:11pm
		wakeUp = new Date();
		wakeUp.setTime(goToBed.getTime() + 9 * 60 * 60 * 1000); //Sleep for exactly nine hours
		this.logOvernightData(new OvernightSleepData(goToBed, wakeUp));
	}

	public async logOvernightData(sleepData:OvernightSleepData) {
		SleepService.AllSleepData.push(sleepData);
		SleepService.AllOvernightData.push(sleepData);
		console.log(SleepService.AllOvernightData);

		await this.storage.set('overnight', 'data', SleepService.AllOvernightData);
		await this.storage.set('sleep', 'all', SleepService.AllSleepData);
	}

	public async logSleepinessData(sleepData:StanfordSleepinessData) {
		SleepService.AllSleepData.push(sleepData);
		SleepService.AllSleepinessData.push(sleepData);

		await this.storage.set('sleepiness', 'data', SleepService.AllSleepinessData);
		await this.storage.set('sleep', 'all', SleepService.AllSleepData);
	}
}
