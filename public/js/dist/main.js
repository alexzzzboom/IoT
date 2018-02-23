'use strict';var map,homeMarker,userMarker;window.Event=new Vue,Vue.component('mapmodal',{data:function data(){return{homelocation:{},userlocation:{}}},mounted:function mounted(){initMap(),Event.$on('reloadMap',function(a){setTimeout(function(){google.maps.event.trigger(map,'resize'),a&&a.location&&map.panTo(a.location)},100)})},template:'<div class="modal is-active">\n    <div class="modal-background" @click="$emit(\'close\')"></div>\n    <div class="modal-content">\n    <div class="modalMap notification is-info">\n    <section id="map" class="map">Loading map...</section>\n    </div></div>\n    <button class="modal-close is-large" aria-label="close" @click="$emit(\'close\')"></button>\n    </div>'}),Vue.component('userbox',{props:['username','index','distance'],data:function data(){return{userDistance:1e3}},computed:{isUserNearby:function isUserNearby(){return 0<this.userDistance&&this.userDistance<100}},mounted:function mounted(){var a=this;this.userDistance=this.distance,socket.on('userLocation',function(b){if(b.username==a.username){var c=100,d=b.distance<c&&!(0<a.userDistance&&a.userDistance<c)&&b.distance<a.userDistance;if(d){var e=a.username+' just arrived at home!';iziToast.success({title:e,timeout:1e4}),new Notification(e)}a.userDistance=b.distance,console.log(b.location),window.Event.$emit('updateMarker',{username:a.username,index:a.index,position:{lat:b.location.latitude,lng:b.location.longitude}})}})},template:'<div class="column is-narrow">\n    <div :class="{\'is-danger\':!isUserNearby,\'is-success\':isUserNearby}" class="notification">\n    <span class="icon littleMargin">\n    <i class="fa  fa-map-marker fa-2x"></i>\n    </span>\n    {{username}} is <strong>{{userDistance}}</strong> meters away from home!\n    </div></div>'}),Vue.component('usersarea',{data:function data(){return{users:[],mapModal:!1}},methods:{showMap:function showMap(a,b){this.mapModal=!0,this.currentUser=a,userMarker.setPosition(this.users[b].position),Event.$emit('reloadMap',{location:this.users[b].position})},hideModal:function hideModal(){this.mapModal=!1}},mounted:function mounted(){var a=this;Event.$on('updateMarker',function(b){a.users[b.index].position=b.position,a.currentUser===b.username&&(userMarker.setPosition(b.position),map.panTo(b.position)),Event.$emit('reloadMap')}),socket.on('userLocation',function(b){console.log('Dater are '+a.users.findIndex(function(a){return a.username===b.username})),-1===a.users.findIndex(function(a){return a.username===b.username})&&a.users.push({username:b.username,distance:b.distance,position:{lat:b.location.latitude,lng:b.location.longitude}})})},template:'<div>\n    <mapmodal v-show="mapModal" @close="hideModal"></mapmodal>\n    <section class="columns usersArea">\n        <template  v-for="(user,index) of users">\n            <userbox :username="user.username" :index="index" :distance="user.distance" @click.native="showMap(user.username,index)"></userbox>\n        </template>\n    </section>\n    </div>'}),Vue.component('device',{props:{deviceId:{type:Number,required:!0},iconClass:String,meters:{type:Number,default:0},temp:{type:Number,default:0},enabled:{type:Boolean,default:!1}},data:function data(){return{isDeviceEnabled:this.enabled,isLoading:!1}},computed:{statusText:function statusText(){return this.isDeviceEnabled?'Device Enabled':'Device Disabled'},buttonText:function buttonText(){return this.isDeviceEnabled?' Disable':'Instant Enable'},statusClass:function statusClass(){return this.isDeviceEnabled?'has-text-success':'has-text-danger'}},methods:{changeDeviceStatus:function changeDeviceStatus(){var a=this;this.isLoading=!0,iziToast.success({title:'Changing LED status',message:'In the actual project, available on github, the LED on Rapberry Pi will change status. Now the status will be change after this notification',timeout:15000,position:'bottomCenter',pauseOnHover:!1}),setTimeout(function(){a.isLoading=!1,a.isDeviceEnabled=!a.isDeviceEnabled},15000)}},template:'<div class="tile is-child box notification is-warning">\n    <p class="title"><slot></slot></p>\n    <div class="columns">\n        <div class="column centeredElements">\n            <span class="icon">\n            <i class="fa fa-5x" :class="iconClass"></i>\n            </span>\n            <p class="title has-text-centered" :class="statusClass">{{statusText}}</p>\n        </div>\n        <div class="column">\n            <p>\u0397 \u03C3\u03C5\u03C3\u03BA\u03B5\u03C5\u03AE \u03B5\u03BD\u03B5\u03C1\u03B3\u03BF\u03C0\u03BF\u03B9\u03AE\u03C4\u03B5 \u03B1\u03C5\u03C4\u03CC\u03BC\u03B1\u03C4\u03B1 \u03CC\u03C4\u03B1\u03BD:</p>\n            <p v-if="meters > 0">O \u03C7\u03C1\u03AE\u03C3\u03C4\u03B7\u03C2 \u03B5\u03AF\u03BD\u03B1\u03B9 <strong>{{meters}}</strong> \u03BC\u03AD\u03C4\u03C1\u03B1 \u03BC\u03B1\u03BA\u03C1\u03B9\u03AC \u03B1\u03C0\u03CC \u03C4\u03BF \u03C3\u03C0\u03AF\u03C4\u03B9.</p>\n            <p v-if="temp > 0">\u0397 \u03B8\u03B5\u03C1\u03BC\u03BF\u03BA\u03C1\u03B1\u03C3\u03AF\u03B1 \u03BA\u03AC\u03C4\u03C9 \u03B1\u03C0\u03CC <strong>{{temp}}</strong> \u03B2\u03B1\u03B8\u03BC\u03BF\u03CD\u03C2 \u03BA\u03B5\u03BB\u03C3\u03AF\u03BF\u03C5</p>\n            <p class="topMargin"><button class="button is-large is-success is-outlined is-inverted" :class="{\'is-loading\':isLoading}" @click="changeDeviceStatus">{{buttonText}}</button></p>\n        </div>\n    </div>\n</div>'}),Vue.component('video-area',{props:['cssClasses','imageUrl','camId'],data:function data(){return{dateStamp:0,activeCapture:!1,image:''}},template:'<div class="tile is-child box notification is-info">\n    <p class="title">Capture</p>\n    <p><slot></slot><strong>{{imageDate}}</strong></p>\n    <figure :class="cssObj">\n        <img :src="image">\n    </figure>\n    <p class="topMargin has-text-centered"><button class="button is-large is-warning is-outlined is-inverted" @click="startCapture" :disabled="activeCapture">{{buttonText}}</button></p>\n</div>',created:function created(){this.image=this.imageUrl},methods:{startCapture:function startCapture(){var a=this;this.dateStamp=parseInt(Date.now()),this.activeCapture=!0,iziToast.success({title:'Live capture',message:'In the actual project, available on github, the capture from cameras on Raspberry Pi is showing',timeout:1e4,position:'bottomCenter',pauseOnHover:!1}),setTimeout(function(){a.activeCapture=!1},1e4)}},computed:{cssObj:function cssObj(){return this.cssClasses.split(' ').reduce(function(a,b){return a[b]=!0,a},{})},getImageURL:function getImageURL(){return this.imageUrl+'?d='+this.dateStamp},imageDate:function imageDate(){return 0<this.dateStamp?moment(this.dateStamp).calendar():''},buttonText:function buttonText(){return this.activeCapture?'Live capture':'Start capture'}}});function askReport(){}function listen(){}function initMap(){var a={lat:35.32098178540996,lng:25.10274052619934};map=new google.maps.Map(document.getElementById('map'),{center:a,zoom:14}),homeMarker=new google.maps.Marker({map:map,position:a,icon:'/public/img/house-icon.png'}),userMarker=new google.maps.Marker({map:map,title:'Your position'}),console.log('Map i showing!!')}var app=new Vue({el:'#root',data:{raspberryConnected:!1,temperature:0,humidity:0,currentUser:'',loading:!0},created:function created(){listen.call(this)},mounted:function mounted(){askReport(),this.loading=!1,window.Notification&&'denied'!==Notification.permission&&'granted'!==Notification.permission&&Notification.requestPermission().then(function(a){'denied'===a&&iziToast.warning({title:'Notifications',message:'It\'s Ok you still can watch these notifications\n                                 and can enable the browser\'s web notifications later by click the page options left to addrees bar',timeout:15000,position:'topLeft'})})},methods:{raspberryStatus:function raspberryStatus(){var a=this;iziToast.success({title:'Changing Raspberry Pi status',message:'In the actual project, available on github, the status of Rapberry Pi is showing. Now the status will be change after this notification',timeout:1e4,position:'bottomCenter',pauseOnHover:!1}),setTimeout(function(){a.raspberryConnected=!a.raspberryConnected},1e4)},temperatureStatus:function temperatureStatus(){var a=this;iziToast.success({title:'Weather data value',message:'In the actual project, available on github, the value of sensors on Rapberry Pi is showing. Now the value will be incresead by 10 after this notification',timeout:1e4,position:'bottomCenter',pauseOnHover:!1}),setTimeout(function(){a.temperature+=10,a.humidity+=10},1e4)}}});