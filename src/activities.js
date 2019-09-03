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
  chartMargin: 40,
  organizations: {},
  charts: {
    mainTable: {
      chart: null,
      type: 'table',
      title: 'ACTIVITEES DE LOBBYING',
      info: 'test'
    }
  },
  selectedElement: { "P": "", "Sub": ""},
  colors: {
    activities: {
      "0":"#ccc",
      "1":"#8ed3fb",
      "2 - 5":"#68add4",
      "6 - 10":"#4388ad",
      "> 10":"#1a6287"
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
      charts[c].chart.size(recalcWidthWordcloud());
      charts[c].chart.redraw();
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
json('./data/c/agora_repertoire_opendata.json', (err, lobbyists) => {

  var activities = [];
  //Loop through data to aply fixes and calculations
  _.each(lobbyists.publications, function (d) {
    //Set up parameters that will be used in graphs and tables
    //String that will be used for search functionality
    d.searchstring = "";
    //Let's try to extract activities to their own object. This might have to be moved to a PHP script later.
    if(d.exercices && d.exercices.length > 0){
      _.each(d.exercices, function (ex) {
        if(ex.publicationCourante && ex.publicationCourante.activites) {
          _.each(ex.publicationCourante.activites, function (act) {
            //Add lobbyists info to activity and add activity to activities list
            act.org = d.nomUsage;
            act.searchstring = "";
            activities.push(act);
          });
        }
      });
    }
  });

  //Set dc main vars
  var ndx = crossfilter(activities);
  var searchDimension = ndx.dimension(function (d) {
      return d.searchstring.toLowerCase();
  });
  
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
            return d.publicationCourante.identifiantFiche;
          }
        },
        {
          "searchable": false,
          "orderable": true,
          "targets": 2,
          "defaultContent":"N/A",
          "type":"date-eu",
          "data": function(d) {
            return 'date';
          }
        },
        {
          "searchable": false,
          "orderable": true,
          "targets": 3,
          "defaultContent":"N/A",
          "data": function(d) {
            return d.org;
          }
        }
      ],
      "iDisplayLength" : 25,
      "bPaginate": true,
      "bLengthChange": true,
      "bFilter": false,
      "order": [[ 3, "desc" ]],
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
  /*
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
  */
  

  //Window resize function
  window.onresize = function(event) {
    resizeGraphs();
  };
})
