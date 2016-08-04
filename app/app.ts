import {Component, ViewChild} from '@angular/core';
import {ionicBootstrap, App, Events, Platform, Nav, MenuController, Alert} from 'ionic-angular';
import {StatusBar, Splashscreen} from 'ionic-native';
import {TabsPage} from './pages/tabs/tabs';
import {FirstDevicePage} from './pages/first-device/first-device';

import {DevicesData} from './providers/devices-data';

interface PageObj {
    title: string;
    component: any;
    icon: string;
    index?: number;
}

@Component({
    templateUrl: 'build/app.html'
})
class ConferenceApp {
    @ViewChild(Nav) nav: Nav;

    appPages: PageObj[] = [
        { title: 'Device', component: TabsPage, index: 0, icon: 'cube' },
        { title: 'About', component: TabsPage, index: 1, icon: 'information-circle' },
    ];
    rootPage: any = TabsPage;
    loading_alert: any;
    updating_alert: any;

    constructor(
        private events: Events,
        private menu: MenuController,
        platform: Platform,
        private data: DevicesData
    ) {
        // Call any initial plugins when ready
        platform.ready().then(() => {
            StatusBar.styleDefault();
            Splashscreen.hide();
        });

        this.listenToEvents();
    }

    openPage(page: PageObj) {
        // the nav component was found using @ViewChild(Nav)
        // reset the nav to remove previous pages and only have this page
        // we wouldn't want the back button to show in this scenario
        if (page.index) {
            this.nav.setRoot(page.component, {tabIndex: page.index});
        } else {
            this.nav.setRoot(page.component);
        }
    }

    listenToEvents() {
        this.events.subscribe('data:loading-start', () => {
            this.loadingStart();
        });

        this.events.subscribe('data:loading-finish', () => {
            this.loadingFinish();
        });

        this.events.subscribe('data:updating-start', () => {
            this.updatingStart();
        });

        this.events.subscribe('data:updating-success', () => {
            this.updatingSuccess();
        });

        this.events.subscribe('data:updating-error', () => {
            this.updatingError();
        });
    }

    loadingStart() {
        this.loading_alert = Alert.create({
            title: 'Loading...'
        });
        this.nav.present(this.loading_alert);
    }

    loadingFinish() {
        if (this.loading_alert) {
            this.loading_alert.dismiss(0);
            this.loading_alert = null;
        }
    }

    updatingStart() {
        this.updating_alert = Alert.create({
            title: 'Updating...'
        });
        this.nav.present(this.updating_alert);
    }

    updatingSuccess() {
        if (this.updating_alert) {
            this.updating_alert.dismiss(0);
            this.updating_alert = null;
        }
    }
    updatingError() {
        if (this.updating_alert) {
            this.updating_alert.dismiss(0).then(() => { 
                this.updating_alert = null;
                let alert = Alert.create({
                    title: 'Requst Failed',
                    subTitle: 'Please try again',
                    buttons: ['Close']
                });
                this.nav.present(alert);
            });
            
        }
    }
}

ionicBootstrap(ConferenceApp, [DevicesData], {
    tabbarPlacement: 'bottom'
});
