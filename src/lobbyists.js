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
  chartMargin: 40,
  organizations: {},
  charts: {
    actNumber: {
      title: 'Nombre d’activités déclarées',
      info: ''
    },
    mainTable: {
      chart: null,
      type: 'table',
      title: 'ORGANISATIONS DE LOBBYING',
      info: 'test'
    }
  },
  selectedElement: { "P": "", "Sub": ""},
  modalShowTable: '',
  colors: {
    colorSchemeCloud: [ "#4d9e9c", "#62aad9", "#3b95d0", "#42b983", "#449188", "#52c993", "#b7bebf", "#99b6c0" ],
    activities: {
      "0":"#ccc",
      "1":"#8ed3fb",
      "2 - 5":"#68add4",
      "6 - 10":"#4388ad",
      "> 10":"#1a6287"
    },
    default: ["#3b95d0"],
  },
  categories: {
    organizations: {
      "Société commerciale": "Organisations commerciales",
      "Société civile (autre que cabinet d’avocats)": "Société civile",
      "Cabinets d’avocats": "Avocats",
      "Cabinet d’avocats": "Avocats",
      "Avocat indépendant": "Avocats",
      "Cabinet de conseil": "Consultants",
      "Cabinet de conseils": "Consultants",
      "Consultant indépendant": "Consultants",
      "Organisation professionnelle": "Organisations professionnelles & syndicats",
      "Syndicat": "Organisations professionnelles & syndicats",
      "Chambre consulaire": "Etablissement public à caractère économique",
      "Association": "Société civile",
      "Fondation": "Société civile",
      "Organisme de recherche ou de réflexion": "Organismes de recherche",
      "Autre organisation non gouvernementale": "Société civile",
      "Autres organisations non gouvernementales": "Société civile",
      "Etablissement public exerçant une activité industrielle et commerciale": "Etablissement public à caractère économique",
      "Groupement d’intérêt public exerçant une activité industrielle et commerciale": "Etablissement public à caractère économique",
      "Autres organisations":	"Autres organisations"
    }
  },
  agencies: [
    "Agence française de lutte contre le dopage",
    "Autorité de contrôle des nuisances sonores aéroportuaires",
    "Autorité de régulation des communications électroniques et des postes",
    "Autorité de la concurrence",
    "Autorité de régulation de la distribution de la presse",
    "Autorité de régulation des activités ferroviaires et routières",
    "Autorité de régulation des jeux en ligne",
    "Autorité des marchés financiers",
    "Autorité de sûreté nucléaire",
    "Comité d indemnisation des victimes des essais nucléaires",
    "Commission d accès aux documents administratifs",
    "Commission du secret de la défense nationale",
    "Contrôleur général des lieux de privation de liberté",
    "Commission nationale des comptes de campagne et des financements politiques",
    "Commission nationale de contrôle des techniques de renseignement",
    "Commission nationale du débat public",
    "Commission nationale de l informatique et des libertés",
    "Commission de régulation de l énergie",
    "Conseil supérieur de l audiovisuel",
    "Défenseur des droits",
    "Haute Autorité de santé",
    "Haut Conseil de l évaluation de la recherche et de l enseignement supérieur",
    "Haut Conseil du commissariat aux comptes",
    "Haute Autorité pour la diffusion des œuvres et la protection des droits sur internet",
    "Haute Autorité pour la transparence de la vie publique",
    "Médiateur national de l énergie"
  ]
}



//Set vue components and Vue app

Vue.component('chart-header', ChartHeader);
Vue.component('loader', Loader);

