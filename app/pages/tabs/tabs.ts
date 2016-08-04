import {Page, NavParams} from 'ionic-angular';
import {FirstDevicePage} from '../first-device/first-device';
import {SecondDevicePage} from '../second-device/second-device';
import {ActionsPage} from '../actions/actions';
import {AboutPage} from '../about/about';


@Page({
  templateUrl: 'build/pages/tabs/tabs.html'
})
export class TabsPage {
  // set the root pages for each tab
  tab1Root: any = FirstDevicePage;
  tab2Root: any = AboutPage;
  mySelectedIndex: number;

  constructor(navParams: NavParams) {
    this.mySelectedIndex = navParams.data.tabIndex || 0;
  }
}
