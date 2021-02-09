import jquery from 'jquery';
window.jQuery = jquery;
window.$ = jquery;
require( 'datatables.net' )( window, $ )
require( 'datatables.net-dt' )( window, $ )

import underscore from 'underscore';
window.underscore = underscore;
window._ = underscore;

import '../public/vendor/js/popper.min.js'
import '../public/vendor/js/bootstrap.min.js'
import { csv } from 'd3-request'
import { json } from 'd3-request'

import '../public/vendor/css/bootstrap.min.css'
import '../public/vendor/css/dc.css'
import '/scss/main.scss';

import Vue from 'vue';
import Loader from './components/Loader.vue';
import ChartHeader from './components/ChartHeader.vue';


// Data object - is also used by Vue

var vuedata = {
  page: 'meps',
  loader: true,
  showInfo: true,
  showShare: true,
  showAllCharts: true,
  maxDeclarationsDeclated: 0,
  chartMargin: 40,
  organizations: {},
  charts: {
    map: {
      title: 'DÉPARTEMENTS',
      info: 'Nombre de parlementaires par département, à l’exception de l’Île-de-France et des DOM-TOM (nombres totaux). Cliquez sur le département qui vous intéresse pour voir le nombre de parlementaires concernés.'
    },
    party: {
      title: 'PARTIS POLITIQUES',
      info: 'Répartition des responsables publics en fonction de leur appartenance politique, selon les données des parlements français et européens au 3 juillet 2020. Cliquez sur les différents secteurs pour voir le nombre de parlementaires concernés.'
    },
    activities: {
      title: 'ACTIVITÉS ANNEXES CONSERVÉES',
      info: 'Répartition des mandats électifs, activités professionnelles conservées et fonctions bénévoles toujours en cours déclarées par les responsables publics. La mise à jour par les responsables publics de la mention "conservée" est malheureusement rare ce qui peut rendre certaines déclarations obsolètes.'
    },
    mandate: {
      title: 'FONCTION',
      info: 'Type de mandat occupé par le décideur public.'
    },
    gender: {
      title: 'HOMMES/FEMMES',
      info: ''
    },
    declarationsNumber: {
      title: 'Nombre de déclarations déposées',
      info: ''
    },
    mainTable: {
      chart: null,
      type: 'table',
      title: 'Activités annexes conservées des responsables publics',
      info: 'Click on any meeting for additional information.'
    }
  },
  selectedElement: { "P": "", "Sub": ""},
  colors: {
    parties: {
      "PRG":"#ECB050",
      "FG":"#DB6A1F",
      "PCF":"#DB6A1F",
      "FG/PCF":"#DB6A1F",
      "PS":"#C12E41",
      "Groupe SRC":"#C12E41",
      "PS/SRC":"#C12E41",
      "EELV":"#05a61e",
      "UDE":"#05a61e",
      "EELV/UDE":"#05a61e",
      "UDI":"#8C1456",
      "EFDD":"#5eced6",
      "PPE":"#0a3e63",
      "ECR":"#3086c2",
      "NA/NI":"#cccccc",
      "FN":"#000000",
      "Groupe GDR":"#A1480D",
      "Group RRDP":"#800c00",
      "Others":"#BBBBBB",
      "Autres":"#BBBBBB",
      "Array":"pink",
      "REM":"#f6cb00",
      "LR":"#0a3e63",
      "MoDem":"#ff9205",
      "LC":"#48d4f7",
      "NG":"#fcafc5",
      "FI":"#ff4541",
      "GDR":"#c21410",
      "NI":"#656565",
      "LFI":"#dd0000",
      "RN":"#5599ee",
      "UDRL":"#4c2082",
      "":"#BBBBBB"
    },
    activities: {
      "0":"#ccc",
      "1":"#8ed3fb",
      "2 - 5":"#68add4",
      "6 - 10":"#4388ad",
      "> 10":"#1a6287",
      "Pas de données open data / publication à venir": "#aaa"
    },
    party: ["#3b95d0"]
  }
}



//Set vue components and Vue app

Vue.component('chart-header', ChartHeader);
Vue.component('loader', Loader);

new Vue({
  el: '#app',
  data: vuedata,
  methods: {
    //Share
    downloadDataset: function () {
      var datatable = charts.mainTable.chart;
      var filteredData = datatable.DataTable().rows( { filter : 'applied'} ).data();
      var entries = [["Nom","Département","Fonction","Parti politique de rattachement","Groupe parlementaire de rattachement","Activités annexes conservées","Détention de participations financières","Activités annexes des collaborateurs","Nombre de déclarations déposées","Date de dépôt de la dernière déclaration"]];
      _.each(filteredData, function (d) {
        var entry = [
          '"' + d.tableInfo.name + '"',
          d.tableInfo.department,
          '"' + d.tableInfo.function + '"',
          '"' + d.tableInfo.party + '"',
          '"' + d.tableInfo.group + '"',
          d.tableInfo.activities,
          d.tableInfo.participations,
          d.tableInfo.collabActivities,
          d.tableInfo.declarationsNumber,
          d.tableInfo.declatationDate];
        entries.push(entry);
      });
      var csvContent = "data:text/csv;charset=utf-8,";
      entries.forEach(function(rowArray) {
        var row = rowArray.join(",");
        csvContent += row + "\r\n";
      });
      var encodedUri = encodeURI(csvContent);
      var link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", "IW_FR_responsables_publics_filtered.csv");
      document.body.appendChild(link);
      link.click(); 
      return;
    },
    share: function (platform) {
      if(platform == 'twitter'){
        var thisPage = window.location.href.split('?')[0];
        var shareText = 'Quelles sont les activités annexes de vos responsables publics ? #integritywatch FR : un outil inédit de @TI_France pour prévenir les conflits d\'intérêts et renforcer la #transparence de nos élus ' + thisPage;
        var shareURL = 'https://twitter.com/intent/tweet?text=' + encodeURIComponent(shareText);
        window.open(shareURL, '_blank');
        return;
      }
      if(platform == 'facebook'){
        //var toShareUrl = window.location.href.split('?')[0];
        var toShareUrl = 'https://integritywatch.fr';
        var shareURL = 'https://www.facebook.com/sharer/sharer.php?u='+encodeURIComponent(toShareUrl);
        window.open(shareURL, '_blank', 'toolbar=no,location=0,status=no,menubar=no,scrollbars=yes,resizable=yes,width=600,height=250,top=300,left=300');
        return;
      }
    },
    boolToX: function (conservee){
			if(conservee == "true"){
				return "X";
			}
			return "";
    },
    revenusList: function (remuneration){
			var remunerationText = "";
			if(remuneration.montant[0].montant && remuneration.montant[0].montant.annee){
				remunerationText = remuneration.montant[0].montant.annee + ': '+remuneration.montant[0].montant.montant+'<br />' + remunerationText;
			} else if(remuneration.montant[0].montant && remuneration.montant[0].montant.length > 0){
				remuneration.montant[0].montant.forEach(function (x) {
					remunerationText = x.annee + ': '+x.montant+'<br />' + remunerationText;
				});
			}
			return remunerationText;
		}
  }
});

//Initialize info popovers
$(function () {
  $('[data-toggle="popover"]').popover()
})

//Charts
var charts = {
  map: {
    chart: dc.geoChoroplethChart("#map_chart"),
    type: 'map',
    divId: 'map_chart'
  },
  party: {
    chart: dc.pieChart("#party_chart"),
    type: 'pie',
    divId: 'party_chart'
  },
  activities: {
    chart: dc.pieChart("#activities_chart"),
    type: 'pie',
    divId: 'activities_chart'
  },
  mandate: {
    chart: dc.pieChart("#mandate_chart"),
    type: 'pie',
    divId: 'mandate_chart'
  },
  gender: {
    chart: dc.pieChart("#gender_chart"),
    type: 'pie',
    divId: 'gender_chart'
  },
  declarationsNumber: {
    chart: dc.barChart("#declarationsnumber_chart"),
    type: 'bar',
    divId: 'declarationsnumber_chart'
  },
  mainTable: {
    chart: null,
    type: 'table',
    divId: 'dc-data-table'
  }
}

