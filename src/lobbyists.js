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
  page: 'lobbyists',
  loader: true,
  showInfo: true,
  showShare: true,
  showAllCharts: true,
  showClientsTable: false,
  chartMargin: 40,
  charts: {
    activitiesNum: {
      title: 'Nombre d’activités déclarées',
      info: ''
    },
    chiffreAffaire: {
      title: 'Chiffre d’affaires',
      info: ''
    },
    montantDepense: {
      title: 'Montant des dépenses',
      info: ''
    },
    sectors: {
      title: 'Secteurs d’activités',
      info: ''
    },
    lobbyists: {
      title: 'Nombre de lobbyistes par organisation',
      info: ''
    },
    clients: {
      title: 'Nombre de clients et mandants pour lesquels des activités ont été effectuées',
      info: ''
    },
    years: {
      title: 'Nombre d\'activités par période de déclaration',
      info: ''
    },
    category: {
      title: 'Nombre d’organisations de lobbying par catégorie',
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
    activities: {
      "0 activités": "#52c993",
      "1—10 activités": "#42b983",
      "11—25 activités": "#229983",
      "26—50 activités": "#1a8883",
      "> 50 activités": "#127983"
    },
    chiffre: {
      "< 100 000 euros": "#52c993",
      "> = 100 000 euros et < 500 000 euros": "#42b983",
      "> = 500 000 euros et < 1 000 000 euros": "#229983",
      "> = 1 000 000 euros": "#1a8883",
      "Sans chiffre d'affaires": "#ccc"
    },
    depenses: {
      "/": "#ccc",
      "< 10.000 €": "#52c993",
      "> = 10.000€ - < 500.000€": "#42b983",
      "> = 500.000€ - < 1.000.000€": "#229983",
      "> = 1.000.000€ - <5.000.000€": "#1a8883",
      "> = 5.000.000€ - < 10.000.000 €": "#127983",
      "Déclaration à venir": "#ccc"
    },
    lobbyists: {
      "1 lobbyiste": "#52c993",
      "2—5 lobbyistes": "#42b983",
      "6—10 lobbyistes": "#229983",
      "11—20 lobbyistes": "#1a8883",
      "> 20 lobbyistes": "#127983"
    },
    clients: {
      "0 clients ou mandants": "#52c993",
      "1—5 clients ou mandants": "#42b983",
      "6—10 clients ou mandants": "#229983",
      ">10 clients ou mandants": "#1a8883"
    },
    default: ["#229983"],
  },
  categories: {
    depenses: {
      "/": "/",
      "< 10 000 euros": "< 10.000 €",
      "> = 10 000 euros et < 25 000 euros": "> = 10.000€ - < 500.000€",
      "> = 100 000 euros et < 200 000 euros": "> = 10.000€ - < 500.000€",
      "> = 25 000 euros et < 50 000 euros": "> = 10.000€ - < 500.000€",
      "> = 50 000 euros et < 75 000 euros": "> = 10.000€ - < 500.000€",
      "> = 75 000 euros et < 100 000 euros": "> = 10.000€ - < 500.000€",
      "> = 200 000 euros et < 300 000 euros": "> = 10.000€ - < 500.000€",
      "> = 300 000 euros et < 400 000 euros": "> = 10.000€ - < 500.000€",
      "> = 400 000 euros et < 500 000 euros": "> = 10.000€ - < 500.000€",
      "> = 500 000 euros et < 600 000 euros": "> = 500.000€ - < 1.000.000€",
      "> = 600 000 euros et < 700 000 euros": "> = 500.000€ - < 1.000.000€",
      "> = 800 000 euros et < 900 000 euros": "> = 500.000€ - < 1.000.000€",
      "> = 900 000 euros et < 1 000 000 euros": "> = 500.000€ - < 1.000.000€",
      "> = 1 000 000 euros et < 1 250 000 euros": "> = 1.000.000€ - <5.000.000€",
      "> = 1 250 000 euros et < 1 500 000 euros": "> = 1.000.000€ - <5.000.000€",
      "> = 700 000 euros et < 800 000 euros": "> = 500.000€ - < 1.000.000€",
      "> = 1 500 000 euros et < 1 750 000 euros": "> = 1.000.000€ - <5.000.000€",
      "> = 1 750 000 euros et < 2 000 000 euros": "> = 1.000.000€ - <5.000.000€",
      "> = 3 250 000 euros et < 3 500 000 euros": "> = 1.000.000€ - <5.000.000€",
      "> = 3 750 000 euros et < 4 000 000 euros": "> = 1.000.000€ - <5.000.000€",
      "> = 9 250 000 euros et < 9 500 000 euros": "> = 5.000.000€ - < 10.000.000 €",
      "> = 10 000 000 euros": "> = 10.000.000 €"
    }
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
  activitiesNum: {
    chart: dc.pieChart("#activitiesnum_chart"),
    type: 'pie',
    divId: 'activitiesnum_chart'
  },
  chiffreAffaire: {
    chart: dc.pieChart("#chiffreaffaire_chart"),
    type: 'pie',
    divId: 'chiffreaffaire_chart'
  },
  montantDepense: {
    chart: dc.pieChart("#montantdepense_chart"),
    type: 'pie',
    divId: 'montantdepense_chart'
  },
  sectors: {
    chart: dc.rowChart("#sectors_chart"),
    type: 'row',
    divId: 'sectors_chart'
  },
  lobbyists: {
    chart: dc.pieChart("#lobbyists_chart"),
    type: 'pie',
    divId: 'lobbyists_chart'
  },
  clients: {
    chart: dc.pieChart("#clients_chart"),
    type: 'pie',
    divId: 'clients_chart'
  },
  years: {
    chart: dc.barChart("#years_chart"),
    type: 'bar',
    divId: 'years_chart'
  },
  category: {
    chart: dc.rowChart("#category_chart"),
    type: 'row',
    divId: 'category_chart'
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

function getActivitiesNumRange(n) {
  if(n == 0) {
    return "0 activités";
  } else if(n <= 10) {
    return "1—10 activités";
  } else if(n <= 25) {
    return "11—25 activités";
  } else if(n <= 50) {
    return "26—50 activités";
  } else if(n > 50) {
    return "> 50 activités";
  }
}

function getCollabRange(n) {
  if(n == 1) {
    return "1 lobbyiste";
  } else if(n <= 5) {
    return "2—5 lobbyistes";
  } else if(n <= 10) {
    return "6—10 lobbyistes";
  } else if(n <= 20) {
    return "11—20 lobbyistes";
  } else if(n > 20) {
    return "> 20 lobbyistes";
  }
  return "/";
}

function getClientsRange(n) {
  if(n == 0) {
    return "0 clients ou mandants";
  } else if(n <= 5) {
    return "1—5 clients ou mandants";
  } else if(n <= 10) {
    return "6—10 clients ou mandants";
  } else if(n > 10) {
    return ">10 clients ou mandants";
  } 
  return "/";
}

//Load data and generate charts
//json('./data/c/agora_repertoire_opendata.json', (err, lobbyists) => {
  json('./data/c/agora_repertoire_opendata.json', (err, activities) => {

  //console.log(repTypesList.sort());
  //$('body').html(repTypesList.sort().join('<br />'));
  _.each(activities.publications, function (d) {
    d.latestPub = d.exercices[0].publicationCourante;
    var latestPubFound = false;
    d.totalActivitiesNum = 0;
    //Store activities num per year
    d.actYears = {};
    d.actYearsArray = [];
    //Get latest filled publicationCourante publicationDate and add up all activities
    for (var i = 0; i < d.exercices.length; i++) {
      if (d.exercices[i].publicationCourante.publicationDate && latestPubFound == false){
        d.latestPub = d.exercices[i].publicationCourante;
        latestPubFound = true;
      }
      //Add activities
      if(d.exercices[i].publicationCourante.nombreActivite) {
        d.totalActivitiesNum += d.exercices[i].publicationCourante.nombreActivite;
      }
      if(d.exercices[i].publicationCourante.dateDebut) {
        var thisYear = d.exercices[i].publicationCourante.dateDebut.split("-")[2];
        var thisActAmt = d.exercices[i].publicationCourante.nombreActivite;
        if(d.actYears[thisYear]) {
          d.actYears[thisYear] += thisActAmt;
        } else {
          d.actYears[thisYear] = thisActAmt;
        }
        for (var n = 0; n < thisActAmt; n++) {
          d.actYearsArray.push(thisYear);
        }
      }
      //console.log(d.actYears);
    }
    //Get activities sectors list
    d.sectors = [];
    _.each(d.activites.listSecteursActivites, function (s) {
      d.sectors.push(s.label);
    });
    d.activitiesNumRange = getActivitiesNumRange(d.latestPub.nombreActivite);
    d.activitiesNumRangeTot = getActivitiesNumRange(d.totalActivitiesNum);
    //Store number of collaborators and clients and related ranges
    d.collabNum = d.collaborateurs.length;
    d.collabNumRange = getCollabRange(d.collabNum);
    d.clientsNum = d.clients.length;
    d.clientsNumRange = getClientsRange(d.clientsNum);
    d.searchstring = d.nomUsage + " " + d.denomination + " " + d.categorieOrganisation.label;
    //Streamline montant depense
    d.montantDepenseStreamlined = "Déclaration à venir";
    if(d.latestPub.montantDepense) {
      d.montantDepenseStreamlined = vuedata.categories.depenses[d.latestPub.montantDepense];
    }
  });

  //Set dc main vars
  var ndx = crossfilter(activities.publications);
  var searchDimension = ndx.dimension(function (d) {
      return d.searchstring.toLowerCase();
  });

  //CHART 1
  var createActivitiesNumChart = function() {
    var chart = charts.activitiesNum.chart;
    var dimension = ndx.dimension(function (d) {
      return d.activitiesNumRangeTot; 
    });
    var group = dimension.group().reduceSum(function (d) { return 1; });
    var sizes = calcPieSize(charts.activitiesNum.divId);
    var order = ["0 activités", "1—10 activités", "11—25 activités", "26—50 activités", "> 50 activités"];
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
      .minAngleForLabel(0.1)
      .label(function (d){
        var percent = d.value / group.all().reduce(function(a, v){ return a + v.value; }, 0);
        percent = percent*100;
        return percent.toFixed(1) + '%';
      })
      .dimension(dimension)
      .group(group)
      .ordering(function(d) { return order.indexOf(d.key)})
      .colorCalculator(function(d, i) {
        return vuedata.colors.activities[d.key];
      });
    chart.render();
  }

  //CHART 2
  var createChiffreAffaireChart = function() {
    var chart = charts.chiffreAffaire.chart;
    var dimension = ndx.dimension(function (d) {
      if(d.latestPub.chiffreAffaire) {
        return d.latestPub.chiffreAffaire;
      } else {
        return "Sans chiffre d'affaires";
      }
    });
    var group = dimension.group().reduceSum(function (d) { return 1; });
    var sizes = calcPieSize(charts.chiffreAffaire.divId);
    var order = ["< 100 000 euros", "> = 100 000 euros et < 500 000 euros", "> = 500 000 euros et < 1 000 000 euros", "> = 1 000 000 euros", "Sans chiffre d'affaires"];
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
      .minAngleForLabel(0.1)
      .label(function (d){
        var percent = d.value / group.all().reduce(function(a, v){ return a + v.value; }, 0);
        percent = percent*100;
        return percent.toFixed(1) + '%';
      })
      .dimension(dimension)
      .group(group)
      .ordering(function(d) {return order.indexOf(d.key)})
      .colorCalculator(function(d, i) {
        return vuedata.colors.chiffre[d.key];
      });
    chart.render();
  }

  //CHART 3
  var createMontantDepenseChart = function() {
    var chart = charts.montantDepense.chart;
    var dimension = ndx.dimension(function (d) {
      if(d.montantDepenseStreamlined) {
        return d.montantDepenseStreamlined;
      } else {
        return " ";
      }
    });
    var group = dimension.group().reduceSum(function (d) { return 1; });
    var sizes = calcPieSize(charts.montantDepense.divId);
    var order = ["< 10.000 €", "> = 10.000€ - < 500.000€", "> = 500.000€ - < 1.000.000€", "> = 1.000.000€ - <5.000.000€", "> = 5.000.000€ - < 10.000.000 €", "> = 10.000.000 €", "Déclaration à venir"];
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
        console.log(d.key);
        return thisKey + ': ' + d.value;
      })
      .minAngleForLabel(0.1)
      .label(function (d){
        var percent = d.value / group.all().reduce(function(a, v){ return a + v.value; }, 0);
        percent = percent*100;
        return percent.toFixed(1) + '%';
      })
      .dimension(dimension)
      .group(group)
      .ordering(function(d) { return order.indexOf(d.key)})
      .colorCalculator(function(d, i) {
        return vuedata.colors.depenses[d.key];
      });
    chart.render();
  }

  //CHART 4
  var createSectorsChart = function() {
    var chart = charts.sectors.chart;
    var dimension = ndx.dimension(function (d) {
        return d.sectors;
    }, true);
    var group = dimension.group().reduceSum(function (d) {
        return 1;
    });
    var filteredGroup = (function(source_group) {
      return {
        all: function() {
          return source_group.top(40).filter(function(d) {
            return (d.value != 0);
          });
        }
      };
    })(group);
    var width = recalcWidth(charts.sectors.divId);
    var charsLength = recalcCharsLength(width);
    chart
      .width(width)
      .height(710)
      .margins({top: 0, left: 0, right: 0, bottom: 20})
      .group(filteredGroup)
      .dimension(dimension)
      .label(function (d) {
          if(d.key.length > charsLength){
            return d.key.substring(0,charsLength) + '...';
          }
          return d.key;
      })
      .title(function (d) {
          return d.key + ': ' + d.value;
      })
      .colorCalculator(function(d, i) {
        return vuedata.colors.default;
      })
      .elasticX(true)
      .xAxis().ticks(4);
      chart.render();
  }

  //CHART 5
  var createLobbyistsNumChart = function() {
    var chart = charts.lobbyists.chart;
    var dimension = ndx.dimension(function (d) {
      return d.collabNumRange; 
    });
    var group = dimension.group().reduceSum(function (d) { return 1; });
    var sizes = calcPieSize(charts.lobbyists.divId);
    var order = ["1 lobbyiste", "2—5 lobbyistes", "6—10 lobbyistes", "11—20 lobbyistes", "> 20 lobbyistes"];
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
      .minAngleForLabel(0.1)
      .label(function (d){
        var percent = d.value / group.all().reduce(function(a, v){ return a + v.value; }, 0);
        percent = percent*100;
        return percent.toFixed(1) + '%';
      })
      .dimension(dimension)
      .group(group)
      .ordering(function(d) { return order.indexOf(d.key)})
      .colorCalculator(function(d, i) {
        return vuedata.colors.lobbyists[d.key];
      });
    chart.render();
  }

  //CHART 6
  var createClientsNumChart = function() {
    var chart = charts.clients.chart;
    var dimension = ndx.dimension(function (d) {
      return d.clientsNumRange; 
    });
    var group = dimension.group().reduceSum(function (d) { return 1; });
    var sizes = calcPieSize(charts.clients.divId);
    var order = ["0 clients ou mandants", "1—5 clients ou mandants", "6—10 clients ou mandants", ">10 clients ou mandants"];
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
      .minAngleForLabel(0)
      .label(function (d){
        var percent = d.value / group.all().reduce(function(a, v){ return a + v.value; }, 0);
        percent = percent*100;
        return percent.toFixed(1) + '%';
      })
      .dimension(dimension)
      .group(group)
      .ordering(function(d) { return order.indexOf(d.key)})
      .colorCalculator(function(d, i) {
        return vuedata.colors.clients[d.key];
      });
    chart.render();
  }

  //CHART 7
  var createCategoryChart = function() {
    var chart = charts.category.chart;
    var dimension = ndx.dimension(function (d) {
        return d.categorieOrganisation.label;
    });
    var group = dimension.group().reduceSum(function (d) {
        return 1;
    });
    var filteredGroup = (function(source_group) {
      return {
        all: function() {
          return source_group.top(40).filter(function(d) {
            return (d.value != 0);
          });
        }
      };
    })(group);
    var width = recalcWidth(charts.category.divId);
    var charsLength = recalcCharsLength(width);
    chart
      .width(width)
      .height(690)
      .margins({top: 0, left: 0, right: 0, bottom: 20})
      .group(filteredGroup)
      .dimension(dimension)
      .colorCalculator(function(d, i) {
        return vuedata.colors.default;
      })
      .label(function (d) {
          if(d.key.length > charsLength){
            return d.key.substring(0,charsLength) + '...';
          }
          return d.key;
      })
      .title(function (d) {
          return d.key + ': ' + d.value;
      })
      .elasticX(true)
      .xAxis().ticks(4);
      chart.render();
  }

  //CHART 8
  var createYearsChart = function() {
    var chart = charts.years.chart;
    var dimension = ndx.dimension(function (d) {
        return d.actYearsArray;
    }, true);
    var group = dimension.group().reduceSum(function (d) {
        return 1;
    });
    var width = recalcWidth(charts.years.divId);
    chart
      .width(width)
      .height(300)
      .group(group)
      .dimension(dimension)
      .on("preRender",(function(chart,filter){
      }))
      .margins({top: 0, right: 10, bottom: 20, left: 20})
      .x(d3.scaleBand().domain(["2017", "2018", "2019"]))
      .xUnits(dc.units.ordinal)
      .gap(10)
      .elasticY(true)
      .ordinalColors(vuedata.colors.default)
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
            if(d.nomUsage) {
              return d.nomUsage;
            } else {
              return d.denomination;
            }
          }
        },
        {
          "searchable": false,
          "orderable": true,
          "targets": 1,
          "defaultContent":"N/A",
          "data": function(d) {
            return d.categorieOrganisation.label;
          }
        },
        {
          "searchable": false,
          "orderable": true,
          "targets": 2,
          "defaultContent":"N/A",
          "data": function(d) {
            return d.totalActivitiesNum;
          }
        },
        {
          "searchable": false,
          "orderable": true,
          "targets": 3,
          "defaultContent":"N/A",
          "data": function(d) {
            return d.collabNum;
          }
        },
        {
          "searchable": false,
          "orderable": true,
          "targets": 4,
          "defaultContent":"N/A",
          "data": function(d) {
            if(d.activites) {
              return d.activites.listSecteursActivites.length;
            }
            return "/";
          }
        },
        {
          "searchable": false,
          "orderable": true,
          "targets": 5,
          "defaultContent":"N/A",
          "data": function(d) {
            return d.clientsNum;
          }
        },
        {
          "searchable": false,
          "orderable": true,
          "targets": 6,
          "defaultContent":"N/A",
          "data": function(d) {
            return d.affiliations.length;
          }
        },
        {
          "searchable": false,
          "orderable": true,
          "targets": 7,
          "defaultContent":"N/A",
          "data": function(d) {
            if(d.latestPub.defautDeclaration == true) {
              return "NON";
            } else {
              return "OUI";
            }
          }
        }
      ],
      "iDisplayLength" : 25,
      "bPaginate": true,
      "bLengthChange": true,
      "bFilter": false,
      "order": [[ 0, "asc" ]],
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
      vuedata.showClientsTable = false;
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
  createActivitiesNumChart();
  createChiffreAffaireChart();
  createMontantDepenseChart();
  createSectorsChart();
  createLobbyistsNumChart();
  createClientsNumChart();
  createCategoryChart();
  createYearsChart();

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
