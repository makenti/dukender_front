// import { Component, OnInit } from '@angular/core';
// import { Router, ActivatedRoute } from '@angular/router';
// import { ToastyService } from 'ng2-toasty';
// // import { YaMap }  from '../map/directives/ymap';

// import * as moment from 'moment';

// import { AuthService, ProposalService } from '../../services/index';

// @Component({
//   selector: 'proposal-print',
//   templateUrl: 'proposal.print.html',
//   styleUrls: ['proposal.print.css'],
//   providers: [ AuthService, ProposalService ]
// })

// export class ProposalPrintComponent implements OnInit  {

// 	private errorMessage = new Array();
// 	private proposal: any = null;
//   private key: string;
//   private proposalItems = new Array();
//   private deliveryDate: any = '';
//   private deliveryDateText: any = '';
//   private proposalDate: any = '';
//   private customerAddress: any = '';

//   constructor(
//   	private auth: AuthService,
//   	private router: Router,
//     private route: ActivatedRoute,
//   	private proposalService: ProposalService,
//     private toastyService: ToastyService) {}

//   ngOnInit() {
//     this.route.params.subscribe(params => {
//       this.key = params['key'];
//       this.getProposal();
//     });
//     this.getProposal();
//   }

//   getProposal() {
//     let data = {
//       key: this.key
//     };
//     this.proposalService.getProposalByKey(data)
//         .subscribe(
//           resp => {
//             if(resp === null) {
//               console.log('no request');
//             }else {
//               this.proposal = resp;
//               this.proposalItems = [];

//               if(resp.create_time !== '')
//                 this.proposalDate = moment(parseInt(resp.create_time, 10)/1000).format('DD.MM.YYYY');

//               if(resp.delivery_time !== '') {
//                 this.deliveryDate = moment(parseInt(resp.delivery_time, 10)).toDate();
//                 this.deliveryDateText = moment(this.deliveryDate).format('DD.MM.YYYY');
//               }

//               if(resp.customer !== '')
//                 this.customerAddress =  resp.customer.district.region.name + ' ' +
//                                         resp.customer.district.name + ' ' +
//                                         resp.customer.address;
//               for( let item of resp.items) {
//                 let p = {
//                   item_id: item.item_id,
//                   count: item.count,
//                   price: item.price,
//                   name: item.name,
//                   nomenclature: item.nomenclature
//                 };
//                 this.proposalItems.push(p);
//               }
//             }
//           },
//           error =>  this.errorMessage = <any>error
//         );
//   }

//   onPrintProposal() {
//     let printContents: any, popupWin: any;
//     printContents = document.getElementById('proposalPrintContent').innerHTML;
//     popupWin = window.open('', '_blank', 'top=0,left=0,height=100%, width=auto');
//     popupWin.document.open();
//     popupWin.document.write(`
//       <!DOCTYPE html>
//       <html>
//         <head>
//           <title>Заявка</title>
//           <meta name='viewport' content='width=device-width, initial-scale=1, maximum-scale=1'>
//           <script src='https://api-maps.yandex.ru/2.0-stable/?load=package.standard&lang=ru-RU' type='text/javascript'></script>
//           <style>
//             body {
//               font-size: 16px;
//               font-family: 'Open Sans', sans-serif;
//               font-weight: normal;
//               font-style: normal;
//               font-stretch: normal;
//               -webkit-font-smoothing: antialiased;
//               -moz-osx-font-smoothing: grayscale;
//             }
//             .no-print{display:none}
//             .show-print{display:block}
//             table{
//               border: 1px solid #111;
//               border-collapse: collapse;
//             }
//             table th, table td {padding: 4px 10px;border: 1px solid black;}
//             .proposal-print-field{margin: 5px 0;}
//             .print-proposal-table{margin-top: 10px;}
//             #map {
//               width: 600px;
//               height: 300px;
//               display: block;
//               margin-top: 20px;
//             }
//           </style>
//         </head>
//         <body onload='onLoadBody()' >
//           ${printContents}
//           <p>Адрес доставки на карте</p>
//           <ya-map id='map'></ya-map>
//           <script type='text/javascript'>
//             ymaps.ready(init);
//             var myMap;
//             console.log(window.localStorage)
//             function init(){
//               myMap = new ymaps.Map ('map', {
//                 center: [${this.proposal.customer.latitude}, ${this.proposal.customer.longitude}],
//                 zoom: 12
//               });
//               myPlacemark = new ymaps.Placemark([${this.proposal.customer.latitude}, ${this.proposal.customer.longitude}], {
//                 hintContent: 'пункт доставки',
//                 balloonContent: 'пункт доставки'
//               });
//               myMap.geoObjects.add(myPlacemark);
//             }
//             function onLoadBody() {
//               setInterval(function() { window.print();window.close() }, 1000)
//             }
//           </script>
//         </body>
//       </html>`
//     );
//     popupWin.document.close();
//   }

// }