new Vue({
  el: '#app',
  data: vuedata,
  methods: {
    //Share
    share: function (platform) {
      if(platform == 'twitter'){
        var thisPage = window.location.href.split('?')[0];
        var shareText = 'Share text here ' + thisPage;
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
    }
  }
});

//Initialize info popovers
$(function () {
  $('[data-toggle="popover"]').popover()
})

//Charts
var charts = {
  /*
  repPublique: {
    chart: dc.pieChart("#rep_publique_chart"),
    type: 'pie',
    divId: 'rep_publique_chart'
  },
  */
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
var recalcWidthWordcloud = function(divId) {
  //Replace element if with wordcloud column id
  var width = document.getElementById(divId).offsetWidth - vuedata.chartMargin*2;
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
    if((c == 'topDomains' || c == 'autoritiesAgencies') && vuedata.showAllCharts == false){
      
    } else {
      var sizes = calcPieSize(charts[c].divId);
      var newWidth = recalcWidth(charts[c].divId);
      var charsLength = recalcCharsLength(newWidth);
      if(charts[c].type == 'map') {
        var newProjection = d3.geoMercator()
          .center([11,45]) //theorically, 50°7′2.23″N 9°14′51.97″E but this works
          .translate([newWidth - 50, 220])
          .scale(newWidth*3);
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
      } else if(charts[c].type == 'bar'){
        charts[c].chart.width(newWidth);
        charts[c].chart.rescale();
        charts[c].chart.redraw();
      } else if(charts[c].type == 'pie') {
        charts[c].chart
          .width(sizes.width)
          .height(sizes.height)
          .cy(sizes.cy)
          .innerRadius(sizes.innerRadius)
          .radius(sizes.radius)
          .legend(dc.legend().x(0).y(sizes.legendY).gap(10));
        charts[c].chart.redraw();
      } else if(charts[c].type == 'cloud') {
        charts[c].chart.size([newWidth,550]);
        //.size([recalcWidth(charts.objet.divId),550])
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

//Streamline reponsablesPublics
function streamlineRep(rp) {
  var cat1 = [];
  var cat2 = [];
  return '';
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

//Load data and generate charts
//json('./data/c/agora_repertoire_opendata.json', (err, lobbyists) => {
  json('./data/c/agora_repertoire_opendata.json', (err, activities) => {

  //console.log(repTypesList.sort());
  //$('body').html(repTypesList.sort().join('<br />'));
  _.each(activities.publications, function (d) {
    d.searchstring = d.nomUsage + "";
  });

  //Set dc main vars
  var ndx = crossfilter(activities.publications);
  var searchDimension = ndx.dimension(function (d) {
      return d.searchstring.toLowerCase();
  });

  //CHART 1
  var createRepPubliqueChart = function() {
    var chart = charts.repPublique.chart;
    var dimension = ndx.dimension(function (d) {
      //return d.repType; 
      return d.repTypeStreamLined; 
    }, true);
    var group = dimension.group().reduceSum(function (d) { return 1; });
    var sizes = calcPieSize(charts.repPublique.divId);
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
      .dimension(dimension)
      .group(group);
      /*
      .ordering(function(d) { return order.indexOf(d)})
      .colorCalculator(function(d, i) {
        return vuedata.colors.parties[d.key];
      });
      */
    chart.render();
  }

  //TABLE
  var createTable = function() {
    var count=0;
    charts.mainTable.chart = $("#dc-data-table").dataTable({
      "columnDefs": [
        {
          "searchable": false,
          "orderable": true,
          "targets": 0,
          "defaultContent":"N/A",
          "data": function(d) {
            return d.nomUsage;
          }
        }
      ],
      "iDisplayLength" : 25,
      "bPaginate": true,
      "bLengthChange": true,
      "bFilter": false,
      "order": [[ 0, "desc" ]],
      "bSort": true,
      "bInfo": true,
      "bAutoWidth": false,
      "bDeferRender": true,
      "aaData": searchDimension.top(Infinity),
      "bDestroy": true,
    });
    var datatable = charts.mainTable.chart;
    /*
    datatable.on( 'draw.dt', function () {
      var PageInfo = $('#dc-data-table').DataTable().page.info();
        datatable.DataTable().column(0, { page: 'current' }).nodes().each( function (cell, i) {
            cell.innerHTML = i + 1 + PageInfo.start;
        });
      });
    */
      datatable.DataTable().draw();

    $('#dc-data-table tbody').on('click', 'tr', function () {
      var data = datatable.DataTable().row( this ).data();
      vuedata.selectedElement = data;
      //console.log(vuedata.selectedElement);
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

  //Set word for wordcloud
  var setword = function(wd) {
    //console.log(charts.subject.chart);
    $("#search-input").val(wd);
    var s = wd.toLowerCase();
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
    searchDimension.filter(null);
    $('#search-input').val('');
    dc.redrawAll();
  }
  $('.reset-btn').click(function(){
    resetGraphs();
  })
  
  //Render charts
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
    calcCountPercentage();
    RefreshTable();
  });

  var calcCountPercentage = function() {
    var count = $('.activities-count .filter-count').html();
    var total = $('.activities-count .total-count').html();
    count = parseInt(count.replace(",", ""));
    total = parseInt(total.replace(",", ""));
    var percent = ((count/total) * 100).toFixed(1);
    $('.activities-count .percentage-count').html(percent + '%');
  }
  calcCountPercentage();

  //Window resize function
  window.onresize = function(event) {
    resizeGraphs();
  };
})