//Functions for responsivness
var recalcWidth = function(divId) {
  return document.getElementById(divId).offsetWidth - vuedata.chartMargin;
};
var recalcWidthWordcloud = function() {
  //Replace element if with wordcloud column id
  var width = document.getElementById("party_chart").offsetWidth - vuedata.chartMargin*2;
  return [width, 550];
};
var recalcCharsLength = function(width) {
  return parseInt(width / 8);
};
var calcPieSize = function(divId) {
  var newWidth = recalcWidth(divId);
  var sizes = {
    'width': newWidth,
    'height': 0,
    'radius': 0,
    'innerRadius': 0,
    'cy': 0,
    'legendY': 0
  }
  if(newWidth < 300) { 
    sizes.height = newWidth + 170;
    sizes.radius = (newWidth)/2;
    sizes.innerRadius = (newWidth)/4;
    sizes.cy = (newWidth)/2;
    sizes.legendY = (newWidth) + 30;
  } else {
    sizes.height = newWidth*0.75 + 170;
    sizes.radius = (newWidth*0.75)/2;
    sizes.innerRadius = (newWidth*0.75)/4;
    sizes.cy = (newWidth*0.75)/2;
    sizes.legendY = (newWidth*0.75) + 30;
  }
  return sizes;
};
var resizeGraphs = function() {
  for (var c in charts) {
    if((c == 'declarationsNumber') && vuedata.showAllCharts == false){
    
    } else {
      var sizes = calcPieSize(charts[c].divId);
      var newWidth = recalcWidth(charts[c].divId);
      var charsLength = recalcCharsLength(newWidth);
      if(charts[c].type == 'map') {
        if(window.innerWidth <= 768) {
          var newProjection = d3.geoMercator()
          .center([11,45]) //theorically, 50°7′2.23″N 9°14′51.97″E but this works
          .translate([newWidth - 30, 270])
          .scale(newWidth*3.2);
          charts[c].chart.height(500);
        } else {
          var newProjection = d3.geoMercator()
          .center([11,45]) //theorically, 50°7′2.23″N 9°14′51.97″E but this works
          .scale(newWidth*3.7)
          .translate([newWidth + 40, 420]);
          //.translate([newWidth - 50, 220])
          //.scale(newWidth*3);
          charts[c].chart.height(800);
        }
        charts[c].chart.width(newWidth);
        charts[c].chart.projection(newProjection);
        charts[c].chart.redraw();
      } else if(charts[c].type == 'row'){
        charts[c].chart.width(newWidth);
        charts[c].chart.label(function (d) {
          var thisKey = d.key;
          if(thisKey.indexOf('###') > -1){
            thisKey = thisKey.split('###')[0];
          }
          if(thisKey.length > charsLength){
            return thisKey.substring(0,charsLength) + '...';
          }
          return thisKey;
        })
        charts[c].chart.redraw();
      } else if(charts[c].type == 'pie') {
        charts[c].chart
          .width(sizes.width)
          .height(sizes.height)
          .cy(sizes.cy)
          .innerRadius(sizes.innerRadius)
          .radius(sizes.radius)
          .legend(dc.legend().x(0).y(sizes.legendY).gap(10));
        if(charts[c].divId == 'party_chart') {
          charts[c].chart.legend(dc.legend().x(0).y(sizes.legendY).horizontal(true).autoItemWidth(true).legendWidth(sizes.width).gap(10).legendText(function(d) { 
            var thisKey = d.name;
            if(thisKey.length > 40){
              return thisKey.substring(0,40) + '...';
            }
            return thisKey;
          }));
        }
        charts[c].chart.redraw();
      } else if(charts[c].type == 'cloud') {
        charts[c].chart.size(recalcWidthWordcloud());
        charts[c].chart.redraw();
      }
    }
  }
};

