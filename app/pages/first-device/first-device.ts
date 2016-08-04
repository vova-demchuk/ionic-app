import {Page, NavController, Alert, Events} from 'ionic-angular';
import * as noUiSlider from 'nouislider';

import {DevicesData} from '../../providers/devices-data';

@Page({
	templateUrl: 'build/pages/first-device/first-device.html'
})
export class FirstDevicePage {
	initialDevice: any = {
		parametersList: {
			lamp: {
				Value: 0
			},
			light_sensor: {
				Value: 0
			},
			servo: {
				Value: 0
			},
			custom1: {
				Value: 0
			}
		}
	}
	light: boolean = false;
	custom1: boolean = false;
	device: any = this.initialDevice;
	servo: any = {
		min: 0,
		max: 180
	}
	slider: any;
	timer: any;

	constructor(private nav: NavController, private events: Events, private devicesData: DevicesData) {}

	onPageDidEnter() {
		setTimeout(() => {
			this.loadDevice();
		}, 500);
		this.createSlider();
	}
	onPageDidUnload() {
		this.removeLoadingTimer();
	}

	loadDevice() {
		this.events.publish('data:loading-start');
		this.devicesData.getFirstDevice().subscribe(
			device => {
				for (let prop in device) {
					this.device[prop] = device[prop];
				}
				this.devicesData.getParameters(device.Parameters).subscribe(
					parameters => {
						parameters.map((item, index) => {
							if (item.Name == 'lamp' || item.Name == 'light_sensor' || item.Name == 'servo' || item.Name == 'custom1') {
								this.device.parametersList[item.Name] = item;
							}
						});
						this.light = this.device.parametersList.lamp.Value == 1 ? true : false;
						this.custom1 = this.device.parametersList.custom1.Value == 1 ? true : false;
						this.updateSliderValue(this.device.parametersList.servo.Value);
						this.events.publish('data:loading-finish');
						this.createLoadingTimer();
					},
					error => {
						this.events.publish('data:loading-finish');
					});
			},
			error => {
				this.events.publish('data:loading-finish');
				this.device = this.initialDevice;
			});
	}

	createSlider() {
		let element = document.getElementById('slider-servo');

		this.slider = noUiSlider.create(element, {
			start: [0],
			step: 1,
			range: {
				'min': [this.servo.min],
				'max': [this.servo.max]
			}
		});
		this.slider.on('update', (values, handle, unencoded, tap, positions) => {
			this.device.parametersList.servo.Value = parseInt(values[0]);
		});
		this.slider.on('change', (values, handle, unencoded, tap, positions) => {
			if ( !this.device.parametersList.servo.Id ) return;
			this.device.parametersList.servo.Value = parseInt(values[0]);
			this.changeParameter(this.device.parametersList.servo);
		});
	}

	updateSliderValue(value) {
		this.slider.set(parseInt(value));
	}

	changeLight(event) {
		this.light = event.checked;
		this.device.parametersList.lamp.Value = this.light ? 1 : 0;
		this.changeParameter(this.device.parametersList.lamp);
	}

	changeCustom1(event) {
		this.custom1 = event.checked;
		this.device.parametersList.custom1.Value = this.custom1 ? 1 : 0;
		this.changeParameter(this.device.parametersList.custom1);
	}

	changeParameter(parameter) {
		this.events.publish('data:updating-start');
		this.devicesData.updateParameter(parameter).subscribe(
			resp => {
				this.events.publish('data:updating-success');
			},
			error => {
				this.events.publish('data:updating-error');
			});
	}

	createLoadingTimer() {
		this.timer = setInterval(() => {
			this.loadLightSensor();
		}, 1000);
	}

	removeLoadingTimer() {
		clearInterval(this.timer);
		this.timer = null;
	}

	loadLightSensor() {
		this.devicesData.getParameter(this.device.parametersList.light_sensor).subscribe(
			parameter => {
				this.device.parametersList.light_sensor = parameter;
			});
	}
}