//Add commas to thousands
function addcommas(x){
  if(parseInt(x)){
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }
  return x;
}
//Clean strings
function cleanstring(str) {
	if(str) {
		return str.trim().toLowerCase();
	} else {
		return '';
	}
}
//Clean strings with special characters
function cleanstringSpecial(str) {
	if(str){
	var newStr = str.trim().toLowerCase();
	newStr = newStr.replace("é","e");
	newStr = newStr.replace("è","e");
	newStr = newStr.replace("ç","c");
	newStr = newStr.replace("-"," ");
	newStr = newStr.replace("ë","e");
	newStr = newStr.replace(".","");
	newStr = newStr.replace(/é/g , "e");
	newStr = newStr.replace(/è/g , "e");
	newStr = newStr.replace(/ç/g , "c");
	newStr = newStr.replace(/_/g , " ");
	newStr = newStr.replace(/ë/g , "e");
	newStr = newStr.replace(/\./g , "");
	newStr = newStr.replace("  "," ");
	return newStr;
	}
}
//Replace diacritics
function removeDiacritics(str) {
  var diacriticsMap = {
    A: /[\u0041\u24B6\uFF21\u00C0\u00C1\u00C2\u1EA6\u1EA4\u1EAA\u1EA8\u00C3\u0100\u0102\u1EB0\u1EAE\u1EB4\u1EB2\u0226\u01E0\u00C4\u01DE\u1EA2\u00C5\u01FA\u01CD\u0200\u0202\u1EA0\u1EAC\u1EB6\u1E00\u0104\u023A\u2C6F]/g,
    AA: /[\uA732]/g,
    AE: /[\u00C6\u01FC\u01E2]/g,
    AO: /[\uA734]/g,
    AU: /[\uA736]/g,
    AV: /[\uA738\uA73A]/g,
    AY: /[\uA73C]/g,
    B: /[\u0042\u24B7\uFF22\u1E02\u1E04\u1E06\u0243\u0182\u0181]/g,
    C: /[\u0043\u24B8\uFF23\u0106\u0108\u010A\u010C\u00C7\u1E08\u0187\u023B\uA73E]/g,
    D: /[\u0044\u24B9\uFF24\u1E0A\u010E\u1E0C\u1E10\u1E12\u1E0E\u0110\u018B\u018A\u0189\uA779]/g,
    DZ: /[\u01F1\u01C4]/g,
    Dz: /[\u01F2\u01C5]/g,
    E: /[\u0045\u24BA\uFF25\u00C8\u00C9\u00CA\u1EC0\u1EBE\u1EC4\u1EC2\u1EBC\u0112\u1E14\u1E16\u0114\u0116\u00CB\u1EBA\u011A\u0204\u0206\u1EB8\u1EC6\u0228\u1E1C\u0118\u1E18\u1E1A\u0190\u018E]/g,
    F: /[\u0046\u24BB\uFF26\u1E1E\u0191\uA77B]/g,
    G: /[\u0047\u24BC\uFF27\u01F4\u011C\u1E20\u011E\u0120\u01E6\u0122\u01E4\u0193\uA7A0\uA77D\uA77E]/g,
    H: /[\u0048\u24BD\uFF28\u0124\u1E22\u1E26\u021E\u1E24\u1E28\u1E2A\u0126\u2C67\u2C75\uA78D]/g,
    I: /[\u0049\u24BE\uFF29\u00CC\u00CD\u00CE\u0128\u012A\u012C\u0130\u00CF\u1E2E\u1EC8\u01CF\u0208\u020A\u1ECA\u012E\u1E2C\u0197]/g,
    J: /[\u004A\u24BF\uFF2A\u0134\u0248]/g,
    K: /[\u004B\u24C0\uFF2B\u1E30\u01E8\u1E32\u0136\u1E34\u0198\u2C69\uA740\uA742\uA744\uA7A2]/g,
    L: /[\u004C\u24C1\uFF2C\u013F\u0139\u013D\u1E36\u1E38\u013B\u1E3C\u1E3A\u0141\u023D\u2C62\u2C60\uA748\uA746\uA780]/g,
    LJ: /[\u01C7]/g,
    Lj: /[\u01C8]/g,
    M: /[\u004D\u24C2\uFF2D\u1E3E\u1E40\u1E42\u2C6E\u019C]/g,
    N: /[\u004E\u24C3\uFF2E\u01F8\u0143\u00D1\u1E44\u0147\u1E46\u0145\u1E4A\u1E48\u0220\u019D\uA790\uA7A4]/g,
    NJ: /[\u01CA]/g,
    Nj: /[\u01CB]/g,
    O: /[\u004F\u24C4\uFF2F\u00D2\u00D3\u00D4\u1ED2\u1ED0\u1ED6\u1ED4\u00D5\u1E4C\u022C\u1E4E\u014C\u1E50\u1E52\u014E\u022E\u0230\u00D6\u022A\u1ECE\u0150\u01D1\u020C\u020E\u01A0\u1EDC\u1EDA\u1EE0\u1EDE\u1EE2\u1ECC\u1ED8\u01EA\u01EC\u00D8\u01FE\u0186\u019F\uA74A\uA74C]/g,
    OI: /[\u01A2]/g,
    OO: /[\uA74E]/g,
    OU: /[\u0222]/g,
    P: /[\u0050\u24C5\uFF30\u1E54\u1E56\u01A4\u2C63\uA750\uA752\uA754]/g,
    Q: /[\u0051\u24C6\uFF31\uA756\uA758\u024A]/g,
    R: /[\u0052\u24C7\uFF32\u0154\u1E58\u0158\u0210\u0212\u1E5A\u1E5C\u0156\u1E5E\u024C\u2C64\uA75A\uA7A6\uA782]/g,
    S: /[\u0053\u24C8\uFF33\u1E9E\u015A\u1E64\u015C\u1E60\u0160\u1E66\u1E62\u1E68\u0218\u015E\u2C7E\uA7A8\uA784]/g,
    T: /[\u0054\u24C9\uFF34\u1E6A\u0164\u1E6C\u021A\u0162\u1E70\u1E6E\u0166\u01AC\u01AE\u023E\uA786]/g,
    TZ: /[\uA728]/g,
    U: /[\u0055\u24CA\uFF35\u00D9\u00DA\u00DB\u0168\u1E78\u016A\u1E7A\u016C\u00DC\u01DB\u01D7\u01D5\u01D9\u1EE6\u016E\u0170\u01D3\u0214\u0216\u01AF\u1EEA\u1EE8\u1EEE\u1EEC\u1EF0\u1EE4\u1E72\u0172\u1E76\u1E74\u0244]/g,
    V: /[\u0056\u24CB\uFF36\u1E7C\u1E7E\u01B2\uA75E\u0245]/g,
    VY: /[\uA760]/g,
    W: /[\u0057\u24CC\uFF37\u1E80\u1E82\u0174\u1E86\u1E84\u1E88\u2C72]/g,
    X: /[\u0058\u24CD\uFF38\u1E8A\u1E8C]/g,
    Y: /[\u0059\u24CE\uFF39\u1EF2\u00DD\u0176\u1EF8\u0232\u1E8E\u0178\u1EF6\u1EF4\u01B3\u024E\u1EFE]/g,
    Z: /[\u005A\u24CF\uFF3A\u0179\u1E90\u017B\u017D\u1E92\u1E94\u01B5\u0224\u2C7F\u2C6B\uA762]/g,
    a: /[\u0061\u24D0\uFF41\u1E9A\u00E0\u00E1\u00E2\u1EA7\u1EA5\u1EAB\u1EA9\u00E3\u0101\u0103\u1EB1\u1EAF\u1EB5\u1EB3\u0227\u01E1\u00E4\u01DF\u1EA3\u00E5\u01FB\u01CE\u0201\u0203\u1EA1\u1EAD\u1EB7\u1E01\u0105\u2C65\u0250]/g,
    aa: /[\uA733]/g,
    ae: /[\u00E6\u01FD\u01E3]/g,
    ao: /[\uA735]/g,
    au: /[\uA737]/g,
    av: /[\uA739\uA73B]/g,
    ay: /[\uA73D]/g,
    b: /[\u0062\u24D1\uFF42\u1E03\u1E05\u1E07\u0180\u0183\u0253]/g,
    c: /[\u0063\u24D2\uFF43\u0107\u0109\u010B\u010D\u00E7\u1E09\u0188\u023C\uA73F\u2184]/g,
    d: /[\u0064\u24D3\uFF44\u1E0B\u010F\u1E0D\u1E11\u1E13\u1E0F\u0111\u018C\u0256\u0257\uA77A]/g,
    dz: /[\u01F3\u01C6]/g,
    e: /[\u0065\u24D4\uFF45\u00E8\u00E9\u00EA\u1EC1\u1EBF\u1EC5\u1EC3\u1EBD\u0113\u1E15\u1E17\u0115\u0117\u00EB\u1EBB\u011B\u0205\u0207\u1EB9\u1EC7\u0229\u1E1D\u0119\u1E19\u1E1B\u0247\u025B\u01DD]/g,
    f: /[\u0066\u24D5\uFF46\u1E1F\u0192\uA77C]/g,
    g: /[\u0067\u24D6\uFF47\u01F5\u011D\u1E21\u011F\u0121\u01E7\u0123\u01E5\u0260\uA7A1\u1D79\uA77F]/g,
    h: /[\u0068\u24D7\uFF48\u0125\u1E23\u1E27\u021F\u1E25\u1E29\u1E2B\u1E96\u0127\u2C68\u2C76\u0265]/g,
    hv: /[\u0195]/g,
    i: /[\u0069\u24D8\uFF49\u00EC\u00ED\u00EE\u0129\u012B\u012D\u00EF\u1E2F\u1EC9\u01D0\u0209\u020B\u1ECB\u012F\u1E2D\u0268\u0131]/g,
    j: /[\u006A\u24D9\uFF4A\u0135\u01F0\u0249]/g,
    k: /[\u006B\u24DA\uFF4B\u1E31\u01E9\u1E33\u0137\u1E35\u0199\u2C6A\uA741\uA743\uA745\uA7A3]/g,
    l: /[\u006C\u24DB\uFF4C\u0140\u013A\u013E\u1E37\u1E39\u013C\u1E3D\u1E3B\u017F\u0142\u019A\u026B\u2C61\uA749\uA781\uA747]/g,
    lj: /[\u01C9]/g,
    m: /[\u006D\u24DC\uFF4D\u1E3F\u1E41\u1E43\u0271\u026F]/g,
    n: /[\u006E\u24DD\uFF4E\u01F9\u0144\u00F1\u1E45\u0148\u1E47\u0146\u1E4B\u1E49\u019E\u0272\u0149\uA791\uA7A5]/g,
    nj: /[\u01CC]/g,
    o: /[\u006F\u24DE\uFF4F\u00F2\u00F3\u00F4\u1ED3\u1ED1\u1ED7\u1ED5\u00F5\u1E4D\u022D\u1E4F\u014D\u1E51\u1E53\u014F\u022F\u0231\u00F6\u022B\u1ECF\u0151\u01D2\u020D\u020F\u01A1\u1EDD\u1EDB\u1EE1\u1EDF\u1EE3\u1ECD\u1ED9\u01EB\u01ED\u00F8\u01FF\u0254\uA74B\uA74D\u0275]/g,
    oi: /[\u01A3]/g,
    ou: /[\u0223]/g,
    oo: /[\uA74F]/g,
    p: /[\u0070\u24DF\uFF50\u1E55\u1E57\u01A5\u1D7D\uA751\uA753\uA755]/g,
    q: /[\u0071\u24E0\uFF51\u024B\uA757\uA759]/g,
    r: /[\u0072\u24E1\uFF52\u0155\u1E59\u0159\u0211\u0213\u1E5B\u1E5D\u0157\u1E5F\u024D\u027D\uA75B\uA7A7\uA783]/g,
    s: /[\u0073\u24E2\uFF53\u015B\u1E65\u015D\u1E61\u0161\u1E67\u1E63\u1E69\u0219\u015F\u023F\uA7A9\uA785\u1E9B]/g,
    ss: /[\u00DF]/g,
    t: /[\u0074\u24E3\uFF54\u1E6B\u1E97\u0165\u1E6D\u021B\u0163\u1E71\u1E6F\u0167\u01AD\u0288\u2C66\uA787]/g,
    tz: /[\uA729]/g,
    u: /[\u0075\u24E4\uFF55\u00F9\u00FA\u00FB\u0169\u1E79\u016B\u1E7B\u016D\u00FC\u01DC\u01D8\u01D6\u01DA\u1EE7\u016F\u0171\u01D4\u0215\u0217\u01B0\u1EEB\u1EE9\u1EEF\u1EED\u1EF1\u1EE5\u1E73\u0173\u1E77\u1E75\u0289]/g,
    v: /[\u0076\u24E5\uFF56\u1E7D\u1E7F\u028B\uA75F\u028C]/g,
    vy: /[\uA761]/g,
    w: /[\u0077\u24E6\uFF57\u1E81\u1E83\u0175\u1E87\u1E85\u1E98\u1E89\u2C73]/g,
    x: /[\u0078\u24E7\uFF58\u1E8B\u1E8D]/g,
    y: /[\u0079\u24E8\uFF59\u1EF3\u00FD\u0177\u1EF9\u0233\u1E8F\u00FF\u1EF7\u1E99\u1EF5\u01B4\u024F\u1EFF]/g,
    z: /[\u007A\u24E9\uFF5A\u017A\u1E91\u017C\u017E\u1E93\u1E95\u01B6\u0225\u0240\u2C6C\uA763]/g
  };
  for (var x in diacriticsMap) {
    // Iterate through each keys in the above object and perform a replace
    str = str.replace(diacriticsMap[x], x);
  }
  return str;
}
//Get PhotoUrl
function getPhoto(name,type) {
  var plainname = removeDiacritics(name);
  var slug = plainname.replace( / /g, "-" );
  slug = slug.replace( /'/g, "-" );
  if(slug == 'Evelyne-Yonnet-Salvator'){
   slug = 'Evelyne-Yonnet';
  } else if(slug == 'Pierre-Yves-Le-Borgn-'){
    slug = 'Pierre-Yves-Le-Borgn';
  }
  var copyr = "";
  if(type && type[0].toLowerCase() == 's'){
    var photourl = "http://www.nossenateurs.fr/senateur/photo/"+slug+"/180";
    copyr = "©Sénat – 2015";
  } else if(type && type[0].toLowerCase() == 'd'){
    var photourl = "http://www.nosdeputes.fr/depute/photo/"+slug+"/180";
    copyr = "©Assemblée-nationale – 2015";
  } else {
    //console.log(name + ' ' + type);
  }
  return photourl;
  return "<img src=\""+photourl+"\" /><br />"+copyr;
}
//Get profile link
function getHatvp(name, name_url) {
  var slug = '';
  if(name_url.length > 1){
    slug = name_url;
  } else {
    var plainname = removeDiacritics(name);
    var name1 = plainname.substr(0,plainname.indexOf(' '));
    var name2 = plainname.substr(plainname.indexOf(' ')+1);
    var name2 = name2.replace(/ /g, '-');
    slug = name2+'-'+name1;		
    slug = slug.toLowerCase();
  }
  if(slug == 'yonnet-salvator-evelyne'){
   slug = 'yonnet-evelyne';
  }
  if(slug == 'anthoine-emmanuelle'){
    slug = 'anthoine-emmanuelle-571';
  }
  var url = "http://www.hatvp.fr/fiche-nominative/?declarant="+slug;
  return url;
}
//Custom date order for dataTables
var dmy = d3.timeParse("%d/%m/%Y");
jQuery.extend( jQuery.fn.dataTableExt.oSort, {
  "date-eu-pre": function (date) {
    if(date.indexOf("Cancelled") > -1){
      date = date.split(" ")[0];
    }
      return dmy(date);
  },
  "date-eu-asc": function ( a, b ) {
      return ((a < b) ? -1 : ((a > b) ? 1 : 0));
  },
  "date-eu-desc": function ( a, b ) {
      return ((a < b) ? 1 : ((a > b) ? -1 : 0));
  }
});

//Generate random parameter for dynamic dataset loading (to avoid caching)
var randomPar = '';
var randomCharacters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
for ( var i = 0; i < 5; i++ ) {
  randomPar += randomCharacters.charAt(Math.floor(Math.random() * randomCharacters.length));
}

//Load data and generate charts
  json('./data/declarations-filtered-080720.json', (err, dataDeclarations) => {
  //json('./data/declarations-150620.json', (err, dataDeclarations) => {
  csv('./data/parlementaires.csv', (err, dataParlamentaires) => {
    csv('./data/department-names.csv', (err, departmentnames) => {
      csv('./data/parties-names.csv?'+ randomPar, (err, partiesnames) => {
        csv('./data/list-final-080720.csv?'+ randomPar, (err, listfinal) => {
            //var declarations = dataDeclarations.declarations.declaration;
            var declarations = dataDeclarations;
            var representatives = dataParlamentaires;
            var totpeople = 0;
            var totact = 0;
            var totrev = 0;
            //Does this need to change? It's used to indicate which revenue year to keep into account from the declarations.
            //At the moment the latest ones seem to be 2017.
            var currentYear = 2017;
            //Get the list of correct declarations timestamps from the list-final csv file
            var timestamps = [];
            var missingsenators = [];
            var missingothers = [];

            listfinal.forEach(function (d) {
              if(d.date_depot == "No digital dec" || d.date_depot == "") {
                if( d.type_mandat == "senateur") {
                  missingsenators.push(d);
                } else {
                  missingothers.push(d);
                  //console.log(d.Full_name);
                }
              } else if(d.date_depot && d.date_depot.length > 1) {
                timestamps.push(d.date_depot);
              }
            });
            
            //Get declarations from listed timestamps by filtering the declarations json
            var declarationsFiltered = _.filter(declarations, function(dec, index) {
              return timestamps.indexOf(dec.dateDepot) > -1;
            });
            declarations = declarationsFiltered;
            //console.log(JSON.stringify(declarations));
            console.log(declarations.length);

            //Add missing senators from missing-senators csv to the declarations json structure
            missingsenators.forEach(function (d) {
              var thisname = d.name;
              var thislastname = d.lastname;
              //var thisname = d.prenom;
		          //var thislastname = d.nom;
              var newObj = {
                "general": {
                  "mandat": { "label": "Député ou sénateur" },
                  "qualiteMandat": {
                    "typeMandat": d.type_mandat
                  },
                  "declarant": {
                    "civilite": d.civilite,
                    "nom": thislastname,
                    "prenom": thisname,
                    "dateNaissance": "",
                  }
                },
                "parti": d.parti,
                "parti_group": d.groupe,
                "departement": d.departement,
                "departement_n": d.departement,
                "convertedFromCSV": true
              };
              newObj.customDateText = "Pas de données open data disponibles";
              declarations.push(newObj);
            });

            missingothers.forEach(function (d) {
              var thisname = d.name;
              var thislastname = d.lastname;
              //var thisname = d.prenom;
		          //var thislastname = d.nom;
              var newObj = {
                "general": {
                  "mandat": { "label": d.type_mandat },
                  "qualiteMandat": {
                    "typeMandat": d.type_mandat
                  },
                  "declarant": {
                    "civilite": d.civilite,
                    "nom": thislastname,
                    "prenom": thisname,
                    "dateNaissance": "",
                  }
                },
                "parti": d.parti,
                "parti_group": d.groupe,
                "departement": d.departement,
                "departement_n": d.departement,
                "convertedFromCSV": true
              };
              newObj.customDateText = "Publication à venir";
              declarations.push(newObj);
            });

            //Loop through data to aply fixes and calculations
            _.each(declarations, function (d) {
              //Set up parameters that will be used in graphs and tables
              d.name = d.general.declarant.prenom + " " + d.general.declarant.nom;
              if(d.name == 'Robert Del'){
                d.name = 'Robert Del Picchia';
              }
              if(d.name == 'DEL PICCHIA'){
                d.name = 'Robert DEL PICCHIA';
              }
              //Get list info
              var thislistentry = _.find(listfinal, function (m) {return m.date_depot == d.dateDepot;});
              if(!thislistentry) {
                thislistentry = _.find(listfinal, function (m) {
                  return m.Full_name == d.name || (m.name + ' ' + m.lastname) == d.name;
                });
              }
              d.listInfo = thislistentry;
              if(!d.listInfo) {
                console.log("missing list entry:");
              }
              if(d.listInfo && d.listInfo.declarations_num > vuedata.maxDeclarationsDeclated) {
                vuedata.maxDeclarationsDeclated = parseInt(d.listInfo.declarations_num);
              }
              d.name_show = d.name;
              d.civilite = cleanstring(d.general.declarant.civilite);
              if(cleanstringSpecial(d.civilite) == "m"){
                d.civilite = "m";
              }
              if(cleanstringSpecial(d.civilite) == "mme"){
                d.civilite = "f";
              }
              d.birth_year = d.general.declarant.dateNaissance.split("/")[2];
              d.birth_date = d.general.declarant.dateNaissance;
              d.revenue = 0;
              d.activities = 0;
              if(!d.departement){
                d.departement;
              }
              if(d.general.organe && d.general.organe.labelOrgane){
                d.departement = d.general.organe.labelOrgane.split("(")[0];
              }
              if(d.general.organe){
                d.departement_n = d.general.organe.codeOrgane;
              }
              d.region = "";
              d.mandat2 = d.general.qualiteMandat.typeMandat;
              d.mandat = d.general.mandat.label;
              if(!d.parti){
                d.parti = "";
              }
              if(!d.parti_group){
                d.parti_group = "";
              }
              d.activcons = "NON";
              d.partsoc = "NON";
              d.collabNum = 0;
              d.name_url = '';
              //Get party and other info from main list
              if(thislistentry){
                d.name_url = thislistentry.file.split('-dia')[0];
                if(thislistentry.file.indexOf('romeiro-dias-laetitia') > -1){
                  d.name_url = 'romeiro-dias-laetitia';
                }
                d.parti = thislistentry.parti.trim();
                d.parti_group = thislistentry.groupe.trim();
                d.name_show = thislistentry.name;
                d.departement_n = thislistentry.departement.trim();
                if(!d.general.qualiteMandat.typeMandat){
                  d.mandat2 = thislistentry.type_mandat;
                }
                d.mandat2 = thislistentry.type_mandat;
              }
              if(d.mandat2 == 'depute'){
                d.mandat2 = 'Député';
              } else if(d.mandat2 == 'senateur'){
                d.mandat2 = 'Sénateur';
              }
              if(d.mandat == "Député ou sénateur"){
                d.mandat = d.mandat2;
              }
              if(d.mandat == "gouvernement") {
                d.mandat = "Membre du Gouvernement"
              }
              if(d.mandat == "depute") {
                d.mandat = "Député"
              }
              if(d.mandat == "europe") {
                d.mandat = "Député européen"
              }

              if(!d.department || d.department == '' || d.department == undefined){
                //Find department name from department names csv if missing
                var thisdepname = _.find(departmentnames, function (m) {return d.departement_n==m.code;});
                if(thisdepname){
                  d.department = thisdepname.name;
                }
              }
              d.parti_group_m = d.parti_group;
              d.parti_acronym = '';
              //Find party acronym
              var partiToLower = '';
              if(d.parti) {
                partiToLower = cleanstringSpecial(d.parti).toLowerCase();
              }
              var pacronym = _.find(partiesnames, function (m) {return cleanstringSpecial(m.party).toLowerCase()==partiToLower});
              if(pacronym){
                d.parti_acronym = pacronym.abbreviation;
              }
              //Set party name that will be used in the parties pie chart
              var partiespielist = ['rem','lr','modem','lc','ng','fi','gdr','ps','eelv','rn','lfi','udrl'];
              if(partiespielist.indexOf(d.parti_acronym.toLowerCase()) < 0){
                d.parti_pie = 'Autres';
                //d.parti_pie = d.parti_acronym;
              } else {
                d.parti_pie = d.parti_acronym;
              }
              //Deparment number fix
              if(d.departement_n == '099' || d.departement_n == '998' || d.departement_n == 998){
                d.departement_n = 99;
              }
              //Get photo url and profile link
              d.photoUrl = getPhoto(d.name,d.mandat);
              d.hatvp = getHatvp(d.name, d.name_url);
              //Calculate activities number and revenue
              d.activitiestot = 0;
              d.revenuetot = 0;
              d.revenuetotAvg = 0;
              d.activConsultant = [];
              d.activProfCinqDerniere = [];
              d.activProfConjoint = [];
              d.fonctionBenevole = [];
              d.mandatElectif = [];
              d.participationDirigeant = [];
              d.participationFinanciere = [];
              d.activCollaborateurs = [];
              //See if way to check nested property can be improved, made shorter
              if(d.activConsultantDto && d.activConsultantDto.items && d.activConsultantDto.items[0] && d.activConsultantDto.items[0].items){
                if(d.activConsultantDto.items[0].items.motif){
                  d.activConsultant.push(d.activConsultantDto.items[0].items);
                } else {
                  d.activConsultant = d.activConsultantDto.items[0].items;
                }
              }
              if(d.activProfCinqDerniereDto && d.activProfCinqDerniereDto.items && d.activProfCinqDerniereDto.items[0] && d.activProfCinqDerniereDto.items[0].items){
                if(d.activProfCinqDerniereDto.items[0].items.motif){
                  d.activConsultant.push(d.activProfCinqDerniereDto.items[0].items);
                } else {
                  d.activProfCinqDerniere = d.activProfCinqDerniereDto.items[0].items;
                }
              }
              if(d.activProfConjointDto && d.activProfConjointDto.items && d.activProfConjointDto.items[0] && d.activProfConjointDto.items[0].items){
                if(d.activProfConjointDto.items[0].items.motif){
                  d.activProfConjoint.push(d.activProfConjointDto.items[0].items);
                } else {
                  d.activProfConjoint = d.activProfConjointDto.items[0].items;
                }
              }
              if(d.fonctionBenevoleDto && d.fonctionBenevoleDto.items && d.fonctionBenevoleDto.items[0] && d.fonctionBenevoleDto.items[0].items){
                if(d.fonctionBenevoleDto.items[0].items.motif){
                  d.fonctionBenevole.push(d.fonctionBenevoleDto.items[0].items);
                } else {
                  d.fonctionBenevole = d.fonctionBenevoleDto.items[0].items;
                }
              }
              if(d.mandatElectifDto && d.mandatElectifDto.items && d.mandatElectifDto.items[0] && d.mandatElectifDto.items[0].items){
                if(d.mandatElectifDto.items[0].items.motif){
                  d.mandatElectif.push(d.mandatElectifDto.items[0].items);
                } else {
                  d.mandatElectif = d.mandatElectifDto.items[0].items;
                }
              }
              if(d.participationDirigeantDto && d.participationDirigeantDto.items && d.participationDirigeantDto.items[0] && d.participationDirigeantDto.items[0].items){
                if(d.participationDirigeantDto.items[0].items.motif){
                  d.participationDirigeant.push(d.participationDirigeantDto.items[0].items);
                } else {
                  d.participationDirigeant = d.participationDirigeantDto.items[0].items;
                }
              }
              if(d.participationFinanciereDto && d.participationFinanciereDto.items && d.participationFinanciereDto.items[0] && d.participationFinanciereDto.items[0].items){
                if(d.participationFinanciereDto.items[0].items.motif){
                  d.participationFinanciere.push(d.participationFinanciereDto.items[0].items);
                } else {
                  d.participationFinanciere = d.participationFinanciereDto.items[0].items;
                }
              }
              if(d.activCollaborateursDto && d.activCollaborateursDto.items && d.activCollaborateursDto.items[0] && d.activCollaborateursDto.items[0].items){
                if(d.activCollaborateursDto.items[0].items.motif){
                  d.activCollaborateurs.push(d.activCollaborateursDto.items[0].items);
                } else {
                  d.activCollaborateurs = d.activCollaborateursDto.items[0].items;
                }
              }
              if(d.participationFinanciere.length > 0){
                d.partsoc = "OUI";
              }
              //Calculate activities and revenues	
              function calcActRev(actArray){
                if(actArray.length > 0){
                  actArray.forEach(function (x) {
                    //Count activity only if conservee
                    if(x.conservee && x.conservee == "true"){
                      d.activitiestot ++;
                    }
                    //Revenue sum for conservee activities
                    if(x.conservee == "true"){
                      if(x.remuneration && x.remuneration.montant.montant){
                        //If the revenue only has 1 entry the data structure is a bit different
                        if(x.remuneration.montant.montant.annee && x.remuneration.montant.montant.annee == currentYear){
                          d.revenuetot += Number(x.remuneration.montant.montant.montant);
                        } else if(x.remuneration.montant.montant.length > 0){
                          //If there are more entries, loop through revenue entries, 1 entry per year; pick the current year entry
                          x.remuneration.montant.montant.forEach(function (y) {
                            if(y.annee == currentYear){
                              d.revenuetot += Number(y.montant);
                            }
                          });
                        }
                      }
                      //Revenue sum average
                      var thisacttot = 0;
                      var thisactyears = 0;
                      if(x.remuneration && x.remuneration.montant.montant){
                        //If the revenue only has 1 entry the data structure is a bit different
                        if(x.remuneration.montant.montant.annee){
                          d.revenuetotAvg += Number(x.remuneration.montant.montant.montant);
                        } else if(x.remuneration.montant.montant.length > 0){
                          //If there are more entries, loop through revenue entries, 1 entry per year; sum the revenues and divide by years amount
                          x.remuneration.montant.montant.forEach(function (y) {
                            thisacttot += Number(y.montant);
                            thisactyears ++;
                          });
                        }
                      }
                      if(thisactyears > 0){
                        d.revenuetotAvg += Number(thisacttot)/Number(thisactyears);
                        //.toFixed(2)
                      }
                    }
                    //If any is kept, set activcons to OUI
                    if(x.conservee && x.conservee == "true"){
                      d.activcons = "OUI";
                    }
                  });
                }
              }
              calcActRev(d.activConsultant);
              calcActRev(d.activProfCinqDerniere);
              calcActRev(d.fonctionBenevole);
              calcActRev(d.mandatElectif);
              calcActRev(d.participationDirigeant);
              /* ENTRIES THAT SHOULD NOT BE COUNTED FOR ACTIVITIES COUNT - DO NOT DELETE */
              /*
              if(d.activProfConjoint.length > 0){
                d.activProfConjoint.forEach(function (x) {
                });
              }
              if(d.participationFinanciere.length > 0){
                d.participationFinanciere.forEach(function (x) {
                });
              }
              */
              //Count collaborators
              d.activCollaborateurs.forEach(function (x) {
                if((x.descriptionActivite || (x.employeur && x.employeur != "Néant")) && ((cleanstringSpecial(x.employeur) != "neant" && x.employeur != "Néant" && cleanstringSpecial(x.employeur) != "") || (cleanstringSpecial(x.descriptionActivite) != "" && cleanstringSpecial(x.descriptionActivite) != "neant")) && (x.descriptionActivite != "AUCUNE AUTRE ACTIVITE")){
                  d.collabNum ++;
                }
              });
              //Set activities range
              d.activities = d.activitiestot;
              d.activities_range = "";
              if(d.activitiestot == 0){
                d.activities_range = "0";
              } else if(d.activitiestot <= 1){
                d.activities_range = "1";
              } else if(d.activitiestot <= 5){
                d.activities_range = "2 - 5";
              } else if(d.activitiestot <= 10){
                d.activities_range = "6 - 10";
              } else if(d.activitiestot > 10){
                d.activities_range = "> 10";
              }	
              //If no declaration (no date in list) assign separate category for activities graph
              if(!d.listInfo || !d.listInfo.date_depot || d.listInfo.date_depot == "") {
                d.activities_range = "Pas de données open data / publication à venir";
              }
              //Set revenues range
              d.revenue = d.revenuetot;
              d.revenue_n = d.revenuetot;
              //Revenue ranges
              if(d.revenue == '#N/D' || d.revenue == ''){
                d.revenue_n = 0;
                d.revenue_n2 = 0;
              } else {
                //d.revenue_n = d.revenue.replace(',','.');
                d.revenue_n = parseFloat(d.revenue_n);
                d.revenue_n2 = d.revenue_n.toFixed(0);
              }
              if(d.revenue == '#N/D' || d.revenue == ''){
                d.revenue_range = "Aucun";
              } else if(d.revenue_n <= 1000){
                d.revenue_range = "0 - 1000";
              } else if(d.revenue_n <= 10000){
                d.revenue_range = "1001 - 10,000";
              } else if(d.revenue_n <= 25000){
                d.revenue_range = "10,001 - 25,000";
              } else if(d.revenue_n <= 50000){
                d.revenue_range = "25,001 - 50,000";
              } else if(d.revenue_n <= 100000){
                d.revenue_range = "50,001 - 100,000";
              } else if(d.revenue_n > 100000){
                d.revenue_range = "100,001 +";
              }
              d.revenue_n = d.revenue_n.toFixed(2);

              //Search string
              var activitiesSearchString = "";
              if(d.activProfCinqDerniere) {
                _.each(d.activProfCinqDerniere, function (a) {
                  activitiesSearchString += a.description + " " + a.employeur + " ";
                 });
              }
              if(d.activConsultant) {
                _.each(d.activConsultant, function (a) {
                  activitiesSearchString += a.description + " " + a.employeur + " ";
                 });
              }
              if(d.participationDirigeant) {
                _.each(d.participationDirigeant, function (a) {
                  activitiesSearchString += a.activite + " " + a.nomSociete + " ";
                 });
              }
              if(d.participationFinanciere) {
                _.each(d.participationFinanciere, function (a) {
                  activitiesSearchString += a.nomSociete + " ";
                 });
              }
              if(d.activProfConjoint) {
                _.each(d.activProfConjoint, function (a) {
                  activitiesSearchString += a.activiteProf + " " + a.employeurConjoint + " ";
                 });
              }
              if(d.fonctionBenevole) {
                _.each(d.fonctionBenevole, function (a) {
                  activitiesSearchString += a.descriptionActivite + " " + a.nomStructure + " ";
                 });
              }
              if(d.mandatElectif) {
                _.each(d.mandatElectif, function (a) {
                  activitiesSearchString += a.descriptionMandat + " ";
                 });
              }
              if(d.activCollaborateur) {
                _.each(d.activCollaborateur, function (a) {
                  activitiesSearchString += a.nom + " " + a.descriptionActivite + " " + d.employeur + " ";
                 });
              }
              d.searchstring = d.name + " " + d.departement + " " + d.departement_n + " " + d.parti + activitiesSearchString;
              d.activities_word = d.activities;
              //Totals
              totpeople ++;
              totact += parseInt(d.activities);
              totrev += parseFloat(d.revenue_n);

              //Parse data for table display
              d.tableInfo = {
                name: "",
                department: d.departement_n,
                function: d.mandat,
                party: d.parti,
                group: d.parti_group,
                activities: "",
                participations: "",
                collabActivities: "",
                declarationsNumber: "",
                declatationDate: ""
              }
              if (d.name) {
                var name1 = d.name.substr(0,d.name.indexOf(' '));
                name1 = name1.charAt(0).toUpperCase() + name1.slice(1).toLowerCase();
                var name2 = d.name.substr(d.name.indexOf(' ')+1);
                d.tableInfo.name = name2.toUpperCase() + ' ' + name1;
              }
              if (d.convertedFromCSV) {
                d.tableInfo.participations = "Pas de données open data disponibles";
              } else { 
                d.tableInfo.activities = d.activities; 
                d.tableInfo.participations = d.partsoc;
                d.tableInfo.collabActivities = d.collabNum;
              }
              if(d.listInfo) {
                d.tableInfo.declarationsNumber = d.listInfo.declarations_num;
              }
              if(d.dateDepot){
                d.tableInfo.declatationDate = d.dateDepot.split(' ')[0];
              }

            });

            //Set dc main vars
            var ndx = crossfilter(declarations);
            var searchDimension = ndx.dimension(function (d) {
                return d.searchstring.toLowerCase();
            });
            var mapDimension = ndx.dimension(function (d) {
              if(d.departement_n && d.departement_n.length == 1){
                return '0'+d.departement_n;
              } else {
                return d.departement_n;
              }
            });

            //MAP CHART
            var createMapChart = function() {
              json('./data/departements.topo.js', (err, jsonmap) => {
                var chart = charts.map.chart;
                var width = recalcWidth(charts.map.divId);
                var group = mapDimension.group().reduceSum(function (d) { return 1; });
                var dpt = topojson.feature(jsonmap, jsonmap.objects.departements).features;
                var scale = width*3.7;
                var translate = [width + 40, 420];
                if(window.innerWidth <= 678) {
                  scale = width*3.2;
                  translate = [width - 30, 270];
                }
                var projection = d3.geoMercator()
                  .center([11,45])
                  .scale(scale)
                  .translate(translate);
                var centered;
                function clicked(d) {
                }
            
                chart
                  .width(width)
                  .height(function(d){ return window.innerWidth <= 678 ? 500 : 800 })
                  .dimension(mapDimension)
                  .group(group)
                  .projection(projection)
                  .colors(d3.scaleQuantize().range(["#E2F2FF", "#C4E4FF", "#9ED2FF", "#81C5FF", "#6BBAFF", "#51AEFF", "#36A2FF", "#1E96FF", "#0089FF", "#0061B5"]))
                  .colorDomain([1, 20])
                  .colorCalculator(function (d) { return d == 0 ? '#eee' : chart.colors()(d);})
                  .overlayGeoJson(dpt, "departement", function (d) { return d.properties.code; })
                  .title(function (d) {
                    return  _.find(dpt, function (m) {return m.properties.code==d.key}).properties.nom + ': ' + d.value + ' parlementaires';
                  })
                  .on('renderlet', function(chart) {});
                chart.render();

                //Button to filter department_N > 95 and show France map as deselected
                $('#franceterritories').click(function () {
                  $(this).addClass('active');
                  $('#iledefrance').removeClass('active');
                  mapDimension.filter(function (d) { 
                    return d > 95;
                  });
                  dc.redrawAll();
                  RefreshTable();
                  $( "#map_chart svg .layer0 .departement" ).each(function( index ) {
                    $(this).removeClass('selected');
                    $(this).addClass('deselected');
                  });
                });
                
                //Button to filter departments 75, 77, 78, 91, 92, 93, 94, 95
                $('#iledefrance').click(function () {
                  $(this).addClass('active');
                  $('#franceterritories').removeClass('active');
                  var ileDepartments = ['75', '77', '78', '91', '92', '93', '94', '95'];
                  mapDimension.filter(function (d) { 
                    if(ileDepartments.indexOf(d) > -1){
                      return true;
                    } else {
                      return false;
                    }
                  });
                  dc.redrawAll();
                  RefreshTable();
                  $('#map_chart svg .layer0 .departement').each(function(i) {
                    $(this).removeClass('selected');
                    $(this).addClass('deselected');
                  });
                  ileDepartments.forEach(function(i) {
                    $('#map_chart svg .layer0 .departement.'+i).removeClass('deselected');
                    $('#map_chart svg .layer0 .departement.'+i).addClass('selected');
                  });
                });

              });
            }

            //CHART 1
            var createPartyChart = function() {
              var chart = charts.party.chart;
              var dimension = ndx.dimension(function (d) {
                return d.parti_pie;  
              });
              var order = ['LR','Autres','FN','UDI','EELV/UDE','FG/PCF','PRG','PS/SRC'];
              var group = dimension.group().reduceSum(function (d) { return 1; });
              var sizes = calcPieSize(charts.party.divId);
              chart
                .width(sizes.width)
                .height(sizes.height)
                .cy(sizes.cy)
                .innerRadius(sizes.innerRadius)
                .radius(sizes.radius)
                .legend(dc.legend().x(0).y(sizes.legendY).horizontal(true).autoItemWidth(true).legendWidth(sizes.width).gap(10).legendText(function(d) { 
                  var thisKey = d.name;
                  if(thisKey.length > 40){
                    return thisKey.substring(0,40) + '...';
                  }
                  return thisKey;
                }))
                .title(function(d){
                  var thisKey = d.key;
                  return thisKey + ': ' + d.value;
                })
                .dimension(dimension)
                .group(group)
                .ordering(function(d) { return order.indexOf(d)})
                .colorCalculator(function(d, i) {
                  return vuedata.colors.parties[d.key];
                });
              chart.render();
            }

            //CHART 2
            var createActivitiesChart = function() {
              var chart = charts.activities.chart;
              var dimension = ndx.dimension(function (d) {
                return d.activities_range;  
              });
              var order = ['0','1','2 - 5','6 - 10','> 10'];
              var group = dimension.group().reduceSum(function (d) { return 1; });
              var sizes = calcPieSize(charts.activities.divId);
              chart
                .width(sizes.width)
                .height(sizes.height)
                .cy(sizes.cy)
                .innerRadius(sizes.innerRadius)
                .radius(sizes.radius)
                .legend(dc.legend().x(0).y(sizes.legendY).gap(10).legendText(function(d) { 
                  var thisKey = d.name;
                  if(thisKey.length > 40){
                    return thisKey.substring(0,40) + '...';
                  }
                  return thisKey;
                }))
                .title(function(d){
                  var thisKey = d.key;
                  return thisKey + ': ' + d.value;
                })
                .label(function (d){
                  var percent = d.value / group.all().reduce(function(a, v){ return a + v.value; }, 0);
                  percent = percent*100;
                  return percent.toFixed(1) + '%';
                })
                .dimension(dimension)
                .group(group)
                .ordering(function(d) { return order.indexOf(d)})
                .colorCalculator(function(d, i) {
                  return vuedata.colors.activities[d.key];
                });
              chart.render();
            }

            //CHART 3
            var createMandateChart = function() {
              var chart = charts.mandate.chart;
              var dimension = ndx.dimension(function (d) {
                if(d.mandat) {
                  return d.mandat; 
                } else {
                  return "N/A";
                }
              });
              var group = dimension.group().reduceSum(function (d) { return 1; });
              var sizes = calcPieSize(charts.mandate.divId);
              chart
                .width(sizes.width)
                .height(sizes.height)
                .cy(sizes.cy)
                .innerRadius(sizes.innerRadius)
                .radius(sizes.radius)
                .legend(dc.legend().x(0).y(sizes.legendY).gap(10).legendText(function(d) { 
                  var thisKey = d.name;
                  if(thisKey.length > 40){
                    return thisKey.substring(0,40) + '...';
                  }
                  return thisKey;
                }))
                .title(function(d){
                  var thisKey = d.key;
                  return thisKey + ': ' + d.value;
                })
                .label(function (d){
                  var percent = d.value / group.all().reduce(function(a, v){ return a + v.value; }, 0);
                  percent = percent*100;
                  return percent.toFixed(1) + '%';
                })
                .dimension(dimension)
                .group(group);
              chart.render();
            }

            //CHART 4
            var createGenderChart = function() {
              var chart = charts.gender.chart;
              var dimension = ndx.dimension(function (d) {
                if(d.civilite == 'm') {
                  return 'h';
                }
                return d.civilite;  
              });
              var group = dimension.group().reduceSum(function (d) { return 1; });
              var sizes = calcPieSize(charts.gender.divId);
              chart
                .width(sizes.width)
                .height(sizes.height)
                .cy(sizes.cy)
                .innerRadius(sizes.innerRadius)
                .radius(sizes.radius)
                .legend(dc.legend().x(0).y(sizes.legendY).gap(10).legendText(function(d) { 
                  var thisKey = d.name;
                  if(thisKey.length > 40){
                    return thisKey.substring(0,40) + '...';
                  }
                  return thisKey;
                }))
                .title(function(d){
                  var thisKey = d.key;
                  return thisKey + ': ' + d.value;
                })
                .label(function (d){
                  var percent = d.value / group.all().reduce(function(a, v){ return a + v.value; }, 0);
                  percent = percent*100;
                  return percent.toFixed(1) + '%';
                })
                .dimension(dimension)
                .group(group);
              chart.render();
            }

            //CHART 5
            var createDeclarationsNumberChart = function() {
              var chart = charts.declarationsNumber.chart;
              var dimension = ndx.dimension(function (d) {
                if(!d.listInfo.declarations_num) {
                  return 0;
                }
                return parseInt(d.listInfo.declarations_num);
              });
              var group = dimension.group().reduceSum(function (d) {
                return 1;
              });
              var width = recalcWidth(charts.declarationsNumber.divId);
              var charsLength = recalcCharsLength(width);
              chart
                .width(width)
                .height(440)
                .margins({top: 0, left: 0, right: 0, bottom: 20})
                .group(group)
                .dimension(dimension)
                .brushOn(true)
                .yAxisLabel("Reponsables publics")
                .on("preRender",(function(chart,filter){
                }))
                .margins({top: 0, right: 10, bottom: 20, left: 40})
                .x(d3.scaleLinear().domain([0,vuedata.maxDeclarationsDeclated + 1]))
                .gap(15)
                .elasticY(true);
              chart.render();
            }
            
            //TABLE
            var createTable = function() {
              var count=0;
              charts.mainTable.chart = $("#dc-data-table").dataTable({
                "columnDefs": [
                  {
                    "searchable": false,
                    "orderable": false,
                    "targets": 0,   
                    data: function ( row, type, val, meta ) {
                      return count;
                    }
                  },
                  {
                    "searchable": false,
                    "orderable": true,
                    "targets": 1,
                    "defaultContent":"N/A",
                    "data": function(d) {
                      return d.tableInfo.name;
                    }
                  },
                  {
                    "searchable": false,
                    "orderable": true,
                    "targets": 2,
                    "defaultContent":"N/A",
                    "data": function(d) {
                      return d.tableInfo.department;
                    }
                  },
                  {
                    "searchable": false,
                    "orderable": true,
                    "targets": 3,
                    "defaultContent":"N/A",
                    "data": function(d) {
                      if(d.civilite == "f") {
                        if(d.tableInfo.function == "Député") {
                          return "Députée";
                        }
                        if(d.tableInfo.function == "Sénateur") {
                          return "Sénatrice";
                        }
                        if(d.tableInfo.function == "Député européen") {
                          return "Députée européenne";
                        }
                      }
                      return d.tableInfo.function;
                      
                    }
                  },
                  {
                    "searchable": false,
                    "orderable": true,
                    "targets": 4,
                    "defaultContent":"N/A",
                    "data": function(d) {
                      return d.tableInfo.party;
                    }
                  },
                  {
                    "searchable": false,
                    "orderable": true,
                    "targets": 5,
                    "defaultContent":"N/A",
                    "data": function(d) {
                      return d.tableInfo.group;
                    }
                  },
                  {
                    "searchable": false,
                    "orderable": true,
                    "targets": 6,
                    "defaultContent":"N/A",
                    "data": function(d) {
                      return d.tableInfo.activities;
                    }
                  },
                  {
                    "searchable": false,
                    "orderable": true,
                    "targets": 7,
                    "defaultContent":"N/A",
                    "data": function(d) {
                      return d.tableInfo.participations;
                    }
                  },
                  {
                    "searchable": false,
                    "orderable": true,
                    "targets": 8,
                    "defaultContent":"N/A",
                    "data": function(d) {
                      return d.tableInfo.collabActivities;
                    }
                  },
                  {
                    "searchable": false,
                    "orderable": true,
                    "targets": 9,
                    "defaultContent":"N/A",
                    "data": function(d) {
                      return d.tableInfo.declarationsNumber;
                    }
                  },
                  {
                    "searchable": false,
                    "orderable": true,
                    "targets": 10,
                    "defaultContent":"N/A",
                    "type":"date-eu",
                    "data": function(d) {
                      if(d.customDateText) {
                        return d.customDateText;
                      }
                      return d.tableInfo.declatationDate;
                    }
                  }
                ],
                "iDisplayLength" : 25,
                "bPaginate": true,
                "bLengthChange": true,
                "bFilter": false,
                "order": [[ 6, "desc" ]],
                "bSort": true,
                "bInfo": true,
                "bAutoWidth": false,
                "bDeferRender": true,
                "aaData": searchDimension.top(Infinity),
                "bDestroy": true,
              });
              var datatable = charts.mainTable.chart;
              datatable.on( 'draw.dt', function () {
                var PageInfo = $('#dc-data-table').DataTable().page.info();
                  datatable.DataTable().column(0, { page: 'current' }).nodes().each( function (cell, i) {
                      cell.innerHTML = i + 1 + PageInfo.start;
                  });
                });
                datatable.DataTable().draw();

              $('#dc-data-table tbody').on('click', 'tr', function () {
                var data = datatable.DataTable().row( this ).data();
                vuedata.selectedElement = data;
                $('#detailsModal').modal();
              });
            }
            //REFRESH TABLE
            function RefreshTable() {
              dc.events.trigger(function () {
                var alldata = searchDimension.top(Infinity);
                charts.mainTable.chart.fnClearTable();
                charts.mainTable.chart.fnAddData(alldata);
                charts.mainTable.chart.fnDraw();
              });
            }

            //SEARCH INPUT FUNCTIONALITY
            var typingTimer;
            var doneTypingInterval = 1000;
            var $input = $("#search-input");
            $input.on('keyup', function () {
              clearTimeout(typingTimer);
              typingTimer = setTimeout(doneTyping, doneTypingInterval);
            });
            $input.on('keydown', function () {
              clearTimeout(typingTimer);
            });
            function doneTyping () {
              var s = $input.val().toLowerCase();
              searchDimension.filter(function(d) { 
                return d.indexOf(s) !== -1;
              });
              throttle();
              var throttleTimer;
              function throttle() {
                window.clearTimeout(throttleTimer);
                throttleTimer = window.setTimeout(function() {
                    dc.redrawAll();
                }, 250);
              }
            }

            //Reset charts
            var resetGraphs = function() {
              for (var c in charts) {
                if(charts[c].type !== 'table' && charts[c].chart.hasFilter()){
                  charts[c].chart.filterAll();
                }
              }
              mapDimension.filter(null);
              $('#franceterritories').removeClass('active');
              $('#iledefrance').removeClass('active');
              searchDimension.filter(null);
              $('#search-input').val('');
              dc.redrawAll();
            }
            $('.reset-btn').click(function(){
              resetGraphs();
            })
            
            //Render charts
            createMapChart();
            createPartyChart();
            createActivitiesChart();
            createMandateChart();
            createGenderChart();
            createDeclarationsNumberChart();
            createTable();

            $('.dataTables_wrapper').append($('.dataTables_length'));

            //Toggle last charts functionality and fix for responsiveness
            vuedata.showAllCharts = false;
            $('#charts-toggle-btn').click(function(){
              if(vuedata.showAllCharts){
                resizeGraphs();
              }
            })

            //Hide loader
            vuedata.loader = false;

            //COUNTERS
            //Main counter
            var all = ndx.groupAll();
            var counter = dc.dataCount('.dc-data-count')
              .dimension(ndx)
              .group(all);
            counter.render();
            //Update datatables
            counter.on("renderlet.resetall", function(c) {
              RefreshTable();
            });

            //Custom counters
            var iniCountSetup = false;
            function drawCustomCounter() {
              var dim = ndx.dimension (function(d) {
                return d.name;
              });
              var group = dim.group().reduce(
                function(p,d) {  
                  p.nb +=1;
                  p.activities += +d.activities;
                  return p;
                },
                function(p,d) {  
                  p.nb -=1;
                  p.activities -= +d.activities;
                  return p;
                },
                function(p,d) {  
                  return {nb: 0, activities: 0}; 
                }
              );
              group.order(function(p){ return p.nb });
              var activities = 0;
              var counter = dc.dataCount(".activities-count")
              .dimension(group)
              .group({value: function() {
                return group.all().filter(function(kv) {
                  if (kv.value.nb > 0) {
                    activities += +kv.value.activities;
                  }
                  return kv.value.nb > 0; 
                }).length;
              }})
              .renderlet(function (chart) {
                $(".activities-count").text(addcommas(Math.round(activities)));
                //Set up initial count
                if(iniCountSetup == false){
                  $('.activities-counter .total-count').text(addcommas(Math.round(activities)));
                  iniCountSetup = true;
                }
                activities=0;
              });
              counter.render();
            }
            drawCustomCounter();
            

            //Window resize function
            window.onresize = function(event) {
              resizeGraphs();
            };
          //})
        })
      })
    })
  })
})
